import querystring from 'qs';
import lodashGet from 'lodash/get';
import { isEmpty } from './DataHelper';

/**
 * Get param from url.
 * @function getParamFromUrl
 * @param {string} url
 * @param {string} name
 * @returns {null | string}
 */
export const getParamFromUrl = (url: string, name: string): null | string => {
  if (!url) {
    return null;
  }

  const params = querystring.parse(url.replace('?', '&'), { ignoreQueryPrefix: true });

  return params[name];
};

/**
 * Add param to url.
 * @function addParamToUrl
 * @param {string | null} url
 * @param {string} name
 * @param {number|string} value
 * @returns {null |string}
 */
export const addParamToUrl = (
  url: string | null,
  name: string,
  value: number | string,
): null | string => {
  if (!url) {
    return null;
  }

  const indexOfQ = url.indexOf('?');

  // if doesn't have extra params
  if (indexOfQ === -1) {
    return `${url}?${name}=${value}`;
  }

  const [baseUrl, rest] = url.split('?');

  const params = querystring.parse(rest, { ignoreQueryPrefix: true });
  params[name] = value;

  return baseUrl + '?' + querystring.stringify(params);
};

/**
 * Find parent id from url in edit relation record.
 * @function findIdFromUrlInEditRelationRecord
 * @param {string} location
 * @returns {void | number} id
 */
export const findIdFromUrlInEditRelationRecord = (url: string): void | number => {
  if (!isEmpty(url)) {
    const redirect = getParamFromUrl(url, 'redirect');
    if (!isEmpty(redirect)) {
      const parentUrlSplited = redirect!.split('/');
      if (parentUrlSplited && parentUrlSplited.length > 1) {
        const id = lodashGet(parentUrlSplited, 3);
        return id ? +id : undefined;
      }
    }
  }
};

/**
 * Check for a valid url
 * @function validUrl
 * @param {string} url
 * @returns{boolean}
 */
export const validUrl = (url: string): boolean => {
  const regexMatch = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/.test(
    url,
  );

  return regexMatch;
};
