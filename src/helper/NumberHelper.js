import { isEmpty } from './DataHelper';

export const formatMoney = (amount, decimalCount = 2, decimal = '.', thousands = ',') => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    const i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  } catch (error) {
    console.log(error);
  }
};

export const isNumber = value => {
  return /^-{0,9}\d+(\.?\d+)?$/.test(value);
};

export const getFractionDigitCountFromFormat = format => {
  // format will be like N22, N0, ...
  const regular = new RegExp(/n(\d+)/i);
  const result = regular.exec(format); // ["n22", "22", index: 0, input: "n22", groups: undefined]

  return result && result[1] ? parseInt(result[1], 10) : 0;
};

export const checkNumberForMinus = input => {
  if (!input) {
    return input;
  }

  const amount = input.toString();
  const isNegative = amount.indexOf('-') === 0;
  if (amount.length === 1) {
    return amount;
  }

  let result = amount.split('-').join('000');
  if (!result.match(/\d+/g)) {
    return '';
  }
  result = isNaN(result) ? result.match(/\d+\.?/g).join('') : result;

  return isNegative ? -1 * parseFloat(result) : parseFloat(result);
};

export const convertDigitsToEnglish = input => {
  if (isEmpty(input)) {
    return '';
  }

  return String(input)
    .replace(/[\u0660-\u0669]/g, c => c.charCodeAt(0) - 0x0660)
    .replace(/[\u06f0-\u06f9]/g, c => c.charCodeAt(0) - 0x06f0);
};

/**
 * it receives a string and separates and return its last character
 * @function getLastCharacter
 * @param {string} value
 * @returns {string} last character of the entry
 */
export const getLastCharacter = value => {
  return String(value).slice(String(value).length - 1);
};

/**
 * it receives a string and count number of "." on it
 * @function getCountOfDecimalPoints
 * @param {string} value
 * @returns {number} number of Dots
 */
export const getCountOfDecimalPoints = value => {
  return (String(value).match(/\./g) || []).length;
};

/**
 * it receives a string and returns everything after "."
 * @function getDigitsAfterDecimalPoints
 * @param {string} value
 * @returns {string} everything after "."
 */
export const getDigitsAfterDecimalPoints = value => {
  if (value) {
    return String(value).split('.')[1];
  }
  return '';
};

/**
 * it checks that should handle entry or not
 * @function shouldHandleNumber
 * @param {string} numericValue
 * @param {boolean} shouldAddDot
 */
export const shouldHandleNumber = (numericValue, shouldAddDot) => {
  return isNumber(numericValue) || numericValue === '' || shouldAddDot;
};

/**
 * it receives a number and secret it three by three digits with ","
 * @function formatNumber
 * @param {number | string} value
 * @returns {string}
 */
export const formatNumber = value => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 20 }).format(value);
};
