import {
  TOGGLE_NOTE_STREAM,
  CLOSE_NOTE_STREAM,
  SET_NOTE_STREAM_PAGE,
  TOGGLE_DEV_EX_TOP_FILTER,
  TOGGLE_DEV_EX_GROUPING,
} from './constant';

export function toggleNoteStreamAction() {
  return {
    type: TOGGLE_NOTE_STREAM,
  };
}

export function closeNoteStreamAction() {
  return {
    type: CLOSE_NOTE_STREAM,
  };
}

export function setNoteStreamPageAction(data) {
  return {
    type: SET_NOTE_STREAM_PAGE,
    data, // data has : resource, page
  };
}

export function toggleDevExTopFilterAction() {
  return {
    type: TOGGLE_DEV_EX_TOP_FILTER,
  };
}

export function toggleDevExGroupingAction() {
  return {
    type: TOGGLE_DEV_EX_GROUPING,
  };
}
