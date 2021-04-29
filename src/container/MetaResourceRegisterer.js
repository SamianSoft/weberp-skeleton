import React, { useContext, useState, useEffect } from 'react';
import { Resource } from 'react-admin';
import { NewMetaContext } from './NewMetaContext';
import { getValue, CONFIG_FIXED_RESOURCE } from '../core/configProvider';

export default () => {
  const fixedResource = getValue(CONFIG_FIXED_RESOURCE) || [];

  const { resourceList } = useContext(NewMetaContext);
  const [list, setList] = useState(fixedResource);

  // add new resources to the list and always be adding to the list
  useEffect(() => {
    const newData = new Set(list);
    resourceList.forEach(resource => newData.add(resource));
    setList(Array.from(newData));
  }, [resourceList]);

  return (
    <>
      {list.map(routeName => (
        <Resource key={routeName} name={routeName} intent="registration" />
      ))}
    </>
  );
};
