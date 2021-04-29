import {
  getFormDefaultValue,
  getTreeParentFieldName,
  getGridColumns,
  getFields,
  getFilterColumns,
  getFieldsById,
  getTitleFieldNames,
  getPermanentFilterFieldNames,
  getTranslatedName,
  getShowSummaryColumnList,
  prepareGroups,
  getGroupFieldsFromFieldsList,
  getAllFieldList,
  getRelationList,
  removeHiddenRelations,
  findHiddenRelations,
  filteredRelations,
  getSingleRecordReportRelationList,
  getReportInfo,
  isModuleTable,
  hasNote,
  hasReportEditable,
  getNoteInfo,
  getGroups,
  getTabs,
  getColumnCount,
  getRelationsInForm,
  getFileInfo,
  getProcessList,
  getProcessLines,
  getProcessTaskInfo,
  getProcessInfo,
  getServices,
  getServerValidationFieldList,
  getAsyncValidationInfoForField,
  getTabList,
  mergeTabDataWithSetting,
  getPrimaryField,
  isRecordEditable,
  getReportChildren,
  isReportExecutable,
  getGroupingColumns,
  getDefaultSort,
  isSingleRecordTable,
  getIsRowReOrderEnabled,
  getFieldByName,
  getDefaultReportSort,
  prepareReportFilter,
  getRelationPermissionFromProcessTask,
  isRelationCreateEnabled,
  isRelationEditEnabled,
  isRelationDeleteEnabled,
  getRelationDisabledFields,
  getDropDownListFromState,
  fieldFileList,
  prepareShiftProcess,
  isTreeHasDelete,
  getMaxMinOfRow,
  createEmptyLayout,
  createLayout,
  checkPermission,
  preparedRelationPermission,
  getParameterName,
} from '../../helper/MetaHelper';
import moment from 'moment';

describe('Get form default value', () => {
  const globalParams = {
    currentDate: 'convert(varchar(max),GetDate(),120)',
  };

  test('List is `empty object` and returns `null`', () => {
    const list = getFormDefaultValue({}, null);
    expect(list).toStrictEqual(null);
  });

  test('List is `null` and returns `null`', () => {
    const list = getFormDefaultValue(null, null);
    expect(list).toStrictEqual(null);
  });

  test('List is `undefined` and returns `null`', () => {
    const list = getFormDefaultValue(undefined, null);
    expect(list).toStrictEqual(null);
  });

  test('`field.name` is equal `stateid` in input and return an empty object ', () => {
    const customList = [{ name: 'stateid' }];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({});
  });

  test('`field.name` is equal `positionid` in input and return an empty object', () => {
    const customList = [{ name: 'positionid' }];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({});
  });

  test('`erpType` is equal `computed` in input and return `null`', () => {
    const customList = [
      {
        dataType: {
          erp: 'computed',
        },
        name: 'updatedate',
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: null });
  });

  test('`erpType` is equal `searchDialog` in input and returns `null`', () => {
    const customList = [
      {
        dataType: {
          erp: 'searchDialog',
        },
        name: 'updatedate',
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: null });
  });

  test('`erpType` is equal `tag` in input and returns `null`', () => {
    const customList = [
      {
        dataType: {
          erp: 'tag',
        },
        name: 'updatedate',
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: null });
  });

  test('`erpType` is equal `dropdown` in input and returns an object', () => {
    const customList = [
      {
        dataType: {
          erp: 'dropdown',
        },
        name: 'updatedate',
        dropdown: {
          id: 4172,
          displayMember: 'customertitle',
        },
        defaultValueGlobalParameter: 'currentDate',
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: 'convert(varchar(max),GetDate(),120)' });
  });

  test('`erpType` is equal `dropdown` and type of globalParams is `undefined` in inputs and finally returns `null` ', () => {
    const customList = [
      {
        dataType: {
          erp: 'dropdown',
        },
        name: 'updatedate',
        dropdown: {
          id: 4172,
          displayMember: 'customertitle',
        },
        defaultValueGlobalParameter: null,
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: null });
  });

  test('`simpleType` is equal `datetime` and required is `true` in input and returns today`s day', () => {
    const customList = [
      {
        dataType: {
          simple: 'datetime',
        },
        name: 'updatedate',
        dropdown: {
          id: 4172,
          displayMember: 'customertitle',
        },
        defaultValueGlobalParameter: 'currentDate',
        required: true,
      },
    ];
    const format = 'YYYY-MM-DD';
    const today = moment()
      .locale('en')
      .format(format);

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: today });
  });

  test('`simpleType` is equal `datetime` and required is `false` in input and finally returns `null` at output', () => {
    const customList = [
      {
        dataType: {
          simple: 'datetime',
        },
        name: 'updatedate',
        dropdown: {
          id: 4172,
          displayMember: 'customertitle',
        },
        defaultValueGlobalParameter: 'currentDate',
        required: false,
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: null });
  });

  test('`simpleType` is equal `date` and required is `true` in input and finally returns today`s ', () => {
    const customList = [
      {
        dataType: {
          simple: 'date',
        },
        name: 'updatedate',
        dropdown: {
          id: 4172,
          displayMember: 'customertitle',
        },
        defaultValueGlobalParameter: 'currentDate',
        required: true,
      },
    ];
    const format = 'YYYY-MM-DD';
    const today = moment()
      .locale('en')
      .format(format);

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: today });
  });

  test('`simpleType` is equal `date` and required is `false` in input and finally returns `null`', () => {
    const customList = [
      {
        dataType: {
          simple: 'date',
        },
        name: 'updatedate',
        dropdown: {
          id: 4172,
          displayMember: 'customertitle',
        },
        defaultValueGlobalParameter: 'currentDate',
        required: false,
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: null });
  });

  test('`simpleType` is equal `date` and required is `null` in input and returns `null`', () => {
    const customList = [
      {
        dataType: {
          simple: 'date',
        },
        name: 'updatedate',
        dropdown: {
          id: 4172,
          displayMember: 'customertitle',
        },
        defaultValueGlobalParameter: 'currentDate',
        required: null,
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: null });
  });

  test('`simpleType` is equal `boolean` and defaultValue is `true` in input and returns an object', () => {
    const customList = [
      {
        dataType: {
          simple: 'boolean',
        },
        name: 'updatedate',
        dropdown: {
          id: 4172,
          displayMember: 'customertitle',
        },
        defaultValueGlobalParameter: 'currentDate',
        required: false,
        defaultValue: true,
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ updatedate: true });
  });

  test('Default value with erpType: `test` and simpleType: `test2` in input and finally returns an object', () => {
    const customList = [
      {
        dataType: {
          erp: 'test',
          simple: 'test2',
        },
        name: 'unic',
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ unic: null });
  });

  test('Default value with erpType: `4654` and simpleType: `4652` and returns an object', () => {
    const customList = [
      {
        dataType: {
          erp: 4654,
          simple: 4652,
        },
        name: 'unic',
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ unic: null });
  });

  test('Default value with erpType: `an object` and simpleType: `an object` and returns an object ', () => {
    const customList = [
      {
        dataType: {
          erp: [1, 2, 3],
          simple: { A: 1, B: 2, C: 3 },
        },
        name: 'unic',
      },
    ];

    const list = getFormDefaultValue(customList, globalParams);
    expect(list).toStrictEqual({ unic: null });
  });
});

describe('Get tree parent fieldName', () => {
  test('List is `empty object` and returns `null`', () => {
    const list = getTreeParentFieldName({});
    expect(list).toStrictEqual(null);
  });

  test('List is `null` and returns `null`', () => {
    const list = getTreeParentFieldName(null);
    expect(list).toStrictEqual(null);
  });

  test('List is `undefined` and returns `null`', () => {
    const list = getTreeParentFieldName(undefined);
    expect(list).toStrictEqual(null);
  });

  test('`treeParentField` has a value in input and returns a `string`', () => {
    const customList = {
      config: { treeParentField: 48377 },
      fields: { 48377: { name: 'parentcodingtesttable_id' } },
      treeLevel: 3,
    };

    const list = getTreeParentFieldName(customList);
    expect(list).toStrictEqual('parentcodingtesttable_id');
  });

  test('None of the modes are established and the output returns `null`', () => {
    const customList = {
      config: { treeParentField: null },
    };

    const list = getTreeParentFieldName(customList);
    expect(list).toBe(null);
  });
});

