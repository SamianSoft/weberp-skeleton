import React, { useContext, useState, useEffect, cloneElement, Children } from 'react';
import PropTypes from 'prop-types';

import { NewMetaContext } from './NewMetaContext';
import LoadingBox from '../component/LoadingBox';

const MetaProvider = ({
  resourceName,
  children,
  noLoading = false,
  metaField = 'metaData',
  ...rest
}) => {
  const { getMeta, version } = useContext(NewMetaContext);
  const [metaData, setMetaData] = useState(null);
  const [resource, setResource] = useState(resourceName);

  useEffect(() => {
    // if we already have meta
    if (metaData && resource === resourceName) {
      return;
    }

    const newData = getMeta(resourceName);
    if (newData) {
      setMetaData(newData);
      setResource(resourceName);
    }
  }, [version, resourceName]);

  if (!noLoading && !metaData) {
    return <LoadingBox />;
  }

  return Children.map(children, element =>
    cloneElement(element, {
      ...rest,
      [metaField]: metaData,
      getMeta: getMeta,
    }),
  );
};

MetaProvider.propTypes = {
  children: PropTypes.any.isRequired,
  resourceName: PropTypes.string.isRequired,
  metaField: PropTypes.string,
  noLoading: PropTypes.bool,
};

export default MetaProvider;
