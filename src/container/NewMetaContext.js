import React, { useState, createContext } from 'react';
import dataProvider, { GET_META } from '../core/dataProvider';
import { isEmpty } from '../helper/DataHelper';

const getReportChildrenMeta = reportMeta => {
  const result = [];

  Object.keys(reportMeta.tabsColumns).forEach((tab, index) => {
    result.push({
      name: `report/${String(reportMeta.id).toLowerCase()}/${index}`,
      meta: {
        ...reportMeta,
        fields: reportMeta.tabsColumns[tab],
        columns: reportMeta.tabsColumns[tab],
        executable: true,
      },
    });
  });

  return result;
};

export const NewMetaContext = createContext({
  resourceList: [],
  version: 0,
  getMeta: resourceName => ({}),
});

const globalAccess = {};
const isLoadedOnceList = {};
let internalCounter = 0;

const getMetaFromApi = async resource => {
  const metaArray = await dataProvider(GET_META, resource, {});

  const preparedList = [];

  for (const meta of metaArray) {
    let isReportWithTabs = false;

    let name;
    // something went wrong in api!
    if (!meta) {
      console.log('empty meta received!', resource);
      continue;
    } else if (typeof meta === 'string') {
      name = resource;
    } else if (!meta.config && meta.id) {
      name = `report/${meta.id}`;
      isReportWithTabs = meta.tabsColumns && Object.keys(meta.tabsColumns).length;
    } else if (typeof meta.config !== 'undefined') {
      const { moduleName, moduleTableName } = meta.config;
      name = `${moduleName}/${moduleTableName}`;
    } else {
      console.log('bad meta', meta);
      throw new Error('bad meta');
    }

    // add main meta
    preparedList.push({
      name: name.toLowerCase(),
      meta: !isReportWithTabs ? meta : { ...meta, executable: false },
    });

    if (meta.reports && meta.reports.length) {
      for (const reportMeta of meta.reports) {
        const hasReportChildren =
          reportMeta.tabsColumns && Object.keys(reportMeta.tabsColumns).length;

        preparedList.push({
          name: `report/${String(reportMeta.id).toLowerCase()}`,
          meta: {
            ...reportMeta,
            executable: hasReportChildren ? false : true,
          },
        });

        if (hasReportChildren) {
          getReportChildrenMeta(reportMeta).forEach(child => {
            preparedList.push(child);
          });
        }
      }
    }

    // see if any child reports exist
    if (isReportWithTabs) {
      getReportChildrenMeta(meta).forEach(child => {
        preparedList.push(child);
      });
    }
  }

  return preparedList;
};

export const NewMetaStore = ({ children }) => {
  const [version, setVersion] = useState(internalCounter);

  const getMeta = resourceName => {
    if (isEmpty(resourceName) || resourceName === 'undefined/undefined') {
      return null;
    }

    const resource = String(resourceName.toLowerCase());

    if (globalAccess[resource]) {
      return globalAccess[resource];
    }

    if (typeof isLoadedOnceList[resource] !== 'undefined') {
      return null;
    }

    // mark that we know about this and is loading
    isLoadedOnceList[resource] = true;

    // request meta for this resource
    getMetaFromApi(resource)
      .then(newList => {
        // new meta list is an array
        newList.forEach(item => {
          if (!globalAccess[item.name]) {
            globalAccess[item.name] = item.meta;
            isLoadedOnceList[item.name] = false;
          }
        });

        // trigger a refresh
        internalCounter++;
        setVersion(internalCounter);
      })
      .catch(error => {
        console.log('NewMetaContext.js:98 err', error);
        globalAccess[resource] = { error };
      });
  };

  return (
    <NewMetaContext.Provider
      value={{
        getMeta,
        version,
        resourceList: Object.keys(isLoadedOnceList),
      }}
    >
      {children}
    </NewMetaContext.Provider>
  );
};
