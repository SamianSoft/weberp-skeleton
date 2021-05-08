import { ReactElement, RefObject } from 'react';

interface RelationType {
  moduleTableTitle: string;
  translatedTitle: string;
  title: string;
  id: string;
  reportId?: string;
  childFieldName: string;
  parentFieldName: string;
}
export interface RelationPanelType {
  relationPath: string;
  basePath: string;
  relationResource: string;
  currentUrl: string | null;
  relationMetaData: RelationMetaType;
  parentResource: string;
  parentRecord: object;
  additionalProps: object;
  locale: string;
  relation: RelationType;
  isSettingReady: boolean;
  location: { search: string };
  parentProcessUniqueId: string;
  parentPositionId: string;
  parentStateId: string;
  type: string;
  childFieldName: string;
  parentFieldName: string;
  hasCreate: boolean;
  hasEdit: boolean;
  hasDelete: boolean;
  disabledFieldList?: { [x: number]: boolean } | null;
  userSelected: number[] | null;
  defaultSelected: number[] | null;
  match: string;
  rest: any;
}

export interface DynamicRelationType {
  type: string;
  relationResource: string;
  relationPath: string;
  relation: RelationType;
  relationMetaData: RelationMetaType;
  selectedIds: string[] | number[];
  currentUrl: string | null;
  relationData: { TotalCount: number; Data: any[] };
  hasEdit: boolean;
  hasDelete: boolean;
  parentInfo: { parentResource: string };
  handleOnSelect: Function;
  defaultSelected: number[] | null;
  userSelected: number[] | null;
  disabledFieldList?: { [x: number]: boolean } | null;
}

export interface RelationLoadingType {
  title: string;
  element: RefObject<HTMLDivElement>;
}

export interface TableRelationType {
  type: string;
  relationData: { TotalCount: number; Data: never[] };
  locale: string;
  hasEdit: boolean;
  hasDelete: boolean;
  hasCreate: boolean;
  parentInfo: object;
  relationResource: string;
  relationMetaData: RelationMetaType;
  disabledFieldList?: { [x: number]: boolean } | null;
  parentFieldName: string;
  relationTitle: string;
  additionalProps: object;
  selectedIds: number[];
  relationPath: string;
  isPreviouslyOpened: boolean;
  basePath: string;
  parentResource: string;
  parentRecord: object;
  childFieldName: string;
  dynamicRelation: ReactElement;
  relation: RelationType;
  rest: any;
}

export interface RelationActionBarType {
  type: string;
  relationResource: string;
  parentResource: string;
  relation: {
    parentFieldName: string;
    childFieldName: string;
  };
  disabledFieldList?: { [x: number]: boolean } | null;
  currentUrl?: string | null;
  relationData: { TotalCount: number; Data: any[] };
  hasCreate: boolean;
  hasDelete: boolean;
  hasEdit: boolean;
  relationMetaData: RelationMetaType;
  selectedIds: number[];
  relationPath: string;
  parentInfo: object;
  preparedSort: { field: string; order: string } | undefined;
  additionalProps?: object;
  parentRecord: object;
  refreshView: Function;
  locale: string;
}

export interface ReportRelationType {
  relationResource: string;
  relationMetaData: RelationMetaType;
  parentRecord: object;
  showDevExtremeTopFilter: boolean;
  showDevExtremeGrouping: boolean;
  isPreviouslyOpened: boolean;
  dynamicRelation: ReactElement;
  match: string;
  location: object;
}

export interface RelationMetaType {
  reportId?: number;
  gridColumns?: number[];
  fields?: { [x: number]: { id: number; relatedName: string; sortType: null; disabled?: boolean } };
  columns?: object;
  config?: { primaryField: number };
}
