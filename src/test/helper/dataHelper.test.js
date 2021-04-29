import {
  clone,
  mergeAndClone,
  isJsonEncodedString,
  getFirstItemFromObject,
  isEmpty,
  isEmptyObject,
  arrayResultToObjectWithLowerCase,
  objectToLowerCaseProperties,
  removeRelationFromRecord,
  customSort,
} from '../../helper/DataHelper';

describe('Clone data', () => {
  test('Convert data to `stringify` and convert again to `parse`', () => {
    const parseObject = clone({ name: 'ali', pass: 245 });
    expect(parseObject).toStrictEqual({ name: 'ali', pass: 245 });
  });
});

describe('Merge and clone', () => {
  test('Merge and clone for two object', () => {
    const defaultData = { name: 'Jack', age: 56, job: 'programmer' };
    const overrideData = { car: 'Ford', color: 'Black' };
    const resultData = {
      name: 'Jack',
      age: 56,
      job: 'programmer',
      car: 'Ford',
      color: 'Black',
    };

    const data = mergeAndClone(defaultData, overrideData);
    expect(data).toStrictEqual(resultData);
  });
});

describe('Is Json encoded string', () => {
  test('It is not a string value and cannot be a Json string with type of `object`, and the output is `False`', () => {
    const value = isJsonEncodedString('{"name":"john", age:30, "city":"New York"}');
    expect(value).toBe(false);
  });

  test('It is not a string value and cannot be a Json string with type of `object`, and the output is `False`', () => {
    const value = isJsonEncodedString({ name: 'john', age: 30 });
    expect(value).toBe(false);
  });

  test('It is not a string value and cannot be a Json string with type of `Number`, and the output is `False`', () => {
    const value = isJsonEncodedString(646846846);
    expect(value).toBe(false);
  });

  test('The value is parsed and its type is an object and it is not null and the result will be True', () => {
    const value = isJsonEncodedString('{"name":"john", "age":"30", "city":"New York"}');
    expect(value).toBe(true);
  });

  test('Parsed value is null and type of parsed is not `Object` and the result is false', () => {
    const value = isJsonEncodedString(null);
    expect(value).toBe(false);
  });
});

describe('Get first item from object', () => {
  test('Object is null and the output becomes null', () => {
    const object = getFirstItemFromObject(null);
    expect(object).toBe(null);
  });

  test('Receives an object and returns its first item', () => {
    const object = getFirstItemFromObject({ a: 'sometimes', b: 42, c: false });
    expect(object).toBe('sometimes');
  });

  test('If the first item is null, it returns null', () => {
    const obj = getFirstItemFromObject({ a: null, b: 42, c: false });
    expect(obj).toBe(null);
  });
});

describe('Check that the value is empty', () => {
  test('If the value is `undefined` then the value is empty and will be `True`', () => {
    const value = isEmpty(undefined);
    expect(value).toBe(true);
  });

  test('If the value is `null` then the value is empty and will be `True`', () => {
    const value = isEmpty(null);
    expect(value).toBe(true);
  });

  test('If the value is `""` then the value is empty and will be `True`', () => {
    const value = isEmpty('');
    expect(value).toBe(true);
  });

  test('If value is an `object` then value is not empty and will be `False`', () => {
    const value = isEmpty({ A: 'merry', B: 'sandra' });
    expect(value).toBe(false);
  });

  test('If value is an `number` then value is not empty and will be `False`', () => {
    const value = isEmpty(68498);
    expect(value).toBe(false);
  });
});

describe('Check an object for empty', () => {
  test('If input is `undefined`, output becomes True', () => {
    const value = isEmptyObject(undefined);
    expect(value).toBe(true);
  });

  test('If input is `Number`, output becomes True', () => {
    const value = isEmptyObject(1234);
    expect(value).toBe(true);
  });

  test('If input is `String`, output becomes True', () => {
    const value = isEmptyObject('aliye');
    expect(value).toBe(true);
  });

  test('If input is `Null`, output becomes True', () => {
    const value = isEmptyObject(null);
    expect(value).toBe(true);
  });

  test('Value is object but length of object.key equal `0` and output becomes True', () => {
    const value = isEmptyObject({});
    expect(value).toBe(true);
  });

  test('Be the value of the object, output becomes False', () => {
    const value = isEmptyObject({ name: 'iman', salary: 20 });
    expect(value).toBe(false);
  });
});

