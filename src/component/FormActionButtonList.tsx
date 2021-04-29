import React, { SyntheticEvent, ReactNode, useMemo } from 'react';
import lodashGet from 'lodash/get';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Toolbar, useTranslate, Button as ReactAdminButton } from 'react-admin';
import { Icon, Button, makeStyles, IconButton } from '@material-ui/core';
import ProcessIcon from '@material-ui/icons/CallMade';
import { Link } from 'react-router-dom';
import { linkToRecord } from 'ra-core';
import { Identifier } from 'typescript';

import { isRecordEditable, isSingleRecordTable } from '../helper/MetaHelper';
import { CustomTheme } from '../core/themeProvider';
import useWidth from './useWidth';
import CustomFormButton from './form/CustomFormButton';

interface DumbButtonType {
  classes: object;
  onClick: (event: SyntheticEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

interface ProcessLineChangeButtonType {
  processLine: { id: string | undefined; title: string };
  locale;
  redirect: string | boolean;
  handleSubmitWithRedirect: Function;
  disabled: boolean;
}

interface FormActionButtonListType {
  formName: string;
  allFormData: object[];
  closeDialog: Function;
  redirectToPage: Function;
  resetForm: Function;
  redirect: string | boolean;
  record: { __processuniqueid: string; id: Identifier };
  crudCreateWithCallback: Function;
  submitOnEnter: boolean;
  metaData: object;
  locale;
  handleSubmitWithRedirect: Function;
  customSubmit: Function;
  isLoading: boolean;
  processLineList: { id: string | undefined; title: string }[];
  processTaskInfo: object;
  formData: object;
  isCreateMode: boolean;
  basePath: string;
  resource: string;
  isDefaultMode: boolean;
  editedFormData: object;
  rest: any;
}

const useStyles = makeStyles((theme: CustomTheme) => ({
  container: {
    margin: 0,
    padding: '0 16px',
    borderTop: `1px solid ${theme.palette.primary.appPrimaryDividerColor}`,
  },

  dumbButton: {
    margin: '0 5px',
  },

  grow: {
    flexGrow: 1,
  },

  iconButton: {
    padding: 5,
    margin: '0 6px',
  },
}));

const DumbButton = (props: DumbButtonType) => {
  const { onClick, children } = props;
  return <Button onClick={onClick}>{children}</Button>;
};

const ProcessLineChangeButton = (props: ProcessLineChangeButtonType) => {
  const { processLine, locale, redirect, handleSubmitWithRedirect, disabled } = props;

  /**
   * Submit and redirect to specified page
   * @function handleClick
   * @returns void
   */
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () =>
    handleSubmitWithRedirect({ redirect, additionalData: { __lineid: processLine.id } });

  return (
    <Button
      color="primary"
      onClick={handleClick}
      disabled={disabled}
      data-test-process-id={processLine.id}
    >
      <ProcessIcon /> &nbsp;
      {lodashGet(processLine, ['translatedTitle', locale], processLine.title)}
    </Button>
  );
};

const FormActionButtonList = (props: FormActionButtonListType) => {
  const {
    formName,
    allFormData,
    closeDialog,
    redirectToPage,
    resetForm,
    redirect,
    record,
    crudCreateWithCallback,
    submitOnEnter,
    metaData,
    locale,
    handleSubmitWithRedirect,
    customSubmit,
    isLoading,
    processLineList,
    processTaskInfo,
    formData,
    isCreateMode,
    basePath,
    resource,
    isDefaultMode,
    editedFormData,
    ...rest
  } = props;

  const classes = useStyles();
  const translate = useTranslate();
  const width = useWidth();

  const isSaveDisabled = !isCreateMode ? !isRecordEditable(metaData, record) : false;
  const isSingleRecord = isSingleRecordTable(metaData);

  /**
   * Redirect to specified page
   * @function handleDumbBtnClick
   * @returns void
   */
  const handleDumbBtnClick = () => {
    if (
      redirect &&
      redirect !== 'show' &&
      redirect !== 'edit' &&
      redirect !== 'list' &&
      redirect !== 'false'
    ) {
      redirectToPage(redirect);
    } else {
      window.history.back();
    }
  };

  /**
   * disable setting button base on width and `processLineList`
   * @function disabledSettings
   * @returns {boolean}
   */
  const disabledSettings = useMemo(() => {
    if (
      width === 'md' ||
      width === 'sm' ||
      width === 'xs' ||
      (processLineList && processLineList.length)
    ) {
      return true;
    } else {
      return false;
    }
  }, [width, processLineList]);

  /**
   * useful to prevent click bubbling in a datagrid with rowClick
   * @function stopPropagations
   * @param {event}
   * @returns {void}
   */
  const stopPropagation = event => event.stopPropagation();

  const handleSave = () => {
    if (handleSubmitWithRedirect) {
      handleSubmitWithRedirect({ redirect });
    }
  };

  const handleSaveAndNew = () => {
    if (customSubmit) {
      customSubmit(formData, null, { isSaveAndNew: true });
    }
  };

  return (
    <Toolbar
      {...rest}
      className={classes.container}
      handleSubmitWithRedirect={handleSubmitWithRedirect}
      data-action-list="true"
    >
      <CustomFormButton
        id="formMainSaveButton"
        onClick={handleSave}
        disabled={isLoading || isSaveDisabled}
        variant="contained"
        label={translate('ra.action.save')}
      />

      {!isSingleRecord && isCreateMode && (
        <CustomFormButton
          id="formSaveAndNewButton"
          onClick={handleSaveAndNew}
          disabled={isLoading || isSaveDisabled || !!record.__processuniqueid}
          variant="text"
          label={translate('form.createAndNew')}
        />
      )}

      {processLineList &&
        processLineList.map(processLine => (
          <ProcessLineChangeButton
            handleSubmitWithRedirect={handleSubmitWithRedirect}
            key={processLine.id}
            processLine={processLine}
            locale={locale}
            disabled={isLoading}
            redirect={redirect}
          />
        ))}
      <DumbButton
        classes={classes}
        onClick={handleDumbBtnClick}
        data-test-form-cancel-button="true"
      >
        {translate('ra.action.cancel')}
      </DumbButton>
      {!isDefaultMode && (
        <>
          <div className={classes.grow}></div>

          {!disabledSettings && (
            <IconButton
              color="primary"
              className={classes.iconButton}
              component={Link}
              to={`/form-layout/${resource}`}
            >
              <Icon>settings</Icon>
            </IconButton>
          )}

          {record && !!record.id && (
            <ReactAdminButton
              color="primary"
              component={Link}
              to={`${linkToRecord(basePath, record && record.id)}/show`}
              onClick={stopPropagation}
              label={translate('ra.action.show')}
              {...(rest as any)}
            >
              <Icon>visibility</Icon>
            </ReactAdminButton>
          )}
        </>
      )}
    </Toolbar>
  );
};

const mapStateToProps = state => ({
  isLoading: state.admin.loading > 0,
});

const mapDispatchToProps = { redirectToPage: push };

export default connect(mapStateToProps, mapDispatchToProps)(FormActionButtonList);
