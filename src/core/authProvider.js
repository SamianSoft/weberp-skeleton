import { AUTH_LOGIN } from 'react-admin';

import { USER_TOKEN, USER_ID, USER_COMPANY_ID, IS_ADMIN_USER, setValue } from './configProvider';

export const AUTH_SEND_MOBILE = 'AUTH_SEND_MOBILE';
export const AUTH_SEND_CONFIRMATION = 'AUTH_SEND_CONFIRMATION';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJXZWJUZXN0IiwianRpIjoiZWZjNWZmNTUtYjNjMS00MTFkLWI0ZGYtNjMyODIyMTNjOTc0IiwiaWF0IjoxNjE4NjQ5ODYxLCJ1aXUiOiI4MTU1IiwiY3VpdSI6IjgxNTUiLCJkbiI6Itiv2YHYqtixINmF2LHZg9iy2YoiLCJkaSI6IjAiLCJheSI6IjE0MDAiLCJheWkiOiIyOTkwMDAxIiwib3BpIjoiMjk5NyIsInVpbWkiOiIiLCJ3aCI6IjIzIiwiY3NoaSI6IjEiLCJ1aWFjY2kiOiI4MTU1IiwidW4iOiJXZWJUZXN0IFBscyBEbyBub3QgRGVsZXRlIiwidWljbiI6IkRpc3RMaXRlIiwiYXNsIjoiMSIsInVpYyI6IjEiLCJyb2xlcyI6IkVycFVzZXIiLCJuYmYiOjE2MTg2NDk4NjEsImV4cCI6MTY1MDE4NTg2MSwiaXNzIjoidG9rZW5saXRlMjEiLCJhdWQiOiJodHRwOi8vMC4wLjAuMDo4MDg2LyJ9.JOdb-e6VCwqGyFqN_IdCwFaUSu-wMm1k8Pii2cyd4n0';
export default async (type, params) => {
  switch (type) {
    case AUTH_LOGIN:
      setValue(USER_TOKEN, token);
      setValue(USER_COMPANY_ID, 1);
      setValue(USER_ID, 8155);
      setValue(IS_ADMIN_USER, true);

    // eslint-disable-next-line no-fallthrough
    default:
      throw 'Unknown method';
  }
};
