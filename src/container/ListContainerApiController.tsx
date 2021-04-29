import React, { Component, isValidElement, ReactNode } from 'react';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string'; // TODO: replace "query-string" with "qs"
import { push as pushAction } from 'connected-react-router';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import inflection from 'inflection';
import debounce from 'lodash/debounce';
import pickBy from 'lodash/pickBy';
import lodashIsEqual from 'lodash/isEqual';
import { withStyles } from '@material-ui/core/styles';
import { Icon, Typography } from '@material-ui/core';
import {
  queryReducer,
  removeEmpty,
  changeListParams as changeListParamsAction,
  setListSelectedIds as setListSelectedIdsAction,
  toggleListItem as toggleListItemAction,
  withTranslate,
  removeKey,
  Responsive,
  Identifier,
  ListParams,
} from 'react-admin';

import SettingHOC, {
  CONFIG_LIST_LAST_FILTER,
  CONFIG_LIST_PER_PAGE,
  CONFIG_LIST_SORT,
  SET_SETTING_FOR_USER,
} from './SettingHOC';
import { clone, isEmpty, isEmptyObject } from '../helper/DataHelper';
import { crudGetListWithCustomQueryAction } from '../redux/crud/action';
import { SavedFilterItemType } from '../helper/Types';

const SET_SORT = 'SET_SORT';
const SORT_ASC = 'ASC';
const SORT_DESC = 'DESC';

const SET_PAGE = 'SET_PAGE';
const SET_PER_PAGE = 'SET_PER_PAGE';

const SET_FILTER = 'SET_FILTER';

const styles = theme => ({
  resourceIsDisabled: {
    color: theme.palette.text.hint,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
  },

  resourceIsDisabledText: {
    color: theme.palette.text.hint,
  },

  root: {},
  card: {},
  actions: {},
  header: {},
  childrenContainer: {},
  noResults: {},
  tabParent: {},
  toolbarBottomContainer: {},
  bulkActionsToolbar: {},
  collapsed: {},
});

/**
 * ListContainer page component
 *
 * The <ListContainer> component renders the list layout (title, buttons, filters, pagination),
 * and fetches the list of records from the REST API.
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * In Redux terms, <ListContainer> is a connected component, and <Datagrid> is a dumb component.
 *
 * Props:
 *   - title
 *   - perPage
 *   - sort
 *   - filter (the permanent filter to apply to the query)
 *   - actions
 *   - filters (a React Element used to display the filter form)
 *   - pagination
 *
 * @example
 *     const PostFilter = (props) => (
 *         <Filter {...props}>
 *             <TextInput label="Search" source="q" alwaysOn />
 *             <TextInput label="Title" source="title" />
 *         </Filter>
 *     );
 *     export const PostList = (props) => (
 *         <ListContainer {...props}
 *             title="ListContainer of posts"
 *             sort={{ field: 'published_at' }}
 *             filter={{ is_published: true }}
 *             filters={<PostFilter />}
 *         >
 *             <Datagrid>
 *                 <TextField source="id" />
 *                 <TextField source="title" />
 *                 <EditButton />
 *             </Datagrid>
 *         </ListContainer>
 *     );
 */

export interface ListViewProps {
  hideFilter: (name: string) => void;
  filterValues: any;
  onSelect: (ids: Identifier[]) => void;
  onToggleItem: (id: Identifier) => void;
  onUnselectItems: () => void;
  setFilters: (filters: { [key: string]: any }, removeAllVisibleNotUsedFields?: boolean) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSort: (newSort: string) => void;
  showFilter: (filterName: string, defaultValue: any) => void;
  showFilterByList: (filterList: string[]) => void;
  basePath: string;
  currentSort: {
    field: string;
    order: string;
  };
  data: { [key: string]: object };
  defaultTitle: string | undefined;
  displayedFilters: UnconnectedListControllerState;
  hasCreate: boolean | undefined;
  ids: Identifier[];
  isLoading: boolean;
  loadedOnce: boolean;
  page: number;
  perPage: number;
  resource: string;
  selectedIds: Identifier[];
  translate: any;
  total: number;
  version: number;
}

