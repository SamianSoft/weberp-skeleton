import moxios from 'moxios';
import { httpClient } from '../../core/dataProvider';

import {
  findFieldByName,
  handleApiErrors,
  checkFieldValidation,
} from '../../helper/ValidationHelper';

const emptyObject = {};
const localeFa = 'fa';
const localeEn = 'en';

describe('find field by name if fieldList exist from fieldList else meta', () => {
  const expectedObject = {
    id: 48129,
    name: 'price',
  };

  const metaData = {
    fields: {
      48129: {
        id: 48129,
        name: 'price',
      },
    },
  };

  const dirtyFieldName = 'price';

  test('object exist in field list and meta', () => {
    const fieldList = [
      {
        id: 48129,
        name: 'price',
      },
    ];

    const response = findFieldByName(metaData, fieldList, dirtyFieldName);
    expect(response).toStrictEqual(expectedObject);
  });

  test('object not exist in field list but exist in meta', () => {
    const fieldList = [];

    const response = findFieldByName(metaData, fieldList, dirtyFieldName);
    expect(response).toStrictEqual(expectedObject);
  });

  test('object not exist in field list and meta', () => {
    const metaData = {};
    const fieldList = [];

    const response = findFieldByName(metaData, fieldList, dirtyFieldName);
    expect(response).toStrictEqual(null);
  });
});

