import { ReactElement } from 'react';

export interface PageType {
  location: any;
  history: any;
  match: any;
  staticContext: any;
}

export interface FieldType {
  id: string;
  name: string;
  translatedCaption?: {
    [key: string]: string;
  };
  precision?: number;
  [key: string]: any;
}

export interface TodoListPatternType {
  reportResource: string;
  detailsResource: string;
  reportTaskDetailsResource: string;
  deleteService: string;
  deleteGroupService: string;
  detailsFilterFieldName: string;
  sort: { field: string; order: string };
  pagination: { page: string; perPage: string };
  counter: string;
  color: string;
  groupName: string;
  rowOrder: string;
  listMemberResource: string;
  groupResource: string;
  dragListAcceptType: string;
  dragGroupAcceptType: string;
  idListMember: string;
  staticFilterList: { filterName: string; listId: string };
  reportSharedListMember: string;
  isSharedList: string;
  ungroupService: string;
  id: string;
  title: string;
  groupTitle: string;
  groupId: string;
  dragTaskAcceptType: string;
  shareListParentId: string;
}

export interface TodoTaskPatternType {
  stepsResource: string;
  stepsRelationChildFieldName: string;
  sysTaskAssignToMeService: string;
  title: string;
  parentId: string;
  id: string;
  isImportant: string;
  createDate: string;
  isDone: string;
  isAddToMyDay: string;
  remindMeDate: string;
  dueDate: string;
  repeatEveryX: string;
  repeatType: string;
  repeatTypeTitle: string;
  note: string;
  filePath: string;
  assignUser: string;
  sysItem: string;
  dndType: string;
  dragTaskAcceptType: string;
  rowOrder: string;
  sysurl: string;
  sysTitle: string;
  SysAssigned: string;
}

export interface CategoryPatternType {
  id: string;
  name: string;
  priority: string;
  level: string;
  idParent: string;
  imagePath: string;
  imageFileName: string;
  targetResource: string;
  targetResourceParentId: string;
  hasChild: string;
}

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

export interface SellinListPatternType {
  count: string;
  id: string;
  price: string;
  name: string;
  imagePath: string;
  imageFileName: string;
  targetResource: string;
  targetResourceParentId: string;
  // these are ids of fields
  fieldIdListForFilter: string[];
  fieldIdListForSort: string[];
  setBasketResource: string;
  removeBasketResource: string;
  listBasketResource: string;
  basketCount: string;
  basketProductId: string;
  basketItemPrice: string;
  basketBarcodeId: string;
  productId: string;
  itemPrice: string;
  barcodeId: string;
  filterFieldList: FieldType[];
  sortFieldList: FieldType[];
  basketResource: string;
  defaultSort: object;
  hasBarcode: string;
}

export interface TodoTaskStepType {
  parentId: string;
  id: string;
  title: string;
  rowOrder: string;
  dndType: string;
  isDone: string;
}

export interface TodoTaskListMemberType {
  idListMember: string;
  listId: string;
  userId: string;
  groupName: string;
  rowOrder: string;
  groupId: string;
}

export interface TodoSharedListMemberType {
  listId: string;
  personId: string;
  name: string;
  listMemberId: string;
}

export interface AdvertisementPatternType {
  productTagId: string;
  productTagResource: string;
  productTagResourceSort: { field: string; order: string };
  productShowResource: string;
  productId: string;
  categoryId: string;
  categoryListResource: string;
  tagId: string;
  tagListResource: string;
  slideTitle: string;
  imagePath: string;
  imageFileName: string;
  title: string;
  discount: string;
  price: string;
  finalPrice: string;
}

export interface SellinSearchPatternType {
  id: string;
  price: string;
  name: string;
  imagePath: string;
  imageFileName: string;
  targetResource: string;
  targetResourceParentId: string;
  fieldIdListForFilter: string[];
  fieldIdListForSort: string[];
  filterKeyName: string;
  hasBarcode: string;
}
export interface SellinBarcodePatternType {
  id: string;
  name: string;
  count: string;
  barcodeId: string;
  itemPrice: string;
  productId: string;
  imagePath: string;
  imageFileName: string;
  setBasketResource: string;
  basketResource: string;
  removeBasketResource: string;
  defaultSort: object;
  justAvailableNumber: string;
  parentId: string;
}

export interface SavedFilterItemType {
  name?: string;
  id: number;
  data?: object;
}

export interface EncodedFileType {
  src: string;
  isImage: boolean;
}

export interface ModeItemInterface {
  name: string;
  operator: string;
  both: boolean;
}

export interface ActionListInterface {
  name: string;
  title: string;
}

export interface ContextMenuItemType {
  dataTestAttribute: string;
  title: string;
  icon: string | ReactElement;
  submenu?: boolean;
  disable?: boolean;
  value?: string;
}

export interface TreeRow {
  title: string;
  id: string | number;
  compositid: string;
  currentlevel: number;
  text: string;
  items?: [];
  selected: boolean;
  expanded: boolean;
}

export interface AdditionalPropsInterface {
  relationPath: string;
  resource: string;
  orginalRecord: object;
  allowUsePropsAfterCreateRelation: boolean;
}

export interface ValidationErrors {
  id: number | string;
  message: string;
  tabTitle?: string;
  tabId?: number | string;
}
