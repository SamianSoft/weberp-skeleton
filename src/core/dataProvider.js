/* eslint-disable no-case-declarations */
import axios from 'axios';
import querystring from 'qs';
import lodashGet from 'lodash/get';
import { GET_LIST, GET_ONE, CREATE, UPDATE } from 'react-admin';

import {
  API_URL,
  API_VERSION,
  USER_TOKEN,
  CONFIG_PROFILE_SETTING,
  getValue,
  CONFIG_FIXED_HEADER_PARAMS,
  CONFIG_ROUTE_PREFIX,
} from './configProvider';
import {
  clone,
  arrayResultToObjectWithLowerCase,
  objectToLowerCaseProperties,
  isEmpty,
  isEmptyObject,
} from '../helper/DataHelper';
import { getOperatorByValueForFilter } from '../helper/TextHelper';
import { CONFIG_CALENDAR, CONFIG_LOCALE } from './configProvider';

import errorSound from '../sound/error-sound.mp3';
import warningSound from '../sound/warning-sound.mp3';
import defaultSound from '../sound/default-sound.mp3';

// mock file
import metaOrder from '../mock/meta-order.json';
import metaOrderDetail from '../mock/meta-order-detail.json';
import listOrder from '../mock/list-order.json';
import oneOrder from '../mock/one-order.json';
import oneOrderDetail from '../mock/one-order-detail.json';
import dropbaseData from '../mock/dropbase-data.json';
//

export const GET_META = 'GET_META';
export const CUSTOM_UPDATE = 'CUSTOM_UPDATE';
export const GET_DROPDOWN = 'GET_DROPDOWN';
export const RUN_SERVICE = 'RUN_SERVICE';

export const httpClient = axios.create();
httpClient.defaults.timeout = 120000; // wait 120 seconds

export const isResponseOk = response => {
  return response.data && response.data.code >= 200 && response.data.code < 300;
};

export const getResponseMessage = response => {
  const userMessage = lodashGet(response, 'data.userMessage');
  const code = lodashGet(response, 'data.code');
  const reqId = lodashGet(response, 'data.requestId');

  const output = (userMessage || code || 'Error') + `^${reqId}`;

  return output;
};

/**
 * this function checks if the response error should parse or show `userMessage`
 * @function shouldParseResponseError
 * @param {object} response
 * @returns {boolean}
 */
export const shouldParseResponseError = response => {
  return (
    response.data.data &&
    !isEmptyObject(response.data.data) &&
    response.data.code !== 6033 &&
    response.data.code !== 6015 &&
    response.data.code !== 6057 &&
    response.data.code !== 7008
  );
};

export const getFilterByValue = (name, value) => {
  const operator = getOperatorByValueForFilter(value);
  return [name, operator, value];
};

const checkResponseAndPlayAudio = response => {
  const messageSound = lodashGet(response, 'messageSound');
  if (isEmpty(messageSound)) {
    return;
  }

  let soundFile;
  switch (messageSound) {
    case 'error':
      soundFile = errorSound;
      break;

    case 'warning':
      soundFile = warningSound;
      break;

    default:
      soundFile = defaultSound;
  }

  const responseAudio = new Audio(soundFile);
  responseAudio.loop = false;
  responseAudio.play();
};

/**
 * if in the data `recordOpenForm` or `recordKey` is existes this function opens it in new tab.
 * @function checkResponseForOpenNewTab
 * @param {Object} response
 * @returns {void | undefined}
 */
const checkResponseForOpenNewTab = response => {
  if (isEmptyObject(response) || !response.actionOutput || isEmptyObject(response.actionOutput)) {
    return;
  }

  const { recordKey = [], recordOpenForm = [] } = lodashGet(response, ['actionOutput'], {});
  const newTabs = [];
  let index = 0;

  // check recordKey
  if (recordKey && recordKey.length) {
    recordKey.forEach(item => {
      newTabs[index++] = item;
    });
  }

  // check recordOpenForm
  if (recordOpenForm && recordOpenForm.length) {
    recordOpenForm.forEach(item => {
      newTabs[index++] = item;
    });
  }

  // Open new tabs
  if (newTabs.length) {
    newTabs.forEach(item => {});
  }
};

