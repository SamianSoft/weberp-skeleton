import {
  getTodoSharedListMemberPatternInfo,
  getListMemberPatternInfo,
  getCategoryPatternInfo,
  getSellinListPatternInfo,
  getSellinBasketPattern,
  getSellinShowPatternInfo,
  getSellinHistoryOrderPatternInfo,
  getSellinHistoryOrderDetailPatternInfo,
  getSellinBasketFinalizePatternInfo,
  getTodoListPatternInfo,
  getTodoTaskDetailsPatternInfo,
  getTodoTaskStepPatternInfo,
  getAdvertisementPatternInfo,
  getSellinSearchPatternInfo,
  getSellinBarcodePatternInfo,
  getTodoDateRepeatTypeDropdownPatternInfo,
} from '../../helper/PatternMetaHelper';

const checkErrorPattern = (resource, objectiveFunction, errorMessage) => {
  const patternFunction = () => {
    objectiveFunction(resource);
  };
  expect(patternFunction).toThrowError(errorMessage);
};

const checkPatternWithResult = (resource, result, objectiveFunction) => {
  const test = objectiveFunction(resource);
  expect(test).toStrictEqual(result);
};

describe('Get todo shared list member pattern info', () => {
  const correctResource = 'report/ec0884b8-d321-4eab-a0e1-1cd19b8f9921';
  const result = {
    createUserId: 'createuserid',
    listId: 'list_id',
    personId: 'personinfo_id',
    name: 'fullname',
    listMemberId: 'listmember_id',
  };

  test('Check the source of `TodoSharedListMember` for `failure` mode', () => {
    checkErrorPattern(null, getTodoSharedListMemberPatternInfo, `Resource "null" is not defined!`);
    checkErrorPattern(
      'test',
      getTodoSharedListMemberPatternInfo,
      `Resource "test" is not defined!`,
    );
    checkErrorPattern(123, getTodoSharedListMemberPatternInfo, `Resource "123" is not defined!`);
    checkErrorPattern({}, getTodoSharedListMemberPatternInfo, `Resource "${{}}" is not defined!`);
    checkErrorPattern([], getTodoSharedListMemberPatternInfo, `Resource "${[]}" is not defined!`);
    checkErrorPattern('', getTodoSharedListMemberPatternInfo, `Resource "${''}" is not defined!`);
  });

  test('Check the source of `TodoSharedListMember` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getTodoSharedListMemberPatternInfo);
  });
});

describe('Get list member pattern info', () => {
  const correctResource = 'task/listmember';
  const result = {
    idListMember: 'listmember_id',
    listId: 'list_id',
    userId: 'personinfo_id',
    groupName: 'foldernamestitle',
    rowOrder: 'roworder',
    groupId: 'foldernames_id',
  };

  test('Check the source of `TodoTaskListMember` for `failure` mode', () => {
    checkErrorPattern(null, getListMemberPatternInfo, `Resource "null" is not defined!`);
    checkErrorPattern('test', getListMemberPatternInfo, `Resource "test" is not defined!`);
    checkErrorPattern(123, getListMemberPatternInfo, `Resource "123" is not defined!`);
    checkErrorPattern({}, getListMemberPatternInfo, `Resource "${{}}" is not defined!`);
    checkErrorPattern([], getListMemberPatternInfo, `Resource "${[]}" is not defined!`);
    checkErrorPattern('', getListMemberPatternInfo, `Resource "${''}" is not defined!`);
  });

  test('Check the source of `TodoTaskListMember` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getListMemberPatternInfo);
  });
});

describe('Get category pattern info', () => {
  const correctResource = 'category/getlist';
  const result = {
    id: 'id',
    name: 'name',
    priority: 'Priority',
    level: 'level',
    idParent: 'ParentId',
    imagePath: 'imagePath',
    imageFileName: 'imageFileName',
    targetResource: 'product/getlist',
    targetResourceParentId: 'ParentId',
    hasChild: 'hasChild',
  };

  test('Check the source of `category` for `failure` mode', () => {
    checkErrorPattern(null, getCategoryPatternInfo, `Resource "null" for category is not defined!`);
    checkErrorPattern(
      'test',
      getCategoryPatternInfo,
      `Resource "test" for category is not defined!`,
    );
    checkErrorPattern(123, getCategoryPatternInfo, `Resource "123" for category is not defined!`);
    checkErrorPattern({}, getCategoryPatternInfo, `Resource "${{}}" for category is not defined!`);
    checkErrorPattern([], getCategoryPatternInfo, `Resource "${[]}" for category is not defined!`);
    checkErrorPattern('', getCategoryPatternInfo, `Resource "${''}" for category is not defined!`);
  });

  test('Check the source of `category` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getCategoryPatternInfo);
  });
});