interface UnconnectedListControllerProps {
  isResourceDisabled: boolean;
  basePath: string;
  currentSort: {
    field: string;
    order: string;
  };
  data: { [key: string]: object };
  defaultTitle: string | undefined;
  displayedFilters: { [key: string]: boolean };
  hasCreate: boolean | undefined;
  ids: Identifier[];
  isLoading: boolean;
  loadedOnce: boolean;
  page: number;
  perPage: number;
  resource: string;
  selectedIds: Identifier[];
  translate: any;
  total: number;
  version: number;
  enableSetSetting: boolean;
  setSettingForUser: Function;
  debounce: number;
  filter?: object;
  filterDefaultValues?: object;
  sort: {
    field: string;
    order: string;
  };
  changeListParams: (resource: string, newParams: ListParams) => void;
  query: any;
  params: any;
  className?: string;
  crudGetListWithCustomQuery: Function;
  gridProps: any;
  withFile: boolean;
  setSelectedIds: (resource: string, ids: Identifier[]) => void;
  toggleItem: (resource: string, id: Identifier) => void;
  location: any;
  classes: any;
  push: Function;
  children: (props: ListViewProps) => ReactNode;
  skipPrefix?: boolean; // skip prefix when data provider makes a request
  activeTabIndex: number;
  isMultiReport: boolean;
  isReport: boolean;
  requiredFilters?: string[];
}

interface UnconnectedListControllerState {
  [key: string]: boolean;
}

export class UnconnectedListController extends Component<
  UnconnectedListControllerProps,
  UnconnectedListControllerState
