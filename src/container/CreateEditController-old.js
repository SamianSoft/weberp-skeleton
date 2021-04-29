import React, { PureComponent, cloneElement } from 'react';
import querystring from 'qs';
import lodashFindIndex from 'lodash/findIndex';
import lodashMerge from 'lodash/merge';
import { connect } from 'react-redux';
import lodashGet from 'lodash/get';
import { push } from 'connected-react-router';
import compose from 'recompose/compose';
import {
  crudGetOne as crudGetOneAction,
  EditView,
  CreateView,
  showNotification as showNotificationAction,
} from 'react-admin';

import checkMinimumRequiredProps from './admin/checkMinimumRequiredProps';
import { crudUpdateWithCallbackAction, crudCreateWithCallbackAction } from '../redux/crud/action';
import { clone, isEmpty, isEmptyObject, removeRelationFromRecord } from '../helper/DataHelper';
import LoadingBox from '../component/LoadingBox';

class CreateEditController extends PureComponent {
  constructor(params) {
    super(params);

    const { record = {} } = this.props;

    // new record data will be passed through url
    const urlParams = window.location.href.split('?')[1];
    const overrideParams = querystring.parse(urlParams, { strictNullHandling: true });

    this.state = {
      stateRecord: null,
      createdId: null,
      overrideParams,
      mergedRecord: {
        ...record,
        ...overrideParams,
      },
      version: 0,
      apiError: null,
      relationExceptions: [],
    };
  }

  componentDidMount() {
    const { id } = this.props;
    if (!isEmpty(id)) {
      this.updateData();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      // this.props.resetForm(REDUX_FORM_NAME);
      this.updateData(nextProps.resource, nextProps.id);
    }

    if (this.props.record !== nextProps.record) {
      const { stateRecord, overrideParams = {} } = this.state;
      const mergedRecord = stateRecord
        ? lodashMerge(overrideParams, stateRecord)
        : lodashMerge(nextProps.record, overrideParams);

      this.setState({
        stateRecord: null,
        createdId: null,
        mergedRecord: mergedRecord,
        version: this.state.version + 1,
      });
    }
  }

  defaultRedirectRoute() {
    return 'list';
  }

  updateData(resource = this.props.resource, id = this.props.id) {
    this.props.crudGetOne(resource, id, this.props.basePath);
  }

  getId() {
    const { id } = this.props;
    const { createdId } = this.state;

    return !isEmpty(id) ? id : createdId;
  }

  /**
   * Dispatch an action to send a request to API to save form data
   * @function save
   * @param {object} data The form data that should be saved within a request (update/create)
   * @param {object} params The parameteres that we should send in our request
   */
  save = (data, params) => {
    const { dispatchCrudCreate, dispatchCrudUpdate } = this.props;
    const id = this.getId();

    if (!isEmpty(id) && params) {
      // prettier-ignore
      dispatchCrudUpdate(
        this.props.resource,
        id,
        data,
        this.props.record,
        action => this.afterSave(action, params),
        false,
        {},
        true
        );
    } else {
      // prettier-ignore
      dispatchCrudCreate(
        this.props.resource,
        data,
        action => this.afterSave(action, params),
        false,
        true
      );
    }
  };

