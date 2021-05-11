import React from 'react';
import lodashGet from 'lodash/get';

import DynamicCreateEdit from '../container/DynamicCreateEdit';
import SettingHOC from '../container/SettingHOC';
import LoadingBox from '../component/LoadingBox';
import MetaProvider from '../container/MetaProvider';
import CheckResourceReady from '../container/CheckResourceReady';
import { isEmpty } from '../helper/DataHelper';

const CreateEditRecordPage = props => {
  const { staticContext, isSettingReady, id, match, ...rest } = props;

  if (!isSettingReady) {
    return <LoadingBox />;
  }

  const getResource = () => {
    const { moduleName, moduleTableName } = match.params;

    return `${moduleName}/${moduleTableName}`;
  };

  const resource = getResource();
  const isReport = resource.indexOf('report') === 0;
  const computeId = !isEmpty(id) ? id : lodashGet(props, 'match.params.id', null);
  console.log({resource});

  return (
    <MetaProvider resourceName={resource}>
      <CheckResourceReady resourceName={resource}>
        <DynamicCreateEdit
          {...rest}
          resource={resource}
          id={computeId}
          hasList={true}
          hasCreate={!isReport}
          hasEdit={!isReport}
          hasShow={!isReport}
          basePath={`/${resource}`}
        />
      </CheckResourceReady>
    </MetaProvider>
  );
};

export default SettingHOC([])(CreateEditRecordPage);
