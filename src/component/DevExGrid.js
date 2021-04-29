// https://github.com/DevExpress/devextreme-reactive/blob/master/packages/dx-react-grid/docs/reference/table-group-row.md
// https://devexpress.github.io/devextreme-reactive/react/grid/demos/featured/integrated-data-shaping/

import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import {
  FilteringState,
  GroupingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedSelection,
  IntegratedSorting,
  SelectionState,
  SortingState,
  SummaryState,
  IntegratedSummary,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  DragDropProvider,
  Grid,
  GroupingPanel,
  Table,
  TableFilterRow,
  TableGroupRow,
  TableHeaderRow,
  TableSelection,
  TableSummaryRow,
  Toolbar,
  TableFixedColumns,
  TableColumnReordering,
  TableEditColumn,
  TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import { translate, showNotification, refreshView, setListSelectedIds } from 'react-admin';
import { push } from 'connected-react-router';
import { withStyles, withWidth } from '@material-ui/core';

import DevExtremeListHelper from './DevExtremeListHelper';
import DevExGridTableComponent from './devExGrid/DevExGridTableComponent';
import SettingHOC, {
  GET_SETTING,
  GET_SETTING_FOR_USER,
  SET_SETTING,
} from '../container/SettingHOC';
import LoadingBox from './LoadingBox';

const styles = theme => ({
  container: {
    flexGrow: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    '& > div:first-child ': {
      height: 1,
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      '& > div:nth-child(2) ': {
        flexGrow: 1,
      },
    },
  },
});

class DevExGrid extends DevExtremeListHelper {
  notifyQuickEditChange = ({ changed }) => {
    const { quickEditRowCallback, resource } = this.props;
    const { preparedRows } = this.state;

    Object.entries(changed).forEach(([rowIndex, changedRow]) => {
      // if nothing has changed
      if (!changedRow) {
        return;
      }

      const changedColumns = Object.keys(changedRow);
      if (!changedColumns.length) {
        console.log('DevExGrid.js no change detected');
        return;
      }

      if (!preparedRows[rowIndex]) {
        console.log(`DevExGrid.js row with index ${rowIndex} not found!`);
        return;
      }

      quickEditRowCallback(resource, {
        data: { ...preparedRows[rowIndex], ...changedRow },
        columns: changedColumns,
      });
    });
  };

  render() {
    const {
      isDropDown = false,
      classes,
      basePath,
      isTopFilterOpen,
      isGroupingOpen,
      translate,
      relationMode,
      currentUrl,
      enableSelection,
      quickEditButton,
      actionEditColumnCount,
      hasEdit,
      getFooterRef,
      isLoading,
      hasShow,
      metaData,
      parentInfo,
    } = this.props;

    const {
      preparedRows,
      totalSummaryItems,
      preparedColumns,
      tableColumnExtensions,
      PreparedTableRow,
      preparedEditableColumnList,
      actionEditColumnWidth,
      gridWillHandleColumns,
      orderColumns,
      defaultGrouping,
    } = this.state;

    const gridStyle = {
      // width: this.computeGridWidth(),
      transition: 'width 200ms',
    };

    const tableSummaryRowMessages = {
      sum: translate('grid.sum'),
    };

    if (relationMode) {
      gridStyle.height = 300;
    }

    const actionEditColumnBindedParams = {
      quickEditButton,
      hasEdit,
      classes,
      basePath,
      currentUrl,
      translate,
      metaData,
      parentInfo,
    };

    // NOTE RCT-644: because grid will not understand when resource is changed, will not use
    // the provided columns for so the workaround is to remove the grid from showing and put it again after loading
    if (isLoading) {
      return <LoadingBox />;
    }

    return (
      <div
        className={classes.container}
        style={gridStyle}
        id="gridContainer"
        data-test-children-length={
          this.props.ids && this.props.ids.length ? this.props.ids.length : 'emptyGrid'
        }
      >
        <Grid rows={preparedRows} columns={preparedColumns}>
          <SortingState sorting={this.getSort()} onSortingChange={this.changeSorting} />
          {isTopFilterOpen && !relationMode && (
            <FilteringState
              columnFilteringEnabled
              defaultFilters={this.getFilters()}
              onFiltersChange={this.changeFiltering}
            />
          )}
          <GroupingState defaultGrouping={defaultGrouping} />
          {enableSelection && (
            <SelectionState
              selection={this.getSelection()}
              onSelectionChange={this.changeSelection}
            />
          )}

          <EditingState
            columnExtensions={preparedEditableColumnList}
            onCommitChanges={this.notifyQuickEditChange}
          />

          <IntegratedSorting />
          <IntegratedGrouping />
          {isTopFilterOpen && !relationMode && (
            <IntegratedFiltering columnExtensions={preparedColumns} />
          )}
          {enableSelection && <IntegratedSelection />}

          <DragDropProvider />
          {!!totalSummaryItems.length && (
            <SummaryState totalItems={totalSummaryItems} groupItems={totalSummaryItems} />
          )}
          {!!totalSummaryItems.length && <IntegratedSummary />}
          <Table
            columnExtensions={tableColumnExtensions}
            tableComponent={patentProps => (
              <DevExGridTableComponent
                {...patentProps}
                data-test-table-selection={this.getSelection().length}
                data-test-has-edit={hasEdit}
              />
            )}
            rowComponent={PreparedTableRow}
            basePath={basePath}
            messages={{
              noData: isLoading
                ? translate('ra.page.loading')
                : translate('ra.navigation.no_results'),
            }}
          />

          <TableColumnReordering
            order={!relationMode ? orderColumns : preparedColumns}
            onOrderChange={this.onColumnsOrderChange}
          />

          {enableSelection && (
            <TableSelection
              cellComponent={this.customSelectionComponent}
              headerCellComponent={this.customHeaderSelectionComponent}
              showSelectAll
            />
          )}

          <TableHeaderRow showSortingControls />
          {isTopFilterOpen && !relationMode && (
            <TableFilterRow
              messages={{
                filterPlaceholder: translate('grid.filterPlaceholder'),
              }}
            />
          )}
          <TableEditRow />
          {(hasEdit || quickEditButton) && (
            <TableEditColumn
              width={actionEditColumnWidth * actionEditColumnCount}
              showEditCommand
            />
          )}

          {!!totalSummaryItems.length && <TableSummaryRow messages={tableSummaryRowMessages} />}
          <TableGroupRow />
          <TableFixedColumns />
          {(isGroupingOpen || !!defaultGrouping.length) && !relationMode && <Toolbar />}
          {(isGroupingOpen || !!defaultGrouping.length) && !relationMode && (
            <GroupingPanel
              showSortingControls
              showGroupingControls
              messages={{
                groupByColumn: translate('grid.groupByColumn'),
              }}
            />
          )}
        </Grid>
      </div>
    );
  }
}

DevExGrid.propTypes = {
  isDropDown: PropTypes.bool,
  ids: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired, // data must be an object
  setSort: PropTypes.func.isRequired,
  currentSort: PropTypes.object.isRequired,
  hasShow: PropTypes.bool.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  redirectToPage: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired, // used in DevExtremeListHelper
  metaData: PropTypes.object.isRequired,
  currentUrl: PropTypes.string,
  onRowClick: PropTypes.func,
  relationMode: PropTypes.bool,
  enableSelection: PropTypes.bool,
  isSlideOpen: PropTypes.bool,
  quickEditButton: PropTypes.bool,
  actionEditColumnCount: PropTypes.number,
  parentInfo: PropTypes.object,
  resource: PropTypes.string,
};

DevExGrid.defaultProps = {
  enableSelection: true,
  quickEditButton: false,
};

const mapDispatchToProps = {
  redirectToPage: push,
  showNotification,
  refreshView,
  setListSelectedIds,
};

export default compose(
  SettingHOC([GET_SETTING, GET_SETTING_FOR_USER, SET_SETTING]),
  connect(null, mapDispatchToProps),
  withWidth(),
  translate,
  withStyles(styles, { withTheme: true }),
)(DevExGrid);
