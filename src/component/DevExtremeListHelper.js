// https://github.com/DevExpress/devextreme-reactive/blob/master/packages/dx-react-grid/docs/reference/table-group-row.md
// https://devexpress.github.io/devextreme-reactive/react/grid/demos/featured/integrated-data-shaping/

import React, { memo, Component } from 'react';
import lodashGet from 'lodash/get';
import { Table, TableSelection } from '@devexpress/dx-react-grid-material-ui';

import { clone } from '../helper/DataHelper';
import { getFilterByValue } from '../core/dataProvider';
import { getGroupingColumns, getFieldsById } from '../helper/MetaHelper';
import { isStringWthStarsMatch } from '../helper/TextHelper';
import { CONFIG_LIST_COLUMN_CHOICE, DEFAULT } from '../container/SettingHOC';
import { CONFIG_CELL_WIDTH, DRAWER_WIDTH, getValue, USER_ID } from '../core/configProvider';

const safeOperators = [
  'contains',
  'notContains',
  'startsWith',
  'endsWith',
  'equal',
  'notEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual',
];

const columnSearchMatch = (value, filter) => isStringWthStarsMatch(value, filter.value);

class DevExtremeListHelper extends Component {
  state = {
    resizeCounter: 0,
    totalSummaryItems: [],
    orderColumns: [],
    prevIds: null,
    prevData: null,
    preparedRows: [],
    preparedColumns: [],
    tableColumnExtensions: [],
    preparedEditableColumnList: [],
    actionEditColumnWidth: 38,
    selectedItems: [],
  };

  static getDerivedStateFromProps(props, prevState) {
    if (
      JSON.stringify(props.ids) === prevState.prevIds &&
      JSON.stringify(props.data) === prevState.prevData &&
      props.fields.length === prevState.prevFieldsLength &&
      JSON.stringify(props.fields.map(field => field.id)) === prevState.prevFieldIds
    ) {
      return prevState;
    }
    const defaultCellWidth = getValue(CONFIG_CELL_WIDTH);

    // ------ check that selected ids exist on meta ids and set on state ---------------------
    const selectedIdsDependOnIds = prevState.selectedItems.filter(row =>
      props.ids && props.ids.length ? JSON.stringify(props.ids).includes(row.id) : null,
    );

    // ------ check that selected ids exist on meta ids and set on redux ---------------------
    props.setListSelectedIds(props.resource, selectedIdsDependOnIds);

    // ------ check that selected ids exist on meta ids and pass to parent ---------------------
    if (props.onSelect && typeof props.onSelect === 'function') {
      props.onSelect(selectedIdsDependOnIds.map(row => row['id']));
    }

    const gridWillHandleColumns = props.fields.map(field =>
      field && field.relatedName ? field.relatedName : null,
    );

    const tableColumnExtensions = [{ columnName: 'gridOperations', width: 80 }];
    props.fields.forEach(field => {
      const multiply = props.width === 'xs' ? 1.2 : 2;
      if (field && field.name) {
        tableColumnExtensions.push({
          columnName: field.name,
          width: field.width ? field.width * multiply : defaultCellWidth,
        });
      }
    });

    const TableRow = ({ row, style = {}, ...restProps }) => {
      const rowStyle = { ...style };

      return (
        <Table.Row
          {...restProps}
          style={rowStyle}
          onClick={event => {
            if (typeof props.onRowClick === 'function') {
              props.onRowClick(row);
              return;
            }
          }}
          data-test-grid-row={row.id}
        />
      );
    };

    const editableColumnList = props.fields.map(field => ({
      columnName: field.relatedName,
      editingEnabled: !!field.editable,
    }));

    const defaultGrouping = getGroupingColumns(props.fields).map(field => ({
      columnName: field.relatedName,
    }));

    return {
      ...prevState,
      gridWillHandleColumns,
      tableColumnExtensions,
      prevIds: JSON.stringify(props.ids),
      prevData: JSON.stringify(props.data),
      prevFieldsLength: props.fields.length,
      prevFieldIds: JSON.stringify(props.fields.map(field => field.id)),
      preparedRows: props.ids ? props.ids.map(key => props.data[key]) : [],
      preparedColumns: DevExtremeListHelper.getColumns(props),
      defaultGrouping,
      PreparedTableRow: memo(TableRow),
      preparedEditableColumnList: editableColumnList,
      orderColumns: DevExtremeListHelper.getColumnsDefaultOrder(props),
      selectedItems: selectedIdsDependOnIds,
    };
  }

  changeSorting = sorting => {
    if (sorting && sorting[0] && sorting[0].columnName) {
      this.props.setSort(sorting[0].columnName);
    }
  };

