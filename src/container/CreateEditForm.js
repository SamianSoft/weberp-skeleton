import React, { useRef, useState, useEffect, useContext } from 'react';
import lodashGet from 'lodash/get';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, TableBody, Typography, makeStyles } from '@material-ui/core';
import { useLocale } from 'react-admin';

import DynamicInput from './DynamicInput';
import SettingHOC, { GET_SETTING, CONFIG_FORM_LAYOUT, GET_SETTING_FOR_USER } from './SettingHOC';

import { getParamFromUrl } from '../helper/UrlHelper';
import {
  getColumnCount,
  getFormDefaultValue,
  getRelationsInForm,
  getTabList,
  mergeTabDataWithSetting,
  getAllFieldList,
  getProcessTaskInfo,
  getProcessLines,
  getRelationDisabledFields,
  extractAllFieldsFromCustomGroupList,
  preparedRelationPermission,
} from '../helper/MetaHelper';
import FormActionButtonList from '../component/FormActionButtonList';
import TabChild from '../component/form/TabChild';
import TabParent from '../component/form/TabParent';
import DummyDiv from '../component/DummyDiv';
import DummyFunctionComponent from '../component/DummyFunctionComponent';
import NewSubmittableForm from '../component/NewSubmittableForm';
import { NewMetaContext } from './NewMetaContext';
import useWidth from '../component/useWidth';
import { isEmptyObject } from '../helper/DataHelper';
import RelationPanel from './RelationPanel';
import AccordionComponent from '../component/Accordion/AccordionComponent';
import RelationActionButtonsComponent from '../component/RelationActionButtonsComponent';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: theme.palette.primary.appPrimaryBackgroundColor,
  },

  simpleForm: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: 1,
    '& > div:nth-child(2)': {
      [theme.breakpoints.down('xs')]: {
        height: 0,
      },
    },
    '& > div.fieldContainer ': {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      padding: 16,
      '& > div': {
        display: 'flex',
        flexGrow: 1,
      },
    },
  },

  simpleFormDummyDiv: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  simpleFormDummyDivColumnStyle: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'column',
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
    margin: '10px 0',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[50],
  },

  table: {
    borderCollapse: 'unset',
    borderSpacing: '7px',
    tableLayout: 'fixed',
  },

  groupHeader: {
    padding: '15px 15px 0 15px',
  },

  tableCell: {
    [theme.breakpoints.up('lg')]: {
      height: 43,
      boxSizing: 'border-box',
      padding: 0,
    },
    [theme.breakpoints.down('md')]: {
      height: 35,
      maxHeight: 35,
    },
    [theme.breakpoints.down('md')]: {
      display: 'block',
      width: '100%',
      marginBottom: 5,
      height: 35,
    },
  },

  emptyTableCell: {
    height: 35,
    [theme.breakpoints.down('md')]: {
      display: 'block',
      width: '100%',
    },
  },

  relationPanel: {
    width: '100%',
  },
}));

const defaultGlobalParameters = {};
const emptyRecord = {};

