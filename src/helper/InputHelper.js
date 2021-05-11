/* eslint-disable @typescript-eslint/no-empty-function */
import lodashGet from 'lodash/get';

import dataProvider, { RUN_SERVICE } from '../core/dataProvider';
import { isEmpty, isEmptyObject } from './DataHelper';

export const URL_FIELD = 'URL_FIELD';
export const RESOURCE_LINK_FIELD = 'RESOURCE_LINK_FIELD';
export const POLYGON_FIELD = 'POLYGON_FIELD';
export const LOCATION_FIELD = 'LOCATION_FIELD';
export const COMPUTED_FIELD = 'COMPUTED_FIELD';
export const DROPDOWN_FIELD = 'DROPDOWN_FIELD';
export const SEARCH_FIELD = 'SEARCH_FIELD';
export const TAG_FIELD = 'TAG_FIELD';
export const BOOLEAN_FIELD = 'BOOLEAN_FIELD';
export const NUMBER_FIELD = 'NUMBER_FIELD';
export const DATE_FIELD = 'DATE_FIELD';
export const LONG_TEXT_FIELD = 'LONG_TEXT_FIELD';
export const TEXT_FIELD = 'TEXT_FIELD';
export const CODING_FIELD = 'CODING_FIELD';
export const DECIMAL_FIELD = 'DECIMAL_FIELD';
export const FILE_FIELD = 'FILE_FIELD';
export const STRING_SELECT_FIELD = 'STRING_SELECT_FIELD';
export const STRING_MULTI_SELECT_FIELD = 'STRING_MULTI_SELECT_FIELD';
export const DROP_BASE_MULTI_SELECT_FIELD = 'DROP_BASE_MULTI_SELECT_FIELD';
export const TIME_FIELD = 'TIME_FIELD';

export const getInputWidth = input => {
  if (!input) {
    return 150;
  }
  const minInputWidth = input.dropdown ? 250 : 150;

  return input.width <= minInputWidth ? minInputWidth : input.width;
};

export const getCodingPattern = (codingPattern, currentLevel) => {
  const regExPattern = RegExp(/^\d+$/);
  if (!codingPattern || !regExPattern.exec(currentLevel).length) {
    return;
  }
  const splitted = codingPattern.split('#');
  return splitted[currentLevel].length;
};

export const isActive = (key, activeItem) => {
  if(activeItem)
  return key ===  activeItem.key;
  else return false;
};


export const isPassed = (item, activeItem) => {
  if(activeItem) {
    return item.priority <= activeItem.priority && item.tickWhenPass
  } else return false;
}

export const getTypeByField = field => {
  // return TEXT_FIELD;
  return field.name
};

/**
 * prepare data and param and run service validation
 * @param {Number} fieldId
 * @param {String} resource
 * @param {Object} validationInfo
 * @param {Function} changeFormValue
 * @param {String} source
 * @returns {Function}
 */
export const runAsyncValidation = (
  fieldId,
  resource,
  validationInfo,
  changeFormValue,
  source,
) => async (currentValue, formData) => {
  const [serviceModuleName, serviceModuleTableName] = resource.split('/');
  const [relationPath, rowNumber] = source.split('.');

  const params = prepareParamForValidation(
    validationInfo.parameters,
    lodashGet(formData, `${relationPath}.${rowNumber}`, formData),
  );

  try {
    const { status, data, userMessage } = await dataProvider(RUN_SERVICE, '', {
      actionUniqueId: validationInfo.uniqueId,
      serviceModuleName,
      serviceModuleTableName,
      fieldId: fieldId,
      data: {
        params,
        items: [],
      },
      rawResponse: true,
    });

    if (data && !isEmptyObject(data)) {
      Object.keys(data).forEach(name => {
        if (!isEmpty(rowNumber)) {
          if (
            lodashGet(formData, `${relationPath}.${rowNumber}.${name.toLowerCase()}`) != data[name]
          ) {
            changeFormValue(`${relationPath}.${rowNumber}.${name.toLowerCase()}`, data[name]);
          }
        } else {
          if (formData[name.toLowerCase()] != data[name]) {
            changeFormValue(name.toLowerCase(), data[name]);
          }
        }
      });
    } else if (!status) {
      return userMessage;
    }
  } catch (error) {
    return error.toString();
  }
};

export const simpleMemoizeForValidation = fn => {
  let lastArg;
  let lastResult;
  return (value, formData) => {
    if (lastArg !== value) {
      lastArg = value;
      lastResult = fn(value, formData);
    }
    return lastResult;
  };
};

/**
 * prepare parameter for service validation with `relatedParameterName`.
 * @param {Array} parameter
 * @param {Object} data
 * @returns {Object}
 */
export const prepareParamForValidation = (parameter, data) => {
  if (!parameter || !parameter.length) {
    return {};
  }

  const tempParam = {};

  parameter.forEach(item => {
    const { name, id, relatedParameterName, defaultValue } = item.field;
    if (id > 0) {
      tempParam[relatedParameterName] = lodashGet(data, name, null);
    } else {
      tempParam[relatedParameterName] = !isEmpty(defaultValue)
        ? defaultValue
        : lodashGet(data, name, null);
    }
  });

  return tempParam;
};