  changeFiltering = filterArray => {
    const filters = {};
    filterArray.forEach(item => {
      filters[item.columnName] = item.value;
      // const operation = item.operation ? item.operation : 'equal';
      // return [item.columnName, operation, item.value];
    });
    this.props.setFilters(filters);
  };

  /**
   * it will call everyTime that sellect all checkbox press to check the state and sellect all or deSelect all
   * both in local selectedItems state and redux ListSelectedIds
   * @returns {void}
   */
  changeSelection = () => {
    const { ids, setListSelectedIds, resource } = this.props;
    const { selectedItems, preparedRows } = this.state;

    const localPreparedRows = preparedRows;
    localPreparedRows.forEach(row => {
      row.id = String(row.id);
    });

    if (preparedRows.length === selectedItems.length) {
      setListSelectedIds(resource, []);
      this.setState({
        selectedItems: [],
      });
    } else {
      setListSelectedIds(resource, ids);
      this.setState({
        selectedItems: preparedRows,
      });
    }
  };

  static getColumns(props) {
    const { locale, fields } = props;

    const preparedColumns = [];

    fields.forEach(field => {
      // "rowstatecolor" contains only color info for row
      if (!field || (field && field.name === 'rowstatecolor')) {
        return;
      }

      preparedColumns.push({
        field, // to not find field again from list of fields
        name: field.relatedName, // use relatedName for all fields
        title: lodashGet(field, ['translatedCaption', locale], field.caption),
        columnName: field.relatedName, // used by filter
        predicate: columnSearchMatch, // used by filter
      });
    });

    return preparedColumns;
  }

  static getColumnsDefaultOrder(props) {
    const { fields, isDropDown, getSetting, getSettingForUser, metaData, resource } = props;

    const defaultSelected = getSetting(DEFAULT + '_' + CONFIG_LIST_COLUMN_CHOICE + '_' + resource);
    const userSelected = getSettingForUser(CONFIG_LIST_COLUMN_CHOICE + '_' + resource);

    // at first, it's all the fields
    let fieldList = clone(fields); // must be cloned!
    if (!isDropDown) {
      // if user has selected, or something default is set calculate fieldList again
      if ((userSelected && userSelected.length) || (defaultSelected && defaultSelected.length)) {
        const selectedIds = userSelected && userSelected.length ? userSelected : defaultSelected;

        const selectedFields = getFieldsById(metaData, selectedIds).map(field => {
          if (!field) {
            return null;
          }
          return field;
        });

        fieldList = [...selectedFields];
      }
    }
    return fieldList.map(field => (field ? field.relatedName : null));
  }

  getFilters() {
    const { filterValues } = this.props;

    const preparedFilter = [];
    for (const key in filterValues) {
      // if filter value is prepared
      if (Array.isArray(filterValues[key])) {
        // if current operator, is not in safe list of dev extreme, skip it, because dev ex can't handle it
        if (safeOperators.indexOf(filterValues[key][1]) === -1) {
          continue;
        }
        preparedFilter.push({
          columnName: filterValues[key][0],
          operation: filterValues[key][1],
          value: filterValues[key][2],
        });
      } else {
        const filterParam = getFilterByValue(key, filterValues[key]);

        // if current operator, is not in safe list of dev extreme, skip it, because dev ex can't handle it
        if (safeOperators.indexOf(filterParam[1]) === -1) {
          continue;
        }

        preparedFilter.push({
          columnName: filterParam[0],
          operation: filterParam[1],
          value: filterParam[2],
        });
      }
    }

    return preparedFilter;
  }

  getSort() {
    const { currentSort = {} } = this.props;
    const { field = '', order = '' } = currentSort;

    return [{ columnName: String(field), direction: order.toLowerCase() }];
  }

  /**
   * it use to calculate ids of items with extract ids from index array that comes
   * but after customizing ids store on local and redux state directly and it just
   * return all of ids that receve.
   * @returns {Array} selectedIds
   */
  getSelection() {
    const { selectedIds } = this.props;
    return selectedIds;
  }

  updateDimensions() {
    this.setState({ resizeCounter: Math.random() });
  }

  onColumnsOrderChange = newOrder => {
    const { fields, resource, setSetting } = this.props;
    const newOrderIdList = [];

    for (const item of newOrder) {
      if (item === 'gridOperations') {
        continue;
      }
      fields.filter(field => {
        if (field.relatedName === item) {
          newOrderIdList.push(field.id);
        }
      });
    }
    const userId = getValue(USER_ID);
    setSetting(userId + '_' + CONFIG_LIST_COLUMN_CHOICE + '_' + resource, newOrderIdList);
    this.setState({ orderColumns: newOrder });
  };

