import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import ContentCreate from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';
import { linkToRecord } from 'ra-core';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

// useful to prevent click bubbling in a datagrid with rowClick
const styles = theme => ({
  // IconButton: {
  //   opacity: 0,
  //   transition: 'opacity 200ms',
  //   '&:hover': {
  //     opacity: 1,
  //     transition: 'opacity 200ms',
  //   }
  // },

  icon: {
    color: theme.palette.primary.main,
    margin: '0 !important',
  },
});

const stopPropagation = e => e.stopPropagation();

const EditButton = ({
  basePath = '',
  label = 'ra.action.edit',
  record = {},
  classes,
  redirect,
  ...rest
}) => {
  return (
    <IconButton
      {...rest}
      data-test="editButton"
      color="primary"
      className={classes.IconButton}
      component={Link}
      to={linkToRecord(basePath, record.id) + (redirect ? `?redirect=${redirect}` : '')}
      label={label}
      onClick={stopPropagation}
    >
      <ContentCreate fontSize="small" className={classes.icon} />
    </IconButton>
  );
};

EditButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  record: PropTypes.object,
  icon: PropTypes.element,
  redirect: PropTypes.string,
};

const enhance = shouldUpdate(
  (props, nextProps) =>
    props.translate !== nextProps.translate ||
    (props.record && nextProps.record && props.record.id !== nextProps.record.id) ||
    props.basePath !== nextProps.basePath ||
    (props.record == null && nextProps.record != null),
);

export default enhance(withStyles(styles, { withTheme: true })(EditButton));
