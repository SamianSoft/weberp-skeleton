import { Reducer } from 'redux';
import { ShowNotificationAction, HideNotificationAction, Notification } from './action';

import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from './constant';

import { UNDO, UndoAction } from 'ra-core';

type ActionTypes =
  | ShowNotificationAction
  | HideNotificationAction
  | UndoAction
  | { type: 'OTHER_TYPE' };

type State = Notification[];

const notificationsReducer: Reducer<State> = (previousState = [], action: ActionTypes) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return previousState.concat(action.payload);
    case UNDO:
    case HIDE_NOTIFICATION:
      return previousState.slice(1);
    default:
      return previousState;
  }
};

export default notificationsReducer;
/**
 * Returns the first available notification to show
 * @param {Object} state - Redux state
 */
export const getNotification = state => state.admin.notifications[0];
