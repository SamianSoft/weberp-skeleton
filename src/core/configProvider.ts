import { isJsonEncodedString } from '../helper/DataHelper';

export const API_URL = 'API_URL';
export const API_NAME = 'API_NAME';
export const API_VERSION = 'API_VERSION';

export const USER_TOKEN = 'USER_TOKEN';
export const USER_ID = 'USER_ID';
export const USER_COMPANY_ID = 'USER_COMPANY_ID';
export const IS_ADMIN_USER = 'IS_ADMIN_USER';

export const DRAWER_WIDTH = 'DRAWER_WIDTH';
export const HEADER_HEIGHT = 'HEADER_HEIGHT';
export const HEADER_HEIGHT_XS = 'HEADER_HEIGHT_XS';
export const CONFIG_LOCALE = 'CONFIG_LOCALE';
export const CONFIG_THEME_DIR = 'CONFIG_THEME_DIR';
export const CONFIG_CALENDAR = 'CONFIG_CALENDAR';
export const CONFIG_PROFILE_SETTING = 'CONFIG_PROFILE_SETTING';
export const CONFIG_CACHED_MENU = 'CONFIG_CACHED_MENU';
export const CONFIG_CELL_WIDTH = 'CONFIG_CELL_WIDTH';
export const CONFIG_DRAWER_MENU_IS_OPEN = 'CONFIG_DRAWER_MENU_IS_OPEN';
export const CONFIG_LOGIN_WITH_SMS = 'CONFIG_LOGIN_WITH_SMS';
export const CONFIG_FIXED_HEADER_PARAMS = 'CONFIG_FIXED_HEADER_PARAMS';
export const CONFIG_FIXED_MENU = 'CONFIG_FIXED_MENU';
export const CONFIG_ROUTE_PREFIX = 'CONFIG_ROUTE_PREFIX';
export const CONFIG_FIXED_RESOURCE = 'CONFIG_FIXED_RESOURCE';
export const CONFIG_DISABLE_FETCH_USER_SETTING = 'CONFIG_DISABLE_FETCH_USER_SETTING';
export const CONFIG_IS_PROFILE_EDIT_ENABLED = 'CONFIG_IS_PROFILE_EDIT_ENABLED';
export const CONFIG_DASHBOARD_ADVERTISEMENT_RESOURCE = 'CONFIG_DASHBOARD_ADVERTISEMENT_RESOURCE';
export const CONFIG_PALETTE_COLORS = 'CONFIG_PALETTE_COLORS';
export const CONFIG_IS_BOTTOM_MENU_ENABLED = 'CONFIG_IS_BOTTOM_MENU_ENABLED';
export const CONFIG_CACHED_TODO_EXPANDED_GROUP = 'CONFIG_CACHED_TODO_EXPANDED_GROUP';

export const CONFIG_CURRENCY_SYMBOL = 'CONFIG_CURRENCY_SYMBOL';
export const CONFIG_CURRENCY_NAME = 'CONFIG_CURRENCY_NAME';

export const SERVER_DATE_FORMAT = 'YYYY-MM-DD';
export const USER_SETTING_VERSION = 'USER_SETTING_VERSION';

const defaultValue = {
  [API_URL]: process.env.REACT_APP_API_URL,
  [API_NAME]: process.env.REACT_APP_API_NAME,
  [USER_SETTING_VERSION]: 'v1',
  [CONFIG_ROUTE_PREFIX]: process.env.REACT_APP_ROUTE_PREFIX,
  [API_VERSION]: 'v2',
  [DRAWER_WIDTH]: 200,
  [HEADER_HEIGHT]: 50,
  [HEADER_HEIGHT_XS]: 40,
  [CONFIG_CELL_WIDTH]: 200,
  [CONFIG_LOCALE]: 'fa',
  [CONFIG_THEME_DIR]: 'rtl',
  [CONFIG_CALENDAR]: 'jalali',
  [IS_ADMIN_USER]: false,
  [CONFIG_PROFILE_SETTING]: null,
  [CONFIG_DRAWER_MENU_IS_OPEN]: true,
  [CONFIG_LOGIN_WITH_SMS]: !!process.env.REACT_APP_LOGIN_WITH_SMS,
  [CONFIG_FIXED_HEADER_PARAMS]: process.env.REACT_APP_FIXED_HEADER_PARAMS,
  [CONFIG_FIXED_MENU]: process.env.REACT_APP_FIXED_MENU,
  [CONFIG_FIXED_RESOURCE]: process.env.REACT_APP_FIXED_RESOURCE,
  [CONFIG_DISABLE_FETCH_USER_SETTING]: !!process.env.REACT_APP_DISABLE_FETCH_USER_SETTING,
  [CONFIG_IS_PROFILE_EDIT_ENABLED]: !!process.env.REACT_APP_IS_PROFILE_EDIT_ENABLED,
  [CONFIG_DASHBOARD_ADVERTISEMENT_RESOURCE]: process.env.REACT_APP_DASHBOARD_ADVERTISEMENT_RESOURCE,
  [CONFIG_PALETTE_COLORS]: process.env.REACT_APP_PALETTE_COLORS
    ? process.env.REACT_APP_PALETTE_COLORS
    : {},
  [CONFIG_IS_BOTTOM_MENU_ENABLED]: !!process.env.REACT_APP_IS_BOTTOM_MENU_ENABLED,
};

export const getValue = (name: string): any => {
  const storedValue = localStorage.getItem(name);
  if (!storedValue) {
    return isJsonEncodedString(defaultValue[name])
      ? JSON.parse(defaultValue[name])
      : defaultValue[name];
  }

  if (isJsonEncodedString(storedValue)) {
    return JSON.parse(storedValue);
  }
  if (storedValue === 'true') {
    return true;
  }
  if (storedValue === 'false') {
    return false;
  }

  return storedValue;
};

export const setValue = (name: string, value: any): void => {
  const preparedData = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;

  localStorage.setItem(name, preparedData);
};

export const removeValue = (name: string): void => {
  localStorage.removeItem(name);
};

export const clearAllConfig = (): void => {
  localStorage.clear();
};
