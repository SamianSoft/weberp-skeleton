import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { translate, useLocale } from 'react-admin';
import ShowActions from '../component/ShowActions';
import ShowTitle from '../component/ShowTitle';
import { withStyles } from '@material-ui/core';
import ShowRecordWithRelation from './ShowRecordWithRelation';
import compose from 'recompose/compose';
import NotFound from '../component/NotFound';
import ShowController from './ShowController';
import LoadingBox from '../component/LoadingBox';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },

  showCard: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    boxShadow: 'none',
  },

  main: {
    height: '100%',
  },
});

const DynamicShow = props => {
  const {
    classes,
    translate,
    match,
    location,
    resource,
    metaData,
    metaDataLoading,
    metaDataError,
    dispatch,
    getMeta,
    viewComponent,
    hasEdit,
    ...rest
  } = props;

  const locale = useLocale();

  if (metaDataError) {
    return <NotFound title={metaDataError} />;
  }

  if (metaDataLoading || !metaData) {
    return <LoadingBox />;
  }

  return (
    <div className={classes.container}>
      <ShowController
        {...rest}
        match={match}
        location={location}
        resource={resource}
        className={classes.container}
        classes={{
          card: classes.showCard,
          main: classes.main,
        }}
        title={<ShowTitle metaData={metaData} resource={resource} />}
        actions={<ShowActions metaData={metaData} locale={locale} hasEdit={hasEdit} />}
      >
        {cloneElement(viewComponent, {
          match,
          location,
          metaData,
          getMeta,
          locale,
          hasEdit,
        })}
      </ShowController>
    </div>
  );
};

DynamicShow.defaultProps = {
  viewComponent: <ShowRecordWithRelation />,
};

DynamicShow.propTypes = {
  locale: PropTypes.string.isRequired,
  metaData: PropTypes.object,
  metaDataLoading: PropTypes.bool,
  viewComponent: PropTypes.element.isRequired,
};

export default compose(withStyles(styles, { withTheme: true }), translate)(DynamicShow);
