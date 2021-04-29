import produce from 'immer';
import { USER_LOGOUT } from 'react-admin';
import {
  TOGGLE_NOTE_STREAM,
  CLOSE_NOTE_STREAM,
  TOGGLE_DEV_EX_TOP_FILTER,
  SET_NOTE_STREAM_PAGE,
  TOGGLE_DEV_EX_GROUPING,
} from './constant';

const initialState = {
  showNoteStream: false,
  noteStreamPage: {},
  showDevExtremeTopFilter: false,
  showDevExtremeGrouping: false,
};

const myReducer = (state = initialState, { type, data }) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case USER_LOGOUT:
        draft.showNoteStream = false;
        draft.noteStreamPage = {};
        draft.showDevExtremeTopFilter = false;
        draft.showDevExtremeGrouping = false;
        break;

      case TOGGLE_NOTE_STREAM:
        draft.showNoteStream = !draft.showNoteStream;
        break;

      case CLOSE_NOTE_STREAM:
        draft.showNoteStream = false;
        break;

      case TOGGLE_DEV_EX_TOP_FILTER:
        draft.showDevExtremeTopFilter = !draft.showDevExtremeTopFilter;
        break;

      case SET_NOTE_STREAM_PAGE:
        draft.noteStreamPage[data.resource] = data.page;
        break;

      case TOGGLE_DEV_EX_GROUPING:
        draft.showDevExtremeGrouping = !draft.showDevExtremeGrouping;
        break;
    }
  });

export default myReducer;
