import { isEmpty, isEmptyObject } from './DataHelper';
import lodashMerge from 'lodash/merge';
import lodashGet from 'lodash/get';

/**
 * Get dropdown request parameter from form data.
 * @function getDropdownRequestParams
 * @param {object} -
 * {
 *   dropdownMeta: object,
 *   page: number,
 *   perPage: number,
 *   record: object,
 *   search: string,
 *   filterValues: object,
 *   forceTreeLevel: boolean,
 *   additionalProps: object,
 *   resource: string
 * }
 * @returns {object}
 */
export const getDropdownRequestParams = ({
  dropdownMeta,
  page = 1,
  perPage = 10,
  record = {},
  search = '',
  filterValues = {},
  forceTreeLevel = dropdownMeta.forceTreeLevel,
  additionalProps = {},
  resource = '',
}) => {
  const { parameters: dropdownRequiredParameters } = dropdownMeta;

  const result = {
    pagination: {
      page,
      perPage,
    },
    search,
    filter: filterValues,
  };

  const parameters = {};
  dropdownRequiredParameters.forEach(item => {
    if (!item || isEmpty(item.from) || isEmpty(item.to)) {
      return;
    }
    const { orginalRecord } = additionalProps;
    const { to, from, moduleName, moduleTableName, defaultValue } = item;
    const dropdownParameterResource = `${moduleName}/${moduleTableName}`;
    const formFieldName = from.toLowerCase();
    const paramFieldName = to.toLowerCase();

    if (dropdownParameterResource === resource) {
      const parameterValue = computeParameterValue(record, formFieldName, defaultValue);
      if (!isEmpty(parameterValue)) {
        parameters[paramFieldName] = parameterValue;
      }
    } else {
      const parameterValue = computeParameterValue(orginalRecord, formFieldName, defaultValue);
      if (!isEmpty(parameterValue)) {
        parameters[paramFieldName] = parameterValue;
      }
    }
  });

  if (Object.keys(parameters).length > 0) {
    result.parameters = JSON.stringify(parameters);
  }

  result.forceTreeLevel = forceTreeLevel;
  return result;
};

/**
 * Check `fieldName` in `data` and return value.
 * @function computeParameterValue
 * @param {object} data
 * @param {string} fieldName
 * @param {number | string | null} defaultValue
 * @returns {number | string | null}
 */
const computeParameterValue = (data, fieldName, defaultValue) => {
  return data && !isEmpty(data[fieldName])
    ? data[fieldName]
    : !isEmpty(defaultValue)
    ? defaultValue
    : null;
};

export const getLabelForDropdownOption = (dropdownMeta, row) => {
  const { displayMember, displayMember2 } = dropdownMeta;

  let label = row[displayMember];

  if (typeof row[displayMember2] !== 'undefined') {
    label += ' - ' + row[displayMember2];
  }

  return label;
};

/**
 * it will compute the dropdown label that should be displayed and the dropdown value that
 * should send in requests and returns this info in an object to use in the dropdown field.
 * @function findSelectedItemFromDropdownData
 * @param {Object} includes dropdownMeta,dataArray,record,value,field
 * @returns {Object} dropdown lable and value
 */
export const findSelectedItemFromDropdownData = ({
  dropdownMeta,
  dataArray,
  record,
  value,
  field,
}) => {
  const { valueMember } = dropdownMeta;
  // if we have any data from api, use that first!
  if (dataArray && dataArray.length && !isEmpty(value)) {
    const dropdownItem = dataArray.find(item => {
      // keep loose comparison, because server might give number inside string
      // eslint-disable-next-line eqeqeq
      const computedValue = Array.isArray(value) ? lodashGet(value, 2) : value;
      return item[valueMember] == computedValue;
    });

    if (dropdownItem) {
      return {
        ...dropdownItem,
        value: dropdownItem[valueMember],
        label: getLabelForDropdownOption(dropdownMeta, dropdownItem),
      };
    }
  }

  const preFilledName = dropdownPreFilledName(field);
  if (!isEmpty(value) && record && record[preFilledName]) {
    return {
      value: value,
      label: record[preFilledName],
    };
  }

  return null;
};

export const dropdownPreFilledName = field => {
  return field.relatedName;
};
/**
 * this function will call the getDropdownRequestParams function to compute dropdown parameters
 * for HTTP requests then merge them with custom params that have been received from the third parameter.
 * then trigger the findDropdownData action that has been destructed from the first parameter (props)
 * @function triggerDropdownFetchData
 * @param {object} props
 * @param {string} value
 * @param {object} customParams constant parameters
 * @returns {void}
 */
export const triggerDropdownFetchData = (props, value, customParams = {}) => {
  const {
    formData,
    record = {},
    dropdownMeta,
    findDropdownData,
    additionalProps,
    resource,
  } = props;
  const { id } = dropdownMeta;

  const params = lodashMerge(
    getDropdownRequestParams({
      dropdownMeta,
      record: !isEmptyObject(formData) ? formData : record,
      search: !isEmpty(value) ? value : '',
      additionalProps,
      resource,
    }),
    customParams,
  );

  findDropdownData({ id, params, meta: dropdownMeta });
};
