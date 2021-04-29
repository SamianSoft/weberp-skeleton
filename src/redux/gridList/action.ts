import { Pagination, Sort, CRUD_GET_LIST, GET_LIST } from 'react-admin';
import { ADD_RESOURCE_DATA } from './constant';

export const crudGetListAction = (
  resource: string,
  pagination: Pagination,
  sort: Sort,
  filter: object,
  resourceId: string | undefined,
) => ({
  type: CRUD_GET_LIST,
  payload: { pagination, sort, filter },
  meta: {
    resourceId,
    resource,
    fetch: GET_LIST,
    onFailure: {
      notification: {
        body: 'ra.notification.http_error',
        level: 'warning',
      },
    },
  },
});

export const addDataForGridWithResourceIdAction = (
  resourceId: string,
  data: object[],
  total: number,
) => ({
  type: ADD_RESOURCE_DATA,
  resourceId,
  data,
  total,
});
