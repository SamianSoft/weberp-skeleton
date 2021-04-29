import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { useTranslate, crudGetOne as crudGetOneAction } from 'react-admin';

import LoadingBox from '../component/LoadingBox';
import { crudGetOneDisableNotificationAction } from '../redux/crud/action';
import ShowView from '../component/ShowView';

const ShowController = props => {
  const {
    version,
    record,
    children,
    crudGetOneDisableNotification,
    crudGetOne,
    basePath,
    resource,
    id,
    ...rest
  } = props;
  const translate = useTranslate();
  const previousId = useRef(id);
  const previousVersion = useRef(version);

  useEffect(() => {
    updateData();
  }, []);

  useEffect(() => {
    if (previousId.current !== id || previousVersion.current !== version) {
      updateData(resource, id);
    }
  }, [id, version, resource]);

  const updateData = (resource = props.resource, id = props.id) => {
    crudGetOne(resource, id, basePath);
  };

  const customRefresh = () => {
    crudGetOneDisableNotification({
      resource,
      id,
      basePath,
    });
  };

  if (!children) {
    return null;
  }

  const defaultTitle = translate('ra.page.show', {
    name: `${resource}`, // resource name
    id,
    record,
  });

  if (!record) {
    return <LoadingBox />;
  }

  const viewProps = {
    defaultTitle,
    resource,
    basePath,
    id,
    record,
    translate,
    version,
  };

  return (
    <ShowView {...rest} {...viewProps} customRefresh={customRefresh}>
      {children}
    </ShowView>
  );
};

function mapStateToProps(state, props) {
  return {
    id: props.id,
    record: state.admin.resources[props.resource]
      ? state.admin.resources[props.resource].data[props.id]
      : null,
    version: state.admin.ui.viewVersion,
  };
}

export default compose(
  connect(mapStateToProps, {
    crudGetOne: crudGetOneAction,
    crudGetOneDisableNotification: crudGetOneDisableNotificationAction,
  }),
)(ShowController);
