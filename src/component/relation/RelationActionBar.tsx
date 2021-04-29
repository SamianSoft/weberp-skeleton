import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useTranslate, refreshView } from 'react-admin';
import { connect } from 'react-redux';
import lodashGet from 'lodash/get';

import ListActions from '../ListActions';
import { RelationActionBarType } from './RelationTypes';

const RelationActionBar: FC<RelationActionBarType> = props => {
  const {
    type,
    relationResource,
    parentResource,
    relation,
    disabledFieldList,
    currentUrl = '',
    relationData,
    hasCreate,
    hasDelete,
    hasEdit,
    relationMetaData,
    selectedIds,
    relationPath,
    parentInfo,
    preparedSort,
    additionalProps,
    parentRecord,
    refreshView,
    locale,
  } = props;

  const { parentFieldName, childFieldName } = relation;
  const quickCreateData = {
    [childFieldName]: lodashGet(parentRecord, parentFieldName, lodashGet(parentRecord, 'id')),
  };

  const translate = useTranslate();

  const [element, setElement] = useState<ReactElement | null>(null);

  /**
   * Refresh view after upload a file to show new files in list
   * @function handleFileUpload
   * @returns {void}
   */
  const handleFileUpload = (): void => {
    refreshView();
  };

  /**
   * Prepare view based on `type` prop
   */
  useEffect(() => {
    let actionPanel: ReactElement = (
      <ListActions
        hasShow
        hasDelete={hasDelete}
        hasEdit={hasEdit}
        hasCreate={hasCreate}
        locale={locale}
        metaData={relationMetaData}
        resource={relationResource}
        selectedIds={selectedIds}
        quickCreateData={quickCreateData}
        quickCreateMustRefresh
        currentSort={preparedSort}
        filterValues={quickCreateData}
        redirect={currentUrl}
        columnChoiceKey={relationPath}
        listColumnChoiceMustRefresh
        disabledFieldList={disabledFieldList}
        parentInfo={parentInfo}
        initialData={relationData.Data}
        additionalProps={additionalProps}
        parentFieldName={parentFieldName}
        relationMode
      />
    );
    if (hasCreate) {
      switch (type) {
        default:
          if (!relationData.TotalCount) {
            actionPanel = <div>create</div>;
          }
      }
    }

    setElement(actionPanel);
  }, [type, relationData, selectedIds]);

  return element;
};

const mapDispatchToProps = {
  refreshView,
};

export default connect(null, mapDispatchToProps)(RelationActionBar);
