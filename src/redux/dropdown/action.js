import { FIND_ONE, FIND_ONE_SUCCESS, FIND_ONE_FAILED, CREATE_ONE_SUCCESS } from './constant';

export function findOneAction({ id, meta, params = {} }, callback) {
  return {
    type: FIND_ONE,
    id,
    params,
    meta,
    callback,
  };
}

export function findOneSuccessAction({ id, data, meta }) {
  return {
    type: FIND_ONE_SUCCESS,
    id,
    data,
    meta,
  };
}

export function findOneFailedAction({ id, error }) {
  return {
    type: FIND_ONE_FAILED,
    id,
    error,
  };
}

export function createOneSuccessAction({ id, newRecord, meta }) {
  return {
    type: CREATE_ONE_SUCCESS,
    id,
    newRecord,
    meta,
  };
}