describe('Array result to object with lower case', () => {
  test('If the array is `Null`, we will have an empty array at the output', () => {
    const result = arrayResultToObjectWithLowerCase(null);
    expect(result).toStrictEqual([]);
  });

  test('If the array is `empty []` and the array length is zero, we will have an empty array at the output', () => {
    const result = arrayResultToObjectWithLowerCase([]);
    expect(result).toStrictEqual([]);
  });

  test('Receives an array and displays its keys in lower case next to the previous values', () => {
    const result = arrayResultToObjectWithLowerCase([{ A: 'john', B: 42, C: true }]);
    expect(result).toStrictEqual([{ A: 'john', B: 42, C: true, a: 'john', b: 42, c: true, id: 1 }]);
  });

  test('Receives two arrays and displays its keys in lower case next to the previous values', () => {
    const input = [
      { A: 'john', B: 42, C: true },
      { A: 'mick', B: 25, C: false },
    ];
    const output = [
      { A: 'john', B: 42, C: true, a: 'john', b: 42, c: true, id: 2 },
      { A: 'mick', B: 25, C: false, a: 'mick', b: 25, c: false, id: 3 },
    ];
    const result = arrayResultToObjectWithLowerCase(input);
    expect(result).toStrictEqual(output);
  });

  test('use page meta to increament id', () => {
    const pageMeta = {
      perPage: 50,
      page: 7,
    };
    const input = [
      { A: 'john', B: 42, C: true },
      { A: 'mick', B: 25, C: false },
    ];
    const output = [
      { A: 'john', B: 42, C: true, a: 'john', b: 42, c: true, id: 301 },
      { A: 'mick', B: 25, C: false, a: 'mick', b: 25, c: false, id: 302 },
    ];
    const result = arrayResultToObjectWithLowerCase(input, pageMeta);
    expect(result).toStrictEqual(output);
  });

  test('when there is no page/perpage, it uses the old way to increament id', () => {
    const pageMeta = {};
    const input = [
      { A: 'john', B: 42, C: true },
      { A: 'mick', B: 25, C: false },
    ];
    const output = [
      { A: 'john', B: 42, C: true, a: 'john', b: 42, c: true, id: 4 },
      { A: 'mick', B: 25, C: false, a: 'mick', b: 25, c: false, id: 5 },
    ];
    const result = arrayResultToObjectWithLowerCase(input, pageMeta);
    expect(result).toStrictEqual(output);
  });
});

describe('Convert object keys to lowerCase and the row becomes the clone and also their inputs are `row`, `index`, `array`, `id`', () => {
  test('if the row is set to `null`, the row value becomes a empty object and Clone returns an ID', () => {
    const rowObject = objectToLowerCaseProperties(null);
    expect(rowObject).toStrictEqual({ id: 6 });
  });

  test('If the row is set to `undefined`, the row value becomes a empty object and Clone returns an ID', () => {
    const rowObject = objectToLowerCaseProperties(undefined);
    expect(rowObject).toStrictEqual({ id: 7 });
  });

  test('All input values are available and show the cloned value in the output', () => {
    const row = {
      accounts_id: 963,
      barcodemain_id: null,
      contract_id: 961,
      contractbegin: null,
    };
    const index = 0;
    const id = undefined;
    const array = [
      {
        accounts_id: 963,
        barcodemain_id: null,
        contract_id: 961,
        contractbegin: null,
      },
    ];
    const resultClone = {
      accounts_id: 963,
      barcodemain_id: null,
      contract_id: 961,
      contractbegin: null,
      id: 8,
    };

    const data = objectToLowerCaseProperties(row, index, array, id);
    expect(data).toStrictEqual(resultClone);
  });
});

describe('Remove relation from record', () => {
  test('Run `removeRelationFromRecord` with empty `record`', () => {
    const newRecord = removeRelationFromRecord({}, {});
    expect(newRecord).toStrictEqual({});
  });

  test('Run `removeRelationFromRecord` with undefined `record`', () => {
    const newRecord = removeRelationFromRecord(undefined, {});
    expect(newRecord).toStrictEqual({});
  });

  test('Run `removeRelationFromRecord` with string `record`', () => {
    const newRecord = removeRelationFromRecord('test', {});
    expect(newRecord).toStrictEqual({});
  });

  describe('check `removeRelationFromRecord` with `metaData` change', () => {
    const record = {
      name: 'test',
      id: 1234,
      test: 'test',
      'webtest/order/orderdetail_id': {},
    };

    test('Run `removeRelationFromRecord` with empty `metaData`', () => {
      const expectedRecord = {
        clearedRecord: { id: 1234, name: 'test', test: 'test', 'webtest/order/orderdetail_id': {} },
      };
      const newRecord = removeRelationFromRecord(record, {});
      expect(newRecord).toStrictEqual(expectedRecord);
    });

    test('Run `removeRelationFromRecord` with undefined `metaData`', () => {
      const expectedRecord = {
        clearedRecord: { id: 1234, name: 'test', test: 'test', 'webtest/order/orderdetail_id': {} },
      };
      const newRecord = removeRelationFromRecord(record, undefined);
      expect(newRecord).toStrictEqual(expectedRecord);
    });

    test('Run `removeRelationFromRecord` with string `metaData`', () => {
      const expectedRecord = {
        clearedRecord: { id: 1234, name: 'test', test: 'test', 'webtest/order/orderdetail_id': {} },
      };
      const newRecord = removeRelationFromRecord(record, 'test');
      expect(newRecord).toStrictEqual(expectedRecord);
    });
  });

  const meta = {
    relations: [
      {
        childFieldName: 'personinfoid',
        moduleName: 'webtest',
        moduleTableName: 'order',
        showWithMainTable: true,
      },
      {
        childFieldName: 'testId',
        moduleName: 'webtest',
        moduleTableName: 'test',
        showWithMainTable: false,
      },
      {
        childFieldName: 'personinfo_id',
        moduleName: 'person',
        moduleTableName: 'userproductlimit',
        showWithMainTable: false,
      },
    ],
  };

  test('remove relation data from `record` with `metaData`', () => {
    const record = {
      name: 'test',
      id: 1234,
      test: 'test',
      'webtest/order/personinfoid': {},
    };

    const expectedRecord = {
      clearedRecord: { id: 1234, name: 'test', test: 'test' },
      relationRecord: {
        'webtest/order/personinfoid': {},
        id: 1234,
      },
    };
    const newRecord = removeRelationFromRecord(record, meta);
    expect(newRecord).toStrictEqual(expectedRecord);
  });

  test('check remove relation data from `record` with `metaData` ', () => {
    const record = {
      name: 'test',
      id: 1234,
      test: 'test',
      'webtest/order/personinfoid': {},
      'webtest/test/testId': {},
    };

    const expectedRecord = {
      clearedRecord: { id: 1234, name: 'test', test: 'test' },
      relationRecord: {
        'webtest/order/personinfoid': {},
        'webtest/test/testId': {},
        id: 1234,
      },
    };
    const newRecord = removeRelationFromRecord(record, meta);
    expect(newRecord).toStrictEqual(expectedRecord);
  });
});

