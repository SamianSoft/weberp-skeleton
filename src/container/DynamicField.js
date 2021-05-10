import React from 'react';
import lodashGet from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextField } from 'react-admin';
import classNames from 'classnames';
import { Icon, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { getTypeByField } from '../helper/NewInputHelper';
import InputLabelComponent from '../component/input/InputLabelComponent';
import AutocompleteView from '../component/input/AutocompleteView';

const useStyles = makeStyles(theme => ({
  textField: {
    display: 'inline',
    margin: '0 5px',
    fontSize: 12,
  },

  fieldItem: {
    display: 'flex',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
  },

  fieldCaption: {
    flex: '1',
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 12,
  },

  fieldValue: {
    flex: '1',
    flexGrow: '2',
    overflow: 'hidden',
    fontSize: 12,
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    padding: '0 16px',
  },
  inputField: {
    width: '100%',
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
  },
  fieldLink: {
    textDecoration: 'none',
    color: theme.palette.secondary.main,
    textAlign: 'center',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  booleanField: {
    display: 'flex',
    '& svg': {
      fontSize: 20,
    },
  },

  iconButton: {
    padding: 7,
  },

  icon: {
    fontSize: 13,
  },
}));

const DynamicField = props => {
  const { field, source, record, customLabel, hasEdit, label, relationMode, ...rest } = props;

  const classes = useStyles(props);
  const commonProps = {
    record,
    source,
    label,
    field,
  };

  /**
   * Extracts `relatedName` and `parameterKey` from the field and
   * also takes `relatedName` for value variable and these are used for the `addToFilterRequestList` function
   * @function setCurrentValueToFilter
   * @returns {void}
   */
  const setCurrentValueToFilter = () => {
    const { parameterKey, relatedName } = field;
    const value = lodashGet(record, relatedName);
  };

  /**
   * Open a link in a new tab
   * @function openLinkNewTab
   * @returns {void}
   */
  const openLinkNewTab = () => {
    window.open(`${record[source]}`, '_blank');
  };

  let fieldComponent;

  switch (getTypeByField(field)) {
    case 'stringMultiSelectDropBase': {
      fieldComponent = <AutocompleteView field={field} {...rest} {...commonProps} disabled />;
      break;
    }
    default: {
      const linkName = lodashGet(field, 'linkName');
      const linkValue = lodashGet(record, linkName);
      if (linkName && linkValue) {
        fieldComponent = (
          <Link
            className={classNames(classes.fieldValue, classes.fieldLink)}
            to={`${linkValue.toLowerCase()}/show`}
            data-test-field-link-name={field.name}
          >
            {lodashGet(record, lodashGet(field, 'relatedName'))}
          </Link>
        );
      } else {
        fieldComponent = !customLabel ? (
          <TextField
            data-test-text-field-name={field.name}
            {...rest}
            {...commonProps}
            emptyText=" "
            className={classes.textField}
          />
        ) : (
          <InputLabelComponent label={label}>
            <div className={classes.inputField}>
              <Typography className={classes.fieldValue} variant="">
                {record[source]}
              </Typography>
            </div>
          </InputLabelComponent>
        );
      }
    }
  }

  return !customLabel ? (
    <>
      {!!field.parameterKey && !relationMode && (
        <IconButton
          className={classes.iconButton}
          onClick={setCurrentValueToFilter}
          color="primary"
          data-test-filter-button-id={record[source]}
        >
          <Icon fontSize="small" className={classNames(classes.icon, 'fa fa-filter')} />
        </IconButton>
      )}
      {fieldComponent}
    </>
  ) : (
    <>{fieldComponent}</>
  );
};

DynamicField.propTypes = {
  field: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired, // must be defined for grid to show header column
};

const mapDispatchTopProps = {};

export default connect(null, mapDispatchTopProps)(DynamicField);
