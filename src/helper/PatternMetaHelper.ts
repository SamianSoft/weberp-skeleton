import {
  TodoTaskListMemberType,
  CategoryPatternType,
  SellinListPatternType,
  AdvertisementPatternType,
  TodoListPatternType,
  TodoTaskPatternType,
  TodoTaskStepType,
  TodoSharedListMemberType,
} from './Types';

const sellinList: { [key: string]: SellinListPatternType } = {
  //card-list
  'product/getlist': {
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
  },
};

const category: { [key: string]: CategoryPatternType } = {
  'category/getlist': {
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
  },
};

const sellinBasket = {
  'basket/getlist': {
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
  },
};

const sellinShow = {
  'product/getdetail': {
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
  },
};

const sellinHistoryOrder = {
  'order/getlist': {
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
  },
};

const sellinHistoryOrderDetail = {
  'order/getdetail': {
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
  },
};

const sellinBasketFinalize = {
  'basket/finalize': {
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
  },
};

const advertisementList: { [key: string]: AdvertisementPatternType } = {
  advertisement: {
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
  },
  // for single product
  'product/GetListByTag': {
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
  },
};

const TodoList = {
  'task/list': {
    reportResource: 'report/e24f3fb4-de27-4c10-9221-83339934162b',
    taskDetailsResource: 'task/taskdetails',
    reportTaskDetailsResource: 'report/77c9235b-bc16-4425-adeb-133c0bc50dc4',
    deleteService: '14899D59-81AC-47E5-96D4-8DF8BED792B7',
    deleteGroupService: 'ec7c8111-95c5-429b-b132-a409522821dd',
    ungroupService: '03891103-0b20-43ec-b34a-2a050dd76f09',
    detailsFilterFieldName: 'list_id',
    sort: {
      field: 'rowOrder',
      order: 'ASC',
    },
    pagination: {
      page: 1,
      perPage: 10000,
    },
    id: 'list_id',
    title: 'listtitle',
    counter: 'countlist',
    color: 'themecolor',
    groupName: 'foldername',
    groupTitle: 'foldernamestitle',
    rowOrder: 'roworder',
    groupId: 'foldernames_id',
    listMemberResource: 'task/listmember',
    groupResource: 'task/foldernames',
    dragListAcceptType: 'list',
    dragTaskAcceptType: 'task',
    dragGroupAcceptType: 'group',
    idListMember: 'listmember_id',
    staticFilterList: {
      filterName: 'filterName',
      listId: 'list_id',
    },
    reportSharedListMember: 'report/ec0884b8-d321-4eab-a0e1-1cd19b8f9921',
    isSharedList: 'issharedlist',
    taskId: 'tasksdetails_id',
    createUserId: 'createuserid',
    shareListParentId: 'list_id',
  },
};

const TodoTaskDetails = {
  'task/taskdetails': {
    deleteTaskServiceResource: 'b5080d81-a919-4a61-8958-bf5767f1ed0e',
    sysTaskAssignToMeService: '1E07CC26-929C-4C11-99DE-22E05F1B4836',
    stepsResource: 'task/taskstep',
    stepsRelationChildFieldName: 'tasksdetails_id',
    title: 'detailtitle',
    parentId: 'list_id',
    id: 'id',
    isImportant: 'isimportant',
    createDate: 'createdate',
    isDone: 'isdone',
    isAddToMyDay: 'isaddedtomyday',
    remindMeDate: 'remindmedate',
    dueDate: 'duedate',
    repeatEveryX: 'repeateveryx',
    repeatType: 'repeattype_id',
    repeatTypeTitle: 'repeattypetitle',
    note: 'body',
    filePath: '__filepath',
    assignUser: 'agentuser',
    sysItem: 'sysitem',
    dragTaskAcceptType: 'task',
    rowOrder: 'roworder',
    sysurl: 'sysurl',
    sysTitle: 'title',
    SysAssigned: 'SysAssigned',
  },
  'report/77c9235b-bc16-4425-adeb-133c0bc50dc4': {
    deleteTaskServiceResource: 'b5080d81-a919-4a61-8958-bf5767f1ed0e',
    sysTaskAssignToMeService: '1E07CC26-929C-4C11-99DE-22E05F1B4836',
    stepsResource: 'task/taskstep',
    stepsRelationChildFieldName: 'tasksdetails_id',
    title: 'detailtitle',
    parentId: 'list_id',
    id: 'id',
    isImportant: 'isimportant',
    createDate: 'createdate',
    isDone: 'isdone',
    isAddToMyDay: 'isaddedtomyday',
    remindMeDate: 'remindmedate',
    dueDate: 'duedate',
    repeatEveryX: 'repeateveryx',
    repeatType: 'repeattype_id',
    repeatTypeTitle: 'repeattypetitle',
    note: 'body',
    filePath: '__filepath',
    assignUser: 'agentuser',
    sysItem: 'sysitem',
    dragTaskAcceptType: 'task',
    rowOrder: 'roworder',
    sysurl: 'sysurl',
    sysTitle: 'title',
    SysAssigned: 'SysAssigned',
  },
};