> {
  static defaultProps = {
    debounce: 500,
    filter: {},
    perPage: 10,
    sort: {
      field: 'id',
      order: SORT_DESC,
    },
  };

  state = {};
  activeResource = '';

  setFilters = debounce(
    (filters: SavedFilterItemType, removeAllVisibleNotUsedFields = false): void => {
      let displayedFiltersChanged = false;
      const displayedFilters = clone(this.state);
      const { requiredFilters } = this.props;

      // only fields that are used in "filters" are kept
      if (removeAllVisibleNotUsedFields) {
        // for update required filters
        Object.keys(this.state).forEach(name => {
          if (this.props.isReport || this.props.isMultiReport) {
            displayedFilters[name] =
              requiredFilters && requiredFilters.includes(name) ? true : false;
          } else {
            displayedFilters[name] = false;
          }

          displayedFiltersChanged = true;
        });
      }

      // keep empty value filters on the page
      Object.keys(filters).forEach(name => {
        displayedFilters[name] = true;
        displayedFiltersChanged = true;
      });

      if (displayedFiltersChanged) {
        this.setState(displayedFilters);
      }

      if (lodashIsEqual(filters, this.getFilterValues())) {
        return;
      }
      const { setSettingForUser, resource, enableSetSetting } = this.props;
      // save last filter of this user in a setting, so it will be accessible by DynamicList
      if (enableSetSetting) {
        setSettingForUser(CONFIG_LIST_LAST_FILTER + '_' + resource, filters);
      }

      // fix for react-final-form bug with onChange and enableReinitialize
      const filtersWithoutEmpty = removeEmpty(filters);
      this.changeParams({
        type: SET_FILTER,
        payload: { filter: filtersWithoutEmpty },
      });
    },
    this.props.debounce,
  );

  componentDidMount() {
    const {
      isResourceDisabled,
      filter,
      query,
      ids,
      params,
      total,
      requiredFilters,
      isReport,
      isMultiReport,
    } = this.props;

    if (isResourceDisabled) {
      return;
    }

    if (filter && isValidElement(filter)) {
      throw new Error(
        '<ListContainer> received a React element as `filter` props. If you intended to set the list filter elements, use the `filters` (with an s) prop instead. The `filter` prop is internal and should not be set by the developer.',
      );
    }
    if (!query.page && !(ids || []).length && params.page > 1 && total > 0) {
      this.setPage(params.page - 1);
      return;
    }

    this.updateData();

    // here should check the filter names and if there were in required filters list, they should
    // render at the first time render so should add their names to this.state (onley in report and multi report )
    if (isReport || isMultiReport) {
      if (requiredFilters) {
        const preparedRequiredFilters = {};
        requiredFilters.forEach(name => {
          preparedRequiredFilters[name] = true;
        });
        this.setState(preparedRequiredFilters);
      }
    }

    let shouldCallSetFilters = false;
    const filters = this.getFilterValues();
    if (!isEmptyObject(filters)) {
      if (!isEmptyObject(this.state)) {
        Object.keys(this.state).forEach(displayedFilter => {
          Object.keys(filters).forEach(filterValue => {
            if (filterValue === displayedFilter) {
              shouldCallSetFilters = false;
            } else {
              shouldCallSetFilters = true;
            }
          });
          if (shouldCallSetFilters) {
            this.setFilters(filters);
          }
        });
      } else {
        this.setFilters(filters);
      }
    }
  }

  componentWillUnmount() {
    this.setFilters.cancel();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMultiReport && prevProps.activeTabIndex !== this.props.activeTabIndex) {
      this.setPage(1);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.resource !== this.props.resource ||
      nextProps.query.sort !== this.props.query.sort ||
      nextProps.query.order !== this.props.query.order ||
      nextProps.query.page !== this.props.query.page ||
      nextProps.query.perPage !== this.props.query.perPage ||
      !lodashIsEqual(nextProps.query.filter, this.props.query.filter) ||
      !lodashIsEqual(nextProps.filter, this.props.filter) ||
      !lodashIsEqual(nextProps.sort, this.props.sort) ||
      !lodashIsEqual(nextProps.perPage, this.props.perPage) ||
      !lodashIsEqual(nextProps.page, this.props.page)
    ) {
      this.updateData(
        Object.keys(nextProps.query).length > 0 ? nextProps.query : nextProps.params,
        nextProps,
      );
    }
    if (nextProps.version !== this.props.version) {
      this.updateData(null, nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // ------ for unselect checkboxes when chenge tab ---------------------
    if (nextProps.activeTabIndex !== this.props.activeTabIndex) {
      this.handleUnselectItems();
    }

    if (
      nextProps.className === this.props.className &&
      nextProps.translate === this.props.translate &&
      nextProps.isLoading === this.props.isLoading &&
      nextProps.version === this.props.version &&
      nextState === this.state &&
      nextProps.data === this.props.data &&
      nextProps.selectedIds === this.props.selectedIds &&
      nextProps.total === this.props.total &&
      lodashIsEqual(nextProps.gridProps, this.props.gridProps) &&
      lodashIsEqual(nextProps.sort, this.props.sort)
    ) {
      return false;
    }
    return true;
  }

  /**
   * Check if user has already set custom sort, page, or filters for this list
   *
   * User params come from the Redux store as the params props. By default,
   * this object is:
   *
   * { filter: {}, order: null, page: 1, perPage: null, sort: null }
   *
   * To check if the user has custom params, we must compare the params
   * to these initial values.
   *
   * @param {object} params
   */
  hasCustomParams(params) {
    return (
      params &&
      params.filter &&
      (Object.keys(params.filter).length > 0 ||
        params.order != null ||
        params.page !== 1 ||
        params.perPage != null ||
        params.sort != null)
    );
  }

  /**
   * Merge list params from 4 different sources:
   *   - the query string
   *   - the params stored in the state (from previous navigation)
   *   - the filter defaultValues
   *   - the props passed to the ListContainer component
   */
  getQuery(props = this.props) {
    let query;
    if (Object.keys(props.query).length > 0) {
      query = props.query;
      if (props.isMultiReport) {
        query.filter = props.filterDefaultValues || {};
      }
    } else if (this.hasCustomParams(props.params)) {
      query = { ...props.params };
    } else {
      query = { filter: props.filterDefaultValues || {} };
    }

    if (props.isMultiReport || !query.order || !query.sort) {
      query.order = props.sort.order;
      query.sort = props.sort.field;
    }

    if (props.isMultiReport || !query.perPage) {
      query.perPage = props.perPage;
    }

    if (
      props.isMultiReport &&
      (!query.page || String(props.resource) !== String(this.activeResource))
    ) {
      query.page = '1';
    }

    if (!query.withFile) {
      query.withFile = props.withFile;
    }

    return query;
  }

  getFilterValues(props = this.props) {
    const { filterDefaultValues = {}, filter: permanentFilter = {} } = props;
    const query = this.getQuery(props);
    const currentFilter = query.filter || {};

    return {
      ...filterDefaultValues,
      ...currentFilter,
      ...permanentFilter,
    };
  }

  updateData(query = null, props = this.props) {
    // const params = query || this.getQuery(props);
    const params = this.getQuery(props);
    const { sort, order, page = 1, perPage, filter } = params;
    const {
      withFile,
      skipPrefix = false,
      isMultiReport = false,
      resource,
      changeListParams,
      crudGetListWithCustomQuery,
      filterDefaultValues = {},
      isReport = false,
    } = props;

    const pagination = {
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
    };

    const permanentFilter = props.filter;

    const queryParams: any = {};
    if (withFile) {
      queryParams.withFile = 'true';
    }

    const reduxQuery = props.params;
    reduxQuery.page = reduxQuery.page ? String(reduxQuery.page) : null;
    this.activeResource = resource;

    let hasEmptyRequiredParameter = false;

    const { requiredFilters } = this.props;

    // it will check that is there any required filter with empty value or not.
    // ( only check if it be a report or multi report )
    if (isReport || isMultiReport) {
      if (isEmptyObject(params.filter) && requiredFilters && requiredFilters.length > 0) {
        hasEmptyRequiredParameter = true;
      } else if (params.filter && requiredFilters && requiredFilters.length > 0) {
        const requestParams = Object.keys(params.filter);
        requiredFilters.forEach(name => {
          if (!requestParams.includes(name)) {
            hasEmptyRequiredParameter = true;
          }
        });
      }
    }

    if (isMultiReport) {
      if (
        (isEmptyObject(props.data) || !lodashIsEqual(params, reduxQuery)) &&
        !hasEmptyRequiredParameter
      ) {
        changeListParams(resource, params);
        crudGetListWithCustomQuery(
          resource,
          pagination,
          { field: sort, order },
          filterDefaultValues,
          { skipPrefix, queryParams },
        );
      }
    } else if (isReport) {
      // if be in puzzle form
      if (hasEmptyRequiredParameter && permanentFilter && !isEmptyObject(permanentFilter)) {
        changeListParams(resource, params);
        crudGetListWithCustomQuery(
          resource,
          pagination,
          { field: sort, order },
          { ...filterDefaultValues, ...filter, ...permanentFilter },
          { skipPrefix, queryParams },
        );
      } else if (!hasEmptyRequiredParameter) {
        // if not be in puzzle form
        changeListParams(resource, params);
        crudGetListWithCustomQuery(
          resource,
          pagination,
          { field: sort, order },
          { ...filterDefaultValues, ...filter, ...permanentFilter },
          { skipPrefix, queryParams },
        );
      }
    } else {
      changeListParams(resource, params);
      crudGetListWithCustomQuery(
        resource,
        pagination,
        { field: sort, order },
        isMultiReport
          ? { ...filterDefaultValues }
          : { ...filterDefaultValues, ...filter, ...permanentFilter },
        { skipPrefix, queryParams },
      );
    }
  }

  setPerPage = (perPage: number) => {
    const { setSettingForUser, resource, enableSetSetting } = this.props;

    // if use of setting is enabled
    if (enableSetSetting) {
      // remember users choice for this resource
      setSettingForUser(CONFIG_LIST_PER_PAGE + '_' + resource, perPage);
    }
    this.changeParams({ type: SET_PER_PAGE, payload: perPage });
  };

  setSort = (newSort: string, order = '') => {
    const { setSettingForUser, resource, enableSetSetting, query } = this.props;

    const prepareOrder = () => {
      if (!isEmpty(order) && (order === SORT_DESC || order === SORT_ASC)) {
        return order;
      } else if (String(query.sort) !== String(newSort)) {
        return query.order;
      } else {
        return query.order === SORT_DESC ? SORT_ASC : SORT_DESC;
      }
    };

    if (enableSetSetting) {
      const preparedSort = {
        field: newSort,
        order: prepareOrder(),
      };
      setSettingForUser(CONFIG_LIST_SORT + '_' + resource, preparedSort);
    }

    this.changeParams({ type: SET_SORT, payload: { sort: newSort, order: prepareOrder() } });
  };

  setPage = (page: number) => {
    this.changeParams({ type: SET_PAGE, payload: page });
  };

  showFilter = (filterName: string, defaultValue: any) => {
    this.setState({ [filterName]: true });
    if (typeof defaultValue !== 'undefined') {
      this.setFilters({
        ...this.getFilterValues(),
        [filterName]: defaultValue,
      });
    }
  };

  showFilterByList = (filterList: string[]) => {
    const newState = {};
    filterList.forEach(name => {
      newState[name] = true;
    });

    this.setState({
      ...this.state,
      ...newState,
    });
  };

  hideFilter = (filterName: string) => {
    this.setState({ [filterName]: false });
    const newFilters = removeKey(this.getFilterValues(), filterName);
    this.setFilters(newFilters);
  };

  handleSelect = (ids: Identifier[]) => {
    this.props.setSelectedIds(this.props.resource, ids);
  };

  handleUnselectItems = () => {
    this.props.setSelectedIds(this.props.resource, []);
  };

  handleToggleItem = (id: Identifier) => {
    this.props.toggleItem(this.props.resource, id);
  };

  changeParams(action) {
    const newParams = queryReducer(this.getQuery(), action);
    this.props.push({
      ...this.props.location,
      search: `?${stringify({
        ...newParams,
        filter: JSON.stringify(newParams.filter),
      })}`,
    });
  }

  render() {
    const {
      basePath,
      children,
      resource,
      hasCreate,
      data,
      ids,
      loadedOnce,
      total,
      isLoading,
      translate,
      version,
      selectedIds,
      isResourceDisabled,
      classes,
    } = this.props;

    if (isResourceDisabled) {
      return (
        <Responsive
          className={classes.resourceIsDisabled}
          small={
            <div>
              <Icon style={{ fontSize: 40 }}>report_problem</Icon>
              <Typography className={classes.resourceIsDisabledText} variant="h5">
                {translate('grid.resourceIsDisabled')}
              </Typography>
            </div>
          }
          medium={
            <div>
              <Icon style={{ fontSize: 90 }}>report_problem</Icon>
              <Typography className={classes.resourceIsDisabledText} variant="h2">
                {translate('grid.resourceIsDisabled')}
              </Typography>
            </div>
          }
        />
      );
    }

    const query = this.getQuery();
    const resourceName = translate(`resources.${resource}.name`, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      smart_count: 2,
      _: inflection.humanize(inflection.pluralize(resource)),
    });
    const defaultTitle = translate('ra.page.list', {
      name: resourceName,
    });

    return children({
      basePath,
      currentSort: {
        field: query.sort,
        order: query.order,
      },
      data,
      defaultTitle,
      displayedFilters: this.state,
      filterValues: this.getFilterValues(),
      hasCreate,
      hideFilter: this.hideFilter,
      ids,
      isLoading,
      loadedOnce,
      onSelect: this.handleSelect,
      onToggleItem: this.handleToggleItem,
      onUnselectItems: this.handleUnselectItems,
      page: (typeof query.page === 'string' ? parseInt(query.page, 10) : query.page) || 1,
      perPage:
        (typeof query.perPage === 'string' ? parseInt(query.perPage, 10) : query.perPage) || 10,
      resource,
      selectedIds,
      setFilters: this.setFilters,
      setPage: this.setPage,
      setPerPage: this.setPerPage,
      setSort: this.setSort,
      showFilter: this.showFilter,
      showFilterByList: this.showFilterByList,
      translate,
      total,
      version,
    });
  }
}

