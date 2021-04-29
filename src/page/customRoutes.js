import React from 'react';

import PrivateRoute from '../container/PrivateRoute';
import ListRecordPage from './ListRecordPage';
import ShowRecordPage from './ShowRecordPage';
import CreateEditRecordPage from './CreateEditRecordPage';

// NOTE: first pattern that matches will be used
// prettier-ignore
const list = [
  <PrivateRoute exact path={`/:moduleName/:moduleTableName/create`} component={CreateEditRecordPage} />,
  <PrivateRoute exact path={`/:moduleName/:moduleTableName/:id/show`} component={ShowRecordPage} />,
  <PrivateRoute exact path={`/:moduleName/:moduleTableName/:id`} component={CreateEditRecordPage} />,
  <PrivateRoute exact path={`/:moduleName/:moduleTableName`} component={ListRecordPage} />,
];

export default list;
