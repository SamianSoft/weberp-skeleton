import React, { PureComponent } from 'react';
import lodashGet from 'lodash/get';
import lodashFind from 'lodash/find';
import lodashIsObject from 'lodash/isObject';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { crudGetList as crudGetListAction } from 'react-admin';

import { crudCreateWithCallbackAction, crudUpdateWithCallbackAction } from '../redux/crud/action';
import { isJsonEncodedString, mergeAndClone } from '../helper/DataHelper';
import {
  getValue,
  USER_ID,
  CONFIG_DISABLE_FETCH_USER_SETTING,
  USER_SETTING_VERSION,
} from '../core/configProvider';
import { isNumber } from '../helper/NumberHelper';

const settingResource = 'appcore/websetting';

export const GET_SETTING = 'getSetting';
export const GET_SETTING_FOR_USER = 'getSettingForUser';
export const SET_SETTING = 'setSetting';
export const SET_SETTING_FOR_USER = 'setSettingForUser';

export const DEFAULT = 'DEFAULT';
export const CONFIG_SAVED_FILTER = 'CONFIG_SAVED_FILTER';
export const CONFIG_LIST_COLUMN_CHOICE = 'CONFIG_LIST_COLUMN_CHOICE';
export const CONFIG_LIST_LAST_FILTER = 'CONFIG_LIST_LAST_FILTER';
export const CONFIG_LIST_SORT = 'CONFIG_LIST_SORT';
export const CONFIG_LIST_PER_PAGE = 'CONFIG_LIST_PER_PAGE';
export const CONFIG_FORM_LAYOUT = 'CONFIG_FORM_LAYOUT';

// use global variable, because this component will be used in multiple locations
let lastSettingRequested = null;
const defaultAppLoadedSetting = {};

class UnConnectedSettingHOC extends PureComponent {
  componentDidMount() {
    this.fetchSetting();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.profileData !== nextProps.profileData) {
      lastSettingRequested = null;
      this.fetchSetting();
    }
  }

  fetchSetting() {
    const { crudGetList, isSettingReady } = this.props;

    if (!isSettingReady && !lastSettingRequested) {
      lastSettingRequested = Date.now();

      crudGetList(
        settingResource,
        { page: 1, perPage: 999999 },
        { field: 'id', order: 'DESC' },
        {},
      );
    }
  }

  getSetting = (_key, defaultValue = null) => {
    const key = `${getValue(USER_SETTING_VERSION)}_${_key}`;
    const { appLoadedSetting } = this.props;

    const setting = lodashFind(appLoadedSetting, { settingkey: key });
    if (!setting) {
      return defaultValue;
    }
    if (isJsonEncodedString(setting.settingvalue)) {
      return JSON.parse(setting.settingvalue);
    }
    if (isNumber(setting.settingvalue)) {
      return parseFloat(setting.settingvalue);
    }

    return setting.settingvalue;
  };

  getSettingForUser = (key, defaultValue = null) => {
    const userId = getValue(USER_ID);
    return this.getSetting(userId + '_' + key, defaultValue);
  };

  setSetting = (_key, value, callback) => {
    const key = `${getValue(USER_SETTING_VERSION)}_${_key}`;
    const { appLoadedSetting, crudCreate, crudUpdate } = this.props;

    const preparedData =
      lodashIsObject(value) || Array.isArray(value) ? JSON.stringify(value) : value;

    const record = lodashFind(appLoadedSetting, { settingkey: key });

    if (record) {
      crudUpdate(
        settingResource,
        record.id,
        mergeAndClone(record, { settingvalue: preparedData }),
        record,
        callback,
        true,
      );
    } else {
      crudCreate(settingResource, { settingkey: key, settingvalue: preparedData }, callback, true);
    }
  };

  setSettingForUser = (key, value, callback) => {
    const userId = getValue(USER_ID);
    this.setSetting(userId + '_' + key, value, callback);
  };

  render() {
    const {
      functionList,
      component: ChildComponent,
      appLoadedSetting,
      crudGetList,
      crudCreate,
      crudUpdate,
      isSettingReady,
      profileData,
      ...rest
    } = this.props;

    if (!Array.isArray(functionList)) {
      throw new Error('Dear developer, Please provide name of props that you need from setting');
    }

    const necessaryProps = {};
    functionList.forEach(name => {
      necessaryProps[name] = this[name];
    });

    return <ChildComponent {...rest} {...necessaryProps} isSettingReady={isSettingReady} />;
  }
}

UnConnectedSettingHOC.propTypes = {
  functionList: PropTypes.array.isRequired,
  component: PropTypes.any.isRequired,
  crudGetList: PropTypes.func.isRequired,
  profileData: PropTypes.object,
};

const mapStateToProps = state => ({
  appLoadedSetting: lodashGet(
    state,
    ['admin', 'resources', settingResource, 'data'],
    defaultAppLoadedSetting,
  ),
  // prettier-ignore
  isSettingReady: lodashGet(state, ['admin', 'resources', settingResource, 'list', 'loadedOnce'], false),
  profileData: lodashGet(state, 'profile.data'), // check profile for logged-in user change
});

const mapDispatchToProps = {
  crudGetList: crudGetListAction,
  crudCreate: crudCreateWithCallbackAction,
  crudUpdate: crudUpdateWithCallbackAction,
};

const SettingHOC = connect(mapStateToProps, mapDispatchToProps)(UnConnectedSettingHOC);

class DummySettingHOC extends PureComponent {
  getSetting = (key, defaultValue = null) => null;

  getSettingForUser = (key, defaultValue = null) => null;

  setSetting = (key, value, callback) => {};

  setSettingForUser = (key, value, callback) => {};

  render() {
    const {
      functionList,
      component: ChildComponent,
      appLoadedSetting,
      crudGetList,
      crudCreate,
      crudUpdate,
      isSettingReady,
      profileData,
      ...rest
    } = this.props;

    if (!Array.isArray(functionList)) {
      throw new Error('Dear developer, Please provide name of props that you need from setting');
    }

    const necessaryProps = {};
    functionList.forEach(name => {
      necessaryProps[name] = this[name];
    });

    return <ChildComponent {...rest} {...necessaryProps} isSettingReady={isSettingReady} />;
  }
}

export default functionList => HocComponent => props => {
  const disableFetchUserSetting = getValue(CONFIG_DISABLE_FETCH_USER_SETTING);

  return disableFetchUserSetting ? (
    <DummySettingHOC {...props} functionList={functionList} component={HocComponent} />
  ) : (
    <SettingHOC {...props} functionList={functionList} component={HocComponent} />
  );
};
