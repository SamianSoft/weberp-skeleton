/**
 * this function will make the correct form initial values base of the default value prop.
 * @function getFormInitialValues
 * @param {object} initialValues
 * @param {undefined | object | Function} defaultValue
 * @param {object} record
 * @returns {object}
 * */
export default function getFormInitialValues(
  initialValues: object,
  defaultValue: undefined | object | Function,
  record: object,
): object {
  let finalInitialValues = {
    ...initialValues,
    ...record,
  };

  if (typeof defaultValue !== 'undefined') {
    console.warn('"defaultValue" is deprecated, please use "initialValues" instead');
  }

  if (typeof defaultValue === 'object') {
    finalInitialValues = {
      ...defaultValue,
      ...finalInitialValues,
    };
  } else if (typeof defaultValue === 'function') {
    finalInitialValues = {
      ...defaultValue(record),
      ...finalInitialValues,
    };
  }

  return finalInitialValues;
}
