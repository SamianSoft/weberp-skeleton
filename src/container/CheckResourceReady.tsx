import React, { cloneElement, FC, ReactElement, useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslate } from 'react-admin';

import { NewMetaContext } from './NewMetaContext';
import { CONFIG_FIXED_RESOURCE, getValue } from '../core/configProvider';
import NotFound from '../component/NotFound';
import LoadingBox from '../component/LoadingBox';

interface CheckResourceReadyProps {
  resourceName: string;
  children: ReactElement;
  isReady: boolean;
  dispatch: Function;
}

const CheckResourceReady: FC<CheckResourceReadyProps> = props => {
  const { dispatch, resourceName, children, isReady, ...rest } = props;
  const fixedResource = getValue(CONFIG_FIXED_RESOURCE) || [];

  const { resourceList } = useContext(NewMetaContext);
  const [list, setList] = useState<string[]>(fixedResource);
  const [isALittleTimePassed, setIsALittleTimePassed] = useState(false);

  const translate = useTranslate();

  // add new resources to the list and always be adding to the list
  useEffect(() => {
    const newData = new Set(list);
    resourceList.forEach(resource => newData.add(resource));
    setList(Array.from(newData));
  }, [resourceList]);

  // wait a little!
  useEffect(() => {
    setTimeout(() => {
      setIsALittleTimePassed(true);
    }, 500);
  }, []);

  // if a little time is passed and still we don't have resourceName in the list, show that something has went wrong!
  if (isALittleTimePassed && list.indexOf(resourceName) === -1) {
    return <NotFound title={translate('meta.resourceIsNotDefined')} />;
  }

  if (!isReady) {
    return <LoadingBox />;
  }

  return cloneElement(children, rest);
};

const mapStateToProps = (state, { resourceName }) => ({
  isReady: !!state.admin.resources[resourceName],
});

export default connect(mapStateToProps)(CheckResourceReady);
