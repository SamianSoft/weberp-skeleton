import React from 'react';
import lodashGet from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextField } from 'react-admin';
import classNames from 'classnames';
import { Icon, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { getTypeByField } from '../helper/InputHelper';

const useStyles = makeStyles(theme => ({
  textField: {
    display: 'inline',
    margin: '0 5px',
    fontSize: 12,
  },

  fieldItem: {
    display: 'flex',
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
  const {
    field,
    source,
    record,
    customLabel,
    hasEdit,
    label,
    relationMode,
    ...rest
  } = props;

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
          record[source]
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
    <div
      className={classes.fieldItem}
      data-test-field-disabled={field.disabled}
      data-test-field-editable={hasEdit}
    >
      <Typography className={classes.fieldCaption} variant="body2">
        {label}
      </Typography>
      <Typography className={classes.fieldValue} variant="subtitle2">
        {fieldComponent}
      </Typography>
    </div>
  );
};

DynamicField.propTypes = {
  field: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired, // must be defined for grid to show header column
};

const mapDispatchTopProps = {
};

export default connect(null, mapDispatchTopProps)(DynamicField);