describe('Get grid columns', () => {
  test('List is `empty object` and returns `null`', () => {
    const list = getGridColumns({});
    expect(list).toBe(null);
  });

  test('List is `null` and returns `null`', () => {
    const list = getGridColumns(null);
    expect(list).toStrictEqual(null);
  });

  test('List is `undefined` and returns `null`', () => {
    const list = getGridColumns(undefined);
    expect(list).toStrictEqual(null);
  });

  test('`reportId` in list has a value (filterFirstFive = TRUE) and returns an object', () => {
    const customList = {
      reportId: 1095182,
      columns: [{ relatedName: 1095821 }, { relatedName: 1095826 }, { relatedName: 1095822 }],
    };
    const resultList = [
      {
        relatedName: '1095821',
        dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
        disabled: null,
        hidden: null,
        required: null,
        id: 1095821,
      },
      {
        relatedName: '1095826',
        dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
        disabled: null,
        hidden: null,
        required: null,
        id: 1095826,
      },
      {
        relatedName: '1095822',
        dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
        disabled: null,
        hidden: null,
        required: null,
        id: 1095822,
      },
    ];

    const list = getGridColumns(customList, true);
    expect(list).toStrictEqual(resultList);
  });

  test('`reportId` in list has a value (filterFirstFive = FALSE) and returns an object', () => {
    const customList = {
      reportId: 1095182,
      columns: [{ relatedName: 1095821 }, { relatedName: 1095826 }, { relatedName: 1095822 }],
    };
    const resultList = [
      {
        relatedName: '1095821',
        dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
        disabled: null,
        hidden: null,
        required: null,
        id: 1095821,
      },
      {
        relatedName: '1095826',
        dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
        disabled: null,
        hidden: null,
        required: null,
        id: 1095826,
      },
      {
        relatedName: '1095822',
        dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
        disabled: null,
        hidden: null,
        required: null,
        id: 1095822,
      },
    ];

    const list = getGridColumns(customList);
    expect(list).toStrictEqual(resultList);
  });

  test('Type of `fields[fieldId]` is `undefined` at input and returns an array with null content', () => {
    const customList = {
      gridColumns: [3843, 3892, 17262],
      fields: {},
    };
    const resultList = [null, undefined, null, undefined, null, undefined];

    const list = getGridColumns(customList);
    expect(list).toStrictEqual(resultList);
  });

  test('`gridColumns` in list has a value (filterFirstFive = TRUE) and returns an array', () => {
    const customList = {
      gridColumns: [3843, 3892, 17262],
      fields: {
        3843: {
          id: 3843,
          caption: 'شناسه سفارش فروش',
          comment: 'فيلد کليد جدول',
        },
        3892: {
          id: 3892,
          caption: 'مشتري',
          comment: 'مشتري',
        },
        17262: {
          id: 17262,
          caption: 'ويزيتور',
          comment: 'ويزيتور',
        },
      },
    };
    const resultList = [
      { id: 3843, caption: 'شناسه سفارش فروش', comment: 'فيلد کليد جدول' },
      { id: 3892, caption: 'مشتري', comment: 'مشتري' },
      { id: 17262, caption: 'ويزيتور', comment: 'ويزيتور' },
    ];

    const list = getGridColumns(customList, true);
    expect(list).toStrictEqual(resultList);
  });

  test('`gridColumns` in list has a value (filterFirstFive = FALSE) and returns an array', () => {
    const customList = {
      gridColumns: [3843, 3892, 17262],
      fields: {
        3843: {
          id: 3843,
          caption: 'شناسه سفارش فروش',
          comment: 'فيلد کليد جدول',
        },
        3892: {
          id: 3892,
          caption: 'مشتري',
          comment: 'مشتري',
        },
        17262: {
          id: 17262,
          caption: 'ويزيتور',
          comment: 'ويزيتور',
        },
      },
    };
    const resultList = [
      { id: 3843, caption: 'شناسه سفارش فروش', comment: 'فيلد کليد جدول' },
      { id: 3892, caption: 'مشتري', comment: 'مشتري' },
      { id: 17262, caption: 'ويزيتور', comment: 'ويزيتور' },
    ];

    const list = getGridColumns(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get fields', () => {
  test('List is `empty object` and returns `null`', () => {
    const list = getFields({});
    expect(list).toBe(null);
  });

  test('List is `null` and returns `null`', () => {
    const list = getFields(null);
    expect(list).toStrictEqual(null);
  });

  test('List is `undefined` and returns `null`', () => {
    const list = getFields(undefined);
    expect(list).toStrictEqual(null);
  });

  test('The `reportId` is in the list and returns `null`', () => {
    const customList = { reportId: 6846 };
    const list = getFields(customList);
    expect(list).toBe(null);
  });

  test('Get a list for take fields in the input and returns an object ', () => {
    const customList = {
      config: { primaryField: 46965 },
      fields: { 46965: { id: 46965, caption: 'شناسه Product', disabled: true } },
    };
    const resultList = { '46965': { id: 46965, caption: 'شناسه Product', disabled: true } };

    const list = getFields(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get filter columns', () => {
  test('List is `empty object` and returns `null`', () => {
    const list = getFilterColumns({});
    expect(list).toBe(null);
  });

  test('List is `null` and returns `null`', () => {
    const list = getFilterColumns(null);
    expect(list).toStrictEqual(null);
  });

  test('List is `undefined` and returns `null`', () => {
    const list = getFilterColumns(undefined);
    expect(list).toStrictEqual(null);
  });

  test('`reportId` has a value in input and returns an array ', () => {
    const customList = {
      reportId: 29964,
      parameters: [
        {
          field: {
            id: 0,
            caption: 'وصولي',
            relatedName: 'isvossol',
          },
          key: 'isvossol',
          defaultOperator: 'Empty',
          onlyEqualCondition: true,
        },
      ],
    };
    const resultList = [
      {
        id: 'isvossol',
        caption: 'وصولي',
        relatedName: 'isvossol',
        name: 'isvossol',
        defaultOperator: 'Empty',
        onlyEqualCondition: true,
      },
    ];
    const list = getFilterColumns(customList);
    expect(list).toStrictEqual(resultList);
  });

  test('Receives a list with `undefined fields` from the input and returns an empty `array`', () => {
    const customList = {
      filterColumns: [46973, 46974, 48411],
      fields: {},
    };
    const list = getFilterColumns(customList);
    expect(list).toStrictEqual([null, null, null]);
  });

  test('Receives a correct list from the input and returns an `array`', () => {
    const customList = {
      filterColumns: [46973, 46974, 48411],
      fields: {
        46973: { id: 46973, caption: 'عنوان', name: 'title' },
        46974: { id: 46974, caption: 'SalePrice', name: 'saleprice' },
        48411: { id: 48411, caption: 'باركد كالا', name: 'kbarcode' },
      },
    };
    const resultList = [
      { caption: 'عنوان', id: 46973, name: 'title' },
      { caption: 'SalePrice', id: 46974, name: 'saleprice' },
      { caption: 'باركد كالا', id: 48411, name: 'kbarcode' },
    ];
    const list = getFilterColumns(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get fields by id with inputs `list` and `fieldList`', () => {
  const fieldList = [3168, 3169];

  test('List is `empty object` and returns `null`', () => {
    const list = getFieldsById({}, null);
    expect(list).toStrictEqual([]);
  });

  test('List is `null` and returns `null`', () => {
    const list = getFieldsById(null, null);
    expect(list).toStrictEqual([]);
  });

  test('List is `undefined` and returns `null`', () => {
    const list = getFieldsById(undefined, null);
    expect(list).toStrictEqual([]);
  });

  test('`list.reportId` has a value in input and returns an array', () => {
    const customList = {
      reportId: 1095182,
      columns: [{ relatedName: 3168 }, { relatedName: 3169 }],
    };
    const resultList = [
      {
        relatedName: '3168',
        dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
        disabled: null,
        hidden: null,
        required: null,
        id: 3168,
      },
      {
        relatedName: '3169',
        dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
        disabled: null,
        hidden: null,
        required: null,
        id: 3169,
      },
    ];

    const list = getFieldsById(customList, fieldList);
    expect(list).toStrictEqual(resultList);
  });

  test('`list.reportId` has a value but type of columns is `undefined` in input and returns an array', () => {
    const customList = {
      reportId: 1095182,
      columns: [],
    };

    const list = getFieldsById(customList, fieldList);
    expect(list).toStrictEqual([]);
  });

  test('There is no `list.reportId` at the input and it is not a `undefined` field type and returns an array', () => {
    const customList = {
      fields: {
        3168: { id: 3168, format: 'G18', relatedName: 'accounts_id' },
        3169: { id: 3169, format: 'G18', relatedName: 'isdeleted' },
      },
    };
    const resultList = [
      { id: 3168, format: 'G18', relatedName: 'accounts_id' },
      { id: 3169, format: 'G18', relatedName: 'isdeleted' },
    ];

    const list = getFieldsById(customList, fieldList);
    expect(list).toStrictEqual(resultList);
  });

  test('There is no `list.reportId` at the input and it is a `undefined` field type and returns an array', () => {
    const customList = {
      fields: {},
    };

    const list = getFieldsById(customList, fieldList);
    expect(list).toStrictEqual([]);
  });
});

describe('Get title fieldNames', () => {
  test('List is `empty object` and returns an `empty array`', () => {
    const list = getTitleFieldNames({});
    expect(list).toStrictEqual([]);
  });

  test('List is `null` and returns an `empty array`', () => {
    const list = getTitleFieldNames(null);
    expect(list).toStrictEqual([]);
  });

  test('List is `undefined` and returns an `empty array`', () => {
    const list = getTitleFieldNames(undefined);
    expect(list).toStrictEqual([]);
  });

  test('`list.captionColumns` is without amount in input and returns an empty array', () => {
    const customList = { captionColumns: null };
    const list = getTitleFieldNames(customList);
    expect(list).toStrictEqual([]);
  });

  test('Length of`captionColumns` is equal zero in input and returns an empty array', () => {
    const customList = { captionColumns: [] };
    const list = getTitleFieldNames(customList);
    expect(list).toStrictEqual([]);
  });

  test('Receives a list with `undefined fields` from the input and returns `null`', () => {
    const customList = {
      fields: {},
      captionColumns: [4689],
    };

    const list = getTitleFieldNames(customList);
    expect(list).toStrictEqual([null]);
  });

  test('Receives a list with `correct fields` from the input and returns an empty `array`', () => {
    const customList = {
      fields: { 4689: { name: 'accountname' } },
      captionColumns: [4689],
    };

    const list = getTitleFieldNames(customList);
    expect(list).toStrictEqual(['accountname']);
  });
});

describe('Get permanent filter fieldNames', () => {
  test('List is `empty object` and returns an `empty array`', () => {
    const list = getPermanentFilterFieldNames({});
    expect(list).toStrictEqual([]);
  });

  test('List is `null` and returns an `empty array`', () => {
    const list = getPermanentFilterFieldNames(null);
    expect(list).toStrictEqual([]);
  });

  test('List is `undefined` and returns an `empty array`', () => {
    const list = getPermanentFilterFieldNames(undefined);
    expect(list).toStrictEqual([]);
  });

  test('Get an object in input and returns an array', () => {
    const customList = {
      fields: { 4689: { name: 'accountname' } },
      captionColumns: [4689],
    };
    const list = getPermanentFilterFieldNames(customList);
    expect(list).toStrictEqual(['accountname']);
  });
});

describe('Get translated name', () => {
  test('List is `empty object` and returns `null`', () => {
    const list = getTranslatedName({}, 'fa');
    expect(list).toStrictEqual(null);
  });

  test('List is `null` and returns `null`', () => {
    const list = getTranslatedName(null, 'fa');
    expect(list).toStrictEqual(null);
  });

  test('List is `undefined` and returns `null`', () => {
    const list = getTranslatedName(undefined, 'fa');
    expect(list).toStrictEqual(null);
  });

  test('Locale is `null` in input and returns `null`', () => {
    const list = getTranslatedName(null, null);
    expect(list).toBe(null);
  });

  test('Locale is `undefined` in input and returns `null`', () => {
    const list = getTranslatedName(null, undefined);
    expect(list).toBe(null);
  });

  test('Get a list for translate title locale in input and returns a string ', () => {
    const customList = {
      translatedTitle: {
        ar: 'تغييرات قيمت منتج در ليست قيمت',
        en: 'Commodity price changes in the price list',
        fa: 'تغييرات قيمت کالا در ليست قيمت',
      },
    };
    const list = getTranslatedName(customList, 'fa');
    expect(list).toBe('تغييرات قيمت کالا در ليست قيمت');
  });

  test('`translatedCaptionLocale` field has a value and returns a string', () => {
    const customList = {
      config: {
        translatedCaption: {
          fa: 'گروه تفصيلي',
          en: 'CodingTafsilGroup',
          ar: 'گروه بعد الحسابي',
        },
      },
    };
    const list = getTranslatedName(customList, 'fa');
    expect(list).toBe('گروه تفصيلي');
  });

  test('`Caption` has a value in config and returns string', () => {
    const customList = {
      config: { caption: 'گروه تفصيلي' },
    };
    const list = getTranslatedName(customList, 'fa');
    expect(list).toBe('گروه تفصيلي');
  });

  test('`Title` has a value in config and returns string', () => {
    const customList = {
      config: { title: 'گروه نظری' },
    };
    const list = getTranslatedName(customList, 'fa');
    expect(list).toBe('گروه نظری');
  });
});

describe('Get show summary column list', () => {
  test('List is `empty object` and returns `null`', () => {
    const list = getShowSummaryColumnList({});
    expect(list).toStrictEqual(null);
  });

  test('List is `null` and returns `null`', () => {
    const list = getShowSummaryColumnList(null);
    expect(list).toStrictEqual(null);
  });

  test('List is `undefined` and returns `null`', () => {
    const list = getShowSummaryColumnList(undefined);
    expect(list).toStrictEqual(null);
  });

  test('QuickColumns is `null` in input and returns `null`', () => {
    const customList = { quickColumns: null };
    const list = getShowSummaryColumnList(customList);
    expect(list).toBe(null);
  });

  test('`quickColumns` has a value in input but fields are `undefined` and returns `null`', () => {
    const customList = {
      quickColumns: [4689, 3213],
      fields: {},
    };

    const list = getShowSummaryColumnList(customList);
    expect(list).toStrictEqual([null, null]);
  });

  test('`quickColumns` has a value in input, also fields are `full` and returns... ', () => {
    const customList = {
      quickColumns: [4689, 3213],
      fields: {
        4689: { id: 4689, caption: 'نام حساب', relatedName: 'accountname' },
        3213: { id: 3213, caption: 'شماره تماس اصلي', relatedName: 'companynumber' },
      },
    };

    const resultList = [
      { id: 4689, caption: 'نام حساب', relatedName: 'accountname' },
      { id: 3213, caption: 'شماره تماس اصلي', relatedName: 'companynumber' },
    ];
    const list = getShowSummaryColumnList(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Prepare groups', () => {
  test('Get `list` and `defaultColumnCount` in input and return an array', () => {
    const customList = {
      groups: {
        366: {
          fieldsLayout: [
            { fieldId: 27792, rowIndex: 3, columnIndex: 3 },
            { fieldId: 27494, rowIndex: 1, columnIndex: 0 },
          ],
          translatedTitle: { fa: 'اطلاعات حساب', en: 'اطلاعات حساب', ar: 'اطلاعات حساب' },
          fields: [27792, 27494, 25793],
        },
        500: {
          fieldsLayout: [
            { fieldId: 28174, rowIndex: 0, columnIndex: 2 },
            { fieldId: 20067, rowIndex: 0, columnIndex: 3 },
          ],
          translatedTitle: { fa: 'آدرس', en: 'آدرس', ar: 'آدرس' },
          fields: [28174, 20067, 15444, 8720, 4702, 4701],
        },
      },
      quickGroups: {
        4639: {
          fields: [27494, 8584, 5828, 4689, 4626, 4625, 3213, 3211, 3210],
          fieldsLayout: [{ fieldId: 27494, rowIndex: 2, columnIndex: 0 }],
          translatedTitle: { fa: 'تنظيم', en: 'تنظيم', ar: 'تنظيم' },
        },
      },
      fields: {
        27792: {
          caption: 'شناسه حساب ',
          id: 27792,
          name: 'accounts_id',
        },
        27494: {
          caption: 'حذف شده ',
          id: 27494,
          name: 'isdeleted',
        },
        28174: {
          caption: 'تلفيق با حساب ',
          id: 28174,
          name: 'mergeaccounts_id',
        },
        20067: {
          caption: 'ميزان اعتبار ',
          id: 20067,
          name: 'creditamount',
        },
      },
    };

    const resultList = [
      {
        columnCount: 4,
        id: 366,
        layout: [
          ['empty', 'empty', 'empty', 'empty'],
          [
            { caption: 'حذف شده ', id: 27494, name: 'isdeleted', colSpan: 0, rowSpan: 0 },
            'empty',
            'empty',
            'empty',
          ],
          ['empty', 'empty', 'empty', 'empty'],
          [
            'empty',
            'empty',
            'empty',
            { caption: 'شناسه حساب ', id: 27792, name: 'accounts_id', colSpan: 0, rowSpan: 0 },
          ],
        ],
        translatedTitle: { ar: 'اطلاعات حساب', en: 'اطلاعات حساب', fa: 'اطلاعات حساب' },
      },
      {
        columnCount: 4,
        id: 500,
        layout: [
          [
            'empty',
            'empty',
            {
              caption: 'تلفيق با حساب ',
              id: 28174,
              name: 'mergeaccounts_id',
              colSpan: 0,
              rowSpan: 0,
            },
            { caption: 'ميزان اعتبار ', id: 20067, name: 'creditamount', colSpan: 0, rowSpan: 0 },
          ],
        ],
        translatedTitle: { ar: 'آدرس', en: 'آدرس', fa: 'آدرس' },
      },
    ];

    const list = prepareGroups(customList, 4);
    expect(list).toStrictEqual(resultList);
  });

  test('Get `list` and `defaultColumnCount` in input but there is no `rowIndex` in fieldsLayout and finally return an array', () => {
    const customList = {
      groups: {
        366: {
          fieldsLayout: [
            { fieldId: 27792, rowIndex: 1, columnIndex: 3 },
            { fieldId: 27494, rowIndex: 2, columnIndex: 2 },
            { fieldId: 28174, rowIndex: 1, columnIndex: 0 },
          ],
          translatedTitle: { fa: 'اطلاعات حساب', en: 'اطلاعات حساب', ar: 'اطلاعات حساب' },
          fields: [27792, 27494, 28174],
          columnCount: 4,
        },
        500: {
          fieldsLayout: [
            { fieldId: 28174, rowIndex: 1, columnIndex: 2 },
            { fieldId: 20067, rowIndex: 2, columnIndex: 3 },
          ],
          translatedTitle: { fa: 'آدرس', en: 'آدرس', ar: 'آدرس' },
          fields: [28174, 20067],
        },
      },
      quickGroups: {
        4639: {
          fields: [27494, 8584, 5828, 4689, 4626, 4625, 3213, 3211, 3210],
          fieldsLayout: [{ fieldId: 27494, rowIndex: null, columnIndex: 0 }],
          translatedTitle: { fa: 'تنظيم', en: 'تنظيم', ar: 'تنظيم' },
        },
      },
      fields: {
        27792: {
          caption: 'شناسه حساب ',
          id: 27792,
          name: 'accounts_id',
        },
        27494: {
          caption: 'حذف شده ',
          id: 27494,
          name: 'isdeleted',
        },
        28174: {
          caption: 'تلفيق با حساب ',
          id: 28174,
          name: 'mergeaccounts_id',
        },
        20067: {
          caption: 'ميزان اعتبار ',
          id: 20067,
          name: 'creditamount',
        },
      },
    };

    const resultList = [
      {
        columnCount: 4,
        id: 366,
        layout: [
          ['empty', 'empty', 'empty', 'empty'],
          [
            {
              caption: 'تلفيق با حساب ',
              id: 28174,
              name: 'mergeaccounts_id',
              colSpan: 0,
              rowSpan: 0,
            },
            'empty',
            'empty',
            { caption: 'شناسه حساب ', id: 27792, name: 'accounts_id', colSpan: 0, rowSpan: 0 },
          ],
          [
            'empty',
            'empty',
            { caption: 'حذف شده ', id: 27494, name: 'isdeleted', colSpan: 0, rowSpan: 0 },
            'empty',
          ],
        ],
        translatedTitle: { ar: 'اطلاعات حساب', en: 'اطلاعات حساب', fa: 'اطلاعات حساب' },
      },
      {
        columnCount: 4,
        id: 500,
        layout: [
          ['empty', 'empty', 'empty', 'empty'],
          [
            'empty',
            'empty',
            {
              caption: 'تلفيق با حساب ',
              id: 28174,
              name: 'mergeaccounts_id',
              colSpan: 0,
              rowSpan: 0,
            },
            'empty',
          ],
          [
            'empty',
            'empty',
            'empty',
            { caption: 'ميزان اعتبار ', id: 20067, name: 'creditamount', colSpan: 0, rowSpan: 0 },
          ],
        ],
        translatedTitle: { ar: 'آدرس', en: 'آدرس', fa: 'آدرس' },
      },
    ];

    const list = prepareGroups(customList, 4);
    expect(list).toStrictEqual(resultList);
  });

  test('Get `list` and `defaultColumnCount` in input and also having `columnCount` in one of the groups fields and return an array', () => {
    const customList = {
      groups: {
        366: {
          fieldsLayout: [
            { fieldId: 27792, rowIndex: 7, columnIndex: 3 },
            { fieldId: 27494, rowIndex: 4, columnIndex: 0 },
          ],
          translatedTitle: { fa: 'اطلاعات حساب', en: 'اطلاعات حساب', ar: 'اطلاعات حساب' },
          fields: [27792, 27494, 25793],
          columnCount: 5,
        },
        500: {
          fieldsLayout: [
            { fieldId: 28174, rowIndex: 0, columnIndex: 2 },
            { fieldId: 20067, rowIndex: 0, columnIndex: 3 },
          ],
          translatedTitle: { fa: 'آدرس', en: 'آدرس', ar: 'آدرس' },
          fields: [28174, 20067, 15444, 8720, 4702, 4701],
        },
      },
      quickGroups: {
        4639: {
          fields: [27494, 8584, 5828, 4689, 4626, 4625, 3213, 3211, 3210],
          fieldsLayout: [{ fieldId: 27494, rowIndex: 2, columnIndex: 0 }],
          translatedTitle: { fa: 'تنظيم', en: 'تنظيم', ar: 'تنظيم' },
        },
      },
      fields: {
        27792: {
          caption: 'شناسه حساب ',
          id: 27792,
          name: 'accounts_id',
        },
        27494: {
          caption: 'حذف شده ',
          id: 27494,
          name: 'isdeleted',
        },
        28174: {
          caption: 'تلفيق با حساب ',
          id: 28174,
          name: 'mergeaccounts_id',
        },
        20067: {
          caption: 'ميزان اعتبار ',
          id: 20067,
          name: 'creditamount',
        },
      },
    };

    const resultList = [
      {
        columnCount: 5,
        id: 366,
        layout: [
          ['empty', 'empty', 'empty', 'empty', 'empty'],
          ['empty', 'empty', 'empty', 'empty', 'empty'],
          ['empty', 'empty', 'empty', 'empty', 'empty'],
          ['empty', 'empty', 'empty', 'empty', 'empty'],
          [
            { caption: 'حذف شده ', colSpan: 0, id: 27494, name: 'isdeleted', rowSpan: 0 },
            'empty',
            'empty',
            'empty',
            'empty',
          ],
          ['empty', 'empty', 'empty', 'empty', 'empty'],
          ['empty', 'empty', 'empty', 'empty', 'empty'],
          [
            'empty',
            'empty',
            'empty',
            { caption: 'شناسه حساب ', colSpan: 0, id: 27792, name: 'accounts_id', rowSpan: 0 },
            'empty',
          ],
        ],
        translatedTitle: { ar: 'اطلاعات حساب', en: 'اطلاعات حساب', fa: 'اطلاعات حساب' },
      },
      {
        columnCount: 4,
        id: 500,
        layout: [
          [
            'empty',
            'empty',
            {
              caption: 'تلفيق با حساب ',
              colSpan: 0,
              id: 28174,
              name: 'mergeaccounts_id',
              rowSpan: 0,
            },
            { caption: 'ميزان اعتبار ', colSpan: 0, id: 20067, name: 'creditamount', rowSpan: 0 },
          ],
        ],
        translatedTitle: { ar: 'آدرس', en: 'آدرس', fa: 'آدرس' },
      },
    ];

    const list = prepareGroups(customList, 4);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get group fields from fields list', () => {
  const groupFields = [3213, 3211, 3210];
  const processUniqueId = 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5';

  test('There are `list` and `groupFields` in input and returns an object', () => {
    const customList = {
      fields: {
        3210: { caption: 'شناسه حساب ', id: 3168 },
        3211: { caption: 'حذف شده ', id: 3169 },
        3213: { caption: 'كاربر ايجاد كننده ', id: 3168 },
      },
    };

    const resultList = {
      '3210': { caption: 'شناسه حساب ', id: 3168 },
      '3211': { caption: 'حذف شده ', id: 3169 },
      '3213': { caption: 'كاربر ايجاد كننده ', id: 3168 },
    };
    const list = getGroupFieldsFromFieldsList(customList, groupFields);
    expect(list).toStrictEqual(resultList);
  });

  test('There are `list` and `groupFields` in input but there is no field and finally returns an `empty object`', () => {
    const customList = {
      fields: {},
    };

    const list = getGroupFieldsFromFieldsList(customList, groupFields);
    expect(list).toStrictEqual({});
  });

  test('Get `list`, `groupFields`, `processUniqueId`, `positionId` and `stateid` in input and returns an object', () => {
    const customList = {
      fields: {
        3891: { caption: 'شناسه حساب ', id: 3891 },
        3896: { caption: 'حذف شده ', id: 3896 },
        4256: { caption: 'كاربر ايجاد كننده ', id: 4256 },
      },
      processes: [
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          tasks: [
            {
              title: 'ثبت اوليه فاکتور خريد',
              stateId: 3,
              positionId: 4,
              fields: {
                3891: { id: 3891, hidden: false, required: true },
                3896: { id: 3896, hidden: false, required: true },
                4256: { id: 4256, hidden: false, required: false },
              },
            },
            { title: 'شروع', stateId: 1, positionId: 1 },
          ],
          firstTask: { title: 'ثبت اوليه فاکتور خريد', stateId: 3, positionId: 4 },
        },
      ],
    };

    const resultList = {
      '3891': { caption: 'شناسه حساب ', hidden: false, id: 3891, required: true },
      '3896': { caption: 'حذف شده ', hidden: false, id: 3896, required: true },
      '4256': { caption: 'كاربر ايجاد كننده ', hidden: false, id: 4256, required: false },
    };

    const list = getGroupFieldsFromFieldsList(customList, groupFields, processUniqueId, 4, 3);
    expect(list).toStrictEqual(resultList);
  });

  test('Get`list`,`groupFields`,`processUniqueId`, `positionId` and `stateid` in input and returns an empty object', () => {
    const customList = {
      fields: {
        3891: { caption: 'شناسه حساب ', id: 3891 },
        3896: { caption: 'حذف شده ', id: 3896 },
        4256: { caption: 'كاربر ايجاد كننده ', id: 4256 },
      },
      processes: [
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          tasks: [
            {
              title: 'ثبت اوليه فاکتور خريد',
              stateId: 1,
              positionId: 6,
              fields: {
                3891: { id: 3891, hidden: false, required: true },
                3896: { id: 3896, hidden: false, required: true },
                4256: { id: 4256, hidden: false, required: false },
              },
            },
            { title: 'شروع', stateId: 1, positionId: 1 },
          ],
        },
      ],
    };

    const list = getGroupFieldsFromFieldsList(customList, groupFields, processUniqueId, 4, 3);
    expect(list).toStrictEqual({});
  });

  test('Get`list`,`groupFields`,`processUniqueId` in input but there are no `positionId` and `stateid` and finally returns an object', () => {
    const customList = {
      fields: {
        3891: { caption: 'شناسه حساب ', id: 3891 },
        3896: { caption: 'حذف شده ', id: 3896 },
        4256: { caption: 'كاربر ايجاد كننده ', id: 4256 },
      },
      processes: [
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          tasks: [
            {
              title: 'ثبت اوليه فاکتور خريد',
              stateId: 3,
              positionId: 4,
              fields: {
                3891: { id: 3891, hidden: false, required: true },
                3896: { id: 3896, hidden: false, required: true },
                4256: { id: 4256, hidden: false, required: false },
              },
            },
            { title: 'شروع', stateId: 1, positionId: 1 },
          ],
          firstTask: {
            title: 'ثبت اوليه فاکتور خريد',
            stateId: 3,
            positionId: 4,
            fields: {
              3891: { id: 3891, hidden: false, required: true },
              3896: { id: 3896, hidden: false, required: true },
              4256: { id: 4256, hidden: false, required: false },
            },
          },
        },
      ],
    };

    const resultList = {
      '3891': {
        caption: 'شناسه حساب ',
        id: 3891,
        hidden: false,
        required: true,
      },
      '3896': {
        caption: 'حذف شده ',
        id: 3896,
        hidden: false,
        required: true,
      },
      '4256': {
        caption: 'كاربر ايجاد كننده ',
        id: 4256,
        hidden: false,
        required: false,
      },
    };
    const list = getGroupFieldsFromFieldsList(customList, groupFields, processUniqueId);
    expect(list).toStrictEqual(resultList);
  });

  test('Get`list`,`groupFields`,`processUniqueId`, `positionId` and `stateid` in input and returns an object (fieldSet.disabled = true) ', () => {
    const customList = {
      fields: {
        3213: { caption: 'شناسه حساب ', id: 3891 },
        3211: { caption: 'حذف شده ', id: 3896 },
        4343: { caption: 'كاربر ايجاد كننده ', id: 4256 },
      },
      processes: [
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          tasks: [
            {
              title: 'ثبت اوليه فاکتور خريد',
              stateId: 3,
              positionId: 4,
              fields: {
                3891: { id: 3891, hidden: false, required: true },
                3896: { id: 3896, hidden: false, required: true },
                4256: { id: 4256, hidden: false, required: false },
              },
            },
            { title: 'شروع', stateId: 1, positionId: 1 },
          ],
          firstTask: {
            title: 'ثبت اوليه فاکتور خريد',
            stateId: 3,
            positionId: 4,
            fields: {
              3891: { id: 3891, hidden: false, required: true },
              3896: { id: 3896, hidden: false, required: true },
              4256: { id: 4256, hidden: false, required: false },
            },
          },
        },
      ],
    };

    const resultList = {
      '3211': { caption: 'حذف شده ', id: 3896, disabled: true },
      '3213': { caption: 'شناسه حساب ', id: 3891, disabled: true },
    };
    const list = getGroupFieldsFromFieldsList(customList, groupFields, processUniqueId, 4, 3);
    expect(list).toStrictEqual(resultList);
  });

  test('Get`list`,`groupFields`,`processUniqueId`, `positionId` and `stateid` in input but `fieldSet` will be empty and returns an `empty object` ', () => {
    const customList = {
      fields: {
        2500: { caption: 'شناسه حساب ', id: 3891 },
        1111: { caption: 'حذف شده ', id: 3896 },
        4343: { caption: 'كاربر ايجاد كننده ', id: 4256 },
      },
      processes: [
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          tasks: [
            {
              title: 'ثبت اوليه فاکتور خريد',
              stateId: 3,
              positionId: 4,
              fields: {
                3891: { id: 3891, hidden: false, required: true },
                3896: { id: 3896, hidden: false, required: true },
                4256: { id: 4256, hidden: false, required: false },
              },
            },
            { title: 'شروع', stateId: 1, positionId: 1 },
          ],
          firstTask: {
            title: 'ثبت اوليه فاکتور خريد',
            stateId: 3,
            positionId: 4,
            fields: {
              3891: { id: 3891, hidden: false, required: true },
              3896: { id: 3896, hidden: false, required: true },
              4256: { id: 4256, hidden: false, required: false },
            },
          },
        },
      ],
    };

    const list = getGroupFieldsFromFieldsList(customList, groupFields, processUniqueId, 4, 3);
    expect(list).toStrictEqual({});
  });

  test('Get`list`,`groupFields`,`processUniqueId`, `positionId` and `stateid` in input and returns an object ..... ', () => {
    const customList = {
      fields: {
        3213: { caption: 'شناسه حساب ', id: 3891 },
        3211: { caption: 'حذف شده ', id: 3896 },
        4343: { caption: 'كاربر ايجاد كننده ', id: 4256 },
      },
      processes: [
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          tasks: [
            {
              title: 'ثبت اوليه فاکتور خريد',
              stateId: 3,
              positionId: 4,
              fields: {
                3891: { id: 3891, hidden: false, required: true },
                3896: { id: 3896, hidden: false, required: true },
                4256: { id: 4256, hidden: false, required: false },
              },
            },
            { title: 'شروع', stateId: 1, positionId: 1 },
          ],
          firstTask: {
            title: 'ثبت اوليه فاکتور خريد',
            stateId: 3,
            positionId: 4,
            fields: {
              3891: { id: 3891, hidden: false, required: true },
              3896: { id: 3896, hidden: false, required: true },
              4256: { id: 4256, hidden: false, required: false },
            },
          },
        },
      ],
    };

    const resultList = {
      '3211': { caption: 'حذف شده ', id: 3896, disabled: true },
      '3213': { caption: 'شناسه حساب ', id: 3891, disabled: true },
    };
    const list = getGroupFieldsFromFieldsList(customList, groupFields, processUniqueId, 4, 3);
    expect(list).toStrictEqual(resultList);
  });

  test('Get `list`, `groupFields` and `disableFields` in input and returns an object ', () => {
    const customList = {
      fields: {
        3213: { caption: 'شناسه حساب ', id: 3891 },
        3211: { caption: 'حذف شده ', id: 3896 },
        4343: { caption: 'كاربر ايجاد كننده ', id: 4256 },
      },
      processes: [
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          tasks: [
            {
              title: 'ثبت اوليه فاکتور خريد',
              stateId: 3,
              positionId: 4,
              fields: {
                3891: { id: 3891, hidden: false, required: true },
                3896: { id: 3896, hidden: false, required: true },
                4256: { id: 4256, hidden: false, required: false },
              },
            },
            { title: 'شروع', stateId: 1, positionId: 1 },
          ],
          firstTask: {
            title: 'ثبت اوليه فاکتور خريد',
            stateId: 3,
            positionId: 4,
            fields: {
              3891: { id: 3891, hidden: false, required: true },
              3896: { id: 3896, hidden: false, required: true },
              4256: { id: 4256, hidden: false, required: false },
            },
          },
        },
      ],
    };
    const disabledFields = { 47273: true, 3213: true };
    const resultList = {
      '3211': { caption: 'حذف شده ', id: 3896 },
      '3213': { caption: 'شناسه حساب ', id: 3891, disabled: true },
    };

    const list = getGroupFieldsFromFieldsList(
      customList,
      groupFields,
      null,
      null,
      null,
      disabledFields,
    );
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get all field list', () => {
  test('Empty list in input and returns `null`', () => {
    const list = getAllFieldList({});
    expect(list).toStrictEqual(null);
  });

  test('Undefined list in input and returns `null`', () => {
    const list = getAllFieldList(undefined);
    expect(list).toStrictEqual(null);
  });

  test('Null list in input and returns `null`', () => {
    const list = getAllFieldList(null);
    expect(list).toStrictEqual(null);
  });

  test('Get `list` in input with fields are `undefined` and returns [array, null]', () => {
    const customList = {
      fields: {
        3168: undefined,
        3170: {
          id: 3170,
          caption: 'حذف شده',
          name: 'isdeleted',
          tableName: 'accounts',
          disabled: false,
        },
      },
      config: {
        caption: 'حساب ها',
        moduleName: 'crm',
        moduleTableName: 'accounts',
        primaryField: 3170,
      },
    };
    const resultList = [
      null,
      {
        id: 3170,
        caption: 'حذف شده',
        name: 'isdeleted',
        tableName: 'accounts',
        disabled: true,
      },
    ];
    const list = getAllFieldList(customList);
    expect(list).toStrictEqual(resultList);
  });

  test('Get `list` in input and returns an array also `disabled` will be `true`', () => {
    const customList = {
      fields: {
        3168: {
          id: 3168,
          caption: 'شناسه حساب ',
          name: 'accounts_id',
          tableName: 'accounts',
          disabled: false,
        },
        3169: {
          id: 3169,
          caption: 'حذف شده',
          name: 'isdeleted',
          tableName: 'accounts',
          disabled: false,
        },
        3170: {
          id: 3170,
          caption: 'كاربر ايجاد كننده',
          name: 'createuserid',
          tableName: 'accounts',
          disabled: false,
        },
      },
      config: {
        caption: 'حساب ها',
        moduleName: 'crm',
        moduleTableName: 'accounts',
        primaryField: 3170,
      },
    };
    const resultList = [
      {
        id: 3168,
        caption: 'شناسه حساب ',
        name: 'accounts_id',
        tableName: 'accounts',
        disabled: false,
      },
      {
        id: 3169,
        caption: 'حذف شده',
        name: 'isdeleted',
        tableName: 'accounts',
        disabled: false,
      },
      {
        id: 3170,
        caption: 'كاربر ايجاد كننده',
        name: 'createuserid',
        tableName: 'accounts',
        disabled: true,
      },
    ];
    const list = getAllFieldList(customList);
    expect(list).toStrictEqual(resultList);
  });

  test('Get `list` in input without primaryField and returns an array', () => {
    const customList = {
      fields: {
        3168: undefined,
        3172: {
          id: 3172,
          caption: 'حذف شده',
          name: 'isdeleted',
          tableName: 'accounts',
          disabled: false,
        },
      },
    };
    const resultList = [
      null,
      {
        id: 3172,
        caption: 'حذف شده',
        name: 'isdeleted',
        tableName: 'accounts',
        disabled: false,
      },
    ];
    const list = getAllFieldList(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get relation list', () => {
  test('Get `empty object` in input and returns `null`', () => {
    const list = getRelationList({}, {});
    expect(list).toStrictEqual(null);
  });

  test('Get `undefined` list in input and returns `null`', () => {
    const list = getRelationList(undefined, {});
    expect(list).toStrictEqual(null);
  });

  test('Get `null` list in input and returns `null`', () => {
    const list = getRelationList(null, {});
    expect(list).toStrictEqual(null);
  });

  test('Get list in input and returns an array', () => {
    const customList = {
      relations: [
        { moduleName: 'crm', moduleTableTitle: 'تلفنها', parentFieldName: 'accounts_id' },
        { moduleName: 'crm', moduleTableTitle: 'تماس ها', parentFieldName: 'accounts_id' },
        { moduleName: 'crm', moduleTableTitle: 'آدرس', parentFieldName: 'accounts_id' },
      ],
    };
    const processRecord = {
      positionid: 1,
      processuniqueid: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
      stateid: 0,
    };
    const resultList = [
      {
        moduleName: 'crm',
        moduleTableTitle: 'تلفنها',
        parentFieldName: 'accounts_id',
      },
      {
        moduleName: 'crm',
        moduleTableTitle: 'تماس ها',
        parentFieldName: 'accounts_id',
      },
      {
        moduleName: 'crm',
        moduleTableTitle: 'آدرس',
        parentFieldName: 'accounts_id',
      },
    ];

    const list = getRelationList(customList, processRecord);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get single record report relation list', () => {
  test('Get `empty object` in input and returns `null`', () => {
    const list = getSingleRecordReportRelationList({}, {});
    expect(list).toStrictEqual(null);
  });

  test('Get `undefined` list in input and returns `null`', () => {
    const list = getSingleRecordReportRelationList(undefined, {});
    expect(list).toStrictEqual(null);
  });

  test('Get `null` list in input and returns `null`', () => {
    const list = getSingleRecordReportRelationList(null, {});
    expect(list).toStrictEqual(null);
  });

  test('Get list in input and returns an array ---`SingleRecord`', () => {
    const customList = {
      reports: [
        { id: 'ca6f9acf-5366-4203-b93a-8f3e84368ed9', related: 'Table', title: 'دفتر تلفن' },
        {
          id: '91ca0c36-1c85-4705-96bb-4c39d9e16f42',
          related: 'SingleRecord',
          title: 'حساب دفاتر حساب روابط مشتري',
        },
      ],
    };

    const processRecord = {
      positionid: 1,
      processuniqueid: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
      stateid: 0,
    };

    const resultList = [
      {
        id: '91ca0c36-1c85-4705-96bb-4c39d9e16f42',
        related: 'SingleRecord',
        title: 'حساب دفاتر حساب روابط مشتري',
      },
    ];

    const list = getSingleRecordReportRelationList(customList, processRecord);
    expect(list).toStrictEqual(resultList);
  });
});

describe('remove hidden relations', () => {
  const list = {
    // metadata
    processes: [
      {
        uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
        tasks: [
          {
            stateId: 1,
            positionId: 1,
            deactiveSubpanels: [],
            deactiveReports: [],
          },
          {
            stateId: 2,
            positionId: 2,
            deactiveSubpanels: [
              {
                moduleName: 'webtest',
                moduleTableName: 'subpanelprocesstest',
                isHidden: true,
              },
            ],
            deactiveReports: [],
          },
          {
            stateId: 3,
            positionId: 3,
            deactiveSubpanels: [],
            deactiveReports: [
              {
                reportId: 'c76cccb2-e9c5-4dbe-be16-5e08524caced',
                isHidden: true,
              },
            ],
          },
        ],
      },
    ],
    relations: [
      {
        moduleTableName: 'subpanelprocesstest',
        moduleName: 'webtest',
      },
      {
        moduleTableName: 'processtestdetail',
        moduleName: 'webtest',
      },
      {
        moduleTableName: 'processtaskexecutionhistory',
        moduleName: 'workflow',
      },
    ],
    reports: [
      {
        id: 'c76cccb2-e9c5-4dbe-be16-5e08524caced',
      },
      {
        id: 'fake-report',
      },
    ],
  };

  const record = {
    positionid: 1,
    processuniqueid: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
    stateid: 1,
  };

  test('should return all relations without remove any', () => {
    const output = removeHiddenRelations(list, record, list.relations, 'deactiveSubpanels');
    expect(output).toStrictEqual(list.relations);
  });

  test('should return all relations except subpanelprocesstest', () => {
    const _record = {
      positionid: 2,
      processuniqueid: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
      stateid: 2,
    };
    const expected = [
      {
        moduleTableName: 'processtestdetail',
        moduleName: 'webtest',
      },
      {
        moduleTableName: 'processtaskexecutionhistory',
        moduleName: 'workflow',
      },
    ];
    const output = removeHiddenRelations(list, _record, list.relations, 'deactiveSubpanels');
    expect(output).toStrictEqual(expected);
  });

  test('should only return the fake report', () => {
    const _record = {
      positionid: 3,
      processuniqueid: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
      stateid: 3,
    };
    const output = removeHiddenRelations(list, _record, list.reports, 'deactiveReports');
    expect(output).toStrictEqual([list.reports[1]]);
  });
});

describe('Find hidden relatiosn', () => {
  const task = {
    deactiveReports: [
      {
        isHidden: true,
        reportId: 'c76cccb2-e9c5-4dbe-be16-5e08524caced',
      },
      {
        isHidden: false,
        reportId: 'fake-report',
      },
    ],
    deactiveSubpanels: [
      {
        isHidden: true,
        moduleName: 'webtest',
        moduleTableName: 'subpanelprocesstest',
      },
      {
        isHidden: true,
        moduleName: 'webtest',
        moduleTableName: 'testtable',
      },
      {
        isHidden: false,
        moduleName: 'webtest',
        moduleTableName: 'fake-table-name',
      },
    ],
  };

  test('should return nothing', () => {
    expect(findHiddenRelations({ deactiveReports: [] }, 'deactiveReports')).toStrictEqual(
      undefined,
    );
    expect(findHiddenRelations({ deactiveSubpanels: [] }, 'deactiveSubpanels')).toStrictEqual(
      undefined,
    );
  });

  test('should return a list of hidden relations', () => {
    const expected = [
      {
        isHidden: true,
        moduleName: 'webtest',
        moduleTableName: 'subpanelprocesstest',
      },
      {
        isHidden: true,
        moduleName: 'webtest',
        moduleTableName: 'testtable',
      },
    ];
    expect(findHiddenRelations(task, 'deactiveSubpanels')).toStrictEqual(expected);
  });

  test('should return a list of hidden reports', () => {
    const expected = [
      {
        isHidden: true,
        reportId: 'c76cccb2-e9c5-4dbe-be16-5e08524caced',
        id: 'c76cccb2-e9c5-4dbe-be16-5e08524caced',
      },
    ];
    expect(findHiddenRelations(task, 'deactiveReports')).toStrictEqual(expected);
  });
});

describe('Should return a list of filtered relations/reports based on field parameter', () => {
  test('should returns a list of objects with diffrenet id of hiddenRelations', () => {
    const reports = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const hiddenRelations = [{ id: 2 }];
    const expected = [{ id: 1 }, { id: 3 }];
    expect(filteredRelations(reports, hiddenRelations, 'deactiveReports')).toStrictEqual(expected);
  });

  test('should returns a list of objects with diffrenet moduleName/moduleTableName of hiddenRelations', () => {
    const reports = [
      { moduleName: 'mnTest1', moduleTableName: 'mtnTest1' },
      { moduleName: 'mnTest2', moduleTableName: 'mtnTest2' },
      { moduleName: 'mnTest3', moduleTableName: 'mtnTest3' },
    ];
    const hiddenRelations = [{ moduleName: 'mnTest2', moduleTableName: 'mtnTest2' }];
    const expected = [
      { moduleName: 'mnTest1', moduleTableName: 'mtnTest1' },
      { moduleName: 'mnTest3', moduleTableName: 'mtnTest3' },
    ];
    expect(filteredRelations(reports, hiddenRelations, 'deactiveSubpanels')).toStrictEqual(
      expected,
    );
  });

  test('should returns nothing', () => {
    expect(filteredRelations([], [], 'deactiveReports')).toStrictEqual([]);
    expect(filteredRelations([], [], 'deactiveSubpanels')).toStrictEqual([]);
  });
});

describe('Get report info', () => {
  const reportId = '3757b1af-03bb-4dc7-9c77-99e0334ad2bf';

  test('Get `empty object` in input and returns `null`', () => {
    const list = getReportInfo({}, reportId);
    expect(list).toStrictEqual(null);
  });

  test('`List.reports` is null in input and returns `null`', () => {
    const customList = {
      reports: [],
    };
    const list = getReportInfo(customList, reportId);
    expect(list).toStrictEqual(null);
  });

  test('Get list in input and returns an object', () => {
    const customList = {
      reports: [
        {
          id: '057aaf43-f439-41ce-af6a-7779d37b2da8',
          reportId: 9413,
          title: 'کنترل جزئيات خريد با مصوبه',
        },
        { id: '6dc40db4-c64d-49e3-9ddf-c4ad18d17ab4', reportId: 9431, title: 'كنترل فاكتور خريد' },
        {
          id: '3757b1af-03bb-4dc7-9c77-99e0334ad2bf',
          reportId: 9439,
          title: 'فاكتور هاي خريد فاقد قبض انبار',
        },
      ],
    };
    const resultList = {
      id: '3757b1af-03bb-4dc7-9c77-99e0334ad2bf',
      reportId: 9439,
      title: 'فاكتور هاي خريد فاقد قبض انبار',
    };
    const list = getReportInfo(customList, reportId);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Is module table', () => {
  test('Get `empty object` in input and returns `false`', () => {
    const list = isModuleTable({});
    expect(list).toStrictEqual(false);
  });

  test('Get `undefined` list in input and returns `false`', () => {
    const list = isModuleTable(undefined);
    expect(list).toStrictEqual(false);
  });

  test('Get `null` list in input and returns `false`', () => {
    const list = isModuleTable(null);
    expect(list).toStrictEqual(false);
  });

  test('Get list in input and returns a boolean', () => {
    const customList = {
      reportId: 9645,
    };
    const list = isModuleTable(customList);
    expect(list).toStrictEqual(false);
  });
});

describe('Are there `notes` or not', () => {
  test('Getting the list of the input and returning boolean value', () => {
    const customList = {
      config: {
        hasNote: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
          parentFieldName: 'accounts_id',
          childFieldName: 'accounts_id',
        },
      },
    };

    const list = hasNote(customList);
    expect(list).toBe(true);
  });
});

describe('Has the report editable or not', () => {
  test('Getting the list of the input and returning boolean value', () => {
    const customList = { editable: false };
    const list = hasReportEditable(customList);
    expect(list).toStrictEqual(false);
  });
});

describe('Get note info', () => {
  test('Getting the list of the input and returning an object', () => {
    const customList = {
      config: {
        hasNote: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
          parentFieldName: 'accounts_id',
          childFieldName: 'accounts_id',
        },
      },
    };
    const resultList = {
      moduleName: 'crm',
      moduleTableName: 'accounts_notes',
      moduleTableTitle: 'یادداشت ها',
      parentFieldName: 'accounts_id',
      childFieldName: 'accounts_id',
    };

    const list = getNoteInfo(customList);
    expect(list).toStrictEqual(resultList);
  });

  test('Getting the `incomplete list` of the input and returning `null` in note info', () => {
    const customList = {
      config: {
        hasNote: {
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
          parentFieldName: 'accounts_id',
          childFieldName: 'accounts_id',
        },
      },
    }; // incomplete list

    const list = getNoteInfo(customList);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `incomplete list` (note is empty) of the input and returning `null`', () => {
    const customList = {
      config: {
        hasNote: {},
      },
    }; // incomplete list

    const list = getNoteInfo(customList);
    expect(list).toStrictEqual(null);
  });
});

describe('Get groups', () => {
  test('Getting the list of the input and returning an object', () => {
    const customList = {
      groups: { id: 251, priority: 1, title: 'تنظيم' },
    };
    const resultList = { id: 251, priority: 1, title: 'تنظيم' };
    const list = getGroups(customList);
    expect(list).toStrictEqual(resultList);
  });

  test('Getting the `list` and `quickMode` of the input and returning an object', () => {
    const customList = {
      groups: { id: 251, priority: 1, title: 'تنظيم' },
      quickGroups: {
        id: 4551,
        priority: 1,
        title: 'تنظيم',
        fields: [2084],
        translatedTitle: { fa: 'تنظيم', en: 'تنظيم', ar: 'تنظيم' },
      },
    };
    const resultList = {
      id: 4551,
      priority: 1,
      title: 'تنظيم',
      fields: [2084],
      translatedTitle: { fa: 'تنظيم', en: 'تنظيم', ar: 'تنظيم' },
    };

    const list = getGroups(customList, true);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get tabs', () => {
  test('Getting the list of the input and returning an object', () => {
    const customList = {
      tabPages: [
        {
          moduleName: 'product',
          name: '0',
          tableName: 'pricinglistgroupinfo',
          title: 'گروه قيمت',
          translatedTitle: { fa: 'گروه قيمت', en: 'گروه قيمت', ar: 'گروه قيمت' },
        },
      ],
    };
    const resultList = [
      {
        moduleName: 'product',
        name: '0',
        tableName: 'pricinglistgroupinfo',
        title: 'گروه قيمت',
        translatedTitle: { fa: 'گروه قيمت', en: 'گروه قيمت', ar: 'گروه قيمت' },
      },
    ];

    const list = getTabs(customList);
    expect(list).toStrictEqual(resultList);
  });

  test('Getting the `list` and `quickMode` of the input and returning an object', () => {
    const customList = {
      tabPages: [
        {
          moduleName: 'product',
          name: '0',
          tableName: 'pricinglistgroupinfo',
          title: 'گروه قيمت',
          translatedTitle: { fa: 'گروه قيمت', en: 'گروه قيمت', ar: 'گروه قيمت' },
        },
      ],
      quickTabPages: [
        {
          quickGroups: [4551],
          name: '0',
          tableName: 'pricinglistgroupinfo',
          moduleName: 'product',
          title: 'گروه قيمت',
          translatedTitle: { fa: 'گروه قيمت', en: 'گروه قيمت', ar: 'گروه قيمت' },
        },
      ],
    };
    const resultList = [
      {
        quickGroups: [4551],
        name: '0',
        tableName: 'pricinglistgroupinfo',
        moduleName: 'product',
        title: 'گروه قيمت',
        translatedTitle: { fa: 'گروه قيمت', en: 'گروه قيمت', ar: 'گروه قيمت' },
      },
    ];

    const list = getTabs(customList, true);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get column count', () => {
  test('Getting the list of the input and returning a number', () => {
    const customList = {
      config: { columnCount: 4 },
    };
    const list = getColumnCount(customList);
    expect(list).toStrictEqual(4);
  });
});

describe('Get relations in form', () => {
  test('Getting the `empty list` of the input and returning `null` ', () => {
    const list = getRelationsInForm({});
    expect(list).toStrictEqual(null);
  });

  test('Getting the `undefined list` of the input and returning `null`', () => {
    const list = getRelationsInForm(undefined);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `null list` of the input and returning `null`', () => {
    const list = getRelationsInForm(null);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` of the input and returning an `object`', () => {
    const customList = {
      relations: [
        { showWithMainTable: true, moduleName: 'crm', moduleTableName: 'phonelines' },
        { showWithMainTable: false, moduleName: 'crm', moduleTableName: 'contacts' },
        { showWithMainTable: true, moduleName: 'crm', moduleTableName: 'address' },
      ],
    };
    const resultList = [
      {
        showWithMainTable: true,
        moduleName: 'crm',
        moduleTableName: 'phonelines',
        relationFieldName: 'crm/phonelines',
      },
      {
        showWithMainTable: false,
        moduleName: 'crm',
        moduleTableName: 'contacts',
        relationFieldName: 'crm/contacts',
      },
      {
        showWithMainTable: true,
        moduleName: 'crm',
        moduleTableName: 'address',
        relationFieldName: 'crm/address',
      },
    ];

    const list = getRelationsInForm(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get file info', () => {
  test('Getting the `list` of the input and returning `null` (there is no hasFile)', () => {
    const customList = {
      config: { hasFile: null },
    };
    const list = getFileInfo(customList);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` of the input and returning an object', () => {
    const customList = {
      config: { hasFile: { moduleName: 'appcore', moduleTableName: 'filestorage' } },
    };
    const resultList = { moduleName: 'appcore', moduleTableName: 'filestorage' };

    const list = getFileInfo(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get process list', () => {
  test('Getting the `empty list` of the input and returning `null` ', () => {
    const list = getProcessList({});
    expect(list).toStrictEqual(null);
  });

  test('Getting the `undefined list` of the input and returning `null`', () => {
    const list = getProcessList(undefined);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `null list` of the input and returning `null`', () => {
    const list = getProcessList(null);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` of the input but without `process` and returning `null`', () => {
    const customList = { processes: [] };
    const list = getProcessList(customList);
    expect(list).toStrictEqual(null);
  });

  test('Getting the list of the input and returning an array', () => {
    const customList = {
      processes: [
        { uniqueId: '29a93bae-d484-4bf6-aa64-384941691cfc', title: 'خريد مستقيم ' },
        { uniqueId: '99515e7e-0c9a-4015-838b-6d419bb0f13e', title: 'خريد مستقيم - دي مارت' },
        {
          uniqueId: 'b240b55e-3bfb-4efc-8904-0ca8f0603623',
          title: 'خريد با تاييد حسابداري و انبار (لاران)',
        },
      ],
    };
    const resultList = [
      {
        uniqueId: '29a93bae-d484-4bf6-aa64-384941691cfc',
        title: 'خريد مستقيم ',
      },
      {
        uniqueId: '99515e7e-0c9a-4015-838b-6d419bb0f13e',
        title: 'خريد مستقيم - دي مارت',
      },
      {
        uniqueId: 'b240b55e-3bfb-4efc-8904-0ca8f0603623',
        title: 'خريد با تاييد حسابداري و انبار (لاران)',
      },
    ];

    const list = getProcessList(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get process lines', () => {
  const processuniqueid = 'b240b55e-3bfb-4efc-8904-0ca8f0603623';
  const customList = {
    dashletGridColumns: [9549, 3891, 3896, 6206],
    filterColumns: [3856, 3857, 3858, 3859, 3860],
    formColumns: null,
    processes: [
      {
        uniqueId: 'b240b55e-3bfb-4efc-8904-0ca8f0603623',
        title: 'خريد مستقيم ',
        isDefault: true,
        tasks: [
          {
            lines: [
              {
                id: 2251,
                title: 'دريافت شماره ',
                translatedTitle: { fa: 'دريافت شماره ', en: 'دريافت شماره ', ar: 'دريافت شماره ' },
              },
            ],
            positionId: 7,
            stateId: 15,
          },
        ],
      },
      {
        uniqueId: '99515e7e-0c9a-4015-838b-6d419bb0f13e',
        title: 'خريد مستقيم - دي مارت',
        isDefault: false,
      },
      {
        uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
        title: 'خريد مستقيم - شكوفامنش',
        isDefault: false,
      },
    ],
  };

  test('Getting the `empty list` of the input and returning `null` ', () => {
    const list = getProcessLines({}, processuniqueid, 7, 15);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `undefined list` of the input and returning `null`', () => {
    const list = getProcessLines(undefined, processuniqueid, 7, 15);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `null list` of the input and returning `null`', () => {
    const list = getProcessLines(null, processuniqueid, 7, 15);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `empty list.process` of the input and returning `null`', () => {
    const list = getProcessLines({ processes: [] }, processuniqueid, 7, 15);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` of the input but `processuniqueid` has no value and returning `null`', () => {
    const list = getProcessLines(customList, null, 7, 15);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` of the input but `positionid` has no value and returning `null`', () => {
    const list = getProcessLines(customList, processuniqueid, null, 15);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` of the input but `stateid` has no value and returning `null`', () => {
    const list = getProcessLines(customList, processuniqueid, 7, null);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list`, `processuniqueid`, `positionid`, `stateid` of the input but `taskInfo` will be null and returning `null`', () => {
    const incompleteList = {
      processes: [
        {
          uniqueId: '29a93bae-d484-4bf6-aa64-384941691cfc',
          title: 'خريد مستقيم ',
          isDefault: true,
        },
        {
          uniqueId: '99515e7e-0c9a-4015-838b-6d419bb0f13e',
          title: 'خريد مستقيم - دي مارت',
          isDefault: false,
        },
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          isDefault: false,
        },
      ],
    };
    const list = getProcessLines(incompleteList, processuniqueid, 7, 15);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list`, `processuniqueid`, `positionid`, `stateid` of the input and returning an array', () => {
    const resultList = [
      {
        id: 2251,
        title: 'دريافت شماره ',
        translatedTitle: { fa: 'دريافت شماره ', en: 'دريافت شماره ', ar: 'دريافت شماره ' },
      },
    ];
    const list = getProcessLines(customList, processuniqueid, 7, 15);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get process taskInfo', () => {
  const processuniqueid = 'b240b55e-3bfb-4efc-8904-0ca8f0603623';

  test('Getting the `incomplete list`, `processuniqueid`, `positionid`, `stateid` of the input and returning `null`', () => {
    const list = getProcessTaskInfo({ processes: [] }, processuniqueid, 7, 15);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list`, `processuniqueid`, `positionid`, `stateid` of the input and returning an object ', () => {
    const customList = {
      processes: [
        {
          uniqueId: 'b240b55e-3bfb-4efc-8904-0ca8f0603623',
          title: 'خريد مستقيم ',
          isDefault: true,
          tasks: [
            {
              lines: [
                {
                  id: 2251,
                  title: 'دريافت شماره ',
                  translatedTitle: {
                    fa: 'دريافت شماره ',
                    en: 'دريافت شماره ',
                    ar: 'دريافت شماره ',
                  },
                },
              ],
              positionId: 7,
              stateId: 15,
            },
          ],
        },
        {
          uniqueId: '99515e7e-0c9a-4015-838b-6d419bb0f13e',
          title: 'خريد مستقيم - دي مارت',
          isDefault: false,
          tasks: [
            {
              positionId: 5,
              stateId: 1,
              lines: [
                {
                  id: 5551,
                  title: 'ارسال شماره ',
                  translatedTitle: {
                    fa: 'ارسال شماره ',
                    en: 'ارسال شماره ',
                    ar: 'ارسال شماره ',
                  },
                },
              ],
            },
          ],
        },
        {
          uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
          title: 'خريد مستقيم - شكوفامنش',
          isDefault: false,
          tasks: [
            {
              positionId: 12,
              stateId: 8,
            },
          ],
        },
      ],
    };
    const resultList = {
      lines: [
        {
          id: 2251,
          title: 'دريافت شماره ',
          translatedTitle: { ar: 'دريافت شماره ', en: 'دريافت شماره ', fa: 'دريافت شماره ' },
        },
      ],
      positionId: 7,
      stateId: 15,
    };

    const list = getProcessTaskInfo(customList, processuniqueid, 7, 15);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Search in list.process by uniqueId', () => {
  const processuniqueid = 'b240b55e-3bfb-4efc-8904-0ca8f0603623';
  const customList = {
    processes: [
      {
        uniqueId: 'b240b55e-3bfb-4efc-8904-0ca8f0603623',
        title: 'خريد مستقيم ',
        isDefault: true,
        tasks: [
          {
            lines: [
              {
                id: 2251,
                title: 'دريافت شماره ',
                translatedTitle: {
                  fa: 'دريافت شماره ',
                  en: 'دريافت شماره ',
                  ar: 'دريافت شماره ',
                },
              },
            ],
            positionId: 7,
            stateId: 15,
          },
        ],
      },
      {
        uniqueId: '99515e7e-0c9a-4015-838b-6d419bb0f13e',
        title: 'خريد مستقيم - دي مارت',
        isDefault: false,
        tasks: [
          {
            positionId: 5,
            stateId: 1,
            lines: [
              {
                id: 5551,
                title: 'ارسال شماره ',
                translatedTitle: {
                  fa: 'ارسال شماره ',
                  en: 'ارسال شماره ',
                  ar: 'ارسال شماره ',
                },
              },
            ],
          },
        ],
      },
      {
        uniqueId: 'a915d19d-775b-4f0d-b7ac-4bfe9a3314c5',
        title: 'خريد مستقيم - شكوفامنش',
        isDefault: false,
        tasks: [
          {
            positionId: 12,
            stateId: 8,
          },
        ],
      },
    ],
  };

  test('Getting the `empty list` of the input and returning `null` ', () => {
    const list = getProcessInfo({}, processuniqueid);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `undefined list` of the input and returning `null`', () => {
    const list = getProcessInfo(undefined, processuniqueid);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `null list` of the input and returning `null`', () => {
    const list = getProcessInfo(null, processuniqueid);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` and `processuniqueid` of the input but `process` has no value and finally returning `null`', () => {
    const list = getProcessInfo({ processes: [] }, processuniqueid);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` and `processuniqueid` of the input and returning `null`', () => {
    const list = getProcessInfo(customList, null);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` and `processuniqueid` of the input and returning an object', () => {
    const resultList = {
      isDefault: true,
      tasks: [
        {
          lines: [
            {
              id: 2251,
              title: 'دريافت شماره ',
              translatedTitle: { ar: 'دريافت شماره ', en: 'دريافت شماره ', fa: 'دريافت شماره ' },
            },
          ],
          positionId: 7,
          stateId: 15,
        },
      ],
      title: 'خريد مستقيم ',
      uniqueId: 'b240b55e-3bfb-4efc-8904-0ca8f0603623',
    };
    const list = getProcessInfo(customList, processuniqueid);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get services', () => {
  test('Getting the `empty list` of the input and returning `null` ', () => {
    const list = getServices({});
    expect(list).toStrictEqual(null);
  });

  test('Getting the `undefined list` of the input and returning `null`', () => {
    const list = getServices(undefined);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `null list` of the input and returning `null`', () => {
    const list = getServices(null);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `list` of the input but has no `list.action` and returning `null`', () => {
    const list = getServices({ actions: [] });
    expect(list).toStrictEqual(null);
  });

  test('Getting the list of the input and returning an object', () => {
    const customList = {
      actions: [
        {
          id: 1098302,
          title: 'بروزرساني تعداد فاكتور در سفارش',
          uniqueId: '7bcb19ab-3d4e-4fc4-a4aa-72f3f3788264',
        },
        {
          id: 1095333,
          title: 'ثبت تكراري از فاكتور خريد',
          uniqueId: 'e6ede7a7-3998-403c-be41-70e55aa6f7db',
        },
        {
          id: 299251,
          title: 'ايجاد حواله بين انباري از فاكتور خريد',
          uniqueId: '3053a333-85b2-4881-a441-e076f28eaa24',
        },
      ],
    };
    const resultList = [
      {
        id: 1098302,
        title: 'بروزرساني تعداد فاكتور در سفارش',
        uniqueId: '7bcb19ab-3d4e-4fc4-a4aa-72f3f3788264',
      },
      {
        id: 1095333,
        title: 'ثبت تكراري از فاكتور خريد',
        uniqueId: 'e6ede7a7-3998-403c-be41-70e55aa6f7db',
      },
      {
        id: 299251,
        title: 'ايجاد حواله بين انباري از فاكتور خريد',
        uniqueId: '3053a333-85b2-4881-a441-e076f28eaa24',
      },
    ];

    const list = getServices(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get server validation field list', () => {
  test('Getting the `empty list` of the input and returning `null` ', () => {
    const list = getServerValidationFieldList({});
    expect(list).toStrictEqual(null);
  });

  test('Getting the `undefined list` of the input and returning `null`', () => {
    const list = getServerValidationFieldList(undefined);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `null list` of the input and returning `null`', () => {
    const list = getServerValidationFieldList(null);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `incomplete list` of the input and returning `null`', () => {
    const customList = {
      validationActions: {
        47012: [
          {
            id: 299773,
            title: 'سرويس وليديشن خروجي متن',
            uniqueId: '365cd81c-8346-4e7d-8517-3f3c6dd986d8',
          },
        ],
      },
      fields: {
        47000: { id: 47000, caption: 'شناسه OrderDetail' },
        47001: { id: 47001, caption: 'حذف شده' },
        47002: { id: 47002, caption: 'قابل ويرايش' },
      },
    };

    const list = getServerValidationFieldList(customList);
    expect(list).toStrictEqual([null]);
  });

  test('Getting the `list` of the input and returning an`array`', () => {
    const customList = {
      validationActions: {
        47012: [
          {
            id: 299773,
            title: 'سرويس وليديشن خروجي متن',
            uniqueId: '365cd81c-8346-4e7d-8517-3f3c6dd986d8',
          },
        ],
      },
      fields: {
        47000: { id: 47000, caption: 'شناسه OrderDetail' },
        47012: { id: 47012, caption: 'حذف شده' },
        47002: { id: 47002, caption: 'قابل ويرايش' },
      },
    };

    const resultList = [
      {
        field: { caption: 'حذف شده', id: 47012 },
        service: [
          {
            id: 299773,
            title: 'سرويس وليديشن خروجي متن',
            uniqueId: '365cd81c-8346-4e7d-8517-3f3c6dd986d8',
          },
        ],
      },
    ];

    const list = getServerValidationFieldList(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get async validation info for field', () => {
  const meta = {
    validationActions: {
      47012: [
        {
          id: 299773,
          title: 'سرويس وليديشن خروجي متن',
          uniqueId: '365cd81c-8346-4e7d-8517-3f3c6dd986d8',
        },
      ],
    },
  };

  test('Getting the `empty meta` and `fieldId` of the input and returning `undefined`', () => {
    const list = getAsyncValidationInfoForField({}, 47592);
    expect(list).toStrictEqual(undefined);
  });

  test('Getting the `meta` and `empty fieldId` of the input and returning `undefined`', () => {
    const list = getAsyncValidationInfoForField(meta, null);
    expect(list).toStrictEqual(undefined);
  });

  test('Getting the `meta` and `fieldId` of the input and returning an `object`', () => {
    const resultList = {
      id: 299773,
      title: 'سرويس وليديشن خروجي متن',
      uniqueId: '365cd81c-8346-4e7d-8517-3f3c6dd986d8',
    };
    const list = getAsyncValidationInfoForField(meta, 47012);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get tab list', () => {
  const customList = {
    quickTabPages: [
      {
        quickGroups: [4683],
        name: '0',
        tableName: 'purchaseinvoice',
        moduleName: 'wm',
        title: 'فاکتور خريد',
        translatedTitle: { fa: 'فاکتور خريد', en: 'فاکتور خريد', ar: 'فاتورة الشراء' },
      },
    ],
    tabPages: [
      {
        groups: [594],
        name: '0',
        tableName: 'purchaseinvoice',
        moduleName: 'wm',
        title: 'عمومي',
        translatedTitle: { fa: 'عمومي', en: 'عمومي', ar: 'عام' },
      },
      {
        groups: [610],
        name: '1',
        tableName: 'purchaseinvoice',
        moduleName: 'wm',
        title: '',
        translatedTitle: null,
      },
    ],
    quickGroups: {
      4683: {
        id: 4683,
        priority: 1,
        title: 'تنظيم',
        translatedTitle: { fa: 'تنظيم', en: 'تنظيم', ar: 'تنظيم' },
        fields: [23887, 21867, 48246],
        fieldsLayout: [
          { fieldId: 23887, rowIndex: 5, columnIndex: 1, colSpan: 1, rowSpan: 1 },
          { fieldId: 21867, rowIndex: 5, columnIndex: 0, colSpan: 1, rowSpan: 1 },
          { fieldId: 48246, rowIndex: 4, columnIndex: 3, colSpan: 1, rowSpan: 1 },
        ],
      },
    },
    groups: {
      594: {
        id: 594,
        priority: 1,
        title: 'عمومي',
        fields: [(49179, 48246)],
        fieldsLayout: [
          { fieldId: 49179, rowIndex: 11, columnIndex: 0, colSpan: null, rowSpan: null },
          { fieldId: 48246, rowIndex: 9, columnIndex: 3, colSpan: null, rowSpan: null },
        ],
        translatedTitle: { fa: 'عمومي', en: 'عمومي', ar: 'عام' },
      },
      610: {
        id: 610,
        priority: 2,
        title: 'حسابداري',
        fields: [28688, 48246, 21449],
        fieldsLayout: [
          { fieldId: 28688, rowIndex: 1, columnIndex: 2, colSpan: null, rowSpan: null },
          { fieldId: 48246, rowIndex: 1, columnIndex: 3, colSpan: null, rowSpan: null },
          { fieldId: 21449, rowIndex: 1, columnIndex: 0, colSpan: 1, rowSpan: 1 },
        ],
      },
    },
    fields: {
      48246: { id: 48246, caption: 'دريافت با تاخير' },
      23887: { id: 23887, caption: 'زمان حذف شدن' },
    },
  };
  const defaultColumnCount = 4;
  const processuniqueid = 'b240b55e-3bfb-4efc-8904-0ca8f0603623';
  const positionid = 7;
  const stateid = 15;
  const disabledFields = null;
  const specialResultList = [
    {
      groupList: [
        {
          columnCount: 4,
          id: 594,
          layout: [
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            [
              'empty',
              'empty',
              'empty',
              { caption: 'دريافت با تاخير', colSpan: null, id: 48246, rowSpan: null },
            ],
            ['empty', 'empty', 'empty', 'empty'],
            [{ colSpan: null, rowSpan: null }, 'empty', 'empty', 'empty'],
          ],
          translatedTitle: { ar: 'عام', en: 'عمومي', fa: 'عمومي' },
        },
      ],
      groups: [594],
      id: 0,
      moduleName: 'wm',
      name: '0',
      resource: 'wm/purchaseinvoice',
      tableName: 'purchaseinvoice',
      title: 'عمومي',
      translatedTitle: { ar: 'عام', en: 'عمومي', fa: 'عمومي' },
    },
    {
      groupList: [
        {
          columnCount: 4,
          id: 610,
          layout: [
            ['empty', 'empty', 'empty', 'empty'],
            [
              { colSpan: 1, rowSpan: 1 },
              'empty',
              { colSpan: null, rowSpan: null },
              { caption: 'دريافت با تاخير', colSpan: null, id: 48246, rowSpan: null },
            ],
          ],
          translatedTitle: undefined,
        },
      ],
      groups: [610],
      id: 1,
      moduleName: 'wm',
      name: '1',
      resource: 'wm/purchaseinvoice',
      tableName: 'purchaseinvoice',
      title: '',
      translatedTitle: null,
    },
  ];

  test('Getting the `list, defaultColumnCount` and `default values` of the input and returning an `array` ', () => {
    const list = getTabList({ list: customList, defaultColumnCount });
    expect(list).toStrictEqual(specialResultList);
  });

  test('Getting the `list, defaultColumnCount,quickMode` and `default values` of the input and returning an `array`', () => {
    const resultList = [
      {
        groupList: [
          {
            columnCount: 4,
            id: 4683,
            layout: [
              ['empty', 'empty', 'empty', 'empty'],
              ['empty', 'empty', 'empty', 'empty'],
              ['empty', 'empty', 'empty', 'empty'],
              ['empty', 'empty', 'empty', 'empty'],
              [
                'empty',
                'empty',
                'empty',
                { caption: 'دريافت با تاخير', colSpan: 1, id: 48246, rowSpan: 1 },
              ],
              [
                { colSpan: 1, rowSpan: 1 },
                { caption: 'زمان حذف شدن', colSpan: 1, id: 23887, rowSpan: 1 },
                'empty',
                'empty',
              ],
            ],
            translatedTitle: { ar: 'تنظيم', en: 'تنظيم', fa: 'تنظيم' },
          },
        ],
        id: 0,
        moduleName: 'wm',
        name: '0',
        quickGroups: [4683],
        resource: 'wm/purchaseinvoice',
        tableName: 'purchaseinvoice',
        title: 'فاکتور خريد',
        translatedTitle: { ar: 'فاتورة الشراء', en: 'فاکتور خريد', fa: 'فاکتور خريد' },
      },
    ];

    const list = getTabList({ list: customList, defaultColumnCount, quickMode: true });
    expect(list).toStrictEqual(resultList);
  });

  test('Getting the `list`, `defaultColumnCount`, processuniqueid, `positionid`, `stateid`, `quickMode(false)` and `disabledFields` of the input and returning an `array`', () => {
    const list = getTabList({
      list: customList,
      defaultColumnCount,
      processuniqueid,
      positionid,
      stateid,
      quickMode: false,
      disabledFields,
    });
    expect(list).toStrictEqual(specialResultList);
  });

  test('Getting the `list`, `defaultColumnCount`, processuniqueid, `positionid`, `stateid`, `quickMode(true)` and `disabledFields` of the input and returning an `array`', () => {
    const resultList = [
      {
        groupList: [
          {
            columnCount: 4,
            id: 4683,
            layout: [
              ['empty', 'empty', 'empty', 'empty'],
              ['empty', 'empty', 'empty', 'empty'],
              ['empty', 'empty', 'empty', 'empty'],
              ['empty', 'empty', 'empty', 'empty'],
              [
                'empty',
                'empty',
                'empty',
                { caption: 'دريافت با تاخير', colSpan: 1, id: 48246, rowSpan: 1 },
              ],
              [
                { colSpan: 1, rowSpan: 1 },
                { caption: 'زمان حذف شدن', colSpan: 1, id: 23887, rowSpan: 1 },
                'empty',
                'empty',
              ],
            ],
            translatedTitle: { ar: 'تنظيم', en: 'تنظيم', fa: 'تنظيم' },
          },
        ],
        id: 0,
        moduleName: 'wm',
        name: '0',
        quickGroups: [4683],
        resource: 'wm/purchaseinvoice',
        tableName: 'purchaseinvoice',
        title: 'فاکتور خريد',
        translatedTitle: { ar: 'فاتورة الشراء', en: 'فاکتور خريد', fa: 'فاکتور خريد' },
      },
    ];

    const list = getTabList({
      list: customList,
      defaultColumnCount,
      processuniqueid,
      positionid,
      stateid,
      quickMode: true,
      disabledFields,
    });
    expect(list).toStrictEqual(resultList);
  });
});

describe('Merge tab data with setting', () => {
  const customList = {
    fields: {
      47262: { id: 47262, caption: 'شناسه ProcessTest', disabled: false },
      47231: { id: 47231, caption: 'حذف شده', disabled: true },
      47232: { id: 47232, caption: 'قابل ويرايش', disabled: true },
    },
    config: { primaryField: 47262 },
  };
  const tableRelationList = [
    { moduleTableName: 'processtestdetail', moduleName: 'webtest' },
    { moduleTableName: 'processtaskexecutionhistory', moduleName: 'workflow' },
  ];
  const reportRelationList = [
    { id: '6edc4602-20be-4d7a-ba67-4338ff595820', title: 'تست گزارش ريليشن معمولي-مشتري' },
    { id: 'f42ef66f-8146-4703-9cf7-e7b9c37b28a2', title: 'تست گزارش ريليشن مولتي - سفارش' },
  ];
  const fileRelation = {
    moduleName: 'crm',
    moduleTableName: 'accounts_notes',
    moduleTableTitle: 'یادداشت ها',
  };
  const noteRelation = {
    moduleName: 'crm',
    moduleTableName: 'accounts_notes',
    moduleTableTitle: 'یادداشت ها',
  };

  test('Getting the `list`, `processList`, `defaultTabList` and `storedTabList` of the input with default values and returning an `array`. (defaultTabList / clonedField)', () => {
    const processList = [
      { title: 'DefaultProcessTest2', uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad' },
      { uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4', title: 'DefaultProcessTest' },
    ];
    const defaultTabList = [
      {
        id: 5,
        moduleName: 'webtest',
        tableName: 'processtest',
        groupList: [
          {
            layout: [
              [
                { id: 47262, caption: 'EnableField' },
                { id: 47261, caption: 'HideField' },
              ],
            ],
          },
        ],
      },
    ];
    const storedTabList = [
      { id: 0, moduleName: 'webtest', title: 'ProcessTest' },
      { id: 1599908805733, translatedTitle: { fa: 'Hello World', en: 'New Tab', ar: 'قسم جديد' } },
    ];
    const resultList = [
      {
        fileRelation: [],
        groupList: [
          {
            layout: [
              [
                {
                  caption: 'EnableField',
                  disabled: true,
                  id: 47262,
                  tabId: 5,
                  tabTitle: undefined,
                  translatedTabTitle: undefined,
                },
                null,
              ],
            ],
          },
        ],
        id: 5,
        moduleName: 'webtest',
        noteRelation: [],
        reportRelationList: [],
        tableName: 'processtest',
        tableRelationList: [],
      },
    ];

    const list = mergeTabDataWithSetting(customList, processList, defaultTabList, storedTabList);
    expect(list).toStrictEqual(resultList);
  });

  test('Getting the `list`, `processList`, `defaultTabList` and `storedTabList` of the input with default values and returning an `array`. (defaultTabList / originalField)', () => {
    const processList = [
      { title: 'DefaultProcessTest2', uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad' },
      { uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4', title: 'DefaultProcessTest' },
    ];
    const defaultTabList = [
      {
        id: 5,
        moduleName: 'webtest',
        tableName: 'processtest',
        groupList: [
          {
            layout: [[null, { id: 47261, caption: 'HideField' }]],
          },
        ],
      },
    ];
    const storedTabList = [
      { id: 0, moduleName: 'webtest', title: 'ProcessTest' },
      { id: 1599908805733, translatedTitle: { fa: 'Hello World', en: 'New Tab', ar: 'قسم جديد' } },
    ];
    const resultList = [
      {
        fileRelation: [],
        groupList: [{ layout: [[null, null]] }],
        id: 5,
        moduleName: 'webtest',
        noteRelation: [],
        reportRelationList: [],
        tableName: 'processtest',
        tableRelationList: [],
      },
    ];

    const list = mergeTabDataWithSetting(customList, processList, defaultTabList, storedTabList);
    expect(list).toStrictEqual(resultList);
  });

  test('Getting the `list`, `processList`, `defaultTabList` and `storedTabList` of the input with default values and returning an `array`. (storedTabList / clonedField :: originalField)', () => {
    const processList = null;
    const defaultTabList = [
      {
        id: 5,
        moduleName: 'webtest',
        tableName: 'processtest',
        // groupList: [
        //   {
        //     layout: [[null, { id: 47261, caption: 'HideField' }]],
        //   },
        // ],
      },
    ];
    const storedTabList = [
      {
        id: 0,
        moduleName: 'webtest',
        title: 'ProcessTest',
        groupList: [{ layout: [[{ id: 47261 }, { id: 47262 }]] }],
      },
      {
        id: 1599908805733,
        translatedTitle: { fa: 'Hello World', en: 'New Tab', ar: 'قسم جديد' },
        groupList: [{ layout: [[{ id: 47235 }, null]] }],
      },
    ];
    const resultList = [
      {
        fileRelation: [],
        groupList: [
          {
            layout: [
              [
                null,
                {
                  caption: 'شناسه ProcessTest',
                  disabled: true,
                  id: 47262,
                  tabId: 0,
                  tabTitle: 'ProcessTest',
                  translatedTabTitle: undefined,
                },
              ],
            ],
          },
        ],
        id: 0,
        moduleName: 'webtest',
        noteRelation: [],
        reportRelationList: [],
        tableRelationList: [],
        title: 'ProcessTest',
      },
      {
        fileRelation: [],
        groupList: [{ layout: [[null, null]] }],
        id: 1599908805733,
        noteRelation: [],
        reportRelationList: [],
        tableRelationList: [],
        translatedTitle: { ar: 'قسم جديد', en: 'New Tab', fa: 'Hello World' },
      },
    ];

    const list = mergeTabDataWithSetting(customList, processList, defaultTabList, storedTabList);
    expect(list).toStrictEqual(resultList);
  });

  test('Getting a number of objects and arrays of the input and returning an `array`. (defaultTabList / clonedField)', () => {
    const processList = [
      { title: 'DefaultProcessTest2', uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad' },
      { uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4', title: 'DefaultProcessTest' },
    ];
    const defaultTabList = [
      {
        id: 5,
        moduleName: 'webtest',
        tableName: 'processtest',
        groupList: [
          {
            layout: [
              [
                { id: 47262, caption: 'EnableField' },
                { id: 47261, caption: 'HideField' },
              ],
            ],
          },
        ],
      },
    ];
    const storedTabList = [
      { id: 0, moduleName: 'webtest', title: 'ProcessTest' },
      { id: 1599908805733, translatedTitle: { fa: 'Hello World', en: 'New Tab', ar: 'قسم جديد' } },
    ];

    const resultList = [
      {
        fileRelation: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
        },
        groupList: [
          {
            layout: [
              [
                {
                  caption: 'EnableField',
                  disabled: true,
                  id: 47262,
                  tabId: 5,
                  tabTitle: undefined,
                  translatedTabTitle: undefined,
                },
                null,
              ],
            ],
          },
        ],
        id: 5,
        moduleName: 'webtest',
        noteRelation: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
        },
        reportRelationList: [
          { id: '6edc4602-20be-4d7a-ba67-4338ff595820', title: 'تست گزارش ريليشن معمولي-مشتري' },
          { id: 'f42ef66f-8146-4703-9cf7-e7b9c37b28a2', title: 'تست گزارش ريليشن مولتي - سفارش' },
        ],
        tableName: 'processtest',
        tableRelationList: [
          { moduleName: 'webtest', moduleTableName: 'processtestdetail' },
          { moduleName: 'workflow', moduleTableName: 'processtaskexecutionhistory' },
        ],
      },
    ];

    const list = mergeTabDataWithSetting(
      customList,
      processList,
      defaultTabList,
      storedTabList,
      tableRelationList,
      reportRelationList,
      fileRelation,
      noteRelation,
    );
    expect(list).toStrictEqual(resultList);
  });

  test('Getting a number of objects and arrays of the input and returning an `array`. (defaultTabList / originalField)', () => {
    const processList = [
      { title: 'DefaultProcessTest2', uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad' },
      { uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4', title: 'DefaultProcessTest' },
    ];
    const defaultTabList = [
      {
        id: 5,
        moduleName: 'webtest',
        tableName: 'processtest',
        groupList: [
          {
            layout: [[null, { id: 47261, caption: 'HideField' }]],
          },
        ],
      },
    ];
    const storedTabList = [
      { id: 0, moduleName: 'webtest', title: 'ProcessTest' },
      { id: 1599908805733, translatedTitle: { fa: 'Hello World', en: 'New Tab', ar: 'قسم جديد' } },
    ];

    const resultList = [
      {
        fileRelation: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
        },
        groupList: [{ layout: [[null, null]] }],
        id: 5,
        moduleName: 'webtest',
        noteRelation: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
        },
        reportRelationList: [
          { id: '6edc4602-20be-4d7a-ba67-4338ff595820', title: 'تست گزارش ريليشن معمولي-مشتري' },
          { id: 'f42ef66f-8146-4703-9cf7-e7b9c37b28a2', title: 'تست گزارش ريليشن مولتي - سفارش' },
        ],
        tableName: 'processtest',
        tableRelationList: [
          { moduleName: 'webtest', moduleTableName: 'processtestdetail' },
          { moduleName: 'workflow', moduleTableName: 'processtaskexecutionhistory' },
        ],
      },
    ];

    const list = mergeTabDataWithSetting(
      customList,
      processList,
      defaultTabList,
      storedTabList,
      tableRelationList,
      reportRelationList,
      fileRelation,
      noteRelation,
    );
    expect(list).toStrictEqual(resultList);
  });

  test('Getting a number of objects and arrays of the input and returning an `array`. (storedTabList / clonedField :: originalField)', () => {
    const processList = null;
    const defaultTabList = [
      {
        id: 5,
        moduleName: 'webtest',
        tableName: 'processtest',
        // groupList: [
        //   {
        //     layout: [[null, { id: 47261, caption: 'HideField' }]],
        //   },
        // ],
      },
    ];
    const storedTabList = [
      {
        id: 0,
        moduleName: 'webtest',
        title: 'ProcessTest',
        groupList: [{ layout: [[{ id: 47261 }, { id: 47262 }]] }],
      },
      {
        id: 1599908805733,
        translatedTitle: { fa: 'Hello World', en: 'New Tab', ar: 'قسم جديد' },
        groupList: [{ layout: [[{ id: 47235 }, null]] }],
      },
    ];

    const resultList = [
      {
        fileRelation: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
        },
        groupList: [
          {
            layout: [
              [
                null,
                {
                  caption: 'شناسه ProcessTest',
                  disabled: true,
                  id: 47262,
                  tabId: 0,
                  tabTitle: 'ProcessTest',
                  translatedTabTitle: undefined,
                },
              ],
            ],
          },
        ],
        id: 0,
        moduleName: 'webtest',
        noteRelation: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
        },
        reportRelationList: [
          { id: '6edc4602-20be-4d7a-ba67-4338ff595820', title: 'تست گزارش ريليشن معمولي-مشتري' },
          { id: 'f42ef66f-8146-4703-9cf7-e7b9c37b28a2', title: 'تست گزارش ريليشن مولتي - سفارش' },
        ],
        tableRelationList: [
          { moduleName: 'webtest', moduleTableName: 'processtestdetail' },
          { moduleName: 'workflow', moduleTableName: 'processtaskexecutionhistory' },
        ],
        title: 'ProcessTest',
      },
      {
        fileRelation: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
        },
        groupList: [{ layout: [[null, null]] }],
        id: 1599908805733,
        noteRelation: {
          moduleName: 'crm',
          moduleTableName: 'accounts_notes',
          moduleTableTitle: 'یادداشت ها',
        },
        reportRelationList: [
          { id: '6edc4602-20be-4d7a-ba67-4338ff595820', title: 'تست گزارش ريليشن معمولي-مشتري' },
          { id: 'f42ef66f-8146-4703-9cf7-e7b9c37b28a2', title: 'تست گزارش ريليشن مولتي - سفارش' },
        ],
        tableRelationList: [
          { moduleName: 'webtest', moduleTableName: 'processtestdetail' },
          { moduleName: 'workflow', moduleTableName: 'processtaskexecutionhistory' },
        ],
        translatedTitle: { ar: 'قسم جديد', en: 'New Tab', fa: 'Hello World' },
      },
    ];
    const list = mergeTabDataWithSetting(
      customList,
      processList,
      defaultTabList,
      storedTabList,
      tableRelationList,
      reportRelationList,
      fileRelation,
      noteRelation,
    );
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get primary field', () => {
  test('List is `empty object` of the input and returns `null`', () => {
    const list = getPrimaryField({});
    expect(list).toStrictEqual(null);
  });

  test('List is `null` of the input and returns `null`', () => {
    const list = getPrimaryField(null);
    expect(list).toStrictEqual(null);
  });

  test('List is `undefined` of the input and returns `null`', () => {
    const list = getPrimaryField(undefined);
    expect(list).toStrictEqual(null);
  });

  test('List.fields has no value of the input and returning null', () => {
    const list = getPrimaryField({ fields: {} });
    expect(list).toStrictEqual(null);
  });

  test('List.config has no value of the input and returning null', () => {
    const list = getPrimaryField({ config: {} });
    expect(list).toStrictEqual(null);
  });

  test('Getting correct the list of the input and returning an object', () => {
    const customList = {
      fields: {
        3168: { id: 3168, caption: 'شناسه حساب ' },
        3169: { id: 3169, caption: 'حذف شده' },
      },
      config: { primaryField: 3168 },
    };
    const list = getPrimaryField(customList);
    expect(list).toStrictEqual({ id: 3168, caption: 'شناسه حساب ' });
  });
});

describe('Is record editable', () => {
  const customList = {
    fields: {
      3168: { id: 3168, caption: 'شناسه حساب ' },
      3169: { id: 3169, caption: 'حذف شده' },
    },
    processes: [
      {
        uniqueId: 'b240b55e-3bfb-4efc-8904-0ca8f0603623',
        title: 'خريد مستقيم - دي مارت',
        tasks: [{ allowEdit: false, stateId: 15, positionId: 7 }],
      },
    ],
  };
  const record = {
    __processuniqueid: 'b240b55e-3bfb-4efc-8904-0ca8f0603623',
    positionid: 7,
    stateid: 15,
  };

  test('Getting the `empty record` of the input and returning `false`', () => {
    const list = isRecordEditable(customList, {});
    expect(list).toStrictEqual(false);
  });

  test('Getting `incomplete record` of the input and returning `false`', () => {
    const incompleteRecord = { iseditable: null };
    const list = isRecordEditable(customList, incompleteRecord);
    expect(list).toStrictEqual(false);
  });

  test('Getting the `list` and `record` of the input and returning `false`', () => {
    const list = isRecordEditable(customList, record);
    expect(list).toStrictEqual(false);
  });
});

describe('Get report children', () => {
  test('Getting the `list.child` and `locale` of the input and returning an `array`', () => {
    const customList = {
      childs: [
        { reportId: '34c4038b-04a8-47bd-82c6-0ef97bc76343', title: 'شعب' },
        { reportId: '21c74f60-a327-445a-b59b-59de8d72887f', title: 'فاكتورهاي خريد' },
        { reportId: '92d25872-2929-4f74-bc54-07db5b1fafd5', title: 'برند' },
      ],
    };
    const resultList = [
      {
        title: null,
        childResource: 'report/34c4038b-04a8-47bd-82c6-0ef97bc76343',
      },
      {
        title: null,
        childResource: 'report/21c74f60-a327-445a-b59b-59de8d72887f',
      },
      {
        title: null,
        childResource: 'report/92d25872-2929-4f74-bc54-07db5b1fafd5',
      },
    ];

    const list = getReportChildren(customList, 'fa');
    expect(list).toStrictEqual(resultList);
  });

  test('Getting the `list.tabsColumns` and `locale` of the input and returning an `array`', () => {
    const customList = {
      id: '2b5d3a56-822d-48e8-aaa9-700ca85ac015',
      translatedTitle: { fa: 'حساب دفاتر', en: 'حساب دفاتر', ar: 'حساب دفاتر' },
      tabsColumns: {
        table: [
          { relatedName: 'row_num', name: 'row_num', caption: 'row_num' },
          { relatedName: 'itemdategr', name: 'itemdategr', caption: 'ItemDateGr' },
          { relatedName: 'itemdesc', name: 'itemdesc', caption: 'شرح' },
        ],
      },
    };
    const resultList = [
      {
        title: 'حساب دفاتر - 1',
        childResource: 'report/2b5d3a56-822d-48e8-aaa9-700ca85ac015/0',
      },
    ];

    const list = getReportChildren(customList, 'fa');
    expect(list).toStrictEqual(resultList);
  });

  test('Getting the `incorrect list` and `locale` of the input and returning an `empty array`', () => {
    const customList = {
      id: '2b5d3a56-822d-48e8-aaa9-700ca85ac015',
      translatedTitle: { fa: 'حساب دفاتر', en: 'حساب دفاتر', ar: 'حساب دفاتر' },
    };

    const list = getReportChildren(customList, 'fa');
    expect(list).toStrictEqual([]);
  });
});

describe('Is report executable', () => {
  test('Getting the `list` of the input and returning `boolean`', () => {
    const list = isReportExecutable({ executable: false });
    expect(list).toStrictEqual(false);
  });
});

describe('Get grouping columns', () => {
  test('The input is an `empty array` and returning an `empty array`', () => {
    const list = getGroupingColumns([]);
    expect(list).toStrictEqual([]);
  });

  test('The input is `null` and returning an `empty array`', () => {
    const list = getGroupingColumns(null);
    expect(list).toStrictEqual([]);
  });

  test('The input is `undefined` and returning an `empty array`', () => {
    const list = getGroupingColumns(undefined);
    expect(list).toStrictEqual([]);
  });

  test('The input is not array and returning an `empty array`', () => {
    const list = getGroupingColumns(65465);
    expect(list).toStrictEqual([]);
  });

  test('Getting the array of the input and returning an `array`', () => {
    const customList = [
      { id: 3212, groupingPriority: 5 },
      { id: 4689, groupingPriority: 1 },
      { id: 4625, groupingPriority: 4 },
      { id: 5828, groupingPriority: 6 },
      { id: 4626, groupingPriority: 3 },
    ];
    const resultList = [
      { id: 4689, groupingPriority: 1 },
      { id: 4626, groupingPriority: 3 },
      { id: 4625, groupingPriority: 4 },
      { id: 3212, groupingPriority: 5 },
      { id: 5828, groupingPriority: 6 },
    ];
    const list = getGroupingColumns(customList);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get default sort', () => {
  test('Meta is `empty object` and returns `undefined`', () => {
    const list = getDefaultSort({});
    expect(list).toStrictEqual(undefined);
  });

  test('Meta is `null` and returns `undefined`', () => {
    const list = getDefaultSort(null);
    expect(list).toStrictEqual(undefined);
  });

  test('Meta is `undefined` and returns `undefined`', () => {
    const list = getDefaultSort(undefined);
    expect(list).toStrictEqual(undefined);
  });

  test('Getting the `report.Id` and `non-empty sortType` of the input and returning an `object`', () => {
    const meta = {
      reportId: 29964,
      columns: [
        { relatedName: 'refnum', sortType: null },
        { relatedName: 'paymentreceipt_id', sortType: null },
        { relatedName: 'accountnumber', sortType: 'ASC' },
      ],
    };
    const list = getDefaultSort(meta);
    expect(list).toStrictEqual({ field: 'accountnumber', order: 'ASC' });
  });

  test('Getting the `report.Id` and `null sortType` of the input and returning an `object`', () => {
    const meta = {
      reportId: 29964,
      columns: [
        { relatedName: 'refnum', sortType: null },
        { relatedName: 'paymentreceipt_id', sortType: null },
        { relatedName: 'accountnumber', sortType: null },
      ],
    };
    const list = getDefaultSort(meta);
    expect(list).toStrictEqual({ field: 'refnum', order: 'DESC' });
  });

  test('There is no `report.Id` and `config` has value of the input and returning an `object`', () => {
    const meta = {
      columns: [
        { relatedName: 'refnum', sortType: 'ASC' },
        { relatedName: 'paymentreceipt_id', sortType: null },
        { relatedName: 'accountnumber', sortType: 'DESC' },
      ],
      fields: {
        3856: { id: 3856, relatedName: 'refnum', sortType: null },
        3857: { id: 3857, relatedName: 'paymentreceipt_id', sortType: 'ASC' },
        3858: { id: 3858, relatedName: 'accountnumber', sortType: 'DESC' },
      },
      config: {
        sort: { fieldName: 'createdate', type: 'desc', allowChangingRowOrder: false },
      },
    };
    const list = getDefaultSort(meta);
    expect(list).toStrictEqual({ field: 'createdate', order: 'desc' });
  });

  test('There is no `report.Id` and `fieldFound` has no value of the input and returning an `object`', () => {
    const meta = {
      columns: [
        { relatedName: 'refnum', sortType: 'ASC' },
        { relatedName: 'paymentreceipt_id', sortType: null },
        { relatedName: 'accountnumber', sortType: 'DESC' },
      ],
      fields: {
        3856: { id: 3856, relatedName: 'refnum', sortType: null },
        3857: { id: 3857, relatedName: 'paymentreceipt_id', sortType: null },
        3858: { id: 3858, relatedName: 'accountnumber', sortType: null },
      },
      gridColumns: [3856, 9549, 3891],
    };
    const list = getDefaultSort(meta);
    expect(list).toStrictEqual({ field: 'refnum', order: 'DESC' });
  });
});

describe('Is single record table', () => {
  test('Getting the list of the input and returning an object', () => {
    const customList = {
      config: { hasOneRow: false },
    };
    const list = isSingleRecordTable(customList);
    expect(list).toStrictEqual(false);
  });
});

describe('Get is row reorder enabled', () => {
  test('Get `empty object` in input and returns `null`', () => {
    const list = getIsRowReOrderEnabled({});
    expect(list).toStrictEqual(null);
  });

  test('Get `undefined` list in input and returns `null`', () => {
    const list = getIsRowReOrderEnabled(undefined);
    expect(list).toStrictEqual(null);
  });

  test('Get `null` list in input and returns `null`', () => {
    const list = getIsRowReOrderEnabled(null);
    expect(list).toStrictEqual(null);
  });

  test('Getting the list of the input and returning an object', () => {
    const customList = {
      config: {
        sort: { fieldName: 'createdate', type: 'desc', allowChangingRowOrder: true },
      },
    };
    const list = getIsRowReOrderEnabled(customList);
    expect(list).toStrictEqual(true);
  });
});

describe('Get field by name', () => {
  const customList = {
    fields: {
      35589: { id: 35589, name: 'listmember_id' },
      35590: { id: 35590, name: 'personinfo_id' },
      35591: { id: 35591, name: 'iseditable' },
    },
  };
  const fieldName = 'personinfo_id';

  test('Get `empty object` in input and returns `null`', () => {
    const list = getFieldByName({}, fieldName);
    expect(list).toStrictEqual(null);
  });

  test('Get `undefined` list in input and returns `null`', () => {
    const list = getFieldByName(undefined, fieldName);
    expect(list).toStrictEqual(null);
  });

  test('Get `null` list in input and returns `null`', () => {
    const list = getFieldByName(null, fieldName);
    expect(list).toStrictEqual(null);
  });

  test('Getting the list and fieldName of the input and returning an object', () => {
    const list = getFieldByName(customList, fieldName);
    expect(list).toStrictEqual({ id: 35590, name: 'personinfo_id' });
  });
});

describe('Get default report sort', () => {
  const reportId = '6dc40db4-c64d-49e3-9ddf-c4ad18d17ab4';

  test('Get `empty object and reportId` in input and returning `undefined`', () => {
    const list = getDefaultReportSort({}, '');
    expect(list).toStrictEqual(undefined);
  });

  test('Get `undefined` list in input and returning `undefined`', () => {
    const list = getDefaultReportSort(undefined, undefined);
    expect(list).toStrictEqual(undefined);
  });

  test('Get `null` list in input and returning `undefined`', () => {
    const list = getDefaultReportSort(null, null);
    expect(list).toStrictEqual(undefined);
  });

  test('There is the`report` of the input and returning an `object`', () => {
    const customMeta = {
      reports: [
        {
          id: '6dc40db4-c64d-49e3-9ddf-c4ad18d17ab4',
          columns: [
            { sortType: null, relatedName: 94109 },
            { sortType: 'DESC', relatedName: 94107 },
          ],
        },
      ],
    };
    const resultList = { field: '94107', order: 'DESC' };

    const list = getDefaultReportSort(customMeta, reportId);
    expect(list).toStrictEqual(resultList);
  });

  test('There is no the`report` of the input and returning an `object`', () => {
    const customMeta = {
      reports: [
        {
          id: '6dc40db4-c64d-49e3-9ddf-c4ad18d17ab4',
          columns: [
            { sortType: null, relatedName: 94109 },
            { sortType: null, relatedName: 94107 },
          ],
        },
      ],
    };
    const resultList = { field: '94109', order: 'DESC' };

    const list = getDefaultReportSort(customMeta, reportId);
    expect(list).toStrictEqual(resultList);
  });

  test('Getting incorrect the meta of the input and returning `undefined`', () => {
    const customMeta = {
      reports: [
        {
          id: '6dc40db4-c64d-49e3-9ddf-c4ad18d17ab4',
          columns: [],
        },
      ],
    };
    const list = getDefaultReportSort(customMeta, reportId);
    expect(list).toStrictEqual(undefined);
  });
});

describe('Prepare report filter', () => {
  test('Get `empty object and record` in input and returning `undefined`', () => {
    const list = prepareReportFilter({}, {});
    expect(list).toStrictEqual(undefined);
  });

  test('Get `undefined` list and record in input and returning `undefined`', () => {
    const list = prepareReportFilter(undefined, undefined);
    expect(list).toStrictEqual(undefined);
  });

  test('Get `null` list and record in input and returning `undefined`', () => {
    const list = prepareReportFilter(null, null);
    expect(list).toStrictEqual(undefined);
  });

  test('Getting the `meta` and `record` of the input and returning an array', () => {
    const customMeta = {
      parameters: [
        {
          key: 'fltr9465',
          onlyEqualCondition: false,
          field: { name: 'purchaseinvoiceId' },
          defaultOperator: 'Empty',
        },
        {
          key: 'mainaccountId',
          onlyEqualCondition: true,
          field: { name: 'purchaseinvoiceId' },
          defaultOperator: 'Empty',
        },
        {
          key: 'picontractId',
          onlyEqualCondition: false,
          field: { name: 'picontractId' },
          defaultOperator: '=',
        },
      ],
    };
    const record = { mainaccountId: 101, purchaseinvoiceId: 1098000293, picontractId: null };
    const resultList = [
      ['fltr9465', 'equal', 1098000293],
      ['mainaccountId', 'equal', 1098000293],
      ['picontractId', '=', null],
    ];

    const list = prepareReportFilter(customMeta, record);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Get relation permission from process task', () => {
  const meta = {
    processes: [
      {
        title: 'DefaultProcessTest2',
        uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [{ moduleName: 'webtest', moduleTableName: 'processtestdetail' }],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
      {
        title: 'DefaultProcessTest',
        uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [
              {
                moduleName: 'webtest',
                moduleTableName: 'processtestdetail',
                disableAdd: true,
                disableDelete: true,
              },
            ],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
    ],
  };
  const record = {
    __processuniqueid: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
    positionid: 1,
    stateid: 6,
  };
  const moduleName = 'webtest';
  const moduleTableName = 'processtestdetail';

  test('Getting the `empty Meta` of the input and returning `null`', () => {
    const list = getRelationPermissionFromProcessTask({}, record, moduleName, moduleTableName);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `empty Record` of the input and returning `null`', () => {
    const list = getRelationPermissionFromProcessTask(meta, {}, moduleName, moduleTableName);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `empty moduleName` of the input and returning `null`', () => {
    const list = getRelationPermissionFromProcessTask(meta, record, '', moduleTableName);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `empty moduleTableName` of the input and returning `null`', () => {
    const list = getRelationPermissionFromProcessTask(meta, record, moduleName, '');
    expect(list).toStrictEqual(null);
  });

  test('Getting `Incomplete inputs` and returning `null`', () => {
    const customRecord = {
      __processuniqueid: 'ecec1b1e-f555-4ba1-bb1a-8a73f62555a4',
      positionid: 12,
      stateid: 8,
    };
    const list = getRelationPermissionFromProcessTask(
      meta,
      customRecord,
      moduleName,
      moduleTableName,
    );
    expect(list).toStrictEqual(null);
  });

  test('Getting the `meta`, `record`,`moduleName`,`moduleTableName` of the input and returning an object', () => {
    const resultList = {
      moduleName: 'webtest',
      moduleTableName: 'processtestdetail',
      disableAdd: true,
      disableDelete: true,
    };
    const list = getRelationPermissionFromProcessTask(meta, record, moduleName, moduleTableName);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Is relation create enabled', () => {
  const meta = {
    processes: [
      {
        title: 'DefaultProcessTest2',
        uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [{ moduleName: 'webtest', moduleTableName: 'processtestdetail' }],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
      {
        title: 'DefaultProcessTest',
        uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [
              {
                moduleName: 'webtest',
                moduleTableName: 'processtestdetail',
                disableAdd: true,
                disableDelete: true,
              },
            ],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
    ],
  };
  const record = {
    __processuniqueid: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
    positionid: 1,
    stateid: 6,
  };
  const moduleName = 'webtest';
  const moduleTableName = 'processtestdetail';

  test('Getting the `meta`, `record`,`moduleName`,`moduleTableName` of the input and returning a boolean', () => {
    const list = isRelationCreateEnabled(meta, record, moduleName, moduleTableName);
    expect(list).toStrictEqual(false);
  });

  test('Getting `Incomplete inputs` and returning `null`', () => {
    const customRecord = {
      __processuniqueid: 'ecec1b1e-f555-4ba1-bb1a-8a73f62555a4',
      positionid: 12,
      stateid: 8,
    };
    const list = isRelationCreateEnabled(meta, customRecord, moduleName, moduleTableName);
    expect(list).toStrictEqual(null);
  });
});

describe('Is relation edit enabled', () => {
  const meta = {
    processes: [
      {
        title: 'DefaultProcessTest2',
        uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [{ moduleName: 'webtest', moduleTableName: 'processtestdetail' }],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
      {
        title: 'DefaultProcessTest',
        uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [
              {
                moduleName: 'webtest',
                moduleTableName: 'processtestdetail',
                deActiveFields: null,
                disableAdd: true,
                disableDelete: true,
                disableEdit: true,
              },
            ],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
    ],
  };
  const record = {
    __processuniqueid: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
    positionid: 1,
    stateid: 6,
  };
  const moduleName = 'webtest';
  const moduleTableName = 'processtestdetail';

  test('Getting the `meta`, `record`,`moduleName`,`moduleTableName` of the input and returning a boolean', () => {
    const list = isRelationEditEnabled(meta, record, moduleName, moduleTableName);
    expect(list).toStrictEqual(false);
  });

  test('Getting `Incomplete inputs` and returning `null`', () => {
    const customRecord = {
      __processuniqueid: 'ecec1b1e-f555-4ba1-bb1a-8a73f62555a4',
      positionid: 12,
      stateid: 8,
    };
    const list = isRelationEditEnabled(meta, customRecord, moduleName, moduleTableName);
    expect(list).toStrictEqual(null);
  });
});

describe('Is relation delete enabled', () => {
  const meta = {
    processes: [
      {
        title: 'DefaultProcessTest2',
        uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [{ moduleName: 'webtest', moduleTableName: 'processtestdetail' }],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
      {
        title: 'DefaultProcessTest',
        uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [
              {
                moduleName: 'webtest',
                moduleTableName: 'processtestdetail',
                deActiveFields: null,
                disableAdd: true,
                disableDelete: true,
                disableEdit: true,
              },
            ],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
    ],
  };
  const record = {
    __processuniqueid: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
    positionid: 1,
    stateid: 6,
  };
  const moduleName = 'webtest';
  const moduleTableName = 'processtestdetail';

  test('Getting the `meta`, `record`,`moduleName`,`moduleTableName` of the input and returning a boolean', () => {
    const list = isRelationDeleteEnabled(meta, record, moduleName, moduleTableName);
    expect(list).toStrictEqual(false);
  });

  test('Getting `Incomplete inputs` and returning `null`', () => {
    const customRecord = {
      __processuniqueid: 'ecec1b1e-f555-4ba1-bb1a-8a73f62555a4',
      positionid: 12,
      stateid: 8,
    };
    const list = isRelationDeleteEnabled(meta, customRecord, moduleName, moduleTableName);
    expect(list).toStrictEqual(null);
  });
});

describe('Get relation disabled fields', () => {
  const meta = {
    processes: [
      {
        title: 'DefaultProcessTest2',
        uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [{ moduleName: 'webtest', moduleTableName: 'processtestdetail' }],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
      {
        title: 'DefaultProcessTest',
        uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
        tasks: [
          { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
          { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
          {
            title: 'Hide',
            positionId: 1,
            stateId: 6,
            deactiveSubpanels: [
              {
                moduleName: 'webtest',
                moduleTableName: 'processtestdetail',
                deActiveFields: null,
                disableAdd: true,
                disableDelete: true,
                disableEdit: true,
              },
            ],
          },
          { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
        ],
      },
    ],
  };
  const record = {
    __processuniqueid: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
    positionid: 1,
    stateid: 6,
  };
  const moduleName = 'webtest';
  const moduleTableName = 'processtestdetail';

  test('Getting `Incomplete inputs`(empty relInfo) and returning `null`', () => {
    const customRecord = {
      __processuniqueid: 'ecec1b1e-f555-4ba1-bb1a-8a73f62555a4',
      positionid: 12,
      stateid: 8,
    };
    const list = getRelationDisabledFields(meta, customRecord, moduleName, moduleTableName);
    expect(list).toStrictEqual(null);
  });

  test('Getting `Incomplete inputs`(empty relInfo.deActiveFields) and returning `null`', () => {
    const list = getRelationDisabledFields(meta, record, moduleName, moduleTableName);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `meta`, `record`,`moduleName`,`moduleTableName` of the input and returning an object', () => {
    const customMeta = {
      processes: [
        {
          title: 'DefaultProcessTest2',
          uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
          tasks: [
            { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
            { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
            {
              title: 'Hide',
              positionId: 1,
              stateId: 6,
              deactiveSubpanels: [{ moduleName: 'webtest', moduleTableName: 'processtestdetail' }],
            },
            { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
          ],
        },
        {
          title: 'DefaultProcessTest',
          uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
          tasks: [
            { title: 'شروع', positionId: 1, stateId: 1, deactiveSubpanels: [] },
            { title: 'پايان', positionId: 2, stateId: 2, deactiveSubpanels: [] },
            {
              title: 'Hide',
              positionId: 1,
              stateId: 6,
              deactiveSubpanels: [
                {
                  moduleName: 'webtest',
                  moduleTableName: 'processtestdetail',
                  deActiveFields: [47273, 47272],
                  disableAdd: true,
                  disableDelete: true,
                  disableEdit: true,
                },
              ],
            },
            { title: 'mandatory', positionId: 1, stateId: 4, deactiveSubpanels: [] },
          ],
        },
      ],
    };

    const list = getRelationDisabledFields(customMeta, record, moduleName, moduleTableName);
    expect(list).toStrictEqual({ '47272': true, '47273': true });
  });
});

describe('Get dropDown list from state', () => {
  const type = 'uiEnable';
  const state = {
    dropdown: {
      555: [
        {
          personinfoId: 1017,
          fullnamewithid: 'کوه پيکر محمدعلي (1017)',
          id: 1017,
          title: 'کوه پيکر محمدعلي (1017)',
        },
        {
          personinfoId: 181,
          fullnamewithid: 'کنترل کيفيت بيوتال غلامرضا (181)',
          id: 181,
          title: 'کنترل کيفيت بيوتال غلامرضا (181)',
        },
        {
          personinfoId: 8041,
          fullnamewithid: 'کمالي سارا (8041)',
          id: 8041,
          title: 'کمالي سارا (8041)',
        },
      ],
    },
  };
  const metaData = {
    fields: {
      14237: { name: 'salaryloanlist_id', dropdown: { id: 555 } },
    },
  };
  const field = {
    uiEnable: [['salaryloanlist_id', 'isincreasing', 'value=false']],
  };

  test('Getting the `field`, `type`,`state` and `metaData` of the input and returning an `array`', () => {
    const resultList = [
      {
        personinfoId: 1017,
        fullnamewithid: 'کوه پيکر محمدعلي (1017)',
        id: 1017,
        title: 'کوه پيکر محمدعلي (1017)',
      },
      {
        personinfoId: 181,
        fullnamewithid: 'کنترل کيفيت بيوتال غلامرضا (181)',
        id: 181,
        title: 'کنترل کيفيت بيوتال غلامرضا (181)',
      },
      {
        personinfoId: 8041,
        fullnamewithid: 'کمالي سارا (8041)',
        id: 8041,
        title: 'کمالي سارا (8041)',
      },
    ];
    const list = getDropDownListFromState(field, type, state, metaData);
    expect(list).toStrictEqual(resultList);
  });

  test('getDropDownListFromState when meta list is empty (cannot find drop id)', () => {
    const list = getDropDownListFromState(field, type, state, {});
    expect(list).toStrictEqual(null);
  });

  test('getDropDownListFromState when state list is empty (cannot find drop in state)', () => {
    const list = getDropDownListFromState(field, type, {}, metaData);
    expect(list).toStrictEqual(null);
  });
});

describe('Field file list', () => {
  test('`Empty fields` in input and returns `undefined`', () => {
    const list = fieldFileList({});
    expect(list).toStrictEqual(undefined);
  });

  test('`Undefined fields` in input and returns `undefined`', () => {
    const list = fieldFileList(undefined);
    expect(list).toStrictEqual(undefined);
  });

  test('`Null fields` in input and returns `undefined`', () => {
    const list = fieldFileList(null);
    expect(list).toStrictEqual(undefined);
  });

  test('Getting the fields of the input and returning an array', () => {
    const fields = {
      3168: { dataType: { simple: 'file' }, caption: 'شناسه حساب ', id: 3168 },
      3169: { dataType: { simple: 'boolean' }, caption: 'حذف شده', id: 3169 },
    };
    const resultList = [{ dataType: { simple: 'file' }, caption: 'شناسه حساب ', id: 3168 }];

    const list = fieldFileList(fields);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Prepare shift process', () => {
  const uniqueId = 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4';
  const metaData = {
    processes: [
      {
        uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
        tasks: [
          { isTransferable: false },
          { isTransferable: false },
          { isTransferable: true, title: 'Hide' },
        ],
      },
      {
        uniqueId: 'e0249161-d7be-4efb-b2d0-0eafb6b68cad',
        tasks: [
          { isTransferable: true, title: 'شروع' },
          { isTransferable: false },
          { isTransferable: false },
        ],
      },
    ],
  };

  test('`Empty metaData` in input and returns `null`', () => {
    const list = prepareShiftProcess({}, uniqueId);
    expect(list).toStrictEqual(null);
  });

  test('`Undefined metaData` in input and returns `null`', () => {
    const list = prepareShiftProcess(undefined, uniqueId);
    expect(list).toStrictEqual(null);
  });

  test('`Null metaData` in input and returns `null`', () => {
    const list = prepareShiftProcess(null, uniqueId);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `incomplete metaData and uniqueId` (empty process) of the input and returning `null`', () => {
    const customUniqueId = 'ecec1b1e-f934-4ba1-bb1a-8a55f55555a4';
    const list = prepareShiftProcess(metaData, customUniqueId);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `incomplete metaData and uniqueId` (empty process.task) of the input and returning `null`', () => {
    const customMetaData = {
      processes: [
        {
          uniqueId: 'ecec1b1e-f934-4ba1-bb1a-8a73f62582a4',
          tasks: [],
        },
      ],
    };
    const list = prepareShiftProcess(customMetaData, uniqueId);
    expect(list).toStrictEqual(null);
  });

  test('Getting the `metaData` and `uniqueId` of the input and returning an array', () => {
    const resultList = [{ isTransferable: true, title: 'Hide' }];
    const list = prepareShiftProcess(metaData, uniqueId);
    expect(list).toStrictEqual(resultList);
  });
});

describe('Is tree has delete', () => {
  test('Getting the `meta` of the input and returning a boolean', () => {
    const meta = {
      config: { allowDelete: true, caption: 'تست کدينگ' },
    };
    const list = isTreeHasDelete(meta);
    expect(list).toStrictEqual(true);
  });
});

describe('Call getMaxMinOfRow ', () => {
  test('Get maxRow of Array', () => {
    const fieldsLayout = [
      {
        rowIndex: 4,
        rowSpan: null,
      },
      {
        rowIndex: 4,
        rowSpan: 2,
      },
      {
        rowIndex: 0,
        rowSpan: 2,
      },
      {
        rowIndex: 2,
        rowSpan: null,
      },
    ];

    const maxRow = getMaxMinOfRow(fieldsLayout);

    expect(maxRow).toBe(5);
  });
});

describe('Create empty layout', () => {
  test('set max row and create empty layout', () => {
    const expectedArray = [
      ['empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty'],
    ];
    const createdEmptyLayout = createEmptyLayout(5, 3);
    expect(createdEmptyLayout).toStrictEqual(expectedArray);
  });

  test('set max row and create empty layout with different params', () => {
    const expectedArray = [
      ['empty', 'empty'],
      ['empty', 'empty'],
      ['empty', 'empty'],
      ['empty', 'empty'],
    ];
    const createdEmptyLayout = createEmptyLayout(3, 2);
    expect(createdEmptyLayout).toStrictEqual(expectedArray);
  });
});

describe('Create layout', () => {
  test('set wrong param and get empty array', () => {
    expect(createLayout()).toStrictEqual([]);
  });

  test('set `[]` as param and get empty array', () => {
    expect(createLayout([])).toStrictEqual([]);
  });

  test('set empty objec as fieldSet and get empty array', () => {
    const fieldsLayout = [
      {
        rowIndex: 4,
        rowSpan: null,
      },
      {
        rowIndex: 4,
        rowSpan: 2,
      },
      {
        rowIndex: 0,
        rowSpan: 2,
      },
    ];
    expect(createLayout(fieldsLayout, 2, {})).toStrictEqual([]);
  });

  test('set fieldsLayout and prepared layout', () => {
    const fieldsLayout = [
      {
        columnIndex: 0,
        fieldId: 49469,
        rowIndex: 4,
        colSpan: 2,
        rowSpan: null,
      },
      {
        columnIndex: 2,
        fieldId: 49468,
        rowIndex: 4,
        colSpan: null,
        rowSpan: 2,
      },
      {
        columnIndex: 0,
        fieldId: 49466,
        rowIndex: 0,
        colSpan: 2,
        rowSpan: 2,
      },
      {
        columnIndex: 0,
        fieldId: 49465,
        rowIndex: 2,
        colSpan: 3,
        rowSpan: null,
      },
    ];

    const feildSet = {
      49469: { id: 49469, name: 'test' },
      49468: { id: 49468, name: 'test2' },
      49466: { id: 49466, name: 'test3' },
      49465: { id: 49465, name: 'test4' },
    };

    const expectedLayout = [
      [{ id: 49466, name: 'test3', colSpan: 2, rowSpan: 2 }, null, 'empty'],
      [null, null, 'empty'],
      [{ id: 49465, name: 'test4', colSpan: 3, rowSpan: null }, null, null],
      ['empty', 'empty', 'empty'],
      [
        { id: 49469, name: 'test', colSpan: 2, rowSpan: null },
        null,
        { id: 49468, name: 'test2', colSpan: null, rowSpan: 2 },
      ],
      ['empty', 'empty', null],
    ];
    expect(createLayout(fieldsLayout, 3, feildSet)).toStrictEqual(expectedLayout);
  });
});

describe('Check permission', () => {
  const relationMeta = {
    config: {
      allowAdd: false,
    },
  };
  test('run checkPermission with true `permissionType` and get `true`', () => {
    expect(checkPermission(true, relationMeta, 'allowAdd')).toEqual(true);
  });

  test('run checkPermission with false `permissionType` and get `false`', () => {
    expect(checkPermission(false, relationMeta, 'allowAdd')).toEqual(false);
  });

  describe('null permissionType', () => {
    test('run checkPermission with null `permissionType` and get `true`', () => {
      const relationMeta = {
        config: {
          allowAdd: true,
        },
      };
      expect(checkPermission(null, relationMeta, 'allowAdd')).toEqual(true);
    });

    test('run checkPermission with null `permissionType` and get `false`', () => {
      const relationMeta = {
        config: {
          allowAdd: false,
        },
      };
      expect(checkPermission(null, relationMeta, 'allowAdd')).toEqual(false);
    });
  });

  describe('null relationMeta', () => {
    test('run checkPermission with null relationMeta and get `true`', () => {
      const relationMeta = {};
      expect(checkPermission(null, relationMeta, 'allowAdd')).toEqual(true);
    });
  });
});

describe('Prepared relation permission', () => {
  const record = {
    __processuniqueid: null,
    positionid: null,
    stateid: null,
  };

  const relation = {
    childFieldName: 'order_id',
    moduleName: 'webtest',
    moduleTableName: 'orderdetail',
    moduleTableTitle: 'OrderDetail',
    parentFieldName: 'order_id',
    priority: 0,
    relationFieldName: 'webtest/orderdetail',
    showWithMainTable: true,
  };

  const metaData = {
    processes: [],
  };

  const relationMetaData = {
    config: {
      allowAdd: true,
      allowDelete: false,
      allowEdit: true,
      allowExport: true,
    },
  };
  test('call preparedRelationPermission function', () => {
    const expectedPermission = {
      disabledFieldList: null,
      hasCreate: true,
      hasDelete: false,
      hasEdit: true,
    };
    expect(preparedRelationPermission(metaData, record, relation, relationMetaData)).toStrictEqual(
      expectedPermission,
    );
  });

  test('call preparedRelationPermission with null relation', () => {
    const expectedPermission = {
      disabledFieldList: null,
      hasCreate: true,
      hasDelete: true,
      hasEdit: true,
    };
    expect(preparedRelationPermission(metaData, record, null, relationMetaData)).toStrictEqual(
      expectedPermission,
    );
  });
});

describe('run `getParameterName`', () => {
  test('run `getParameterName` with null', () => {
    const name = getParameterName(null);
    expect(name).toEqual(undefined);
  });

  test('run `getParameterName` with undefined', () => {
    const name = getParameterName(undefined);
    expect(name).toEqual(undefined);
  });

  test('run `getParameterName` with empty object', () => {
    const name = getParameterName({});
    expect(name).toEqual(undefined);
  });

  test('run `getParameterName` with `relatedParameterName`', () => {
    const field = {
      id: 1,
      name: 'name',
      relatedParameterName: 'relatedParameterName',
      relatedName: 'relatedName',
    };
    const name = getParameterName(field);
    expect(name).toEqual('relatedParameterName');
  });

  test('run `getParameterName` with `relatedName`', () => {
    const field = {
      id: 1,
      name: 'name',
      relatedName: 'relatedName',
    };
    const name = getParameterName(field);
    expect(name).toEqual('relatedName');
  });
  test('run `getParameterName` with `name`', () => {
    const field = {
      id: 1,
      name: 'name',
    };
    const name = getParameterName(field);
    expect(name).toEqual('name');
  });
});