describe('Get sellin list pattern info', () => {
  const correctResource = 'product/getlist';
  const result = {
    count: 'count',
    id: 'id',
    price: 'price',
    name: 'name',
    imagePath: 'imagePath',
    imageFileName: 'imageFileName',
    targetResource: 'product/getdetail',
    targetResourceParentId: 'productid',
    // these are ids of fields
    fieldIdListForFilter: ['justavailablenumber', 'searchvalue'],
    fieldIdListForSort: ['description', 'price'],
    setBasketResource: 'basket/set',
    removeBasketResource: 'basket/delete',
    basketCount: 'count',
    productId: 'id',
    barcodeId: 'barcodeId',
    itemPrice: 'price',
    listBasketResource: 'basket/getlist',
    basketBarcodeId: 'barcodeId',
    basketItemPrice: 'itemPrice',
    basketProductId: 'productId',
    sortFieldList: [
      {
        id: 'NameAlphabet',
        name: 'NameAlphabet',
        translatedCaption: {
          fa: 'نام (به ترتیب الفبا)',
          en: 'Name (alphabetical order)',
          ar: 'الاسم (بالترتيب الأبجدي)',
        },
      },
      {
        id: 'PriceDescending',
        name: 'PriceDescending',
        translatedCaption: {
          fa: 'قیمت از کم به زیاد',
          en: 'Price from low to high',
          ar: 'السعر من الأقل إلى الأعلى',
        },
      },
      {
        id: 'PriceAscending',
        name: 'PriceAscending',
        translatedCaption: {
          fa: 'قیمت از زیاد به کم',
          en: 'Price from high to low',
          ar: 'السعر من الأعلى إلى الأقل',
        },
      },
    ],
    filterFieldList: [
      {
        id: 'JustAvailableNumber',
        name: 'JustAvailableNumber',
        translatedCaption: {
          fa: 'فقط نمایش کالاهای موجود',
          en: 'Just display the available goods',
          ar: 'فقط قم بعرض البضائع المتاحة',
        },
        dataType: {
          simple: 'boolean',
        },
      },
    ],
    basketResource: 'basket/getlist',
    defaultSort: {
      field: 'updateDate',
      order: 'DESC',
    },
    hasBarcode: 'hasBarcode',
  };

  test('Check the source of `sellinList` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getSellinListPatternInfo,
      `Resource "null" for selin list is not defined!`,
    );
    checkErrorPattern(
      'test',
      getSellinListPatternInfo,
      `Resource "test" for selin list is not defined!`,
    );
    checkErrorPattern(
      123,
      getSellinListPatternInfo,
      `Resource "123" for selin list is not defined!`,
    );
    checkErrorPattern(
      {},
      getSellinListPatternInfo,
      `Resource "${{}}" for selin list is not defined!`,
    );
    checkErrorPattern(
      [],
      getSellinListPatternInfo,
      `Resource "${[]}" for selin list is not defined!`,
    );
    checkErrorPattern(
      '',
      getSellinListPatternInfo,
      `Resource "${''}" for selin list is not defined!`,
    );
  });

  test('Check the source of `sellinList` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getSellinListPatternInfo);
  });
});

describe('Get sellin basket pattern', () => {
  const correctResource = 'basket/getlist';
  const result = {
    id: 'id',
    name: 'name',
    count: 'count',
    imagePath: 'imagePath',
    imageFileName: 'imageFileName',
    totalPrice: 'totalPrice',
    itemPrice: 'itemPrice',
    discount: 'discountPrice',
    setBasketResource: 'basket/set',
    removeBasketResource: 'basket/delete',
    showProductResource: 'product/getdetail',
    finalizeResource: 'basket/finalize',
    defaultSort: {
      field: 'updateDate',
      order: 'DESC',
    },
    productId: 'productId',
  };

  test('Check the source of `sellinBasket` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getSellinBasketPattern,
      `Resource "null" for selin basket is not defined!`,
    );
    checkErrorPattern(
      'test',
      getSellinBasketPattern,
      `Resource "test" for selin basket is not defined!`,
    );
    checkErrorPattern(
      123,
      getSellinBasketPattern,
      `Resource "123" for selin basket is not defined!`,
    );
    checkErrorPattern(
      {},
      getSellinBasketPattern,
      `Resource "${{}}" for selin basket is not defined!`,
    );
    checkErrorPattern(
      [],
      getSellinBasketPattern,
      `Resource "${[]}" for selin basket is not defined!`,
    );
    checkErrorPattern(
      '',
      getSellinBasketPattern,
      `Resource "${''}" for selin basket is not defined!`,
    );
  });

  test('Check the source of `sellinBasket` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getSellinBasketPattern);
  });
});

