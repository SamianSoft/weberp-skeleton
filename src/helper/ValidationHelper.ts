import { isEmpty, isEmptyObject } from './DataHelper';
import { getFieldByName } from './MetaHelper';
import lodashGet from 'lodash/get';
import {
  getTypeByField,
  DECIMAL_FIELD,
  NUMBER_FIELD,
  BOOLEAN_FIELD,
  runAsyncValidation,
  URL_FIELD,
} from './InputHelper';
import { getAsyncValidationInfoForField } from './MetaHelper';
import { ValidationErrors } from './Types';
import { Url } from 'devextreme-react/chart';
import { validUrl } from './UrlHelper';

interface DirtyObjectsInterface {
  field: any;
  type: string;
  corectValue?: any;
}

interface HandleError {
  id: number;
  type: string;
  validValue?: number | string | null;
  tabTitle: string;
  tabId: number | string;
}

/**
 *  this function receves a name of field and found the related field with getFieldByName from MetaHelper.
 *  then try to find similar field from fieldList array from props.
 *  if field exist on field list return that else return original field from getFieldByName.
 *  @param {object} fieldList
 *  @param {Array} fieldList
 *  @param {string} dirtyFieldName
 *  @returns {Object|null} founded field in field list or with getFieldByName function
 */
export const findFieldByName = (
  metaData: object,
  fieldList: any,
  dirtyFieldName: string,
): object | null => {
  // find field by name from meta
  const dirtyFieldFromMeta = getFieldByName(metaData, dirtyFieldName);

  if (!isEmptyObject(dirtyFieldFromMeta)) {
    // find simillar field in fieldList
    const simillarFieldInFieldList = fieldList.filter(
      field => field['id'] === dirtyFieldFromMeta['id'],
    );

    if (simillarFieldInFieldList && simillarFieldInFieldList.length > 0) {
      return simillarFieldInFieldList[0]; // field with tabId and tabTitle
    } else {
      return dirtyFieldFromMeta; // field without tabId and tabTitle
    }
  } else {
    return null;
  }
};

/**
 *  this function receve api error object and seprete the response with their types and
 *  push them with currect message in dirty objects array and return it.
 *  @param {Object } apiErrors api response
 *  @param {Object } meta meta data
 *  @param {Array | null} fieldList array of field list
 *  @param {Function} translate react admin translate function
 *  @returns {Array} dirty objects
 */
const prepareDirtyObjects = (
  apiErrors: object,
  meta: object,
  fieldList: any,
  translate: Function,
): DirtyObjectsInterface[] => {
  const dirtyObjects: DirtyObjectsInterface[] = [];

  // get error types
  Object.keys(apiErrors).forEach(errorType => {
    if (
      errorType === 'maxLength' ||
      errorType === 'maxValue' ||
      errorType === 'minValue' ||
      errorType === 'regex'
    ) {
      // get dirty field keys per each type
      Object.keys(apiErrors[errorType]).forEach(dirtyFieldName => {
        // found field from field list || meta
        const field = findFieldByName(meta, fieldList, dirtyFieldName);

        if (field) {
          // fields that have single correct value in api response
          dirtyObjects.push({
            field: field,
            type: errorType,
            corectValue: apiErrors[errorType][dirtyFieldName],
          });
        } else {
          //fieldNotFound
          console.log('server validation return an error in a field but field dosent exist');
          dirtyObjects.push({
            field: { name: dirtyFieldName },
            type: errorType,
          });
        }
      });
    } else if (errorType === 'wrongvalue') {
      // get dirty field keys per each type
      Object.keys(apiErrors[errorType]).forEach(dirtyFieldName => {
        // found field from field list || meta
        const field = findFieldByName(meta, fieldList, dirtyFieldName);

        if (field) {
          // fields that have an array of correct values in api response
          dirtyObjects.push({
            field: field,
            type: errorType,
            corectValue: apiErrors[errorType][dirtyFieldName].join(
              ' ' + translate('customValidation.seprator') + ' ',
            ),
          });
        } else {
          //fieldNotFound
          console.log('server validation return an error in a field but field dosent exist');
          dirtyObjects.push({
            field: { name: dirtyFieldName },
            type: errorType,
          });
        }
      });
    } else if (errorType === 'required' || errorType === 'stage') {
      // get dirty field keys per each type
      apiErrors[errorType].forEach(dirtyFieldName => {
        // found field from field list || meta
        const field = findFieldByName(meta, fieldList, dirtyFieldName);

        if (field) {
          // fields that havenot correct value in api response
          dirtyObjects.push({
            field: field,
            type: errorType,
          });
        } else {
          //fieldNotFound
          console.log('server validation return an error in a field but field dosent exist');
          dirtyObjects.push({
            field: { name: dirtyFieldName },
            type: errorType,
          });
        }
      });
    } else {
      console.log('ValidationHelper.ts:146 Not handled error 😱', { apiErrors });
    }
  });

  return dirtyObjects;
};

