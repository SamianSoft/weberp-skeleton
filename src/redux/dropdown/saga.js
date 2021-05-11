import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from 'react-admin';

import { FIND_ONE } from './constant';
import { findOneSuccessAction, findOneFailedAction } from './action';
import dataProvider, { GET_DROPDOWN } from '../../core/dataProvider';

function* findOne({ id, params, callback, meta }) {
  try {
    const data = yield dataProvider(GET_DROPDOWN, id, params);

    yield put(findOneSuccessAction({ id, data, meta }));

    if (data.userMessage && data.messageType !== 'ignore') {
      yield put(showNotification(data.userMessage, data.messageType));
    }

    if (typeof callback === 'function') {
      callback(null, data);
    }
  } catch (error) {
    yield put(findOneFailedAction({ id, error }));

    if (typeof callback === 'function') {
      callback(error, null);
    }
  }
}

export default function* dropdownSaga() {
  yield takeEvery(FIND_ONE, findOne);
}
