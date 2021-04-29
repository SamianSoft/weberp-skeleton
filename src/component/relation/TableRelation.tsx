import React, { FC, useState, useEffect } from 'react';
import { ExpansionPanelDetails, makeStyles } from '@material-ui/core';

import LazyReferenceManyField from '../../container/admin/LazyReferenceManyField';
import RelationActionBar from './RelationActionBar';
import { isEmptyObject } from '../../helper/DataHelper';
import { getDefaultSort } from '../../helper/MetaHelper';
import LoadingBox from '../LoadingBox';
import { TableRelationType } from './RelationTypes';

const useStyles = makeStyles(theme => ({
  expansionPanelDetails: {
    display: 'block',
    overflow: 'auto',
    padding: 0,
  },

  referenceManyField: {
    display: 'block',
    overflow: 'auto',
    margin: '0 auto',
    [theme.breakpoints.up('xs')]: {
      width: 270,
      maxWidth: 500,
    },
    [theme.breakpoints.up('sm')]: {
      width: 260,
      maxWidth: 614,
    },
    [theme.breakpoints.up('md')]: {
      width: 618,
      maxWidth: 936,
    },
    [theme.breakpoints.up('lg')]: {
      width: 938,
      maxWidth: 1580,
    },
    [theme.breakpoints.up('xl')]: {
      width: 1580,
      maxWidth: 2950,
    },
  },
}));

const TableRelation: FC<TableRelationType> = props => {
  const {
    relationPath,
    basePath,
    relationResource,
    relationMetaData,
    parentResource,
    parentRecord,
    locale,
    type,
    relationData,
    hasCreate,
    hasDelete,
    hasEdit,
    disabledFieldList,
    parentInfo,
    selectedIds,
    isPreviouslyOpened,
    dynamicRelation,
    relation,
    ...rest
  } = props;

  const classes = useStyles(props);

  const { childFieldName } = relation;
  const [preparedSort, setPreparedSort] = useState<{ field: string; order: string } | undefined>();

  useEffect(() => {
    if (!isEmptyObject(relationMetaData)) {
      setPreparedSort(getDefaultSort(relationMetaData));
    }
  }, [relationMetaData]);

  console.log('TableRelation.tsx:83 >> relationMetaData', { relationMetaData });

  return (
    <ExpansionPanelDetails className={classes.expansionPanelDetails}>
      <RelationActionBar {...props} preparedSort={preparedSort} />
      {isPreviouslyOpened && relationMetaData && (
        <LazyReferenceManyField
          {...rest}
          className={classes.referenceManyField}
          basePath={basePath}
          resource={parentResource}
          record={parentRecord}
          addLabel={false}
          reference={relationResource}
          target={childFieldName}
          initialData={relationData.Data}
          initialCount={relationData.TotalCount}
          showPagination={type !== 'note'}
          sort={type === 'note' ? { field: 'createdate', order: 'DESC' } : preparedSort}
        >
          {dynamicRelation}
        </LazyReferenceManyField>
      )}
    </ExpansionPanelDetails>
  );
};

export default TableRelation;