/**
 *  this function receves an array of API validation Errors , seprate them by them types and names,
 *  make an array of dirty field names to show on notification.
 *  meke a correct error message for each field and make compatible objects with validationErrors State then push to it.
 *  @param {Object } meta meta data
 *  @param {Array | null} fieldList array of field list
 *  @param {Object } errorPackage includes response and request id
 *  @param {Function} notificationCallback show notification action
 *  @param {Function} translate react admin translate function
 *  @param {string} locale current language
 *  @returns {Object} includes response and request id
 */
export const handleApiErrors = (
  meta: object,
  fieldList = [],
  errorPackage: { apiErrors: object; requestId: string },
  notificationCallback: Function,
  translate: Function,
  locale: string,
): {
  preparedValidationErrors: ValidationErrors[] | [];
  preparedErrorMessage: null | string;
} => {
  const apiErrors = errorPackage.apiErrors;
  const requestId = errorPackage.requestId;

  // if error exist
  if (Object.keys(apiErrors).length > 0) {
    const dirtyObjects = prepareDirtyObjects(apiErrors, meta, fieldList, translate);
    const dirtyFieldsNames: string[] = [];
    const preparedValidationErrors: ValidationErrors[] = [];

    // TODO: refactor switch
    // preparing new error objects to push in Validation errors state :
    dirtyObjects.forEach(dirtyObject => {
      const { field, type, corectValue } = dirtyObject;
      const { id, tabTitle, tabId } = field;

      // push dirtyFieldNames to an array to show in notification
      dirtyFieldsNames.push(
        lodashGet(
          field,
          ['translatedCaption', locale],
          lodashGet(field, 'caption', lodashGet(field, 'name')),
        ),
      );

      let message = '';

      switch (type) {
        case 'required':
          message = translate('ra.validation.required');
          break;
        case 'wrongvalue':
          message = translate('customValidation.invalidValue');
          break;
        case 'maxLength':
          message = translate('ra.validation.maxLength', { max: corectValue });
          break;
        case 'maxValue':
          message = translate('ra.validation.maxValue', { max: corectValue });
          break;
        case 'minValue':
          message = translate('ra.validation.minValue', { min: corectValue });
          break;
        case 'stage':
          message = translate('customValidation.invalidValue'); // not show all of correct value
          break;
        case 'regex':
          message = translate('customValidation.invalidValue');
          break;
        default:
          console.log('unknown validation error');
          return;
      }

      preparedValidationErrors.push({
        id: id,
        tabTitle: tabTitle,
        tabId: tabId,
        message,
      });
    });

    // show notification
    const isMultipleError =
      dirtyFieldsNames && dirtyFieldsNames.length && dirtyFieldsNames.length > 1;

    // make a corrct message for show in notofication
    const preparedMessageForNotification = isMultipleError
      ? translate('customValidation.valueOfFields') +
        dirtyFieldsNames.join(' ' + translate('customValidation.seprator') + ' ') +
        translate('customValidation.areNotValid')
      : translate('customValidation.valueOfField') +
        dirtyFieldsNames[0] +
        translate('customValidation.notValid');

    // show notification as dialog
    if (typeof notificationCallback === 'function') {
      notificationCallback(preparedMessageForNotification + '^' + requestId, 'error');
    }

    const resault = {
      preparedValidationErrors: preparedValidationErrors,
      preparedErrorMessage: preparedMessageForNotification,
    };

    return resault;
  } else {
    const cleanResault = {
      preparedValidationErrors: [],
      preparedErrorMessage: null,
    };

    return cleanResault;
  }
};

/**
 * this function should do the validation on every field and push them into an array if
 * an error happen.
 * @param {Object} values - form data
 * @param {string} locale current language
 * @param {Object}  metaData meta data
 * @param {Array} fieldList - all fields
 * @param {string}  resource resource
 * @param {string}  relationResource relation resource
 * @param {Function}  changeFormValue for acync validations
 * @returns {Array}  dirtyFields and asyncValidations
 * */
