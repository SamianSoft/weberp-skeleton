import React, { FC } from 'react';
import { Admin, Resource } from 'react-admin';
import { initializeIcons } from '@uifabric/icons';

import dataProvider from './core/dataProvider';
import authProvider from './core/authProvider';
import i18nProvider from './core/i18n/i18nProvider';
import themeProvider, { AppLayoutDirection } from './core/themeProvider';
import customReducers from './redux/customReducers';
import customSagas from './redux/customSagas';
import customRoutes from './page/customRoutes';
import AppLayout from './component/AppLayout';

import LoginPage from './page/LoginPage';
import { NewMetaStore } from './container/NewMetaContext';

initializeIcons();

const App: FC = () => {
  return (
    <AppLayoutDirection>
      <NewMetaStore>
        <Admin
          title="iMaster Web"
          dataProvider={dataProvider}
          authProvider={authProvider}
          i18nProvider={i18nProvider}
          theme={themeProvider}
          customReducers={customReducers}
          customSagas={customSagas}
          customRoutes={customRoutes}
          layout={AppLayout}
          loginPage={LoginPage}
        >
          <Resource key="webtest/order" name="webtest/order" />
          <Resource key="appcore/websetting" name="appcore/websetting" />
        </Admin>
      </NewMetaStore>
    </AppLayoutDirection>
  );
};

export default App;
