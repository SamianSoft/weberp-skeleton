import React, { useState, useRef } from 'react';
import { useLocale } from 'react-admin';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';

import DevExGrid from '../component/DevExGrid';
import SettingToolbar from '../component/SettingToolbar';
import ListContainer from './ListContainer';
import { getGridColumns, getTranslatedName, getFieldsById } from '../helper/MetaHelper';
import { DRAWER_WIDTH, getValue } from '../core/configProvider';
import SettingHOC, {
  DEFAULT,
  CONFIG_LIST_COLUMN_CHOICE,
  GET_SETTING_FOR_USER,
  GET_SETTING,
} from './SettingHOC';
import NotFound from '../component/NotFound';
import LoadingBox from '../component/LoadingBox';

const drawerWidth = getValue(DRAWER_WIDTH);

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
  },

  withHeight: {
    height: 1,
  },

  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'auto',
  },

  list: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  children: {
    flexGrow: 1,
    overflow: 'auto',
  },

  slide: {
    flexBasis: drawerWidth,
    flexShrink: 0,
    padding: 10,
    borderLeft: `1px solid ${theme.palette.divider}`,
    overflowY: 'auto',
    backgroundColor: theme.palette.primary.appPrimaryBackgroundColor,
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 40,
      right: 0,
      bottom: 0,
      zIndex: 2,
    },
  },

  sidebar: {
    width: '350px',
    flexShrink: 0,
    borderLeft: `1px solid ${theme.palette.divider}`,
    overflowY: 'auto',
    backgroundColor: theme.palette.primary.appPrimaryBackgroundColor,
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      width: '100%',
    },
  },

  listCard: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  childrenContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
}));

const DynamicList = props => {
  const {
    dispatch, // get it out
    resource,
    childResourceList,
    defaultTabIndex,
    crudGetList,
    isAdminLoading,
    metaData,
    metaDataLoading,
    metaDataError,
    getSetting,
    getSettingForUser,
    isSettingReady,
    theme,
    listActionComponent,
    listFilterComponent,
    viewComponent,
    slideComponent,
    sidebarItemComponent,
    isSlideOpen,
    isSidebarItemOpen,
    filter,
    filterDefaultValues,
    permanentFilter,
    onRootClick,
    onRowClick,
    enableSelection,
    perPage,
    pagination,
    sort,
    isTopFilterOpen,
    isGroupingOpen,
    isFilterEnable,
    isGroupingEnable,
    isColumnChoiceEnable,
    treeLevel,
    quickEditRowCallback,
    settingToolbarComponent,
    actionEditColumnCount,
    relationMode,
    additionalViewComponentProps,
    enableSetSetting,
    selectedIds,
    isWMS,
    hideFilters,
    ...rest
  } = props;

  const [disableDelete, setDisableDelete] = useState(false); // will be true if check a parent row in tree
  const selectionRef = useRef();

  const classes = useStyles(props);
  const locale = useLocale();

  const getFieldsForDisplay = (resource, metaData) => {
    if (!enableSetSetting) {
      return getGridColumns(metaData);
    }

    const defaultSelected = getSetting(DEFAULT + '_' + CONFIG_LIST_COLUMN_CHOICE + '_' + resource);
    const userSelected = getSettingForUser(CONFIG_LIST_COLUMN_CHOICE + '_' + resource);

    // if user has selected column order
    if (userSelected && userSelected.length) {
      return getFieldsById(metaData, userSelected);
    }
    // or admin as selected default order
    else if (defaultSelected && defaultSelected.length) {
      return getFieldsById(metaData, defaultSelected);
    }
    // else show all columns
    else {
      return getGridColumns(metaData, true);
    }
  };

  const { hasCreate, hasEdit, hasShow, hasDelete } = props;
  const isMetaLoaded = !!metaData;

  if (metaDataError) {
    return <NotFound title={metaDataError} />;
  }

  if (!isMetaLoaded || (enableSetSetting && !isSettingReady)) {
    return <LoadingBox />;
  }

  const fields = getFieldsForDisplay(resource, metaData);

  const listActionProps = {
    resource,
    locale,
    metaData,
    hasCreate,
    hasDelete,
    treeLevel,
    disableDelete,
    selectionRef,
  };

  const listBulkActionProps = { locale, metaData, hasDelete, treeLevel, disableDelete };

  const settingToolbarProps = {
    locale,
    metaData,
    resource,
    isFilterEnable,
    isGroupingEnable,
    isColumnChoiceEnable,
    fields,
  };

  const listFilterProps = {
    resource,
    metaData,
    locale,
  };

  const viewComponentProps = {
    resource,
    metaData,
    hasEdit: hasEdit,
    hasShow: hasShow,
    enableSelection: enableSelection,
    className: classes.children,
    fields: fields,
    onRowClick: onRowClick,
    isSlideOpen,
    isSidebarItemOpen,
    isTopFilterOpen,
    isGroupingOpen,
    treeLevel,
    quickEditButton: !!quickEditRowCallback,
    actionEditColumnCount:
      typeof actionEditColumnCount !== 'undefined'
        ? actionEditColumnCount
        : typeof quickEditRowCallback === 'function'
        ? 2
        : 1,
    quickEditRowCallback,
    setDisableDelete,
    selectionRef,
    ...additionalViewComponentProps,
  };

  return (
    <div className={classNames(classes.container, relationMode ? '' : classes.withHeight)}>
      <div className={classes.listContainer} onClick={onRootClick}>
        <ListContainer
          {...rest}
          classes={{
            card: classes.listCard,
            childrenContainer: classes.childrenContainer,
          }}
          className={classes.list}
          resource={resource}
          childResourceList={childResourceList}
          actions={null}
          settingToolbar={
            settingToolbarComponent
              ? React.cloneElement(settingToolbarComponent, settingToolbarProps)
              : null
          }
          filter={filter}
          filters={null}
          filterDefaultValues={filterDefaultValues}
          title={getTranslatedName(metaData, locale)}
          debounce={1000}
          bulkActionButtons={null}
          perPage={perPage}
          pagination={pagination}
          sort={sort}
          gridProps={viewComponentProps}
          metaData={metaData}
          defaultTabIndex={defaultTabIndex}
          getFieldsForDisplay={getFieldsForDisplay}
          enableSetSetting={enableSetSetting}
          data-test-list-resource={resource}
          isWMS={isWMS}
        >
          {React.cloneElement(viewComponent, viewComponentProps)}
        </ListContainer>
      </div>
      {sidebarItemComponent && (
        <Slide
          className={classes.sidebar}
          direction="right"
          in={isSidebarItemOpen}
          mountOnEnter
          unmountOnExit
        >
          <div>
            {React.cloneElement(sidebarItemComponent, {
              parentResource: resource,
              parentMetaData: metaData,
            })}
          </div>
        </Slide>
      )}
      {slideComponent && (
        <Slide
          className={classes.slide}
          direction="right"
          in={isSlideOpen}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <div className={classes.toolbar} />
            {React.cloneElement(slideComponent, {
              parentResource: resource,
              parentMetaData: metaData,
            })}
          </div>
        </Slide>
      )}
    </div>
  );
};