describe('should handle API errors', () => {
  const notificationMessageSeprator = '^';
  const mockedRequestId = '12345678';
  const priceShouldEdit = 'مقدار فیلد مبلغ باید اصلاح شود';
  const invalidEntry = 'مقدار وارد شده نامعتبر میباشد';
  let notificationMessage = '';

  const meta = {
    fields: {
      48244: {
        id: 48244,
        name: 'fieldstring',
        maxLength: 5,
        maxValue: null,
        minValue: null,
        required: false,
        tabId: 0,
        tabTitle: 'formvalidation',
        translatedCaption: { fa: 'فیلد رشته ای', en: 'fieldString' },
      },
      48129: {
        id: 48129,
        name: 'price',
        maxLength: null,
        maxValue: 6000,
        minValue: 1000,
        required: false,
        tabId: 0,
        tabTitle: 'formvalidation',
        translatedCaption: { fa: 'مبلغ', en: 'price', ar: 'price' },
      },
      49389: {
        id: 49389,
        name: 'testnumber',
        maxLength: null,
        maxValue: 10,
        minValue: 5,
        required: false,
        translatedCaption: { fa: 'تست عددی', en: 'testnumber', ar: 'testnumber' },
      },
    },
  };

  const prepareFieldList = (isFull = false) => {
    return isFull
      ? [
          {
            id: 48244,
            name: 'fieldstring',
            maxLength: 5,
            maxValue: null,
            minValue: null,
            required: false,
            tabId: 0,
            tabTitle: 'formvalidation',
            translatedCaption: { fa: 'فیلد رشته ای', en: 'fieldString' },
          },
          {
            id: 48129,
            name: 'price',
            maxLength: null,
            maxValue: 6000,
            minValue: 1000,
            required: false,
            tabId: 0,
            tabTitle: 'formvalidation',
            translatedCaption: { fa: 'مبلغ', en: 'price', ar: 'price' },
          },
          'empty',
          {
            id: 49389,
            name: 'testnumber',
            maxLength: null,
            maxValue: 10,
            minValue: 5,
            required: false,
            tabId: 1,
            tabTitle: 'tab2',
            translatedCaption: { fa: 'تست عددی', en: 'testnumber', ar: 'testnumber' },
          },
        ]
      : [
          {
            id: 48244,
            name: 'fieldstring',
            maxLength: 5,
            maxValue: null,
            minValue: null,
            required: false,
            tabId: 0,
            tabTitle: 'formvalidation',
            translatedCaption: { fa: 'فیلد رشته ای', en: 'fieldString' },
          },
          {
            id: 48129,
            name: 'price',
            maxLength: null,
            maxValue: 6000,
            minValue: 1000,
            required: false,
            tabId: 0,
            tabTitle: 'formvalidation',
            translatedCaption: { fa: 'مبلغ', en: 'price', ar: 'price' },
          },
          'empty',
        ];
  };

  const prepareErrorPackage = (isFull = false) => {
    return isFull
      ? {
          apiErrors: {
            minValue: {
              price: 1000,
              testnumber: 5,
            },
          },
          requestId: mockedRequestId,
        }
      : {
          apiErrors: {
            minValue: {
              price: 1000,
            },
          },
          requestId: mockedRequestId,
        };
  };

  const prepareValidationErrors = (
    priceMessage,
    testNumber = null,
    testNumberhasTabInfo = false,
  ) => {
    return testNumber
      ? [
          { id: 48129, message: priceMessage, tabTitle: 'formvalidation', tabId: 0 },
          {
            id: 49389,
            message: testNumber,
            tabTitle: testNumberhasTabInfo ? 'tab2' : undefined,
            tabId: testNumberhasTabInfo ? 1 : undefined,
          },
        ]
      : [{ id: 48129, message: priceMessage, tabTitle: 'formvalidation', tabId: 0 }];
  };

  function notificationCallback(message, type) {
    notificationMessage = message;
  }

  const cleanResault = { preparedValidationErrors: [], preparedErrorMessage: null };

  const mockedTranslate = (key, params) => {
    let resault;
    switch (key) {
      case 'customValidation.validationErrorOnTab':
        resault = 'خطای اعتبارسنجی فیلد ها در پنجره %{tabName}';
        break;
      case 'customValidation.seprator':
        resault = 'و';
        break;
      case 'customValidation.valueOfField':
        resault = 'مقدار فیلد ';
        break;
      case 'customValidation.valueOfFields':
        resault = 'مقدار فیلد های ';
        break;
      case 'customValidation.notValid':
        resault = ' باید اصلاح شود';
        break;
      case 'customValidation.areNotValid':
        resault = ' باید اصلاح شوند';
        break;
      case 'customValidation.invalidValue':
        resault = invalidEntry;
        break;
      case 'ra.validation.minValue':
        resault = `حداقل باید ${params.min} باشد`;
        break;
      case 'ra.validation.required':
        resault = 'اجباری';
        break;
      case 'ra.validation.minLength':
        resault = `حداقل باید ${params.min} کارکتر باشد`;
        break;
      case 'ra.validation.maxLength':
        resault = `باید ${params.max} کارکتر یا کمتر باشد`;
        break;
      case 'ra.validation.maxValue':
        resault = `باید ${params.max} یا کمتر باشد`;
        break;
      case 'ra.validation.regex':
        resault = `باید با فرمت خاصی هماهنگ باشد (regexp): ${params.pattern}`;
        break;
      default:
        console.log('error in mockedTranslate');
        break;
    }
    return resault;
  };

  test('with empty errorPackage', () => {
    notificationMessage = '';

    const resault = handleApiErrors(
      meta,
      prepareFieldList(true),
      { apiErrors: emptyObject, requestId: '' },
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(cleanResault);
    expect(notificationMessage).toStrictEqual('');
  });

  test('with one error in errorPackage FA', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: priceShouldEdit,
      preparedValidationErrors: prepareValidationErrors('حداقل باید 1000 باشد'),
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(true),
      prepareErrorPackage(),
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      priceShouldEdit + notificationMessageSeprator + mockedRequestId,
    );
  });

  test('with tow error in errorPackage FA', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: 'مقدار فیلد های مبلغ و تست عددی باید اصلاح شوند',
      preparedValidationErrors: prepareValidationErrors(
        'حداقل باید 1000 باشد',
        'حداقل باید 5 باشد',
        true,
      ),
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(true),
      prepareErrorPackage(true),
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      'مقدار فیلد های مبلغ و تست عددی باید اصلاح شوند' +
        notificationMessageSeprator +
        mockedRequestId,
    );
  });

  test('when not exist in fieldList', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: 'مقدار فیلد های مبلغ و تست عددی باید اصلاح شوند',
      preparedValidationErrors: prepareValidationErrors(
        'حداقل باید 1000 باشد',
        'حداقل باید 5 باشد',
      ),
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      prepareErrorPackage(true),
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      'مقدار فیلد های مبلغ و تست عددی باید اصلاح شوند' +
        notificationMessageSeprator +
        mockedRequestId,
    );
  });

  test('when not exist in fieldList', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: 'مقدار فیلد های مبلغ و تست عددی باید اصلاح شوند',
      preparedValidationErrors: prepareValidationErrors(
        'حداقل باید 1000 باشد',
        'حداقل باید 5 باشد',
      ),
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      prepareErrorPackage(true),
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      'مقدار فیلد های مبلغ و تست عددی باید اصلاح شوند' +
        notificationMessageSeprator +
        mockedRequestId,
    );
  });

  test('with one error in errorPackage EN', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: 'مقدار فیلد price باید اصلاح شود',
      preparedValidationErrors: prepareValidationErrors('حداقل باید 1000 باشد'),
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(true),
      prepareErrorPackage(),
      notificationCallback,
      mockedTranslate,
      localeEn,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      'مقدار فیلد price باید اصلاح شود' + notificationMessageSeprator + mockedRequestId,
    );
  });

  test('with tow error in errorPackage EN', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: 'مقدار فیلد های price و testnumber باید اصلاح شوند',
      preparedValidationErrors: prepareValidationErrors(
        'حداقل باید 1000 باشد',
        'حداقل باید 5 باشد',
      ),
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      prepareErrorPackage(true),
      notificationCallback,
      mockedTranslate,
      localeEn,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      'مقدار فیلد های price و testnumber باید اصلاح شوند' +
        notificationMessageSeprator +
        mockedRequestId,
    );
  });

  test('has maxLength in error', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: priceShouldEdit,
      preparedValidationErrors: prepareValidationErrors('باید 15 کارکتر یا کمتر باشد'),
    };

    const customErrorPackage = {
      apiErrors: {
        maxLength: {
          price: 15,
        },
      },
      requestId: mockedRequestId,
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      customErrorPackage,
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      priceShouldEdit + notificationMessageSeprator + mockedRequestId,
    );
  });

  test('has maxValue in error', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: priceShouldEdit,
      preparedValidationErrors: prepareValidationErrors('باید 15 یا کمتر باشد'),
    };

    const customErrorPackage = {
      apiErrors: {
        maxValue: {
          price: 15,
        },
      },
      requestId: mockedRequestId,
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      customErrorPackage,
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      priceShouldEdit + notificationMessageSeprator + mockedRequestId,
    );
  });

  test('has regex in error', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: priceShouldEdit,
      preparedValidationErrors: prepareValidationErrors(invalidEntry),
    };

    const customErrorPackage = {
      apiErrors: {
        regex: {
          price: '/[0-9]',
        },
      },
      requestId: mockedRequestId,
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      customErrorPackage,
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      priceShouldEdit + notificationMessageSeprator + mockedRequestId,
    );
  });

  test('has wrongvalue in error', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: priceShouldEdit,
      preparedValidationErrors: prepareValidationErrors(invalidEntry),
    };

    const customErrorPackage = {
      apiErrors: {
        regex: {
          price: 'bla bla bla',
        },
      },
      requestId: mockedRequestId,
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      customErrorPackage,
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      priceShouldEdit + notificationMessageSeprator + mockedRequestId,
    );
  });

  test('has required in error', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: priceShouldEdit,
      preparedValidationErrors: prepareValidationErrors('اجباری'),
    };

    const customErrorPackage = {
      apiErrors: {
        required: ['price'],
      },
      requestId: mockedRequestId,
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      customErrorPackage,
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      priceShouldEdit + notificationMessageSeprator + mockedRequestId,
    );
  });

  test('has stage in error', () => {
    notificationMessage = '';

    const expectedResault = {
      preparedErrorMessage: priceShouldEdit,
      preparedValidationErrors: prepareValidationErrors(invalidEntry),
    };

    const customErrorPackage = {
      apiErrors: {
        stage: ['price'],
      },
      requestId: mockedRequestId,
    };

    const resault = handleApiErrors(
      meta,
      prepareFieldList(),
      customErrorPackage,
      notificationCallback,
      mockedTranslate,
      localeFa,
    );

    expect(resault).toStrictEqual(expectedResault);
    expect(notificationMessage).toStrictEqual(
      priceShouldEdit + notificationMessageSeprator + mockedRequestId,
    );
  });
});

