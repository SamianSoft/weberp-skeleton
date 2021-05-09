import React, { useState, useEffect, useMemo } from 'react';
import lodashGet from 'lodash/get';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import DynamicField from './DynamicField';
import RelationPanel from './RelationPanel';
import { Typography, Table, TableBody, makeStyles } from '@material-ui/core';
import { Identifier } from 'react-admin';

import {
  getColumnCount,
  getFileInfo,
  getNoteInfo,
  getRelationList,
  getTabList,
  isRecordEditable,
  mergeTabDataWithSetting,
  getSingleRecordReportRelationList,
  getProcessList,
  preparedRelationPermission,
} from '../helper/MetaHelper';
import TabParent from '../component/form/TabParent';
import TabChild from '../component/form/TabChild';
import SettingHOC, {
  DEFAULT,
  CONFIG_LIST_COLUMN_CHOICE,
  GET_SETTING,
  GET_SETTING_FOR_USER,
  CONFIG_FORM_LAYOUT,
} from './SettingHOC';

import { CustomTheme } from '../core/themeProvider';
import useWidth from '../component/useWidth';
import AccordionComponent from '../component/Accordion/AccordionComponent';

interface TabInterFace {
  childFieldName: string;
  id: Identifier;
  title: string;
  name: string;
  groupList: object[];
  resource: string;
  noteRelation: RelationItemInterface;
  isOneToOne: boolean;
  tableRelationList: object[];
  tableName: string;
  reportRelationList: object[];
  fileRelation: RelationItemInterface;
}

interface RelationItemInterface {
  moduleName: string;
  moduleTableName: string;
  childFieldName: string;
}

interface RelationListItemInterface {
  [x: string]: any;
}

interface GroupInterface {
  [x: string]: any;
}

const useStyles = makeStyles((theme: CustomTheme) => ({
  viewContainer: {
    height: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    flexWrap: 'wrap',
    flexGrow: 1,
    overflowX: 'hidden',
    padding: '16px',
    alignContent: 'flex-start',
    backgroundColor: theme.palette.primary.appPrimaryBackgroundColor,
  },

  relationItem: {
    width: '100%',
    marginTop: 5,
  },

  tabParent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%',
  },

  groupContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 5,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[50],
  },

  table: {
    borderCollapse: 'unset',
    borderSpacing: '10px',
    tableLayout: 'fixed',
  },

  groupHeader: {
    padding: '15px 15px 0 15px',
  },

  tableCell: {
    // border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: 0,
    [theme.breakpoints.up('lg')]: {
      height: 40,
    },
    [theme.breakpoints.down('md')]: {
      display: 'block',
      width: '100%',
      marginBottom: 5,
    },

    '& .quickEditButton': {
      transition: 'opacity 200ms',
      opacity: 0,
    },
    '&:hover .quickEditButton': {
      transition: 'opacity 200ms',
      opacity: 1,
    },
  },

  emptyTableCell: {
    [theme.breakpoints.up('lg')]: {
      height: 40,
    },
    [theme.breakpoints.down('md')]: {
      display: 'block',
      width: '100%',
    },
  },
}));

