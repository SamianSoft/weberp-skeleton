import React from 'react';
import PropTypes from 'prop-types';
import { useLocale } from 'react-admin';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { getProcessList } from '../helper/MetaHelper';
import CreateEditForm from './CreateEditForm';
import ShowTitle from '../component/ShowTitle';
import NotFound from '../component/NotFound';
import CreateEditController from './CreateEditController';
import LoadingBox from '../component/LoadingBox';
import { isEmpty } from '../helper/DataHelper';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },

  viewRoot: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },

  viewMain: {
    height: '100%',
    margin: 0,
  },

  viewCard: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    boxShadow: 'none',
    borderRadius: '0'
  },

  iconButton: {
    padding: 5,
    margin: '0 6px',
  },
}));

const DynamicCreateEdit = props => {
  const {
    dispatch, // just get it out
    getMeta, // just get it out
    resource,
    metaData,
    metaDataError,
    id,
    ...rest
  } = props;

  const locale = useLocale();
  const classes = useStyles();

  if (metaDataError) {
    return <NotFound title={metaDataError} />;
  }

  if (!metaData) {
    return <LoadingBox />;
  }
  const processList = getProcessList(metaData);

  return (
    <div className={classes.container}>
      <CreateEditController
        {...rest}
        classes={{
          root: classes.viewRoot,
          main: classes.viewMain,
          card: classes.viewCard,
        }}
        actions={null}
        resource={resource}
        id={id}
        title={<ShowTitle resource={resource} metaData={metaData} />}
        metaData={metaData}
      >
        <CreateEditForm
          {...rest}
          metaData={metaData}
          resource={resource}
          locale={locale}
          processList={processList}
          isCreateMode={isEmpty(id)}
        />
      </CreateEditController>
    </div>
  );
};

DynamicCreateEdit.propTypes = {
  metaData: PropTypes.object,
  id: PropTypes.any,
};

export default DynamicCreateEdit;
