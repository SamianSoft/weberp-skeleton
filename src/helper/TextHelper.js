import { CONFIG_LOCALE, getValue } from '../core/configProvider';
import { isEmpty } from './DataHelper';

export const isCleanStringMatch = (haystack, needle, needToReturnString = null) => {
  let internalHaystack = String(haystack).toLowerCase();
  let internalNeedle = String(needle).toLowerCase();
  const list = [
    // ['bad', 'good'],
    ['ي', 'ی'],
    ['ئ', 'ی'],
    ['ى', 'ی'],
    ['ۍ', 'ی'],
    ['ێ', 'ی'],
    ['ې', 'ی'],
    ['ۑ', 'ی'],
    ['ے', 'ی'],
    ['ۓ', 'ی'],
    ['ک', 'ک'],
    ['ڪ', 'ک'],
    ['ګ', 'ک'],
    ['ڬ', 'ک'],
    ['ڭ', 'ک'],
    ['ڮ', 'ک'],
    ['ي', 'ی'],
    ['ك', 'ک'],
  ];

  list.forEach(([bad, good]) => {
    internalHaystack = internalHaystack.split(bad).join(good);
    internalNeedle = internalNeedle.split(bad).join(good);
  });

  if (needToReturnString) {
    return internalHaystack;
  }

  return internalHaystack.indexOf(internalNeedle) !== -1;
};

/**
 * check 2 string and run `isCleanStringMatch`.
 * @param {String} haystack
 * @param {String} needle
 * @returns {Boolean}
 */
export const isStringWthStarsMatch = (haystack, needle) => {
  if (typeof needle === 'boolean') {
    return needle;
  }

  if (needle.indexOf('*') === -1) {
    return isCleanStringMatch(haystack, needle);
  }

  const parts = needle.split('*');
  // every word must match
  for (const word of parts) {
    if (!word) {
      continue;
    }

    // if any of these words are not in haystack, then won't match
    if (!isCleanStringMatch(haystack, word)) {
      return false;
    }
  }

  return true; // if reached here, means it's a match!
};

/**
 * if `value` is boolean return `equal` else return `contains`.
 * @param {boolean | string | number } value
 * @returns {string}
 */
export const getOperatorByValueForFilter = value => {
  // if boolean
  if (
    value === null ||
    value.toString().toLowerCase() === 'true' ||
    value.toString().toLowerCase() === 'false'
  ) {
    return 'equal';
  }

  return 'contains';
};

/**
 * Replace Arabic characters to search correctly
 * @param {string} value A string value
 * @returns {string}
 */
export const replaceArabicCharacters = value => {
  if (typeof value !== 'string' || isEmpty(value)) {
    return value;
  }
  const isFarsi = getValue(CONFIG_LOCALE) === 'fa';
  let mirror = String(value);

  if (isFarsi) {
    const regex = /ئ|ي/gm;
    mirror = mirror.replace(regex, 'ی').replace('ك', 'ک');
  }

  return mirror;
};
