import {
  getInputWidth,
  getCodingPattern,
  getTypeByField,
  simpleMemoizeForValidation,
  prepareParamForValidation,
} from '../../helper/InputHelper';

describe('Get input width using an input called `Input` ', () => {
  test('Input width empty and returns 150', () => {
    const inputWidth = getInputWidth('');
    expect(inputWidth).toBe(150);
  });

  test('The object in the variable has a value and the width in the output is 250', () => {
    const inputWidth = getInputWidth({ width: 160, dropdown: true });
    expect(inputWidth).toBe(250);
  });
});

describe('Get coding pattern', () => {
  test('The codingPattern is empty and the output returns undefined', () => {
    const pattern = getCodingPattern('', 'The best things life is free');
    expect(pattern).toBe(undefined);
  });

  test('codingPattern has a value and returns length of current level', () => {
    const lengthSplitted = getCodingPattern('x#xx#xxxx', 2);
    expect(lengthSplitted).toBe(4);
  });

  test('codingPattern has a specific value and returns length of current level', () => {
    const lengthSplitted = getCodingPattern('x#order#xxxx', 2);
    expect(lengthSplitted).toBe(4);
  });

  test('codingPattern has a specific value and returns length of current level', () => {
    const lengthSplitted = getCodingPattern('order#x5**xxx', 1);
    expect(lengthSplitted).toBe(7);
  });

  test('codingPattern has a specific value and returns length of current level', () => {
    const lengthSplitted = getCodingPattern('1#25?', 1);
    expect(lengthSplitted).toBe(3);
  });
});

describe('Get type by field', () => {
  test('Get type by field `resource` and `resourceType` and finally returns the suitable string', () => {
    const field = {
      resource: 'test',
      resourceType: 'test2',
    };
    const type = getTypeByField(field);
    expect(type).toBe('RESOURCE_LINK_FIELD');
  });

  test('Get type with simple type `file` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: 'file',
        erp: '',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('FILE_FIELD');
  });

  test('Get type with erp type `coding` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'coding',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('CODING_FIELD');
  });

  test('Get type with simple type `url` and finally returns the suitable string', () => {
    const field = {
      relatedName: 'testLink',
      dataType: {
        simple: 'url',
        erp: '',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('URL_FIELD');
  });

  test('Get type with erp type `polygon` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'polygon',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('POLYGON_FIELD');
  });

  test('Get type with erp type `location` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'location',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('LOCATION_FIELD');
  });

  test('Get type with erp type `computed` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'computed',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('COMPUTED_FIELD');
  });

  test('Get type with erp type `dropdown` and finally returns the suitable string', () => {
    const field = {
      dropdown: true,
      dataType: {
        simple: '',
        erp: 'dropdown',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('DROPDOWN_FIELD');
  });

  test('Get type with erp type `stringSingleSelect` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'stringSingleSelect',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('STRING_SELECT_FIELD');
  });

  test('Get type with erp type `stringMultiSelect` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'stringMultiSelect',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('STRING_MULTI_SELECT_FIELD');
  });

  test('Get type with erp type `searchDialog` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'searchDialog',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('SEARCH_FIELD');
  });

  test('Get type with erp type `tag` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'tag',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('TAG_FIELD');
  });

  test('Get type with erp type `decimal` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'decimal',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('DECIMAL_FIELD');
  });

  test('Get type with erp type `currency` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: '',
        erp: 'currency',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('DECIMAL_FIELD');
  });

  test('Get type with simple type `boolean` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: 'boolean',
        erp: '',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('BOOLEAN_FIELD');
  });

  test('Get type with simple type `string` and finally returns the suitable string', () => {
    const field = {
      format: 'N8',
      numberOfLines: 2,
      dataType: {
        simple: 'string',
        erp: '',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('LONG_TEXT_FIELD');
  });

  test('Get type with simple type `number` and finally returns the suitable string', () => {
    const field = {
      format: 'N8',
      numberOfLines: 2,
      dataType: {
        simple: 'number',
        erp: '',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('NUMBER_FIELD');
  });

  test('Get type with simple type `datetime` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: 'datetime',
        erp: '',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('DATE_FIELD');
  });

  test('Get type with simple type `date` and finally returns the suitable string', () => {
    const field = {
      dataType: {
        simple: 'date',
        erp: '',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('DATE_FIELD');
  });

  test('Get type by field `numberOfLines` and finally returns the suitable string', () => {
    const field = { numberOfLines: 2 };
    const type = getTypeByField(field);
    expect(type).toBe('LONG_TEXT_FIELD');
  });

  test('There are no conditions and returns the default type ', () => {
    const field = {
      format: '',
      numberOfLines: 1,
      dataType: {
        simple: '',
        erp: '',
      },
    };
    const type = getTypeByField(field);
    expect(type).toBe('TEXT_FIELD');
  });
});

describe('Simple memoize for validation', () => {
  test('It takes a function from the input and validates whether it is a function or not', () => {
    const func = (val, form) => {
      return val + form;
    };
    const valid = simpleMemoizeForValidation(func('a', 'b'));
    expect(typeof valid).toBe('function');
  });
});

describe('prepare parameter for service validation', () => {
  test('run `prepareParamForValidation` with null', () => {
    const param = prepareParamForValidation(null, null);
    expect(param).toStrictEqual({});
  });

  test('run `prepareParamForValidation` with empty array', () => {
    const param = prepareParamForValidation([], null);
    expect(param).toStrictEqual({});
  });

  describe('check reterned object', () => {
    const parameter = [
      {
        field: {
          name: 'price',
          relatedName: 'price',
          relatedParameterName: 'itemdebtor',
          defaultValue: '0',
          id: 13146,
        },
      },
      {
        field: {
          defaultValue: null,
          id: 27833,
          name: 'itemdebtorrate',
          relatedName: 'itemdebtorrate',
          relatedParameterName: 'itemdebtorrate',
        },
      },
      {
        field: {
          defaultValue: null,
          id: 27832,
          name: 'rateprice',
          relatedName: 'rateprice',
          relatedParameterName: 'rateprice',
        },
      },
      {
        field: {
          defaultValue: '0',
          id: 0,
          name: 'itemcreditor',
          relatedName: 'itemcreditor',
          relatedParameterName: 'itemcreditor',
        },
      },
    ];

    test('run `prepareParamForValidation` with correct parameter', () => {
      const formData = {
        price: '0',
        itemdebtorrate: null,
        itemcreditor: 100,
        rateprice: 1,
      };

      const expectedParam = {
        itemcreditor: '0',
        itemdebtor: '0',
        itemdebtorrate: null,
        rateprice: 1,
      };
      const param = prepareParamForValidation(parameter, formData);
      expect(param).toStrictEqual(expectedParam);
    });

    test('run `prepareParamForValidation` with empty `formData`', () => {
      const expectedParam = {
        itemcreditor: '0',
        itemdebtor: null,
        itemdebtorrate: null,
        rateprice: null,
      };
      const param = prepareParamForValidation(parameter, {});
      expect(param).toStrictEqual(expectedParam);
    });
  });
});