const prepareFilterFromObject = filterObject => {
  const preparedListFilter = [];
  for (const key in filterObject) {
    if (preparedListFilter.length) {
      preparedListFilter.push('and');
    }

    // if filter value is prepared
    if (Array.isArray(filterObject[key])) {
      preparedListFilter.push(filterObject[key]);
    }
    // if it's key=value , then prepare as array
    else {
      preparedListFilter.push(getFilterByValue(key, filterObject[key]));
    }
  }

  return preparedListFilter;
};

const dataProvider = async (type, resource, params = {}) => {
  const { rawResponse = false, skipPrefix = false, queryParams = {} } = params;

  const apiUrl = getValue(API_URL);
  const apiVersion = getValue(API_VERSION);
  const prefix =
    !skipPrefix && getValue(CONFIG_ROUTE_PREFIX) ? `${getValue(CONFIG_ROUTE_PREFIX)}/` : '';
  const token = getValue(USER_TOKEN);
  const profileSetting = getValue(CONFIG_PROFILE_SETTING) || {};
  const fixedHeaderParams = getValue(CONFIG_FIXED_HEADER_PARAMS) || {};

  const calendarLocale = getValue(CONFIG_CALENDAR);
  const locale = getValue(CONFIG_LOCALE);
  const requestConfig = {
    headers: {
      ...fixedHeaderParams,
      calendarLocale,
      locale,
      settings: encodeURI(JSON.stringify(profileSetting)),
      authorization: `Bearer ${token}`,
    },
  };

  switch (type) {
    case GET_DROPDOWN:
      const dropdownPerPage = lodashGet(params, 'pagination.perPage') || 10;
      const dropdownPage = lodashGet(params, 'pagination.page') || 1;
      const dropdownFilter =
        params.filter && Object.keys(params.filter).length > 0
          ? JSON.stringify(prepareFilterFromObject(params.filter))
          : '';

      const dropdownQueryParameters = querystring.stringify({
        search: `${params.search}` || '',
        parameters: params.parameters || '',
        skip: (dropdownPage - 1) * dropdownPerPage,
        takeCount: dropdownPerPage,
        forceTreeLevel: params.forceTreeLevel ? 'true' : 'false',
        filters: dropdownFilter,
      });

      const dropdownUrl = `${apiUrl}/${apiVersion}/${prefix}dropdown/${resource}?${dropdownQueryParameters}`;

      const dropdownResponse = dropbaseData;
      checkResponseAndPlayAudio(dropdownResponse.data);
      checkResponseForOpenNewTab(dropdownResponse.data);
      if (!isResponseOk(dropdownResponse)) {
        throw getResponseMessage(dropdownResponse);
      }

      if (rawResponse) {
        return dropdownResponse.data;
      }

      return {
        result: arrayResultToObjectWithLowerCase(dropdownResponse.data.data),
        total: dropdownResponse.data.totalCount,
        userMessage: dropdownResponse.data.userMessage,
        messageType: dropdownResponse.data.messageType,
      };

    case GET_META:
      let metaResponse = {};
      if (resource === 'webtest/orderdetail') {
        metaResponse = metaOrderDetail;
      } else {
        metaResponse = metaOrder;
      }

      if (!isResponseOk(metaResponse)) {
        throw getResponseMessage(metaResponse);
      }

      let relationsMeta = [];
      if (metaResponse.data.additionalData && metaResponse.data.additionalData.relationsMeta) {
        relationsMeta = metaResponse.data.additionalData.relationsMeta;
      }

      if (rawResponse) {
        return metaResponse.data;
      }

      return [metaResponse.data.data, ...relationsMeta];

    case GET_LIST:
      const page = params.pagination.page || 1;
      const perPage = params.pagination.perPage || 20;

      const response = listOrder;

      checkResponseAndPlayAudio(response.data);
      checkResponseForOpenNewTab(response.data);
      if (rawResponse) {
        return response.data;
      }

      if (!isResponseOk(response)) {
        throw getResponseMessage(response);
      }

      return {
        data: arrayResultToObjectWithLowerCase(response.data.data, { perPage, page }),
        total: response.data.totalCount,
      };

    case GET_ONE:
      // prettier-ignore
      let getOneResponse = {};
      if (resource === 'webtest/orderdetail') {
        getOneResponse = oneOrderDetail;
      } else {
        getOneResponse = oneOrder;
      }

      checkResponseAndPlayAudio(getOneResponse.data);
      checkResponseForOpenNewTab(getOneResponse.data);
      if (!isResponseOk(getOneResponse)) {
        throw getOneResponse.data;
        // TODO: When it isResponseOk === true , check that it works correctly
      }

      if (rawResponse) {
        return getOneResponse.data;
      }

      return {
        data: objectToLowerCaseProperties(
          getOneResponse.data.data,
          undefined,
          undefined,
          params.id,
        ),
      };

    case UPDATE:
      const updateData = clone(params.data);
      delete updateData._meta;
      if (updateData.__relationsData) {
        delete updateData.__relationsData;
      }

      const updateUrl = `${apiUrl}/${apiVersion}/${prefix}${resource}/${params.id}`;
      const updateResponse = await httpClient.put(updateUrl, updateData, requestConfig);

      checkResponseAndPlayAudio(updateResponse.data);
      checkResponseForOpenNewTab(updateResponse.data);
      if (rawResponse) {
        return updateResponse.data;
      }

      if (!isResponseOk(updateResponse)) {
        throw shouldParseResponseError(updateResponse)
          ? updateResponse.data
          : getResponseMessage(updateResponse);
      }

      const { additionalData: updateAdditionalData = {} } = updateResponse.data;

      return {
        ...updateAdditionalData,
        data: objectToLowerCaseProperties(updateResponse.data.data),
      };

    case CUSTOM_UPDATE:
      let customUpdateData = '';
      params.data.map(item => {
        customUpdateData += item;
      });
      const customUpdateUrl = `${apiUrl}/${apiVersion}/${prefix}${resource}/${params.id}/${customUpdateData}`;
      const customUpdateResponse = await httpClient.put(customUpdateUrl, {}, requestConfig);

      checkResponseAndPlayAudio(customUpdateResponse.data);
      checkResponseForOpenNewTab(customUpdateResponse.data);
      if (rawResponse) {
        return customUpdateResponse.data;
      }

      if (!isResponseOk(customUpdateResponse)) {
        throw getResponseMessage(customUpdateResponse);
      }

      const { additionalData: customUpdateAdditionalData = {} } = customUpdateResponse.data;

      return {
        ...customUpdateAdditionalData,
        data: objectToLowerCaseProperties(customUpdateResponse.data.data),
      };

    case CREATE:
      let createData = clone(params.data);
      delete createData._meta;
      // if there is a file attached, send differently
      if (lodashGet(params, 'data.file.type')) {
        requestConfig.headers['content-type'] = 'multipart/form-data';

        createData = new FormData();
        createData.append('file', params.data.file);
        for (const key in params.data) {
          if (key === 'file') continue;
          createData.append(key, params.data[key]);
        }
      }

      const createUrl = `${apiUrl}/${apiVersion}/${prefix}${resource}`;

      const createResponse = await httpClient.post(createUrl, createData, requestConfig);

      checkResponseAndPlayAudio(createResponse.data);
      checkResponseForOpenNewTab(createResponse.data);
      if (rawResponse) {
        return createResponse.data;
      }

      if (!isResponseOk(createResponse)) {
        console.log('dataProvider.js create response is NOT OK', { createResponse });
        throw shouldParseResponseError(createResponse)
          ? createResponse.data
          : getResponseMessage(createResponse);
      }
      const { additionalData: createAdditionalData = {} } = createResponse.data;

      return {
        ...createAdditionalData,
        data: objectToLowerCaseProperties(createResponse.data.data),
      };

    default:
      console.log(type + ' is not defined!', resource, params);
      throw type + ' is not defined!';
  }
};

export default dataProvider;