describe('custom sort ', () => {
  const simpleArrayExample = [{ test: 'test1' }, { test: 'test2' }];
  const unsortedCrowdData = [
    { test: 'test1' },
    { test: 'test6' },
    { test: 'test3' },
    { test: 'test8' },
  ];
  const unsortedNumericData = [{ test: 5 }, { test: 1 }, { test: 99 }, { test: 6 }];

  test('with null data', () => {
    const sortedData = customSort(null, 'test', 'desc');
    expect(sortedData).toStrictEqual([]);
  });

  test('with null key', () => {
    const sortedData = customSort(simpleArrayExample, null, 'asc');
    expect(sortedData).toStrictEqual(simpleArrayExample);
  });

  test('with diffrent format of values in sorted field', () => {
    const unsortedData = [{ test: 'test1' }, { test: 5 }];

    const sortedData = customSort(unsortedData, 'test');
    expect(sortedData).toStrictEqual(unsortedData);
  });

  test('with diffrent format of reverse values in sorted field', () => {
    const unsortedData = [{ test: 5 }, { test: 'test1' }];

    const sortedData = customSort(unsortedData, 'test');
    expect(sortedData).toStrictEqual(unsortedData);
  });

  test('with empty data', () => {
    const unsortedData = [];
    const expectedData = [];

    const sortedData = customSort(unsortedData, 'test');
    expect(sortedData).toStrictEqual(expectedData);
  });

  test('with one parameter', () => {
    const unsortedData = [{ test: 'test1' }];

    const sortedData = customSort(unsortedData, 'test');
    expect(sortedData).toStrictEqual(unsortedData);
  });

  test('with some parameters', () => {
    const expectedData = [
      { test: 'test1' },
      { test: 'test3' },
      { test: 'test6' },
      { test: 'test8' },
    ];

    const sortedData = customSort(unsortedCrowdData, 'test');
    expect(sortedData).toStrictEqual(expectedData);
  });

  test('when desc order', () => {
    const expectedData = [
      { test: 'test8' },
      { test: 'test6' },
      { test: 'test3' },
      { test: 'test1' },
    ];

    const sortedData = customSort(unsortedCrowdData, 'test', 'desc');
    expect(sortedData).toStrictEqual(expectedData);
  });

  test('with some numeric parameters', () => {
    const expectedData = [{ test: 1 }, { test: 5 }, { test: 6 }, { test: 99 }];
    const sortedData = customSort(unsortedNumericData, 'test');

    expect(sortedData).toStrictEqual(expectedData);
  });

  test('when desc order with numeric values', () => {
    const expectedData = [{ test: 99 }, { test: 6 }, { test: 5 }, { test: 1 }];
    const sortedData = customSort(unsortedNumericData, 'test', 'desc');

    expect(sortedData).toStrictEqual(expectedData);
  });

  test('when sort is undefined', () => {
    const sortedData = customSort(unsortedCrowdData, undefined);
    expect(sortedData).toStrictEqual(unsortedCrowdData);
  });

  test('when objects have not sort parameter', () => {
    const sortedData = customSort(unsortedCrowdData, 'notExistKey');
    expect(sortedData).toStrictEqual(unsortedCrowdData);
  });
});
