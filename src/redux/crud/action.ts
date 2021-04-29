import {
  CRUD_CREATE,
  CREATE,
  CRUD_UPDATE,
  UPDATE,
  CRUD_GET_LIST,
  GET_LIST,
  Identifier,
  CRUD_DELETE,
  DELETE,
  CRUD_UPDATE_SUCCESS,
  FETCH_END,
  CRUD_DELETE_MANY,
  DELETE_MANY,
  RefreshSideEffect,
  NotificationSideEffect,
} from 'react-admin';
import { RUN_SERVICE, CUSTOM_UPDATE } from '../../core/dataProvider';

interface CrudActionData {
  [key: string]: any;
}
const emptyFunction = () => {};

export const crudCreateWithCallbackAction = (
  resource: string,
  data: CrudActionData,
  callback: Function,
  disableNotification: boolean,
  executeCallbackOnFailure: boolean,
) => ({
  type: CRUD_CREATE,
  payload: { data },
  meta: {
    resource,
    fetch: CREATE,
    onSuccess: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.created',
            level: 'info',
            messageArgs: {
              smart_count: 1,
            },
          }
        : null,
      callback,
    },
    onFailure: {
      notification: executeCallbackOnFailure
        ? disableNotification
        : !disableNotification
        ? {
            body: 'ra.notification.code_error',
            level: 'error',
          }
        : null,
      callback: executeCallbackOnFailure ? callback : emptyFunction,
    },
  },
});

export const crudDeleteWithCallbackAction = (
  resource: string,
  id: Identifier,
  callback: Function,
  disableNotification: boolean,
) => ({
  type: CRUD_DELETE,
  payload: { id, previousData: {} },
  meta: {
    resource,
    fetch: DELETE,
    onSuccess: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.deleted',
            level: 'info',
            messageArgs: {
              smart_count: 1,
            },
          }
        : null,
      refresh: false,
      redirectTo: null,
      basePath: null,
      callback,
    },
    onFailure: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.code_error',
            level: 'error',
          }
        : null,
    },
  },
});

export const crudUpdateWithCallbackAction = (
  resource: string,
  id: Identifier,
  data: CrudActionData,
  previousData: CrudActionData,
  callback: Function,
  disableNotification: boolean,
  otherParams = {},
  executeCallbackOnFailure: boolean,
) => ({
  type: CRUD_UPDATE,
  payload: { id, data, previousData, ...otherParams },
  meta: {
    resource,
    fetch: UPDATE,
    onSuccess: {
      notification: executeCallbackOnFailure
        ? disableNotification
        : !disableNotification
        ? {
            body: 'ra.notification.updated',
            level: 'info',
            messageArgs: {
              smart_count: 1,
            },
          }
        : null,
      redirectTo: null,
      basePath: null,
      callback,
    },
    onFailure: {
      notification:
        !disableNotification && !executeCallbackOnFailure
          ? {
              body: 'ra.notification.http_error',
              level: 'error',
            }
          : null,
      callback: executeCallbackOnFailure ? callback : emptyFunction,
    },
  },
});

export const crudCustomUpdate = (
  resource: string,
  id: Identifier,
  data: [],
  disableNotification: boolean,
) => ({
  type: CUSTOM_UPDATE,
  payload: { id, data },
  meta: {
    resource,
    fetch: CUSTOM_UPDATE,
    onSuccess: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.updated',
            level: 'info',
            messageArgs: {
              smart_count: 1,
            },
          }
        : null,
      redirectTo: null,
      basePath: null,
    },
    onFailure: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.http_error',
            level: 'error',
          }
        : null,
    },
  },
});

export const runServiceAction = (resource: string, params: any, callback: Function) => ({
  type: RUN_SERVICE,
  resource,
  params,
  callback,
});

export const CRUD_GET_ONE_DISABLE_NOTIFICATION_ACTION =
  'RA/CRUD_GET_ONE_DISABLE_NOTIFICATION_ACTION';
export const crudGetOneDisableNotificationAction = ({ resource, id, basePath }) => ({
  type: CRUD_GET_ONE_DISABLE_NOTIFICATION_ACTION,
  resource,
  id,
  basePath,
});

export const crudGetListWithCustomQueryAction = (
  resource,
  pagination,
  sort,
  filter,
  otherParams = {},
  disableNotification = false,
) => ({
  type: CRUD_GET_LIST,
  payload: { pagination, sort, filter, ...otherParams },
  meta: {
    resource,
    fetch: GET_LIST,
    onFailure: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.http_error',
            level: 'warning',
          }
        : null,
    },
  },
});

export const customSuccessUpdate = (resource: string, data: [], disableNotification: boolean) => ({
  type: CRUD_UPDATE_SUCCESS,
  payload: { data },
  meta: {
    resource,
    fetchResponse: UPDATE,
    fetchStatus: FETCH_END,
    onSuccess: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.updated',
            level: 'info',
          }
        : null,
      redirectTo: null,
      basePath: null,
    },
    onFailure: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.http_error',
            level: 'error',
          }
        : null,
    },
  },
});

export const crudDeleteMany = (
  resource: string,
  ids: Identifier[],
  basePath: string,
  refresh: RefreshSideEffect = true,
  disableNotification = false,
  callback: Function,
): CrudDeleteManyAction => ({
  type: CRUD_DELETE_MANY,
  payload: { ids },
  meta: {
    resource,
    fetch: DELETE_MANY,
    onSuccess: {
      notification: !disableNotification
        ? {
            body: 'ra.notification.deleted',
            level: 'info',
            messageArgs: {
              smart_count: ids.length,
            },
          }
        : null,
      basePath,
      refresh,
      unselectAll: true,
      callback,
    },
    onFailure: {
      notification: {
        body: 'ra.notification.http_error',
        level: 'warning',
      },
    },
  },
});

interface RequestPayload {
  ids: Identifier[];
}

interface CrudDeleteManyAction {
  readonly type: typeof CRUD_DELETE_MANY;
  readonly payload: RequestPayload;
  readonly meta: {
    resource: string;
    fetch: typeof DELETE_MANY;
    onSuccess: {
      notification: NotificationSideEffect;
      refresh: RefreshSideEffect;
      basePath: string;
      unselectAll: boolean;
      callback: Function;
    };
    onFailure: {
      notification: NotificationSideEffect;
    };
  };
}