describe('Get sellin show pattern info', () => {
  const correctResource = 'product/getdetail';
  const result = {
    defaultFilterName: 'productid',
    id: 'id',
    name: 'name',
    description: 'description',
    parent_id: 'parentId',
    image: 'cat_image',
    level: 'level',
    imageFileName: 'imageFileName',
    imagePath: 'imagePath',
    images: 'images',
    setBasketResource: 'basket/set',
    removeBasketResource: 'basket/delete',
    count: 'count',
    productId: 'productId',
    itemPrice: 'itemPrice',
    price: 'price',
    basketResource: 'basket/getlist',
    defaultSort: {
      field: 'updateDate',
      order: 'DESC',
    },
    discount: 'discountPrice',
    hasBarcode: 'hasBarcode',
    barcodeResource: 'barcode/getlist',
    tagResource: 'product/GetTags',
    barcodeId: 'barcodeId',
  };

  test('Check the source of `sellinShow` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getSellinShowPatternInfo,
      `Resource "null" for selin show is not defined!`,
    );
    checkErrorPattern(
      'test',
      getSellinShowPatternInfo,
      `Resource "test" for selin show is not defined!`,
    );
    checkErrorPattern(
      123,
      getSellinShowPatternInfo,
      `Resource "123" for selin show is not defined!`,
    );
    checkErrorPattern(
      {},
      getSellinShowPatternInfo,
      `Resource "${{}}" for selin show is not defined!`,
    );
    checkErrorPattern(
      [],
      getSellinShowPatternInfo,
      `Resource "${[]}" for selin show is not defined!`,
    );
    checkErrorPattern(
      '',
      getSellinShowPatternInfo,
      `Resource "${''}" for selin show is not defined!`,
    );
  });

  test('Check the source of `sellinShow` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getSellinShowPatternInfo);
  });
});

describe('Get sellin history order pattern info', () => {
  const correctResource = 'order/getlist';
  const result = {
    historyOrderDetailResource: 'sellin-history-order-detail/order/getdetail',
    id: 'id',
    createDate: 'createDate',
    updateDate: 'updateDate',
    itemCount: 'itemCount',
    totalItemCount: 'totalItemCount',
    totalDiscountPrice: 'totalDiscountPrice',
    totalWholePrice: 'totalWholePrice',
    finalPrice: 'finalPrice',
    erpCode: 'erpCode',
    description: 'description',
    settlementTypeTitle: 'settlementTypeTitle',
    settlementTypeId: 'settlementTypeId',
    orderStatusTitle: 'orderStatusTitle',
    orderStatusColor: 'orderStatusColor',
    orderStatusDescription: 'orderStatusDescription',
    orderStatusId: 'orderStatusId',
    isDeleted: 'isDeleted',
    successfulOnlinePayment: 'successfulOnlinePayment',
    successfulOnlinePaymentDate: 'successfulOnlinePaymentDate',
  };

  test('Check the source of `sellinHistoryOrder` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getSellinHistoryOrderPatternInfo,
      `Resource "null" for selin history order is not defined!`,
    );
    checkErrorPattern(
      'test',
      getSellinHistoryOrderPatternInfo,
      `Resource "test" for selin history order is not defined!`,
    );
    checkErrorPattern(
      123,
      getSellinHistoryOrderPatternInfo,
      `Resource "123" for selin history order is not defined!`,
    );
    checkErrorPattern(
      {},
      getSellinHistoryOrderPatternInfo,
      `Resource "${{}}" for selin history order is not defined!`,
    );
    checkErrorPattern(
      [],
      getSellinHistoryOrderPatternInfo,
      `Resource "${[]}" for selin history order is not defined!`,
    );
    checkErrorPattern(
      '',
      getSellinHistoryOrderPatternInfo,
      `Resource "" for selin history order is not defined!`,
    );
  });

  test('Check the source of `sellinHistoryOrder` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getSellinHistoryOrderPatternInfo);
  });
});

