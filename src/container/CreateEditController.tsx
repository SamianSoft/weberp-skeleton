import React, { FC, useState, cloneElement, useEffect, useRef, ReactElement } from 'react';
import querystring from 'qs';
import lodashFindIndex from 'lodash/findIndex';
import lodashMerge from 'lodash/merge';
import { connect } from 'react-redux';
import lodashGet from 'lodash/get';
import { push } from 'connected-react-router';
import compose from 'recompose/compose';
import {
  EditView,
  CreateView,
  showNotification as showNotificationAction,
  crudGetOne as crudGetOneAction,
} from 'react-admin';

import { crudUpdateWithCallbackAction, crudCreateWithCallbackAction } from '../redux/crud/action';
import { clone, isEmpty, isEmptyObject, removeRelationFromRecord } from '../helper/DataHelper';
import LoadingBox from '../component/LoadingBox';
import { findIdFromUrlInEditRelationRecord, getParamFromUrl } from '../helper/UrlHelper';

interface CreateEditControllerInterface {
  basePath: string;
  children: ReactElement;
  record: object;
  resource: string;
  dispatchCrudUpdate: Function;
  dispatchCrudCreate: Function;
  redirectToPage: Function;
  crudGetOne: Function;
  showNotification: Function;
  relationRecord: object;
  orginalRecord: object;
  parentRecord: object;
  id: number;
  parentId: number;
  parentResource: string;
  rest: any;
}

interface ExtraParamsInterface {
  relationRefList: object;
  resetDefaultValues: Function;
  isSaveAndNew: boolean;
  resetEditedData: Function;
}

interface Action {
  error: { data: object; requestId: string };
  payload: { data: { id: number }; exceptions: object[] };
  requestPayload: { data: object };
}