const TodoTaskStep = {
  'task/taskstep': {
    parentId: 'tasksdetails_id',
    id: 'taskstep_id',
    title: 'stepname',
    rowOrder: 'roworder',
    dndType: 'step',
    isDone: 'isdone',
  },
};

const TodoTaskListMember = {
  'task/listmember': {
    idListMember: 'listmember_id',
    listId: 'list_id',
    userId: 'personinfo_id',
    groupName: 'foldernamestitle',
    rowOrder: 'roworder',
    groupId: 'foldernames_id',
  },
};

const TodoSharedListMember = {
  'report/ec0884b8-d321-4eab-a0e1-1cd19b8f9921': {
    listId: 'list_id',
    personId: 'personinfo_id',
    name: 'fullname',
    listMemberId: 'listmember_id',
    createUserId: 'createuserid',
  },
};

const sellinSearch = {
  find: {
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
  },
};

const sellinBarcode = {
  'barcode/getlist': {
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
  },
};

const componentsDefaultParams = {
  DropBaseMultiSelect: {
    pagination: {
      page: 1,
      perPage: 99999,
    },
  },
};

const todoDateRepeatTypeDropdown = {
  todoDateRepeatTypeDropdown: {
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
  },
};

export const getTodoSharedListMemberPatternInfo = (resource: string): TodoSharedListMemberType => {
  if (typeof TodoSharedListMember[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" is not defined!`);
  }

  return TodoSharedListMember[resource];
};

export const getListMemberPatternInfo = (resource: string): TodoTaskListMemberType => {
  if (typeof TodoTaskListMember[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" is not defined!`);
  }

  return TodoTaskListMember[resource];
};

export const getCategoryPatternInfo = (resource: string): CategoryPatternType => {
  if (typeof category[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for category is not defined!`);
  }

  return category[resource];
};

export const getSellinListPatternInfo = (resource: string): SellinListPatternType => {
  if (typeof sellinList[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for selin list is not defined!`);
  }

  return sellinList[resource];
};

export const getSellinBasketPattern = (resource: string) => {
  if (typeof sellinBasket[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for selin basket is not defined!`);
  }

  return sellinBasket[resource];
};

export const getSellinShowPatternInfo = (resource: string) => {
  if (typeof sellinShow[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for selin show is not defined!`);
  }

  return sellinShow[resource];
};

export const getSellinHistoryOrderPatternInfo = (resource: string) => {
  if (typeof sellinHistoryOrder[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for selin history order is not defined!`);
  }

  return sellinHistoryOrder[resource];
};

export const getSellinHistoryOrderDetailPatternInfo = (resource: string) => {
  if (typeof sellinHistoryOrderDetail[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for selin history order detail is not defined!`);
  }

  return sellinHistoryOrderDetail[resource];
};

export const getSellinBasketFinalizePatternInfo = (resource: string) => {
  if (typeof sellinBasketFinalize[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" is not defined!`);
  }

  return sellinBasketFinalize[resource];
};
export const getTodoListPatternInfo = (resource: string): TodoListPatternType => {
  if (typeof TodoList[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" is not defined!`);
  }

  return TodoList[resource];
};

export const getTodoTaskDetailsPatternInfo = (resource: string): TodoTaskPatternType => {
  if (typeof TodoTaskDetails[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" is not defined!`);
  }

  return TodoTaskDetails[resource];
};

export const getTodoTaskStepPatternInfo = (resource: string): TodoTaskStepType => {
  if (typeof TodoTaskStep[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" is not defined!`);
  }

  return TodoTaskStep[resource];
};

export const getAdvertisementPatternInfo = (resource: string): AdvertisementPatternType => {
  if (typeof advertisementList[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for advertisement is not defined!`);
  }

  return advertisementList[resource];
};

export const getSellinSearchPatternInfo = (resource: string) => {
  if (typeof sellinSearch[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for selin list is not defined!`);
  }

  return sellinSearch[resource];
};

export const getSellinBarcodePatternInfo = (resource: string) => {
  if (typeof sellinBarcode[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for selin list is not defined!`);
  }

  return sellinBarcode[resource];
};

/**
 * it gets a component name and returns the default value with the came component name key
 * in componentsDefaultParams object that has been declared on this page. also should
 * return an error message if it couldn`t find came key in the object.
 * @param {string} component component name
 * @returns {object|string} constant object or error mssage
 */
export const getComponentsDefaultParams = (component: string) => {
  if (typeof componentsDefaultParams[component] === 'undefined') {
    throw new Error(`component "${component}" has not default params!`);
  }

  return componentsDefaultParams[component];
};

/**
 * Check `resource` and return `todoDateRepeatTypeDropdown` pattern.
 * @function getTodoDateRepeatTypeDropdownPatternInfo
 * @param {string} resource
 * @returns {object}
 */
export const getTodoDateRepeatTypeDropdownPatternInfo = (resource: string): object => {
  if (typeof todoDateRepeatTypeDropdown[resource] === 'undefined') {
    throw new Error(`Resource "${resource}" for list is not defined!`);
  }

  return todoDateRepeatTypeDropdown[resource];
};
