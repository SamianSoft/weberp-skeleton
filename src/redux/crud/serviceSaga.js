import { put, takeEvery } from 'redux-saga/effects';
import { GET_ONE } from 'react-admin';
import { push as redirectTo } from 'connected-react-router';

import dataProvider, { RUN_SERVICE } from '../../core/dataProvider';
import { CRUD_GET_ONE_DISABLE_NOTIFICATION_ACTION } from './action';
import { showNotification } from '../notification/action';

function* findOne({ resource, params, callback }) {
  try {
    const data = yield dataProvider(RUN_SERVICE, resource, params);

    if (typeof callback === 'function') {
      callback(null, data);
    }
  } catch (error) {
    console.log(error);
    if (typeof callback === 'function') {
      callback(error);
    }
  }
}

function* getOneAfterRunService({ resource, id, basePath }) {
  try {
    const data = yield dataProvider(GET_ONE, resource, {
      id: id,
    });

    yield put({
      type: 'RA/CRUD_GET_ONE_SUCCESS',
      payload: data,
      requestPayload: {
        id: id,
      },
      meta: {
        resource: resource,
        basePath: basePath,
        fetchResponse: 'GET_ONE',
        fetchStatus: 'RA/FETCH_END',
      },
    });
  } catch (response) {
    if (response.code !== 7008) {
      yield put(showNotification(response.userMessage, 'error'));
    }
    yield put(redirectTo(basePath));
  }
}

export default function* serviceSaga() {
  yield takeEvery(RUN_SERVICE, findOne);
  yield takeEvery(CRUD_GET_ONE_DISABLE_NOTIFICATION_ACTION, getOneAfterRunService);
}