DynamicList.propTypes = {
  resource: PropTypes.string.isRequired,
  childResourceList: PropTypes.array,
  metaData: PropTypes.object,
  metaDataLoading: PropTypes.bool,
  metaDataError: PropTypes.string,
  filterDefaultValues: PropTypes.object,
  filter: PropTypes.object,
  onRowClick: PropTypes.func,
  onRootClick: PropTypes.func,
  enableSelection: PropTypes.bool,
  perPage: PropTypes.number,
  pagination: PropTypes.element,
  sort: PropTypes.object,
  viewComponent: PropTypes.element,
  slideComponent: PropTypes.element,
  sidebarItemComponent: PropTypes.element,
  isSlideOpen: PropTypes.bool,
  isSidebarItemOpen: PropTypes.bool,
  isTopFilterOpen: PropTypes.bool,
  isGroupingOpen: PropTypes.bool,
  hasDelete: PropTypes.bool,
  isColumnChoiceEnable: PropTypes.bool,
  treeLevel: PropTypes.number,
  defaultTabIndex: PropTypes.number,
  hasReportEditable: PropTypes.bool,
  quickEditRowCallback: PropTypes.func,
  useSimpleApi: PropTypes.bool,
  relationMode: PropTypes.bool,
  additionalViewComponentProps: PropTypes.object,
  withFile: PropTypes.bool,
  enableSetSetting: PropTypes.bool,
  selectedIds: PropTypes.array,
  hideFilters: PropTypes.bool,
  isWMS: PropTypes.bool,
};

DynamicList.defaultProps = {
  settingToolbarComponent: <SettingToolbar />,
  viewComponent: <DevExGrid />,
  filterDefaultValues: null,
  isSlideOpen: false,
  isSidebarItemOpen: false,
  isFilterEnable: true,
  isGroupingEnable: true,
  hasDelete: false,
  isColumnChoiceEnable: true,
  withFile: false,
  enableSetSetting: true,
};

export default SettingHOC([GET_SETTING, GET_SETTING_FOR_USER])(DynamicList);