const CreateEditForm = props => {
  const {
    dispatch, // just get it out
    location,
    metaData,
    resource,
    record,
    hasList,
    hasEdit,
    hasCreate,
    hasShow,
    undoable,
    asyncValidationFieldsList,
    asyncValidation,
    globalParameters,
    isSettingReady, // just get it out
    getSetting,
    version,
    processList,
    isCreateMode,
    relationExceptions,
    setRelationExceptions,
    relationRecord,
    basePath,
    match,
    orginalRecord,
    getSettingForUser,
    parentResource,
    parentRecord,
    ...rest
  } = props;

  const { getMeta } = useContext(NewMetaContext);
  const classes = useStyles(props);
  const locale = useLocale();
  const width = useWidth();

  const [preparedGroupList, setPreparedGroupList] = useState(null);

  const processUniqueId = lodashGet(record, '__processuniqueid', null);
  const processPositionId = lodashGet(record, 'positionid', null);
  const processStateId = lodashGet(record, 'stateid', null);
  const parentMetaData = getMeta(parentResource);
  const [formData, setFormData] = useState({});

  const [additionalProps, setAdditionalProps] = useState();

  const redirect = getParamFromUrl(location.search, 'redirect') || 'show';
  const processTaskInfo = getProcessTaskInfo(
    metaData,
    processUniqueId,
    processPositionId,
    processStateId,
  );

  const getNameOfSetting = ({ resource }) => {
    return CONFIG_FORM_LAYOUT + '_' + resource;
  };

  const storedValue = getSetting(getNameOfSetting(props));

  const relationsInForm = getRelationsInForm(metaData);
  const defaultData = getFormDefaultValue(getAllFieldList(metaData), globalParameters);

  useEffect(() => {
    const [moduleName, moduleTableName] = resource.split('/');
    const columnCount = getColumnCount(metaData);
    const parentProcessUniqueId = getParamFromUrl(location.search, 'parentProcessUniqueId', '');
    const parentPositionId = getParamFromUrl(location.search, 'parentPositionId', '');
    const parentStateId = getParamFromUrl(location.search, 'parentStateId', '');

    const disabledFieldList = getRelationDisabledFields(
      parentMetaData,
      {
        __processuniqueid: parentProcessUniqueId,
        positionid: parentPositionId,
        stateid: parentStateId,
      },
      moduleName,
      moduleTableName,
    );

    const newPreparedGroupList = mergeTabDataWithSetting(
      metaData,
      processList,
      getTabList({
        list: metaData,
        defaultColumnCount: columnCount,
        processuniqueid: processUniqueId,
        positionid: processPositionId,
        stateid: processStateId,
        disabledFields: disabledFieldList,
      }),
      storedValue,
    );

    setPreparedGroupList(newPreparedGroupList);
  }, [parentMetaData, metaData, resource, parentResource]);

  useEffect(() => {
    if (!isEmptyObject(parentRecord))
      setAdditionalProps({
        orginalRecord: parentRecord,
        allowUsePropsAfterCreateRelation: false,
      });
  }, [parentRecord]);

  const allFieldListForValidation = extractAllFieldsFromCustomGroupList(preparedGroupList);
  const theRecord = record || emptyRecord;

  /**
   * it should get form state and destruct it on an state
   * @function handleFormChange
   * @param {object} data form state
   * @returns {void}
   */
  const handleFormChange = ({ data }) => {
    setFormData({ ...data });
  };

  return (
    <div className={classes.container}>
      <RelationActionButtonsComponent
        basePath={basePath}
        record={record}
        list={relationsInForm.map(item => {
          return { title: item.moduleTableName, id: item.childFieldName };
        })}
      />
      <NewSubmittableForm
        {...rest}
        className={classes.simpleForm}
        classes={{
          toolbar: classes.simpleFormToolbar,
        }}
        initialValues={defaultData}
        redirect={redirect}
        fields={metaData.fields}
        record={record}
        resource={resource}
        validationFieldList={allFieldListForValidation}
        metaData={metaData}
        toolbar={
          <FormActionButtonList
            metaData={metaData}
            submitOnEnter={false}
            redirect={redirect}
            locale={locale}
            processLineList={getProcessLines(
              metaData,
              theRecord.__processuniqueid,
              theRecord.positionid,
              theRecord.stateid,
            )}
            processTaskInfo={processTaskInfo}
            isCreateMode={isCreateMode}
          />
        }
        onFormChange={handleFormChange}
        formData={formData}
        isDefaultMode={false}
        basePath={basePath}
      >
        <DummyDiv className={classes.simpleFormDummyDiv}>
          <TabParent className={classes.tabParent}>
            {preparedGroupList &&
              preparedGroupList.map(tab => (
                <TabChild
                  key={tab.id}
                  label={
                    <Typography variant="body2">
                      {lodashGet(tab, ['translatedTitle', locale]) || tab.title}
                    </Typography>
                  }
                >
                  <DummyFunctionComponent>
                    {tabChildProps =>
                      tab.groupList.map((group, index) => (
                        <div key={index} className={classes.groupContainer}>
                          <AccordionComponent
                            customSummaryClass=""
                            summary={
                              <Typography variant="body2">
                                {lodashGet(group, ['translatedTitle', locale], group.id)}
                              </Typography>
                            }
                          >
                            <div>
                              <Table className={classes.table}>
                                <TableBody>
                                  {group.layout.map((rowArray, index) => (
                                    <tr key={index}>
                                      {rowArray.map((field, index) => {
                                        if (
                                          field === 'empty' &&
                                          (width === 'lg' || width === 'xl')
                                        ) {
                                          return (
                                            <td key={index} className={classes.emptyTableCell} />
                                          );
                                        } else if (field && field !== 'empty') {
                                          return (
                                            <td
                                              key={index}
                                              rowSpan={field.rowSpan ? field.rowSpan : 1}
                                              colSpan={field.colSpan ? field.colSpan : 1}
                                              className={classes.tableCell}
                                              data-test-td-name={field.name}
                                            >
                                              <DynamicInput
                                                {...tabChildProps}
                                                key={field.id}
                                                source={field.name}
                                                field={field}
                                                metaData={metaData}
                                                isCreateMode={isCreateMode}
                                                version={version}
                                                additionalProps={additionalProps}
                                                // record={record} // record is fetched directly from redux, no need to pass it here
                                              />
                                            </td>
                                          );
                                        }
                                      })}
                                    </tr>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </AccordionComponent>
                        </div>
                      ))
                    }
                  </DummyFunctionComponent>
                </TabChild>
              ))}
          </TabParent>
        </DummyDiv>

        {/* {!isCreateMode && (
          <DummyDiv className={classes.simpleFormDummyDivColumnStyle}>
            {relationsInForm &&
              relationsInForm.map(relation => {
                const relationResource = `${relation.moduleName}/${relation.moduleTableName}`;
                const relationPath = `${relationResource}/${relation.childFieldName}`;
                const relationMetaData = getMeta(relationResource);

                const additionalProps = {
                  relationPath,
                  resource,
                  orginalRecord,
                  allowUsePropsAfterCreateRelation: true,
                };

                const relationPermission = preparedRelationPermission(
                  metaData,
                  record,
                  relation,
                  relationMetaData,
                );

                return (
                  <RelationPanel
                    {...relationPermission}
                    key={relationPath}
                    locale={locale}
                    parentRecord={relationRecord}
                    parentMetaData={metaData}
                    parentResource={resource}
                    basePath={basePath}
                    location={location}
                    match={match}
                    hasCreate={true}
                    hasEdit={true}
                    childFieldName={relation.childFieldName}
                    parentProcessUniqueId={record.__processuniqueid}
                    parentPositionId={record.positionid}
                    parentStateId={record.stateid}
                    type="simple"
                    relation={relation}
                    relationResource={relationResource}
                    relationPath={relationPath}
                    additionalProps={additionalProps}
                    classes={{
                      container: classes.relationPanel,
                    }}
                    relationMetaData={relationMetaData}
                  />
                );
              })}
          </DummyDiv>
        )} */}
      </NewSubmittableForm>
    </div>
  );
};

CreateEditForm.propTypes = {
  metaData: PropTypes.object.isRequired,
  resource: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  isCreateMode: PropTypes.bool,
};

const mapStateToProps = state => ({
  globalParameters: lodashGet(state, 'profile.globalParameters', defaultGlobalParameters),
});

export default compose(
  SettingHOC([GET_SETTING, GET_SETTING_FOR_USER]),
  connect(mapStateToProps),
)(CreateEditForm);
