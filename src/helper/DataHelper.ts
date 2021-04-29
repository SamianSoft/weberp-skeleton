import lodashMerge from 'lodash/merge';
import lodashIsEmpty from 'lodash/isEmpty';
import lodashPick from 'lodash/pick';
import lodashGet from 'lodash/get';

import { getRelationsInForm } from './MetaHelper';

type arrayResultToObjectWithLowerCase = (
  result: RequestResult[],
  pageMeta?: {
    page?: any;
    perPage?: any;
  },
) => void;

type objectToLowerCaseProperties = (RequestResult) => RequestResult;

interface RequestResult {
  id: number;
  row: object;
}

// for places that don't give back id
let fakeIdCounter = 0;

export const clone = data => {
  return JSON.parse(JSON.stringify(data));
};

export const mergeAndClone = (defaultData, overrideData) => {
  return lodashMerge(clone(defaultData), overrideData);
};

export const isJsonEncodedString = value => {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    const parsed = JSON.parse(value);

    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {}

  return false;
};

export const getFirstItemFromObject = object => {
  if (!object) {
    return null;
  }

  const propertyList = Object.keys(object);
  return propertyList && propertyList[0] ? object[propertyList[0]] : null;
};

/**
 * Check value is empty or not.
 * @function isEmpty
 * @param {string | number | Array<any> | null | undefined} value
 * @returns {boolean}
 */
export const isEmpty = (value: string | number | Array<any> | null | undefined): boolean => {
  return typeof value === 'undefined' || value === null || value === '';
};

export const isEmptyObject = (object: object): boolean => {
  return typeof object === 'string' || lodashIsEmpty(object);
};

export const arrayResultToObjectWithLowerCase: arrayResultToObjectWithLowerCase = (
  result,
  pageMeta = {},
) => {
  const { perPage, page } = pageMeta;
  if (isEmpty(result) || !result.length) {
    return [];
  }

  const isPageMetaAvailable = !isEmpty(perPage) && !isEmpty(page);
  let indexId = page * perPage - perPage + 1;

  return result.map(item => {
    if (isPageMetaAvailable && typeof item.id === 'undefined') {
      item.id = indexId++;
    }
    return objectToLowerCaseProperties(item);
  });
};

export const objectToLowerCaseProperties: objectToLowerCaseProperties = (
  row = {},
  id = undefined,
) => {
  if (row === null || row === undefined || typeof row === 'undefined') {
    row = {};
  }
  const cloned = clone(row);

  Object.keys(row).forEach(property => {
    cloned[property.toLowerCase()] = row[property];
  });

  if (typeof cloned.id === 'undefined') {
    cloned.id = id ? id : ++fakeIdCounter;
  }

  return cloned;
};

/**
 * check equality of tow objects . return true if there were equal and false if the were not equal.
 * @function areTowObjectsEqual
 * @param {Object} firstObject
 * @param {Object} secondObject
 * @returns {boolean} true if same
 * */
export const areTowObjectsEqual = (
  firstObject: object = {},
  secondObject: object = {},
): boolean => {
  const firstObjectKeys = isEmptyObject(firstObject) ? [] : Object.keys(firstObject);
  const secondObjectKeys = isEmptyObject(secondObject) ? [] : Object.keys(secondObject);

  if (firstObjectKeys.length !== secondObjectKeys.length) {
    return false;
  } else {
    let areEqual = true;

    firstObjectKeys.forEach(key => {
      if (firstObject[key] !== secondObject[key]) {
        areEqual = false;
      }
    });

    return areEqual;
  }
};

interface RelationList {
  moduleName: string;
  moduleTableName: string;
  childFieldName: string;
}

/**
 * finds relation keys based on `metaData` and removes keys from the `record`.
 * @function removeRelationFromRecord
 * @param {object} record
 * @param {object} metaData
 * @returns {object}
 */
export const removeRelationFromRecord = (
  record: object,
  metaData: object,
): { clearedRecord?: object; relationRecord?: object } => {
  if (!record || isEmptyObject(record)) {
    return {};
  }

  const relationList: RelationList[] = getRelationsInForm(metaData) || [];

  if (!relationList || !relationList.length) {
    return { clearedRecord: record };
  }

  const relationPathList: string[] = [];

  relationList.forEach(relation => {
    const relationResource = `${relation.moduleName}/${relation.moduleTableName}`;
    relationPathList.push(`${relationResource}/${relation.childFieldName}`);
  });

  const filterKeys = Object.keys(record).filter(key => !relationPathList.includes(key));

  relationPathList.push('id'); // this is parent id for `quickCreateData` in `relationPanel`

  return {
    clearedRecord: lodashPick(record, filterKeys),
    relationRecord: lodashPick(record, relationPathList),
  };
};

/**
 * this function will receive an array of unorganized objects and sort them by a key on these
 * objects in order "asc" or "desc".
 * @function customSort
 * @param {Array<object>} data unsorted data
 * @param {string} key
 * @param {string} order
 * @returns {Array<object>} sorted data
 */
export function customSort<T>(data: Array<T>, key: string, order = 'asc'): Array<T> {
  try {
    if (isEmpty(key)) {
      return data;
    }

    if (!data) {
      return [];
    }

    const sortedData: Array<T> = clone(data).sort((firstParam, secondParam) => {
      let keyValueInFirstParam = lodashGet(firstParam, key);
      let keyValueInSecondParam = lodashGet(secondParam, key);

      if (typeof keyValueInFirstParam === 'number' && typeof keyValueInSecondParam === 'number') {
        return keyValueInFirstParam - keyValueInSecondParam;
      }

      if (typeof keyValueInFirstParam === 'string' && typeof keyValueInSecondParam === 'string') {
        keyValueInFirstParam = keyValueInFirstParam.toLowerCase();
        keyValueInSecondParam = keyValueInSecondParam.toLowerCase();

        if (keyValueInFirstParam < keyValueInSecondParam) {
          return -1;
        }

        if (keyValueInFirstParam > keyValueInSecondParam) {
          return 1;
        }
      }

      return 0;
    });

    return order === 'asc' ? sortedData : sortedData.reverse();
  } catch {
    return [];
  }
}
