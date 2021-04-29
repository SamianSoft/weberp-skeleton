import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import lodashDebounce from 'lodash/debounce';
import lodashGet from 'lodash/get';
import lodashPick from 'lodash/pick';

import { clone, isEmpty, isEmptyObject } from '../helper/DataHelper';
import { getFieldByName } from '../helper/MetaHelper';
import { DATE_FIELD, getTypeByField } from '../helper/InputHelper';

class SubmittableFormDefaultValueHOC extends PureComponent {
  state = { updatedDefault: {}, mergedValues: {} };

  // because change to state variable is slow, we have to keep a normal variable
  // and setState clone of this variable
  internalChangedDefault = {};

  updateDefaultValue = (name, value, skipIfNotExists = false) => {
    if (typeof this.internalChangedDefault[name] === 'undefined' && skipIfNotExists) {
      return;
    }

    this.internalChangedDefault[name] = value;

    this.updateInternalState();
  };

  // reset the stored default values to meta default values
  resetDefaultValues = () => {
    const { initialValues = {}, fieldList = [] } = this.props;
    const resetIgnoreFields = fieldList
      .filter(field => lodashGet(field, 'keepValueAfterSubmit'))
      .map(field => field.name);
    const necessaryValuesBeforReset = lodashPick(this.state.mergedValues, resetIgnoreFields);

    this.internalChangedDefault = initialValues;
    this.setState({
      mergedValues: {
        ...initialValues,
        ...necessaryValuesBeforReset,
      },
    });
  };

  updateInternalState = lodashDebounce(() => {
    const { defaultValue = {}, initialValues = {} } = this.props;
    this.setState({
      updatedDefault: clone(this.internalChangedDefault),
      mergedValues: {
        ...defaultValue,
        ...initialValues,
        ...this.internalChangedDefault,
      },
    });
  }, 200);

  /**
   * This function will look for necessary information like parent field names or
   * process unique id and get the correct value of this important data and inject them to `additionalInfo` object.
   * @function computeAdditionalInfo
   * @param {object} formRecord equall with `props.record`
   * @returns {object} additionalInfo
   */
  computeAdditionalInfo = formRecord => {
    const {
      parentFieldName,
      dropdownParentFieldName,
      todoShareListParentId,
      overrideParams,
    } = this.props;

    const additionalInfo = overrideParams && !isEmptyObject(overrideParams) ? overrideParams : {};

    const positionid = lodashGet(formRecord, 'positionid');
    const stateid = lodashGet(formRecord, 'stateid');
    const __processuniqueid = lodashGet(formRecord, '__processuniqueid');

    if (positionid) {
      additionalInfo.positionid = positionid;
    }
    if (stateid) {
      additionalInfo.stateid = stateid;
    }
    if (__processuniqueid) {
      additionalInfo.__processuniqueid = __processuniqueid;
    }

    if (!isEmpty(parentFieldName)) {
      additionalInfo[parentFieldName] = lodashGet(formRecord, parentFieldName);
    }

    if (!isEmpty(dropdownParentFieldName)) {
      additionalInfo[dropdownParentFieldName] = lodashGet(formRecord, dropdownParentFieldName);
    }

    if (!isEmpty(todoShareListParentId)) {
      additionalInfo[todoShareListParentId] = lodashGet(formRecord, todoShareListParentId);
    }

    return additionalInfo;
  };

  /**
   *Tthis function will remove extra values that exist in the form record but no need to send to the server
   * it will be different for puzzle forms because in puzzle record is equal with `formData`.
   * @function sanitizeRecordOrDefaultValues
   * @param {object} values editted form data
   * @returns {object} clearFormData
   */
  sanitizeRecordOrDefaultValues = values => {
    const { record = {}, initialValues, metaData, puzzleMode, formData } = this.props;
    let clearFormData = {};
    const formRecord = clone(record);

    if (puzzleMode) {
      clearFormData = formData;
    } else {
      clearFormData = this.computeAdditionalInfo(formRecord);
      Object.keys(values).forEach(key => {
        const field = getFieldByName(metaData, key);
        const fieldType = field ? getTypeByField(field) : null;
        const keyValueInInitialValues = lodashGet(initialValues, [key]);
        const keyValueInRecord = lodashGet(formRecord, key);

        if (!isEmpty(keyValueInRecord)) {
          // here field exist in record so its EDIT
          if (keyValueInRecord !== values[key] || fieldType === DATE_FIELD) {
            clearFormData[key] = values[key];
          }
        } else {
          // here field not exist in record so its CREATE
          if (!isEmpty(keyValueInInitialValues)) {
            // has initial value
            if (fieldType !== DATE_FIELD) {
              if (keyValueInInitialValues !== String(values[key])) {
                clearFormData[key] = values[key];
              }
            } else {
              clearFormData[key] = values[key];
            }
          } else {
            // has not initial value
            clearFormData[key] = values[key];
          }
        }
      });
    }
    return clearFormData;
  };

  /**
   * This function will pass to `NewSubmittableForm` as main save function.
   * It should receve form data(just editeds) and parameters that we wanna use them in main API cal function like default values
   * and seprate them to tow parameters(formData, params) with merge params and params to call `props.save`.
   * @function save
   * @param {object|null} data
   * @param {object|null} params
   * @param {object|null} customParams
   * @returns {void}
   */
  save = (data, params = {}, customParams = {}) => {
    const { mergedValues } = this.state;
    const finalData = this.sanitizeRecordOrDefaultValues(data);

    // also give back default data with form data
    this.props.save(finalData, {
      ...params,
      ...customParams,
      defaultValue: mergedValues,
      resetDefaultValues: this.resetDefaultValues,
    });
  };

  render() {
    const { component: ChildComponent, defaultValue, defaultValueRef, ...rest } = this.props;
    const { mergedValues } = this.state;

    if (defaultValueRef && defaultValueRef.current) {
      defaultValueRef.current = {
        defaultValue: mergedValues,
        resetDefaultValues: this.resetDefaultValues,
      };
    }

    return (
      <ChildComponent
        {...rest}
        updateDefaultValue={this.updateDefaultValue}
        initialValues={mergedValues}
        save={this.save}
      />
    );
  }
}

SubmittableFormDefaultValueHOC.propTypes = {
  component: PropTypes.any.isRequired,
  save: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    viewVersion: state.admin.ui.viewVersion,
    parentFieldName: lodashGet(state, ['quickCreate', 'parentFieldName']),
    dropdownParentFieldName: lodashGet(state, ['dropdownQuickCreate', 'parentFieldName']),
    todoShareListParentId: lodashGet(state, ['todoList', 'shareListParentId']),
  };
}

const ConnectedHOC = connect(mapStateToProps, null)(SubmittableFormDefaultValueHOC);

export default HocComponent => props => <ConnectedHOC {...props} component={HocComponent} />;
