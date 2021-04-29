import React, {
  FC,
  useState,
  useEffect,
  ReactElement,
  useMemo,
  cloneElement,
  createElement,
} from 'react';
import { makeStyles } from '@material-ui/core';

import DevExGrid from '../DevExGrid';
import { DynamicRelationType } from './RelationTypes';
import { addParamToUrl } from '../../helper/UrlHelper';
import { isModuleTable } from '../../helper/MetaHelper';
import { KEY_SCROLL_TO } from '../../container/RelationPanel';
import { getFieldsForDisplay } from '../../helper/RelationHelper';

const useStyles = makeStyles(() => ({
  reportChildren: {
    flexGrow: 1,
    overflow: 'auto',
    height: 300,
  },
}));

const DummyComponent: ReactElement = createElement('div'); // will be used if "relationData.Data.length" equal 0..

const DynamicRelation: FC<DynamicRelationType> = props => {
  const {
    type,
    relationResource,
    relationPath,
    relation,
    relationMetaData,
    selectedIds,
    currentUrl: parentUrl,
    relationData,
    hasEdit = true,
    hasDelete = true,
    parentInfo,
    handleOnSelect,
    defaultSelected,
    userSelected,
    disabledFieldList,
  } = props;

  const { parentResource } = parentInfo;
  const isTable = useMemo(() => isModuleTable(relationMetaData), [relationMetaData]);
  const currentUrl = useMemo(() => addParamToUrl(parentUrl, KEY_SCROLL_TO, relationPath), [
    parentUrl,
    relationPath,
  ]);

  const classes = useStyles(props);

  const [fields, setFields] = useState<object[]>([]);
  const [element, setElement] = useState<ReactElement>(DummyComponent);

  /**
   * Prepare grid columns
   */
  useEffect(() => {
    setFields(
      getFieldsForDisplay(defaultSelected, userSelected, relationMetaData, disabledFieldList),
    );
  }, [defaultSelected, userSelected, relationMetaData]);

  /**
   * Prepare view based on `type` prop
   */
  useEffect(() => {
    let item: ReactElement = DummyComponent;

    switch (type) {
      default:
        if (relationData && relationData.Data && relationData.Data.length) {
          item = (
            <DevExGrid
              relationMode
              fields={fields}
              selectedIds={selectedIds}
              onSelect={handleOnSelect}
              currentUrl={currentUrl}
              hasShow={isTable && hasEdit}
              hasEdit={isTable && hasEdit}
              hasDelete={isTable && hasDelete}
              metaData={relationMetaData}
              actionEditColumnCount={1}
              parentInfo={parentInfo}
            />
          );
        }
    }
    setElement(item);
  }, [type, fields, relationData]);

  return cloneElement(element, { ...props });
};
export default DynamicRelation;
