import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';

import { USER_TOKEN, USER_ID, USER_COMPANY_ID, IS_ADMIN_USER, setValue } from './configProvider';

export const AUTH_SEND_MOBILE = 'AUTH_SEND_MOBILE';
export const AUTH_SEND_CONFIRMATION = 'AUTH_SEND_CONFIRMATION';

export default async (type, params) => {
  switch (type) {
    case AUTH_LOGIN:
      setValue(USER_TOKEN, token);
      setValue(USER_COMPANY_ID, 1);
      setValue(USER_ID, 8155);
      setValue(IS_ADMIN_USER, true);

    default:
      throw 'Unknown method';
  }
};
