import React, { Component } from 'react';
import lodashGet from 'lodash/get';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {
  getListControllerProps,
  Title,
  BulkDeleteButton,
  BulkActionsToolbar,
  defaultTheme,
} from 'react-admin';

import ListContainerApiController from './ListContainerApiController';
import TabChild from '../component/form/TabChild';
import TabParent from '../component/form/TabParent';
import LoadingBox from '../component/LoadingBox';
import SettingHOC, {
  CONFIG_LIST_LAST_FILTER,
  CONFIG_LIST_SORT,
  CONFIG_LIST_PER_PAGE,
  GET_SETTING_FOR_USER,
} from './SettingHOC';
import { getDefaultSort, getFilterColumns } from '../helper/MetaHelper';
import { isEmpty } from '../helper/DataHelper';

export const styles = {
  root: {
    display: 'flex',
  },

  card: {
    position: 'relative',
    flex: '1 1 auto',
    borderRadius: 0,
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
  },

  childrenContainer: {},

  noResults: { padding: 20 },

  toolbarBottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // height: 50,
  },

  tabParent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },

  bulkActionsToolbar: {
    height: 40,
    minHeight: 40,
    '& h6': {
      fontSize: 12,
    },
    '& div:last-child': {
      padding: 0,
      alignItems: 'center',
      backgroundColor: 'unset',
    },
  },

  collapsed: {
    minHeight: 0,
    height: 0,
    overflowY: 'hidden',
  },
};

const sanitizeRestProps = ({
  actions,
  basePath,
  bulkActions,
  changeListParams,
  children,
  classes,
  className,
  crudGetList,
  currentSort,
  data,
  defaultTitle,
  displayedFilters,
  exporter,
  filter,
  filterDefaultValues,
  filters,
  filterValues,
  hasCreate,
  hasEdit,
  hasList,
  hasShow,
  hasDelete,
  hideFilter,
  history,
  ids,
  isLoading,
  loadedOnce,
  locale,
  location,
  match,
  onSelect,
  onToggleItem,
  onUnselectItems,
  options,
  page,
  pagination,
  params,
  permissions,
  perPage,
  push,
  query,
  refresh,
  resource,
  selectedIds,
  setFilters,
  setPage,
  setPerPage,
  setSelectedIds,
  setSort,
  showFilter,
  sort,
  theme,
  title,
  toggleItem,
  total,
  translate,
  version,
  ...rest
}) => rest;

