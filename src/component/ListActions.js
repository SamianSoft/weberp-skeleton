import React from 'react';
import PropTypes from 'prop-types';
import { TopToolbar, useTranslate, useLocale } from 'react-admin';
import { IconButton, Icon, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { toggleNoteStreamAction } from '../redux/listPage/action';
import { getProcessList, hasNote } from '../helper/MetaHelper';

const useStyles = makeStyles(theme => ({
  IconButton: {
    padding: 7,
    margin: '0 5px',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },

  topToolbar: {
    padding: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: props => (props.hasSelectedItems === true ? 'space-between' : 'flex-end'),
    flexWrap: 'wrap',
  },

  actionsContainer: {
    display: 'flex',
    alignSelf: 'center',
  },

  selectedItemsContainer: {
    display: 'flex',
    alignSelf: 'center',
  },

  selectedItemsText: {
    alignSelf: 'center',
  },

  clearIcon: {
    color: theme.palette.error.main,
  },
}));

const ListActions = props => {
  const {
    bulkActions,
    basePath,
    currentSort,
    displayedFilters,
    filter,
    filters,
    filterValues,
    showFilterByList,
    showFilter,
    setFilters,
    onUnselectItems,
    resource,
    selectedIds,
    toggleNoteStream,
    metaData,
    quickCreateData,
    quickCreateMustRefresh,
    redirect,
    hasCreate,
    hasDelete,
    columnChoiceKey,
    listColumnChoiceMustRefresh,
    disabledFieldList,
    parentInfo,
    treeLevel,
    disableDelete,
    initialData,
    additionalProps,
    relationMode,
    parentFieldName,
    hidePrint,
    selectionRef,
  } = props;

  const translate = useTranslate();
  const locale = useLocale();
  const classes = useStyles({ hasSelectedItems: !!(selectedIds && selectedIds.length) });

  const processList = getProcessList(metaData);
  const isNoteStreamEnabled = hasNote(metaData);
  const treeCondition = treeLevel && typeof treeLevel === 'number' && selectedIds.length > 1;
  const selectedItemsCount = selectedIds && selectedIds.length ? selectedIds.length : null;

  /**
   * this function should clear all selected items from selection
   * by calling clearSelection function from selectionRef
   * @function clearSelection
   * @returns {void}
   */
  const clearSelection = () => {
    if (selectionRef && selectionRef.current && selectionRef.current.clearSelection) {
      selectionRef.current.clearSelection();
    }
  };

  if (!resource || !metaData) {
    return <div />;
  }

  return (
    <TopToolbar
      className={classes.topToolbar}
      data-test-has-delete={hasDelete}
      data-test-has-create={hasCreate}
    >
      {selectedItemsCount && (
        <div className={classes.selectedItemsContainer}>
          <IconButton
            color="secondary"
            className={classes.IconButton}
            id="unselectAllButton"
            onClick={clearSelection}
          >
            <Icon fontSize="small" className={classes.clearIcon}>
              clear
            </Icon>
          </IconButton>
          <Typography className={classes.selectedItemsText} variant="body2">
            {translate('ra.action.bulk_actions', { smart_count: selectedItemsCount })}
          </Typography>
        </div>
      )}

      <div className={classes.actionsContainer}>
        <div>action item</div>
      </div>
    </TopToolbar>
  );
};

ListActions.propTypes = {
  metaData: PropTypes.object,
  resource: PropTypes.string.isRequired,
  toggleNoteStream: PropTypes.func.isRequired,
  quickCreateData: PropTypes.object,
  quickCreateMustRefresh: PropTypes.bool,
  redirect: PropTypes.string,
  selectedIds: PropTypes.array,
  hasCreate: PropTypes.bool,
  hasDelete: PropTypes.bool,
  columnChoiceKey: PropTypes.string,
  listColumnChoiceMustRefresh: PropTypes.bool,
  parentInfo: PropTypes.object,
  disableDelete: PropTypes.bool,
  initialData: PropTypes.array,
  relationMode: PropTypes.bool,
  selectionRef: PropTypes.object,
  additionalProps: PropTypes.object,
};

const mapDispatchToProps = {
  toggleNoteStream: toggleNoteStreamAction,
};

export default connect(null, mapDispatchToProps)(ListActions);