describe('test of checkFieldValidation function', () => {
  const resource = 'webtest/order';
  const relationResource = 'webtest/order';

  const prepareFormData = (customParameterName = null, customParameterValue = null) => {
    const formData = {
      fieldstring: 'test',
      price: 123,
      active: true,
      nullValue: null,
      validationservice: 50,
    };
    if (customParameterName && customParameterValue) {
      formData[customParameterName] = customParameterValue;
    }
    return formData;
  };

  const fieldList = [
    {
      id: 48244,
      name: 'fieldstring',
      maxLength: 10,
      maxValue: null,
      minValue: null,
      required: true,
      tabId: 0,
      tabTitle: 'formvalidation',
      translatedCaption: { fa: 'فیلد رشته ای', en: 'fieldString' },
    },
    {
      id: 48129,
      name: 'price',
      maxLength: null,
      maxValue: 6000,
      minValue: 1000,
      required: true,
      tabId: 0,
      tabTitle: 'formvalidation',
      translatedCaption: { fa: 'مبلغ', en: 'price', ar: 'price' },
      dataType: { erp: 'number', sql: 'varchar(max)', simple: 'number' },
    },
    {
      id: 48127,
      name: 'active',
      maxLength: null,
      maxValue: null,
      minValue: null,
      required: true,
      tabId: 0,
      tabTitle: 'formvalidation',
      translatedCaption: { fa: 'فعال', en: 'active', ar: 'active' },
    },
    {
      id: 49393,
      name: 'validationservice',
      maxLength: null,
      maxValue: null,
      minValue: null,
      required: false,
      tabId: 0,
      tabTitle: 'formvalidation',
      translatedCaption: {
        fa: 'سرویس ولیدیشن',
        en: 'validationService',
        ar: 'validationService',
      },
    },
  ];

  const metaFields = {};
  fieldList.forEach(field => {
    metaFields[field.id] = field;
  });

  const meta = {
    fields: metaFields,
    validationActions: {
      49393: [
        {
          alarmMessage: '',
          description: 'سرويس وليديشن',
          hasPermission: false,
          id: 2991052,
          manualExecute: false,
          parameters: [
            {
              field: {
                id: 49393,
                name: 'validationservice',
                maxLength: null,
                maxValue: null,
                minValue: null,
                required: false,
                tabId: 0,
                tabTitle: 'formvalidation',
                translatedCaption: {
                  fa: 'سرویس ولیدیشن',
                  en: 'validationService',
                  ar: 'validationService',
                },
              },
            },
          ],
          priority: 0,
          related: 'SingleRecord',
          runOnNonEditableRecords: false,
          title: 'serviceValidation',
          translatedTitle: {
            fa: 'سرویس ولیدیشن',
            en: 'serviceValidation',
            ar: 'serviceValidation',
          },
          uniqueId: '59589e0c-47e2-4b83-bf4c-fe05035ebaae',
        },
      ],
    },
  };

  const handleErrors = (dirtyFields, speceficFieldId) => {
    return {
      dirtyFields: dirtyFields,
      speceficFieldId: speceficFieldId,
    };
  };

  const changeFormValue = () => {
    // some code (dosent matter)
  };

  test('single field string require without value', () => {
    const expectedResault = {
      dirtyFields: [
        {
          id: 48244,
          type: 'required',
          validValue: null,
          tabTitle: 'formvalidation',
          tabId: 0,
        },
      ],
      speceficFieldId: 48244,
    };

    return checkFieldValidation(
      emptyObject,
      fieldList.filter(field => field.id === 48244),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  test('single field string maxLength', () => {
    const expectedResault = {
      dirtyFields: [
        {
          id: 48244,
          type: 'maxLength',
          validValue: 10,
          tabTitle: 'formvalidation',
          tabId: 0,
        },
      ],
      speceficFieldId: 48244,
    };

    return checkFieldValidation(
      prepareFormData('fieldstring', 'this a long text'),
      fieldList.filter(field => field.id === 48244),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  test('single field string require with value', () => {
    const expectedResault = { dirtyFields: [], speceficFieldId: 48244 };

    return checkFieldValidation(
      prepareFormData(),
      fieldList.filter(field => field.id === 48244),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  test('single field number require without value', () => {
    const expectedResault = {
      dirtyFields: [
        {
          id: 48129,
          type: 'required',
          validValue: null,
          tabTitle: 'formvalidation',
          tabId: 0,
        },
      ],
      speceficFieldId: 48129,
    };

    return checkFieldValidation(
      emptyObject,
      fieldList.filter(field => field.id === 48129),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  test('single field number require without value with English locale', () => {
    const expectedResault = {
      dirtyFields: [
        {
          id: 48129,
          type: 'required',
          validValue: null,
          tabTitle: 'formvalidation',
          tabId: 0,
        },
      ],
      speceficFieldId: 48129,
    };

    return checkFieldValidation(
      emptyObject,
      fieldList.filter(field => field.id === 48129),
      handleErrors,
      true,
      localeEn,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  test('single field number require with value', () => {
    const expectedResault = {
      dirtyFields: [],
      speceficFieldId: 48129,
    };

    return checkFieldValidation(
      prepareFormData('price', 1001),
      fieldList.filter(field => field.id === 48129),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  test('single field number minValue', () => {
    const expectedResault = {
      dirtyFields: [
        { id: 48129, tabId: 0, tabTitle: 'formvalidation', type: 'minValue', validValue: 1000 },
      ],
      speceficFieldId: 48129,
    };

    return checkFieldValidation(
      prepareFormData('price', 200),
      fieldList.filter(field => field.id === 48129),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });
  test('single field number maxValue', () => {
    const expectedResault = {
      dirtyFields: [
        { id: 48129, tabId: 0, tabTitle: 'formvalidation', type: 'maxValue', validValue: 6000 },
      ],
      speceficFieldId: 48129,
    };

    return checkFieldValidation(
      prepareFormData('price', 6001),
      fieldList.filter(field => field.id === 48129),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  test('single field boolean require without value', () => {
    const expectedResault = {
      dirtyFields: [
        {
          id: 48127,
          type: 'required',
          validValue: null,
          tabTitle: 'formvalidation',
          tabId: 0,
        },
      ],
      speceficFieldId: 48127,
    };

    return checkFieldValidation(
      emptyObject,
      fieldList.filter(field => field.id === 48127),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  test('single field boolean require with value', () => {
    const expectedResault = {
      dirtyFields: [],
      speceficFieldId: 48127,
    };

    return checkFieldValidation(
      prepareFormData(),
      fieldList.filter(field => field.id === 48127),
      handleErrors,
      true,
      localeFa,
      meta,
      resource,
      relationResource,
      changeFormValue,
    ).then(result => {
      expect(result).toStrictEqual(expectedResault);
    });
  });

  describe('Mock validation', () => {
    beforeEach(() => {
      moxios.install(httpClient);
    });
    afterEach(() => {
      moxios.uninstall(httpClient);
    });

    test('single field with service validation', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            additionalData: null,
            code: 6015,
            data: {},
            developerMessage: '50 is not valid',
            messageSound: null,
            messageType: 'error',
            metaVersion: 'v2_bmvd0_1612253874_b',
            requestId: '0HM65T0B7V092:00000004',
            status: false,
            totalCount: 0,
            userMessage: '50 is not valid',
          },
        });
      });

      const expectedResault = {
        dirtyFields: [
          {
            id: 49393,
            tabId: 0,
            tabTitle: undefined,
            type: 'async',
            validValue: '50 is not valid',
          },
        ],
        speceficFieldId: 49393,
      };

      return checkFieldValidation(
        prepareFormData(),
        fieldList.filter(field => field.id === 49393),
        handleErrors,
        true,
        localeFa,
        meta,
        resource,
        relationResource,
        changeFormValue,
      ).then(result => {
        expect(result).toStrictEqual(expectedResault);
      });
    });

    test('multiple validation errors ', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            additionalData: null,
            code: 6015,
            data: {},
            developerMessage: '50 is not valid',
            messageSound: null,
            messageType: 'error',
            metaVersion: 'v2_bmvd0_1612253874_b',
            requestId: '0HM65T0B7V092:00000004',
            status: false,
            totalCount: 0,
            userMessage: '50 is not valid',
          },
        });
      });

      const expectedResault = {
        dirtyFields: [
          { id: 48244, tabId: 0, tabTitle: 'formvalidation', type: 'maxLength', validValue: 10 },
          { id: 48129, tabId: 0, tabTitle: 'formvalidation', type: 'minValue', validValue: 1000 },
          {
            id: 49393,
            tabId: 0,
            tabTitle: undefined,
            type: 'async',
            validValue: '50 is not valid',
          },
        ],
        speceficFieldId: undefined,
      };

      return checkFieldValidation(
        prepareFormData('fieldstring', 'this a long text'),
        fieldList,
        handleErrors,
        false,
        localeFa,
        meta,
        resource,
        relationResource,
        changeFormValue,
      ).then(result => {
        expect(result).toStrictEqual(expectedResault);
      });
    });
  });
});
