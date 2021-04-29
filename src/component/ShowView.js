import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { TitleForRecord } from 'react-admin';

import ShowActions from './ShowActions';

// This component is copied from React-Admin
// https://github.com/marmelab/react-admin/blob/aeda86582e6ac1ea37f29739a8f08743694616c9/packages/ra-ui-materialui/src/detail/Show.js

const ShowView = props => {
  const {
    actions,
    aside,
    basePath,
    children,
    classes: classesOverride,
    className,
    component: Content,
    defaultTitle,
    hasEdit,
    hasList,
    record,
    resource,
    title,
    version,
    customRefresh,
    ...rest
  } = props;
  const classes = useStyles(props);
  const finalActions = typeof actions === 'undefined' && hasEdit ? <ShowActions /> : actions;

  if (!children) {
    return null;
  }
  return (
    <div className={classnames('show-page', classes.root, className)} {...sanitizeRestProps(rest)}>
      <TitleForRecord title={title} record={record} defaultTitle={defaultTitle} />
      {finalActions &&
        cloneElement(finalActions, {
          basePath,
          data: record,
          hasList,
          hasEdit,
          resource,
          customRefresh,
          //  Ensure we don't override any user provided props
          ...finalActions.props,
        })}
      <div
        className={classnames(classes.main, {
          [classes.noActions]: !finalActions,
        })}
      >
        <Content className={classes.card}>
          {record &&
            cloneElement(Children.only(children), {
              resource,
              basePath,
              record,
              version,
            })}
        </Content>
        {aside &&
          cloneElement(aside, {
            resource,
            basePath,
            record,
            version,
          })}
      </div>
    </div>
  );
};

ShowView.propTypes = {
  actions: PropTypes.element,
  aside: PropTypes.element,
  basePath: PropTypes.string,
  children: PropTypes.element,
  classes: PropTypes.object,
  className: PropTypes.string,
  defaultTitle: PropTypes.any,
  hasEdit: PropTypes.bool,
  hasList: PropTypes.bool,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  record: PropTypes.object,
  resource: PropTypes.string,
  title: PropTypes.any,
  version: PropTypes.node,
};

ShowView.defaultProps = {
  classes: {},
  component: Card,
};

const useStyles = makeStyles(
  {
    root: {},
    main: {
      display: 'flex',
    },
    noActions: {
      marginTop: '1em',
    },
    card: {
      flex: '1 1 auto',
    },
  },
  { name: 'RaShow' },
);

const sanitizeRestProps = ({
  actions,
  aside,
  title,
  children,
  className,
  id,
  data,
  loading,
  loaded,
  resource,
  hasCreate,
  hasEdit,
  hasList,
  hasShow,
  version,
  match,
  location,
  history,
  options,
  locale,
  permissions,
  translate,
  ...rest
}) => rest;

export default ShowView;