describe('Get sellin history order detail pattern info', () => {
  const correctResource = 'order/getdetail';
  const result = {
    id: 'id',
    name: 'name',
    count: 'count',
    imagePath: 'imagePath',
    imageFileName: 'imageFileName',
    totalPrice: 'totalPrice',
    itemPrice: 'itemPrice',
    discount: 'discountPrice',
    setBasketResource: 'basket/set',
    removeBasketResource: 'basket/delete',
    additionalDataOrder: 'order',
    totalItemCount: 'totalItemCount',
    totalWholePrice: 'totalWholePrice',
    showProductResource: 'product/getdetail',
    productId: 'productId',
  };

  test('Check the source of `sellinHistoryOrderDetail` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getSellinHistoryOrderDetailPatternInfo,
      `Resource "null" for selin history order detail is not defined!`,
    );
    checkErrorPattern(
      'test',
      getSellinHistoryOrderDetailPatternInfo,
      `Resource "test" for selin history order detail is not defined!`,
    );
    checkErrorPattern(
      123,
      getSellinHistoryOrderDetailPatternInfo,
      `Resource "123" for selin history order detail is not defined!`,
    );
    checkErrorPattern(
      {},
      getSellinHistoryOrderDetailPatternInfo,
      `Resource "${{}}" for selin history order detail is not defined!`,
    );
    checkErrorPattern(
      [],
      getSellinHistoryOrderDetailPatternInfo,
      `Resource "${[]}" for selin history order detail is not defined!`,
    );
    checkErrorPattern(
      '',
      getSellinHistoryOrderDetailPatternInfo,
      `Resource "${''}" for selin history order detail is not defined!`,
    );
  });

  test('Check the source of `sellinHistoryOrderDetail` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getSellinHistoryOrderDetailPatternInfo);
  });
});

describe('Get sellin basket finalize pattern info', () => {
  const correctResource = 'basket/finalize';
  const result = {
    validateResource: 'basket/validate',
    redirectFinalizeResource: 'order/getdetail',
    redirectCartResource: 'basket/getlist',
    order: 'order',
    settlementType: 'settlementType',
    itemCount: 'itemCount',
    finalPrice: 'finalPrice',
    totalDiscountPrice: 'totalDiscountPrice',
    totalItemCount: 'totalItemCount',
    totalWholePrice: 'totalWholePrice',
    id: 'id',
    isDefault: 'isDefault',
    settlementTypeTitle: 'settlementTypeTitle',
    description: 'description',
    settlementTypeId: 'settlementTypeId',
  };

  test('Check the source of `sellinBasketFinalize` for `failure` mode', () => {
    checkErrorPattern(null, getSellinBasketFinalizePatternInfo, `Resource "null" is not defined!`);
    checkErrorPattern(
      'test',
      getSellinBasketFinalizePatternInfo,
      `Resource "test" is not defined!`,
    );
    checkErrorPattern(123, getSellinBasketFinalizePatternInfo, `Resource "123" is not defined!`);
    checkErrorPattern({}, getSellinBasketFinalizePatternInfo, `Resource "${{}}" is not defined!`);
    checkErrorPattern([], getSellinBasketFinalizePatternInfo, `Resource "${[]}" is not defined!`);
    checkErrorPattern('', getSellinBasketFinalizePatternInfo, `Resource "${''}" is not defined!`);
  });

  test('Check the source of `sellinBasketFinalize` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getSellinBasketFinalizePatternInfo);
  });
});