  /**
   * this function should clear all selected items from local state, redux state and also relation panel state.
   * @function clearSelection
   * @returns {void}
   */
  clearSelection = () => {
    const { resource, setListSelectedIds, onSelect } = this.props;

    this.setState({
      selectedItems: [],
    });

    setListSelectedIds(resource, []);

    if (onSelect && typeof onSelect === 'function') {
      onSelect([]);
    }
  };

  componentDidMount() {
    const { fields, selectionRef } = this.props;

    window.addEventListener('resize', () => {
      this.updateDimensions();
    });

    const tempTotalSummaryItems = [];
    fields.forEach(field => {
      if (!field) {
        return;
      }

      if (field.hasSummary) {
        tempTotalSummaryItems.push({ columnName: field.name, type: 'sum', format: field.format });
      }
    });

    this.setState({
      totalSummaryItems: tempTotalSummaryItems,
      resizeCounter: Math.random(),
    });

    if (selectionRef) {
      selectionRef.current = { clearSelection: this.clearSelection };
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  computeGridWidth() {
    const { isSlideOpen, width, relationMode } = this.props;
    const drawerWidth = getValue(DRAWER_WIDTH);
    let GridWidth = window.innerWidth - drawerWidth;
    if (width === 'xs') {
      GridWidth += drawerWidth;
    }

    if (relationMode) {
      GridWidth -= 48; // grid padding in show page
    } else if (isSlideOpen) {
      GridWidth -= drawerWidth;
    }
    return GridWidth;
  }

  /**
   * Custom Header selection component to handle sellect all checkbox to select or deSelect all ids
   * @param {Object} props
   * @returns {React.Component} that render the checkbox at trhe top of grid
   */
  customHeaderSelectionComponent = props => {
    const { selectedItems, preparedRows } = this.state;
    const { resource, setListSelectedIds, onSelect } = this.props;

    const nothingSelected = selectedItems.length === 0;
    const someSelected = selectedItems.length > 0 && preparedRows.length > selectedItems.length;
    const allSelected = preparedRows.length === selectedItems.length;

    const onToggle = () => {
      if (nothingSelected || someSelected) {
        // ------ for save in an state to custom handeling ---------------------
        this.setState({
          selectedItems: preparedRows,
        });

        // ------ save state ids into redux ---------------------
        setListSelectedIds(
          resource,
          preparedRows.map(row => +row.id),
        );

        // ------ pass new selected items to relation panel to handle local computes ---------------------
        if (onSelect && typeof onSelect === 'function') {
          onSelect(preparedRows.map(row => +row.id));
        }
      } else if (allSelected) {
        // ------ for save in an state to custom handeling ---------------------
        this.setState({
          selectedItems: [],
        });

        // ------ save state ids into redux ---------------------
        setListSelectedIds(resource, []);

        // ------ pass new selected items to relation panel to handle local computes ---------------------
        if (onSelect && typeof onSelect === 'function') {
          onSelect([]);
        }
      }
    };

    return (
      <TableSelection.HeaderCell
        {...props}
        onToggle={onToggle}
        someSelected={someSelected}
        allSelected={allSelected}
      />
    );
  };

  /**
   * Custom selection component to handle saving row ids instead of index in redux selection state
   * @param {Object} props
   * @returns {React.Component} that render the checkbox at the end of each row
   */
  customSelectionComponent = props => {
    const rowTemp = props.row;
    const { ...localProps } = props;

    const { resource, setListSelectedIds, onSelect } = this.props;
    const { selectedItems } = this.state;

    const onToggle = () => {
      let selectedItemsTemp = selectedItems;

      // ------ for save in an state to custom handeling ---------------------
      if (selectedItemsTemp.map(item => item.id).includes(rowTemp.id)) {
        selectedItemsTemp = selectedItemsTemp.filter(row => row.id !== rowTemp.id);
        this.setState({
          selectedItems: selectedItemsTemp,
        });
      } else {
        selectedItemsTemp.push(rowTemp);
        this.setState({
          selectedItems: selectedItemsTemp,
        });
      }

      // ------ save state ids into redux ---------------------
      const selectedIds = selectedItemsTemp.length
        ? Array.from(selectedItemsTemp).map(row => +row.id)
        : [];
      setListSelectedIds(resource, selectedIds);

      // ------ pass new selected items to relation panel to handle local computes ---------------------
      if (onSelect && typeof onSelect === 'function') {
        onSelect(selectedItemsTemp ? selectedItemsTemp.map(row => row['id']) : []);
      }
    };

    return rowTemp.type === 'folder' ? (
      <Table.StubCell />
    ) : (
      <TableSelection.Cell
        {...localProps}
        onToggle={onToggle}
        selected={selectedItems.map(item => item.id).includes(rowTemp.id)}
      />
    );
  };

  render() {
    throw new Error('DevExtremeListHelper: Dear developer, please write your own render method');
    return;
  }
}

export default DevExtremeListHelper;