const validateFields = (
  values,
  locale,
  metaData,
  fieldList,
  resource,
  relationResource,
  changeFormValue,
): [HandleError[], any] => {
  const asyncValidations: any = [];
  const dirtyFields: HandleError[] = [];

  for (const field of fieldList) {
    const {
      name,
      id,
      maxLength,
      maxValue,
      minValue,
      required,
      tabTitle,
      tabId,
      translatedTabTitle,
    } = field;

    const fieldType = getTypeByField(field);
    const value =
      values[name] || values[name] === false || values[name] === 0 ? values[name] : null;
    const preparedTabTitle = lodashGet(translatedTabTitle, locale, tabTitle);
    const asyncValidationInfo = getAsyncValidationInfoForField(metaData, id);
    const computedMaxValue =
      !maxValue || maxValue > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : maxValue;

    const regexMatch = validUrl(value);

    const staticProps = {
      id: id,
      tabId: tabId,
      tabTitle: preparedTabTitle,
    };

    // check require
    if (
      required &&
      fieldType === BOOLEAN_FIELD &&
      value !== false &&
      value !== true &&
      value !== 'false' &&
      value !== 'true'
    ) {
      dirtyFields.push({
        ...staticProps,
        type: 'required',
        validValue: null,
      });
    } else if (
      fieldType !== BOOLEAN_FIELD &&
      required &&
      value !== 0 &&
      (!value || value === null || value === undefined || value === '')
    ) {
      dirtyFields.push({
        ...staticProps,
        type: 'required',
        validValue: null,
      });
    }

    // check maxLength
    else if (maxLength && value && value.length > maxLength) {
      dirtyFields.push({
        ...staticProps,
        type: 'maxLength',
        validValue: maxLength,
      });
    }

    // check minValue
    else if (
      (fieldType === NUMBER_FIELD || fieldType === DECIMAL_FIELD) &&
      minValue &&
      value &&
      minValue > value
    ) {
      dirtyFields.push({
        ...staticProps,
        type: 'minValue',
        validValue: minValue,
      });
    }

    // check maxValue
    else if (
      (fieldType === NUMBER_FIELD || fieldType === DECIMAL_FIELD) &&
      computedMaxValue &&
      value &&
      value > computedMaxValue
    ) {
      dirtyFields.push({
        ...staticProps,
        type: 'maxValue',
        validValue: computedMaxValue,
      });
    }

    // check NaN
    else if ((fieldType === NUMBER_FIELD || fieldType === DECIMAL_FIELD) && value && isNaN(value)) {
      dirtyFields.push({
        ...staticProps,
        type: 'NaN',
        validValue: null,
      });
    }
    // check match url
    else if (fieldType === URL_FIELD && !regexMatch && !isEmpty(value)) {
      dirtyFields.push({
        ...staticProps,
        type: 'url',
        validValue: null,
      });
    }

    // check acync validation
    else if (asyncValidationInfo) {
      const preparedValidationFunction = runAsyncValidation(
        field.id,
        relationResource ? relationResource : resource,
        asyncValidationInfo,
        changeFormValue,
        name,
      );

      asyncValidations.push({
        promise: preparedValidationFunction,
        id: id,
        tabTitle: preparedTabTitle,
        tabId: tabId,
      });
    }
  }
  return [dirtyFields, asyncValidations];
};

/**
 * this function should call error seprator function and then request to server for each
 * async validation object . then return the resault to handler function.
 * @param {Object} values - form data
 * @param {Array} fieldList - all fields
 * @param {Function} handleErrors - should call end of function
 * @param {boolean} speceficField show is from submittable form or not
 * @param {string} locale current language
 * @param {Object}  metaData meta data
 * @param {string}  resource resource
 * @param {string}  relationResource relation resource
 * @param {Function}  changeFormValue for acync validations
 * @returns {Promise}  will call handle error function with prepared data
 * */
export const checkFieldValidation = (
  values: object,
  fieldList,
  handleErrors: Function,
  speceficField: boolean,
  locale: string,
  metaData: object,
  resource: string,
  relationResource: string,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeFormValue,
): Promise<[] | null> => {
  return new Promise((resolve, reject) => {
    const speceficFieldId =
      speceficField && fieldList[0] && fieldList[0].id ? fieldList[0].id : undefined;

    const [dirtyFields, asyncValidations] = validateFields(
      values,
      locale,
      metaData,
      fieldList,
      resource,
      relationResource,
      changeFormValue,
    );

    // request to server for all asyncValidations objects
    if (asyncValidations && asyncValidations.length) {
      Promise.all(asyncValidations.map(obj => obj.promise(null, values))).then(values => {
        values.map((value, index) => {
          if (value && typeof value === 'string') {
            dirtyFields.push({
              id: asyncValidations[index].id,
              type: 'async',
              validValue: value,
              tabTitle: asyncValidations[index].preparedTabTitle,
              tabId: asyncValidations[index].tabId,
            });
          }
        });
        // TODO : refactor: (resolve) yeki shavad
        resolve(handleErrors(dirtyFields, speceficFieldId));
      });
    } else {
      resolve(handleErrors(dirtyFields, speceficFieldId));
    }
  });
};
