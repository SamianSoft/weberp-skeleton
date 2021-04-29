import { put, takeEvery } from 'redux-saga/effects';
import { CRUD_GET_LIST_SUCCESS } from 'react-admin';

import { addDataForGridWithResourceIdAction } from './action';

function* checkList({ payload, meta }) {
  if (!meta.resourceId) {
    return;
  }

  yield put(addDataForGridWithResourceIdAction(meta.resourceId, payload.data, payload.total));
}

export default function* gridListSaga() {
  yield takeEvery(CRUD_GET_LIST_SUCCESS, checkList);
}