describe('Get todoList pattern info', () => {
  const correctResource = 'task/list';
  const result = {
    color: 'themecolor',
    counter: 'countlist',
    createUserId: 'createuserid',
    deleteGroupService: 'ec7c8111-95c5-429b-b132-a409522821dd',
    deleteService: '14899D59-81AC-47E5-96D4-8DF8BED792B7',
    detailsFilterFieldName: 'list_id',
    dragGroupAcceptType: 'group',
    dragListAcceptType: 'list',
    dragTaskAcceptType: 'task',
    groupId: 'foldernames_id',
    groupName: 'foldername',
    groupResource: 'task/foldernames',
    groupTitle: 'foldernamestitle',
    id: 'list_id',
    idListMember: 'listmember_id',
    isSharedList: 'issharedlist',
    listMemberResource: 'task/listmember',
    pagination: { page: 1, perPage: 10000 },
    reportResource: 'report/e24f3fb4-de27-4c10-9221-83339934162b',
    reportSharedListMember: 'report/ec0884b8-d321-4eab-a0e1-1cd19b8f9921',
    reportTaskDetailsResource: 'report/77c9235b-bc16-4425-adeb-133c0bc50dc4',
    rowOrder: 'roworder',
    shareListParentId: 'list_id',
    sort: { field: 'rowOrder', order: 'ASC' },
    staticFilterList: { filterName: 'filterName', listId: 'list_id' },
    taskDetailsResource: 'task/taskdetails',
    taskId: 'tasksdetails_id',
    title: 'listtitle',
    ungroupService: '03891103-0b20-43ec-b34a-2a050dd76f09',
  };

  test('Check the source of `TodoList` for `failure` mode', () => {
    checkErrorPattern(null, getTodoListPatternInfo, `Resource "null" is not defined!`);
    checkErrorPattern('test', getTodoListPatternInfo, `Resource "test" is not defined!`);
    checkErrorPattern(123, getTodoListPatternInfo, `Resource "123" is not defined!`);
    checkErrorPattern({}, getTodoListPatternInfo, `Resource "${{}}" is not defined!`);
    checkErrorPattern([], getTodoListPatternInfo, `Resource "${[]}" is not defined!`);
    checkErrorPattern('', getTodoListPatternInfo, `Resource "${''}" is not defined!`);
  });

  test('Check the source of `TodoList` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getTodoListPatternInfo);
  });
});

describe('Get todoTask details pattern info', () => {
  test('Check the source of `TodoTaskDetails` for `failure` mode', () => {
    checkErrorPattern(null, getTodoTaskDetailsPatternInfo, `Resource "null" is not defined!`);
    checkErrorPattern('test', getTodoTaskDetailsPatternInfo, `Resource "test" is not defined!`);
    checkErrorPattern(123, getTodoTaskDetailsPatternInfo, `Resource "123" is not defined!`);
    checkErrorPattern({}, getTodoTaskDetailsPatternInfo, `Resource "${{}}" is not defined!`);
    checkErrorPattern([], getTodoTaskDetailsPatternInfo, `Resource "${[]}" is not defined!`);
    checkErrorPattern('', getTodoTaskDetailsPatternInfo, `Resource "${''}" is not defined!`);
  });

  test('Check the source of `TodoTaskDetails` for `success` mode with source `task/taskdetails` ', () => {
    const correctResource = 'task/taskdetails';
    const result = {
      SysAssigned: 'SysAssigned',
      assignUser: 'agentuser',
      createDate: 'createdate',
      deleteTaskServiceResource: 'b5080d81-a919-4a61-8958-bf5767f1ed0e',
      dragTaskAcceptType: 'task',
      dueDate: 'duedate',
      filePath: '__filepath',
      id: 'id',
      isAddToMyDay: 'isaddedtomyday',
      isDone: 'isdone',
      isImportant: 'isimportant',
      note: 'body',
      parentId: 'list_id',
      remindMeDate: 'remindmedate',
      repeatEveryX: 'repeateveryx',
      repeatType: 'repeattype_id',
      repeatTypeTitle: 'repeattypetitle',
      rowOrder: 'roworder',
      stepsRelationChildFieldName: 'tasksdetails_id',
      stepsResource: 'task/taskstep',
      sysItem: 'sysitem',
      sysTaskAssignToMeService: '1E07CC26-929C-4C11-99DE-22E05F1B4836',
      sysTitle: 'title',
      sysurl: 'sysurl',
      title: 'detailtitle',
    };
    checkPatternWithResult(correctResource, result, getTodoTaskDetailsPatternInfo);
  });
});