  /**
   * `afterSave` is a function that passes to redux action to call when needed. it receives an action object from `reduxAction` that includes the result
   * of action like API response or API error or even exceptions. And the second parameter is an object that includes extra parameters that we
   * need like `resetDefaultValues` function. It should handle the API response and fill the error state if needed.
   *  @function afterSave
   *  @param {Object | null} action predux action
   *  @param {Object | null} {} extra params
   *  @returns {void}
   */
  afterSave = (action, { relationRefList, resetDefaultValues, isSaveAndNew, resetEditedData }) => {
    const { resource, redirectToPage, showNotification } = this.props;

    if (action.error && action.error.data) {
      // fill the state to pass to validation HOC

      const preparedApiErrorObject = {
        apiErrors: action.error.data,
        requestId: action.error.requestId,
      };

      this.setState({ apiError: preparedApiErrorObject });
    } else if (action.error && !action.error.data) {
      showNotification(action.error, 'error');
    } else {
      const { payload: response, requestPayload } = action;
      const { data: oldData } = requestPayload;
      const { data: newData, exceptions } = response;

      const { stateRecord, version } = this.state;

      resetDefaultValues(); // for clear form data in (save and new) button

      if (typeof resetEditedData === 'function') {
        resetEditedData();
      }

      if (isEmptyObject(exceptions)) {
        if (!isSaveAndNew) {
          redirectToPage(`/${resource}/${newData.id}/show`);
        }

        this.setState({
          stateRecord: null,
          createdId: null,
          mergedRecord: {},
          version: version + 1,
        });
        return;
      }

      showNotification('form.submitWasAlmostSuccessfulPleaseCheckRelationsAndFixErrors', 'error');

      const exceptionsTemp = [];

      let isFocusedOnce = false;
      const clonedData = clone(stateRecord || oldData);

      // each exeption may have multiple relation resource
      Object.keys(exceptions).forEach(relatedResource => {
        // each relation resource may have multiple rows
        exceptions[relatedResource].forEach(row => {
          const errorItemIndex = lodashFindIndex(clonedData[relatedResource].Data, { id: row.id });

          if (errorItemIndex !== -1) {
            clonedData[relatedResource].Data[errorItemIndex] = lodashMerge(
              clonedData[relatedResource].Data[errorItemIndex],
              row,
            );
          } else {
            clonedData[relatedResource].Data.push(row);
          }

          if (!isFocusedOnce && relationRefList[relatedResource]) {
            isFocusedOnce = true;
            relationRefList[relatedResource].scrollIntoView();
          }

          // make an exception object
          const exceptionTemp = {
            relationPath: relatedResource,
            rowIndex: errorItemIndex,
            exception: lodashGet(row, ['exception'], {}),
          };
          exceptionsTemp.push(exceptionTemp);
        });
      });

      this.setState({
        stateRecord: clonedData,
        createdId: newData.id,
        relationExceptions: exceptionsTemp,
      });
    }
  };

  render() {
    const {
      basePath,
      children,
      record,
      resource,
      dispatchCrudUpdate,
      dispatchCrudCreate,
      redirectToPage,
      crudGetOne,
      showNotification,
      resetForm,
      relationRecord,
      orginalRecord,
      ...rest
    } = this.props;
    const { mergedRecord, version, overrideParams } = this.state;
    const id = this.getId();

    // simulate useState
    const setApiError = data => {
      this.setState({ apiError: data });
    };
    const setRelationExceptions = data => {
      this.setState({ relationExceptions: data });
    };

    if (!isEmpty(id) && !record) {
      return <LoadingBox />;
    }

    const viewProps = {
      save: this.save,
      resource,
      basePath,
      record: mergedRecord,
      redirect: this.defaultRedirectRoute(),
      version,
    };

    if (!isEmpty(id)) {
      return (
        <EditView {...rest} {...viewProps}>
          {cloneElement(children, {
            apiError: this.state.apiError,
            setApiError,
            relationExceptions: this.state.relationExceptions,
            setRelationExceptions,
            relationRecord,
            orginalRecord,
            overrideParams,
          })}
        </EditView>
      );
    }

    return (
      <CreateView {...rest} {...viewProps}>
        {cloneElement(children, {
          apiError: this.state.apiError,
          setApiError,
          overrideParams,
        })}
      </CreateView>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { resource, metaData, id } = props;

  const record = state.admin.resources[resource]
    ? lodashGet(state.admin.resources, [resource, 'data', id], null)
    : null;

  const { clearedRecord = {}, relationRecord = {} } = removeRelationFromRecord(record, metaData);

  return {
    id,
    record: !isEmptyObject(clearedRecord) ? clearedRecord : null,
    relationRecord: !isEmptyObject(relationRecord) ? relationRecord : null,
    orginalRecord: record,
  };
};

const mapDispatchToProps = {
  crudGetOne: crudGetOneAction,
  showNotification: showNotificationAction,
  dispatchCrudUpdate: crudUpdateWithCallbackAction,
  dispatchCrudCreate: crudCreateWithCallbackAction,
  redirectToPage: push,
};

export default compose(
  checkMinimumRequiredProps('Edit', ['basePath', 'resource']),
  connect(mapStateToProps, mapDispatchToProps),
)(CreateEditController);