const CreateEditController: FC<CreateEditControllerInterface> = props => {
  const {
    basePath,
    children,
    record = {},
    resource,
    dispatchCrudUpdate,
    dispatchCrudCreate,
    redirectToPage,
    crudGetOne,
    showNotification,
    relationRecord,
    orginalRecord,
    parentRecord,
    id,
    parentId,
    parentResource,
    ...rest
  } = props;

  /**
   * Prepare override param with url.
   * @function prepareOverrideParam
   * @returns {object}
   */
  const prepareOverrideParam = () => {
    const urlParams = window.location.href.split('?')[1];
    return querystring.parse(urlParams, { strictNullHandling: true });
  };

  const [stateRecord, setStateRecord] = useState<object | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [mergedRecord, setMergedRecord] = useState<object>({
    ...record,
    ...prepareOverrideParam(),
  });
  const [version, setVersion] = useState<number>(0);
  const [apiError, setApiError] = useState<object | null>(null);
  const [relationExceptions, setRelationExceptions] = useState<object[]>([]);

  const overrideParams = useRef<object>(prepareOverrideParam());
  const prevRecord = useRef(record);

  useEffect(() => {
    if (!isEmpty(id)) {
      updateData();
    }
  }, []);

  // UNSAFE_componentWillReceiveProps
  useEffect(() => {
    if (!isEmpty(id)) {
      updateData(resource, id);
    }
  }, [resource, id]);

  // UNSAFE_componentWillReceiveProps
  useEffect(() => {
    if (!isEmpty(parentId) && !isEmpty(parentResource) && !isEmptyObject(record)) {
      updateData(parentResource, parentId, `/${parentResource}`);
    }
    if (prevRecord.current !== record) {
      const mergedRecord = stateRecord
        ? lodashMerge(overrideParams.current, stateRecord)
        : lodashMerge(record, overrideParams.current);

      setStateRecord(null);
      setCreatedId(null);
      setMergedRecord(mergedRecord);
      setVersion(version + 1);
    } else {
      prevRecord.current = record;
    }
  }, [record]);

  /**
   * Get one record with `crudGetOne`.
   * @function updateData
   * @param {string} resource
   * @param {number} id
   * @param {string} basePath
   * @returns {void}
   */
  const updateData = (
    resource: string = props.resource,
    id: number = props.id,
    basePath: string = props.basePath,
  ): void => {
    props.crudGetOne(resource, id, basePath);
  };

  /**
   * Get `id` or `createdId`.
   * @function getId
   * @returns {number | null}
   */
  const getId = (): number | null => {
    return !isEmpty(id) ? id : createdId;
  };

  /**
   * Dispatch an action to send a request to API to save form data
   * @function save
   * @param {object} data The form data that should be saved within a request (update/create)
   * @param {object} params The parameteres that we should send in our request
   * @returns {void}
   */
  const save = (data: object, params: ExtraParamsInterface): void => {
    const id = getId();

    if (!isEmpty(id) && params) {
      // prettier-ignore
      dispatchCrudUpdate(
        resource,
        id,
        data,
        record,
        action => afterSave(action, params),
        false,
        {},
        true
        );
    } else {
      // prettier-ignore
      dispatchCrudCreate(
        resource,
        data,
        action => afterSave(action, params),
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
   *  @param {Action} action predux action
   *  @param {ExtraParamsInterface} extraParams - extra params
   *  @returns {void}
   */
  const afterSave = (action: Action, extraParams: ExtraParamsInterface): void => {
    const { relationRefList, resetDefaultValues, isSaveAndNew, resetEditedData } = extraParams;

    if (action && action.error && action.error.data) {
      // fill the state to pass to validation HOC

      const preparedApiErrorObject = {
        apiErrors: action.error.data,
        requestId: action.error.requestId,
      };

      setApiError(preparedApiErrorObject);
    } else if (action && action.error && !action.error.data) {
      showNotification(action.error, 'error');
    } else {
      const { payload: response, requestPayload } = action;
      const { data: oldData } = requestPayload;
      const { data: newData, exceptions } = response;

      resetDefaultValues(); // for clear form data in (save and new) button

      if (typeof resetEditedData === 'function') {
        resetEditedData();
      }

      if (isEmptyObject(exceptions)) {
        if (!isSaveAndNew) {
          redirectToPage(`/${resource}/${newData.id}/show`);
        }

        setStateRecord(null);
        setCreatedId(null);
        setMergedRecord({});
        setVersion(version + 1);

        return;
      }

      showNotification('form.submitWasAlmostSuccessfulPleaseCheckRelationsAndFixErrors', 'error');

      const exceptionsTemp: object[] = [];

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

      setStateRecord(clonedData);
      setCreatedId(newData.id);
      setRelationExceptions(exceptionsTemp);
    }
  };

  const internalId = getId();

  if (!isEmpty(internalId) && !record) {
    return <LoadingBox />;
  }

  const viewProps = {
    // isLoading,
    save: save,
    resource,
    basePath,
    record: mergedRecord,
    redirect: 'list', //defaultRedirectRoute
    version,
  };

  if (!isEmpty(internalId)) {
    return (
      <EditView {...rest} {...viewProps}>
        {cloneElement(children, {
          apiError,
          setApiError,
          relationExceptions,
          setRelationExceptions,
          relationRecord,
          orginalRecord,
          overrideParams: overrideParams.current,
          parentRecord,
          parentResource,
        })}
      </EditView>
    );
  }

  return (
    <CreateView {...rest} {...viewProps}>
      {cloneElement(children, {
        apiError,
        setApiError,
        overrideParams: overrideParams.current,
      })}
    </CreateView>
  );
};

const mapStateToProps = (state, props) => {
  const { resource, metaData, id, location } = props;

  const record = state.admin.resources[resource]
    ? lodashGet(state.admin.resources, [resource, 'data', id], null)
    : null;

  const { clearedRecord = {}, relationRecord = {} } = removeRelationFromRecord(record, metaData);

  const search = lodashGet(location, 'search');
  const parentId = findIdFromUrlInEditRelationRecord(search);
  const parentResource = getParamFromUrl(search, 'parentResource');

  const parentRecord = state.admin.resources[parentResource!]
    ? lodashGet(state.admin.resources, [parentResource, 'data', parentId], null)
    : null;

  return {
    id,
    record: !isEmptyObject(clearedRecord) ? clearedRecord : null,
    relationRecord: !isEmptyObject(relationRecord) ? relationRecord : null,
    orginalRecord: record,
    parentRecord,
    parentId,
    parentResource,
  };
};

const mapDispatchToProps = {
  crudGetOne: crudGetOneAction,
  showNotification: showNotificationAction,
  dispatchCrudUpdate: crudUpdateWithCallbackAction,
  dispatchCrudCreate: crudCreateWithCallbackAction,
  redirectToPage: push,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(CreateEditController);