describe('Get todoTask step pattern info', () => {
  const correctResource = 'task/taskstep';
  const result = {
    parentId: 'tasksdetails_id',
    id: 'taskstep_id',
    title: 'stepname',
    rowOrder: 'roworder',
    dndType: 'step',
    isDone: 'isdone',
  };

  test('Check the source of `TodoTaskStep` for `failure` mode', () => {
    checkErrorPattern(null, getTodoTaskStepPatternInfo, `Resource "null" is not defined!`);
    checkErrorPattern('test', getTodoTaskStepPatternInfo, `Resource "test" is not defined!`);
    checkErrorPattern(123, getTodoTaskStepPatternInfo, `Resource "123" is not defined!`);
    checkErrorPattern({}, getTodoTaskStepPatternInfo, `Resource "${{}}" is not defined!`);
    checkErrorPattern([], getTodoTaskStepPatternInfo, `Resource "${[]}" is not defined!`);
    checkErrorPattern('', getTodoTaskStepPatternInfo, `Resource "${''}" is not defined!`);
  });

  test('Check the source of `TodoTaskStep` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getTodoTaskStepPatternInfo);
  });
});

describe('Get advertisement pattern info', () => {
  test('Check the source of `advertisementList` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getAdvertisementPatternInfo,
      `Resource "null" for advertisement is not defined!`,
    );
    checkErrorPattern(
      'test',
      getAdvertisementPatternInfo,
      `Resource "test" for advertisement is not defined!`,
    );
    checkErrorPattern(
      123,
      getAdvertisementPatternInfo,
      `Resource "123" for advertisement is not defined!`,
    );
    checkErrorPattern(
      {},
      getAdvertisementPatternInfo,
      `Resource "${{}}" for advertisement is not defined!`,
    );
    checkErrorPattern(
      [],
      getAdvertisementPatternInfo,
      `Resource "${[]}" for advertisement is not defined!`,
    );
    checkErrorPattern(
      '',
      getAdvertisementPatternInfo,
      `Resource "${''}" for advertisement is not defined!`,
    );
  });

  test('Check the source of `advertisementList` for `success` mode with source `product/GetListByTag`', () => {
    const correctResource = 'product/GetListByTag';
    const result = {
      productTagId: '',
      productTagResource: '',
      productTagResourceSort: { field: '', order: '' },
      productShowResource: 'product/getdetail',
      productId: 'id',
      categoryId: '',
      categoryListResource: '',
      tagId: '',
      tagListResource: '',
      slideTitle: '',
      imagePath: 'imagePath',
      imageFileName: 'imageFileName',
      title: 'name',
      discount: 'discount',
      price: 'price',
      finalPrice: 'price',
    };
    checkPatternWithResult(correctResource, result, getAdvertisementPatternInfo);
  });

  test('Check the source of `advertisementList` for `success` mode with source `advertisement`', () => {
    const correctResource = 'advertisement';
    const result = {
      productTagId: 'tagId',
      productTagResource: 'product/GetListByTag', // is also indexed below
      productTagResourceSort: { field: 'PriceAscending', order: 'ASC' },
      productShowResource: 'product/getdetail',
      productId: '',
      categoryId: 'categoryId',
      categoryListResource: 'product/getlist',
      tagId: 'tagId',
      tagListResource: 'product/GetListByTag',
      slideTitle: 'title',
      imagePath: 'imagePath',
      imageFileName: 'imageFileName',
      title: 'title',
      discount: 'discount',
      price: 'price',
      finalPrice: 'finalPrice',
    };
    checkPatternWithResult(correctResource, result, getAdvertisementPatternInfo);
  });
});

describe('Get sellin search pattern info', () => {
  const correctResource = 'find';
  const result = {
    id: 'id',
    price: 'price',
    name: 'name',
    hasBarcode: 'hasBarcode',
    imagePath: 'imagePath',
    imageFileName: 'imageFileName',
    targetResource: 'product/getdetail',
    targetResourceParentId: 'productid',
    fieldIdListForFilter: ['justavailablenumber', 'searchvalue'],
    fieldIdListForSort: ['description', 'price'],
    filterKeyName: 'search',
  };

  test('Check the source of `sellinSearch` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getSellinSearchPatternInfo,
      `Resource "null" for selin list is not defined!`,
    );
    checkErrorPattern(
      'test',
      getSellinSearchPatternInfo,
      `Resource "test" for selin list is not defined!`,
    );
    checkErrorPattern(
      123,
      getSellinSearchPatternInfo,
      `Resource "123" for selin list is not defined!`,
    );
    checkErrorPattern(
      {},
      getSellinSearchPatternInfo,
      `Resource "${{}}" for selin list is not defined!`,
    );
    checkErrorPattern(
      [],
      getSellinSearchPatternInfo,
      `Resource "${[]}" for selin list is not defined!`,
    );
    checkErrorPattern(
      '',
      getSellinSearchPatternInfo,
      `Resource "${''}" for selin list is not defined!`,
    );
  });

  test('Check the source of `sellinSearch` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getSellinSearchPatternInfo);
  });
});