const ShowRecordWithRelation = props => {
  const {
    match,
    location,
    resource,
    locale,
    record,
    basePath,
    metaData,
    hasEdit,
    getMeta,
    getSetting,
    getSettingForUser,
  } = props;

  const classes = useStyles(props);
  const width = useWidth();

  const [preparedGroupList, setPreparedGroupList] = useState([]);
  const [hiddenFieldsCaption, setHiddenFieldsCaption] = useState<string[]>([]);

  useEffect(() => {
    prepareViewFields();
  }, [metaData, record, resource]);

  // UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
  //   const { resource: nextResource } = nextProps;
  //   if (nextResource !== this.props.resource) {
  //     this.prepareViewFields(nextProps);
  //   }
  // }

  /**
   * prepare fields list based on metadata, setting, current state
   * @function prepareViewFields
   * @returns {void}
   */
  const prepareViewFields = () => {
    const { __processuniqueid: processuniqueid, positionid, stateid } = record;
    const storedValue = getSetting(getNameOfSetting);
    const columnCount = getColumnCount(metaData);
    const relationList = getRelationList(metaData, {
      processuniqueid,
      positionid,
      stateid,
    });
    const fileRelation = getFileInfo(metaData);
    const reportRelationList: any = getSingleRecordReportRelationList(metaData, {
      processuniqueid: record.__processuniqueid,
      positionid: record.positionid,
      stateid: record.stateid,
    });
    const noteRelation = getNoteInfo(metaData);
    const processList = getProcessList(metaData);

    const tempPreparedGroupList = mergeTabDataWithSetting(
      metaData,
      processList,
      getTabList({
        list: metaData,
        defaultColumnCount: columnCount,
        processuniqueid: record.__processuniqueid,
        positionid: record.positionid,
        stateid: record.stateid,
      }),
      storedValue,
      relationList,
      reportRelationList,
      fileRelation,
      noteRelation,
    );

    // ------ for extract hidden fields name into an array for test ---------------------
    if (tempPreparedGroupList.length) {
      const hiddenTemp: string[] = [];
      tempPreparedGroupList[0].groupList[0].layout[0].forEach(element => {
        if (element && element.hidden === true) {
          hiddenTemp.push(element.name);
        }
      });
      setHiddenFieldsCaption(hiddenTemp);
    }

    tempPreparedGroupList.forEach(tab => {
      if (tab.isOneToOne) {
        const oneToOneRelationResource = `${tab.moduleName}/${tab.tableName}`;
        const oneToOneRelationMeta = getMeta(oneToOneRelationResource);

        if (!oneToOneRelationMeta) {
          tab['tableRelationList'] = [];
          tab['reportRelationList'] = [];
          tab['fileRelation'] = [];
          tab['noteRelation'] = [];
          return;
        }

        tab['tableRelationList'] = getRelationList(oneToOneRelationMeta, {
          processuniqueid: record.__processuniqueid,
          positionid: record.positionid,
          stateid: record.stateid,
        });
        tab['reportRelationList'] = getSingleRecordReportRelationList(oneToOneRelationMeta, {
          processuniqueid: record.__processuniqueid,
          positionid: record.positionid,
          stateid: record.stateid,
        });
        tab['fileRelation'] = getFileInfo(oneToOneRelationMeta);
        tab['noteRelation'] = getNoteInfo(oneToOneRelationMeta);
      }
    });

    setPreparedGroupList(tempPreparedGroupList);
  };

  const getNameOfSetting = useMemo(() => {
    return CONFIG_FORM_LAYOUT + '_' + resource;
  }, [resource]);

  const recordIsEditable = hasEdit && isRecordEditable(metaData, record);
  return (
    <div className={classes.viewContainer}>
      {preparedGroupList && preparedGroupList.length && (
        <TabParent className={classes.tabParent}>
          {preparedGroupList.map((tab: TabInterFace) => {
            const relationPanelParams = {
              currentUrl: match.url,
              locale: locale,
              parentRecord: record,
              parentMetaData: metaData,
              parentResource: resource,
              basePath: basePath,
              location: location,
              match: match,
              hasCreate: true,
              hasEdit: true,
              childFieldName: tab.childFieldName,
              parentProcessUniqueId: record.__processuniqueid,
              parentPositionId: record.positionid,
              parentStateId: record.stateid,
              additionalProps: {
                orginalRecord: record,
                allowUsePropsAfterCreateRelation: false,
              },
            };

            return (
              <TabChild
                key={tab.id}
                label={
                  <Typography variant="body2">
                    {lodashGet(tab, ['translatedTitle', locale]) || tab.title || tab.name || tab.id}
                  </Typography>
                }
                onClick={() => {}}
              >
                {tab.groupList &&
                  tab.groupList.length &&
                  tab.groupList.map((group: GroupInterface, index: number) => (
                    <div key={group.id} className={classes.groupContainer}>
                      <AccordionComponent
                        index={index}
                        customSummaryClass=""
                        summary={
                          <Typography variant="body2">
                            {lodashGet(group, ['translatedTitle', locale], group.id)}
                          </Typography>
                        }
                      >
                        <div>
                          <Table className={classes.table}>
                            <TableBody data-test-hidden-fields={hiddenFieldsCaption}>
                              {group.layout.map((rowArray, index) => (
                                <tr key={index}>
                                  {rowArray.map((field, index) => {
                                    if (
                                      (field === 'empty' && (width === 'lg' || width === 'xl')) ||
                                      (field && field.hidden)
                                    ) {
                                      return (
                                        <td
                                          key={index}
                                          className={classes.emptyTableCell}
                                          data-test-hidden-field={field ? field.name : null}
                                        />
                                      );
                                    } else if (field && field !== 'empty' && !field.hidden) {
                                      return (
                                        <td
                                          key={index}
                                          className={classes.tableCell}
                                          rowSpan={field.rowSpan ? field.rowSpan : 1}
                                          colSpan={field.colSpan ? field.colSpan : 1}
                                          data-test-td-name={field.name}
                                        >
                                          <DynamicField
                                            customLabel
                                            key={field.id}
                                            source={field.name}
                                            field={field}
                                            label={lodashGet(
                                              field,
                                              ['translatedCaption', locale],
                                              field.caption,
                                            )}
                                            record={record}
                                            resource={tab.resource}
                                            basePath={`/${tab.resource}`}
                                            hasEdit={recordIsEditable}
                                          />
                                        </td>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                                </tr>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionComponent>
                    </div>
                  ))}
                {tab.tableRelationList &&
                  tab.tableRelationList.map((item: RelationListItemInterface, index: number) => {
                    const relationResource = `${item.moduleName}/${item.moduleTableName}`;
                    const relationPath = `${item.moduleName}/${item.moduleTableName}/${item.childFieldName}`;
                    const relationMetaData = getMeta(relationResource);

                    console.log('ShowRecordWithRelation.tsx:365 >> relationMetaData', {
                      relationMetaData,
                    });

                    const relationPermission = preparedRelationPermission(
                      metaData,
                      record,
                      item,
                      relationMetaData,
                    );

                    const defaultSelected = getSetting(
                      DEFAULT + '_' + CONFIG_LIST_COLUMN_CHOICE + '_' + relationPath,
                    );
                    const userSelected = getSettingForUser(
                      CONFIG_LIST_COLUMN_CHOICE + '_' + relationPath,
                    );

                    return (
                      <div
                        className={classes.relationItem}
                        key={relationPath}
                        data-relation-test-key={relationPath}
                      >
                        <RelationPanel
                          {...relationPanelParams}
                          {...relationPermission}
                          type="simple"
                          relation={item}
                          index={index}
                          childFieldName={item.childFieldName}
                          relationResource={relationResource}
                          relationPath={relationPath}
                          relationMetaData={relationMetaData}
                          defaultSelected={defaultSelected}
                          userSelected={userSelected}
                        />
                      </div>
                    );
                  })}
              </TabChild>
            );
          })}
        </TabParent>
      )}
    </div>
  );
};

ShowRecordWithRelation.propTypes = {
  metaData: PropTypes.object.isRequired,
  basePath: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  record: PropTypes.object,
  resource: PropTypes.string,
  version: PropTypes.number,
  columnCount: PropTypes.number,
  groups: PropTypes.object,
};

ShowRecordWithRelation.defaultProps = {
  hasEdit: true,
};

export default compose(SettingHOC([GET_SETTING, GET_SETTING_FOR_USER]))(ShowRecordWithRelation);