const ListView = ({
  // component props
  actions,
  settingToolbar,
  aside,
  filters,
  bulkActions, // deprecated
  bulkActionButtons = <BulkDeleteButton undoable={false} />,
  pagination,
  // overridable by user
  children,
  className,
  classes,
  exporter,
  title,
  gridProps,
  metaData,
  childResourceList,
  defaultTabIndex,
  changeActiveResource,
  getFieldsForDisplay,
  showFilterByList,
  withFile,
  enableSetSetting,
  isWMS,
  ...rest
}) => {
  const { defaultTitle, version, isLoading } = rest;
  const controllerProps = getListControllerProps(rest);

  return (
    <div className={classNames('list-page', classes.root, className)} {...sanitizeRestProps(rest)}>
      <Title title={title} defaultTitle={defaultTitle} />
      <Card className={classes.card}>
        {isWMS && (
          <BulkActionsToolbar
            classes={{
              toolbar: classes.bulkActionsToolbar,
              collapsed: classes.collapsed,
            }}
            {...controllerProps}
          >
            {bulkActionButtons}
          </BulkActionsToolbar>
        )}
        {childResourceList ? (
          <TabParent
            className={classes.tabParent}
            defaultTabIndex={defaultTabIndex}
            onChange={(tab, index) => changeActiveResource(index)}
          >
            {childResourceList.map(
              ({
                resource: childResource,
                metaData: childMetaData,
                title,
                quickEditRowCallback,
                ...innerProps
              }) => (
                <TabChild key={childResource} label={title}>
                  {childMetaData ? (
                    <div className={classes.childrenContainer} key={version}>
                      {React.cloneElement(children, {
                        ...controllerProps,
                        ...gridProps,
                        ...innerProps,
                        hasBulkActions: bulkActions !== false && bulkActionButtons !== false,
                        resource: childResource,
                        fields: getFieldsForDisplay(childResource, childMetaData),
                        metaData: childMetaData,
                        quickEditRowCallback,
                        actionEditColumnCount: typeof quickEditRowCallback === 'function' ? 2 : 0,
                        isLoading,
                      })}
                      {(!!pagination || !!settingToolbar) && (
                        <div className={classes.toolbarBottomContainer}>
                          {pagination &&
                            React.cloneElement(pagination, {
                              ...controllerProps,
                              resource: childResource,
                            })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <LoadingBox />
                  )}
                </TabChild>
              ),
            )}
          </TabParent>
        ) : (
          <div className={classes.childrenContainer} key={version}>
            {children &&
              React.cloneElement(children, {
                ...controllerProps,
                ...gridProps,
                hasBulkActions: bulkActions !== false && bulkActionButtons !== false,
                isLoading,
              })}
            {(!!pagination || settingToolbar) && (
              <div className={classes.toolbarBottomContainer}>
                {pagination && React.cloneElement(pagination, controllerProps)}
              </div>
            )}
          </div>
        )}
      </Card>
      {aside && React.cloneElement(aside, controllerProps)}
    </div>
  );
};

ListView.propTypes = {
  actions: PropTypes.element,
  settingToolbar: PropTypes.element,
  aside: PropTypes.node,
  basePath: PropTypes.string,
  bulkActions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  bulkActionButtons: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  children: PropTypes.element,
  className: PropTypes.string,
  classes: PropTypes.object,
  currentSort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  data: PropTypes.object,
  defaultTitle: PropTypes.string,
  displayedFilters: PropTypes.object,
  exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  filters: PropTypes.element,
  filterValues: PropTypes.object,
  hasCreate: PropTypes.bool,
  hideFilter: PropTypes.func,
  ids: PropTypes.array,
  isLoading: PropTypes.bool,
  onSelect: PropTypes.func,
  onToggleItem: PropTypes.func,
  onUnselectItems: PropTypes.func,
  page: PropTypes.number,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  perPage: PropTypes.number,
  refresh: PropTypes.func,
  resource: PropTypes.string,
  selectedIds: PropTypes.array,
  setFilters: PropTypes.func,
  setPage: PropTypes.func,
  setPerPage: PropTypes.func,
  setSort: PropTypes.func,
  showFilter: PropTypes.func,
  title: PropTypes.any,
  total: PropTypes.number,
  translate: PropTypes.func,
  version: PropTypes.number,
  isWMS: PropTypes.bool,
};

ListView.defaultProps = {
  classes: {},
};

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
class ListContainer extends Component {
  state = {
    activeResource: undefined,
    prevChildList: undefined,
    activeSort: undefined,
    activeTabIndex: undefined,
  };

  static getDerivedStateFromProps(props, prevState) {
    const { resource, childResourceList, defaultTabIndex = 0, metaData, sort } = props;

    if (!childResourceList) {
      return {
        ...prevState,
        activeResource: resource,
        activeSort: sort || getDefaultSort(metaData),
      };
    }

    if (prevState.prevChildList === JSON.stringify(childResourceList)) {
      return prevState;
    }

    const tabIndex = isEmpty(prevState.activeTabIndex) ? defaultTabIndex : prevState.activeTabIndex;

    return {
      ...prevState,
      activeResource: lodashGet(childResourceList, [tabIndex, 'resource'], resource),
      activeSort: sort || getDefaultSort(lodashGet(childResourceList, [tabIndex, 'metaData'])),
      prevChildList: JSON.stringify(childResourceList),
      activeTabIndex: tabIndex,
    };
  }

  changeActiveResource = index => {
    const { childResourceList, sort } = this.props;
    this.setState({
      activeResource: childResourceList[index].resource,
      activeSort: sort || getDefaultSort(childResourceList[index].metaData),
      activeTabIndex: index,
    });
  };
  render() {
    const {
      isSettingReady,
      getSettingForUser,
      perPage,
      filterDefaultValues,
      useSimpleApi,
      enableSetSetting,
      metaData,
      ...rest
    } = this.props;
    const {
      activeResource: resource,
      activeSort: sort,
      activeTabIndex: activeTabIndex,
    } = this.state;

    const ApiController = ListContainerApiController;

    const prepareSort = () => {
      const userChoosedSort = getSettingForUser(CONFIG_LIST_SORT + '_' + resource);
      return !!userChoosedSort && !!userChoosedSort.field && !!userChoosedSort.order
        ? userChoosedSort
        : sort;
    };

    // here will extract the required filters from the metaData
    const filterColumns = getFilterColumns(metaData);
    const requiredFields =
      filterColumns.length > 0 ? filterColumns.filter(filter => filter.required) : null;

    // check is report
    const isReport = resource.indexOf('report') === 0;

    return (
      <ApiController
        {...rest}
        useSimpleApi={useSimpleApi}
        resource={resource}
        filterDefaultValues={
          enableSetSetting
            ? getSettingForUser(CONFIG_LIST_LAST_FILTER + '_' + resource) || filterDefaultValues
            : filterDefaultValues
        }
        perPage={getSettingForUser(CONFIG_LIST_PER_PAGE + '_' + resource) || perPage}
        sort={prepareSort()}
        enableSetSetting={enableSetSetting}
        activeTabIndex={activeTabIndex}
        requiredFilters={requiredFields ? requiredFields.map(field => field.name) : null}
        isReport={isReport}
      >
        {controllerProps => (
          <ListView
            {...rest}
            {...controllerProps}
            resource={resource}
            changeActiveResource={this.changeActiveResource}
          />
        )}
      </ApiController>
    );
  }
}

ListContainer.propTypes = {
  // the props you can change
  actions: PropTypes.element,
  settingToolbar: PropTypes.element,
  aside: PropTypes.node,
  bulkActions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  bulkActionButtons: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  filter: PropTypes.object,
  filterDefaultValues: PropTypes.object,
  filters: PropTypes.element,
  pagination: PropTypes.element,
  perPage: PropTypes.number.isRequired,
  sort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  title: PropTypes.any,
  // the props managed by react-admin
  authProvider: PropTypes.func,
  hasCreate: PropTypes.bool.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  hasList: PropTypes.bool.isRequired,
  hasShow: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  path: PropTypes.string,
  resource: PropTypes.string.isRequired,
  childResourceList: PropTypes.array,
  theme: PropTypes.object.isRequired,
  defaultTabIndex: PropTypes.number,
  getFieldsForDisplay: PropTypes.func.isRequired,
  useSimpleApi: PropTypes.bool,
  withFile: PropTypes.bool,
  enableSetSetting: PropTypes.bool,
  isWMS: PropTypes.bool,
};

ListContainer.defaultProps = {
  filter: {},
  perPage: 10,
  theme: defaultTheme,
};

export default compose(SettingHOC([GET_SETTING_FOR_USER]), withStyles(styles))(ListContainer);
