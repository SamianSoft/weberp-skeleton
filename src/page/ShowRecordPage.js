import React from 'react';
import lodashGet from 'lodash/get';
import { useLocale } from 'react-admin';

import DynamicShow from '../container/DynamicShow';
import MetaProvider from '../container/MetaProvider';
import CheckResourceReady from '../container/CheckResourceReady';

const ShowRecordPage = props => {
  const { staticContext, match, ...rest } = props;
  const locale = useLocale();

  const getResource = () => {
    const { moduleName, moduleTableName } = match.params;

    return `${moduleName}/${moduleTableName}`;
  };

  const resource = getResource();
  const isReport = resource.indexOf('report') === 0;

  return (
    <MetaProvider resourceName={resource}>
      <CheckResourceReady resourceName={resource}>
        <DynamicShow
          {...rest}
          resource={resource}
          match={match}
          id={lodashGet(props, 'match.params.id')}
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

export default ShowRecordPage;
