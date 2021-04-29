import { CRUD_GET_ONE_SUCCESS } from 'react-admin';
import { put, takeEvery } from 'redux-saga/effects';

function* checkAdditionalData({ payload }) {
  if (payload && payload.data) {
    for (const item in payload.data) {
      let dataItem = payload.data[item];
      if (
        item.indexOf('/') !== -1 &&
        typeof dataItem.TotalCount !== 'undefined' &&
        typeof dataItem.Data !== 'undefined'
      ) {
        const { Data, TotalCount } = dataItem;

        if (!TotalCount) continue;

        // react-admin\packages\ra-core\src\actions\dataActions\crudGetList.ts
        yield put({
          type: 'RA/CRUD_GET_LIST_SUCCESS',
          payload: {
            data: Data,
            total: TotalCount,
          },
          requestPayload: {
            pagination: {
              page: 1,
              perPage: 10,
            },
            sort: {
              field: 'id',
              order: 'DESC',
            },
            filter: {},
          },
          meta: {
            resource: item,
            fetchResponse: 'GET_LIST',
            fetchStatus: 'RA/FETCH_END',
          },
        });
      }
    }
  }
}

export default function* dropdownSaga() {
  yield takeEvery(CRUD_GET_ONE_SUCCESS, checkAdditionalData);
}