const injectedProps = [
  'basePath',
  'currentSort',
  'data',
  'defaultTitle',
  'displayedFilters',
  'filterValues',
  'hasCreate',
  'hideFilter',
  'ids',
  'isLoading',
  'loadedOnce',
  'onSelect',
  'onToggleItem',
  'onUnselectItems',
  'page',
  'perPage',
  'refresh',
  'resource',
  'selectedIds',
  'setFilters',
  'setPage',
  'setPerPage',
  'setSort',
  'showFilter',
  'total',
  'translate',
  'version',
];

/**
 * Select the props injected by the ListContainerApiController
 * to be passed to the ListContainer children need
 * This is an implementation of pick()
 */
export const getListControllerProps = props =>
  injectedProps.reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

/**
 * Select the props not injected by the ListContainerApiController
 * to be used inside the ListContainer children to sanitize props injected by ListContainer
 * This is an implementation of omit()
 */
export const sanitizeListRestProps = props =>
  Object.keys(props)
    .filter(propName => !injectedProps.includes(propName))
    .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

const validQueryParams = ['page', 'perPage', 'sort', 'order', 'filter', 'detail'];
const getLocationPath = props => props.location.pathname;
const getLocationSearch = props => props.location.search;
const selectQuery = createSelector(getLocationPath, getLocationSearch, (path, search) => {
  const query = pickBy(parse(search), (v, k) => validQueryParams.indexOf(k) !== -1);
  if (query.filter && typeof query.filter === 'string') {
    try {
      query.filter = JSON.parse(query.filter);
    } catch (err) {
      delete query.filter;
    }
  }
  return query;
});

function mapStateToProps(state, props) {
  const resourceState = state.admin.resources[props.resource];

  if (!resourceState) {
    return {
      isResourceDisabled: true,
      query: selectQuery(props),
      isLoading: state.admin.loading > 0,
      version: state.admin.ui.viewVersion,
    };
  }

  return {
    isResourceDisabled: false,
    query: selectQuery(props),
    params: resourceState.list.params,
    ids: resourceState.list.ids,
    loadedOnce: resourceState.list.loadedOnce,
    selectedIds: resourceState.list.selectedIds,
    total: resourceState.list.total,
    data: resourceState.data,
    isLoading: state.admin.loading > 0,
    version: state.admin.ui.viewVersion,
  };
}

const mapDispatchToProps = {
  crudGetListWithCustomQuery: crudGetListWithCustomQueryAction,
  changeListParams: changeListParamsAction,
  setSelectedIds: setListSelectedIdsAction,
  toggleItem: toggleListItemAction,
  push: pushAction,
};

const ListContainerApiController = compose(
  SettingHOC([SET_SETTING_FOR_USER]),
  connect(mapStateToProps, mapDispatchToProps),
  withTranslate,
  withStyles(styles, { withTheme: true }),
)(UnconnectedListController);

export default ListContainerApiController;
