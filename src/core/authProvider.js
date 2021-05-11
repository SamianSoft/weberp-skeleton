import { AUTH_LOGIN } from 'react-admin';

import { USER_TOKEN, USER_ID, USER_COMPANY_ID, IS_ADMIN_USER, setValue } from './configProvider';

export const AUTH_SEND_MOBILE = 'AUTH_SEND_MOBILE';
export const AUTH_SEND_CONFIRMATION = 'AUTH_SEND_CONFIRMATION';

export default async (type, params) => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJXZWJUZXN0IiwianRpIjoiNDQ3M2UyYTctZGMyYS00NTI3LThmNDItMzQwMTc1ZDQxMzgxIiwiaWF0IjoxNjE5MjY2NjU5LCJ1aXUiOiI4MTU1IiwiY3VpdSI6IjgxNTUiLCJkbiI6Itiv2YHYqtixINmF2LHZg9iy2YoiLCJkaSI6IjAiLCJheSI6IjE0MDAiLCJheWkiOiIyOTkwMDAxIiwib3BpIjoiMjk5NyIsInVpbWkiOiIiLCJ3aCI6IjQxIiwiY3NoaSI6IjEiLCJ1aWFjY2kiOiI4MTU1IiwidW4iOiJXZWJUZXN0IFBscyBEbyBub3QgRGVsZXRlIiwidWljbiI6IkRpc3RMaXRlIiwiYXNsIjoiMSIsInVpYyI6IjEiLCJyb2xlcyI6IkVycFVzZXIiLCJuYmYiOjE2MTkyNjY2NTksImV4cCI6MTY1MDgwMjY1OSwiaXNzIjoidG9rZW5saXRlMjEiLCJhdWQiOiJodHRwOi8vMC4wLjAuMDo4MDg2LyJ9.9_pCFEO-2CckCE4iviPa8Nxm3f95dR4f0RVsyI9MdIM';
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