describe('Get sellin barcode pattern info', () => {
  const correctResource = 'barcode/getlist';
  const result = {
    id: 'id',
    name: 'name',
    count: 'count',
    barcodeId: 'barcodeId',
    itemPrice: 'itemPrice',
    productId: 'productId',
    imagePath: 'imagePath',
    imageFileName: 'imageFileName',
    setBasketResource: 'basket/set',
    basketResource: 'basket/getlist',
    removeBasketResource: 'basket/delete',
    defaultSort: {
      field: 'barcode_id',
      order: 'DESC',
    },
    justAvailableNumber: 'JustAvailableNumber',
    parentId: 'ParentId',
  };

  test('Check the source of `sellinBarcode` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getSellinBarcodePatternInfo,
      `Resource "null" for selin list is not defined!`,
    );
    checkErrorPattern(
      'test',
      getSellinBarcodePatternInfo,
      `Resource "test" for selin list is not defined!`,
    );
    checkErrorPattern(
      123,
      getSellinBarcodePatternInfo,
      `Resource "123" for selin list is not defined!`,
    );
    checkErrorPattern(
      {},
      getSellinBarcodePatternInfo,
      `Resource "${{}}" for selin list is not defined!`,
    );
    checkErrorPattern(
      [],
      getSellinBarcodePatternInfo,
      `Resource "${[]}" for selin list is not defined!`,
    );
    checkErrorPattern(
      '',
      getSellinBarcodePatternInfo,
      `Resource "${''}" for selin list is not defined!`,
    );
  });

  test('Check the source of `sellinBarcode` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getSellinBarcodePatternInfo);
  });
});

describe('Get todo date repeat type dropdown pattern info', () => {
  const correctResource = 'todoDateRepeatTypeDropdown';
  const result = {
    columns: null,
    displayMember: 'repeattypetitle',
    displayMember2: null,
    forceTreeLevel: false,
    id: 'f5305dd7-58a9-4a0a-9ffd-06d30c4cdec9',
    maps: [],
    moduleName: 'task',
    parameters: [],
    remoteSearch: false,
    table: null,
    tableName: 'repeattype',
    title: 'کارتابل-نوع تكرار',
    translatedComment: null,
    translatedTitle: {
      fa: 'کارتابل-نوع تكرار',
      en: 'کارتابل-نوع تكرار',
      ar: 'کارتابل-نوع تكرار',
    },
    treeLevel: 0,
    type: 'Simple',
    uniqueId: 'f5305dd7-58a9-4a0a-9ffd-06d30c4cdec9',
    valueMember: 'repeattype_id',
  };

  test('Check the source of `todoDateRepeatTypeDropdown` for `failure` mode', () => {
    checkErrorPattern(
      null,
      getTodoDateRepeatTypeDropdownPatternInfo,
      `Resource "null" for list is not defined!`,
    );
    checkErrorPattern(
      'test',
      getTodoDateRepeatTypeDropdownPatternInfo,
      `Resource "test" for list is not defined!`,
    );
    checkErrorPattern(
      123,
      getTodoDateRepeatTypeDropdownPatternInfo,
      `Resource "123" for list is not defined!`,
    );
    checkErrorPattern(
      {},
      getTodoDateRepeatTypeDropdownPatternInfo,
      `Resource "${{}}" for list is not defined!`,
    );
    checkErrorPattern(
      [],
      getTodoDateRepeatTypeDropdownPatternInfo,
      `Resource "${[]}" for list is not defined!`,
    );
    checkErrorPattern(
      '',
      getTodoDateRepeatTypeDropdownPatternInfo,
      `Resource "${''}" for list is not defined!`,
    );
  });

  test('Check the source of `todoDateRepeatTypeDropdown` for `success` mode', () => {
    checkPatternWithResult(correctResource, result, getTodoDateRepeatTypeDropdownPatternInfo);
  });
});
