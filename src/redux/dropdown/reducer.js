import produce from 'immer';
import lodashFind from 'lodash/find';
import { USER_LOGOUT } from 'react-admin';
import { FIND_ONE, FIND_ONE_SUCCESS, FIND_ONE_FAILED, CREATE_ONE_SUCCESS } from './constant';

// for a id like "abcd123", we will create 5 properties in root
// abcd123
// abcd123_loading
// abcd123_error
// abcd123_total
// abcd123_all
const initialState = {};

const decorateRowWithIdAndTitle = (row, meta) => ({
  ...row,
  // always use meta to determine id value
  id: row[meta.valueMember],
  title: row[meta.displayMember],
});

const myReducer = (state = initialState, { type, id, data, error, meta, newRecord }) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case USER_LOGOUT:
        return initialState;

      case FIND_ONE:
        draft[id + '_loading'] = true;
        draft[id + '_error'] = null;
        break;

      case FIND_ONE_SUCCESS:
        if (typeof draft[id + '_all'] === 'undefined') {
          draft[id + '_all'] = [];
        }

        // don't add to dropdown, just show what is given back from api
        draft[id] = data.result.map(unpreparedRow => {
          const row = decorateRowWithIdAndTitle(unpreparedRow, meta);

          // also add to all found items
          if (!lodashFind(draft[id + '_all'], { id: row.id })) {
            draft[id + '_all'].push(row);
          }

          return row;
        });

        draft[id + '_loading'] = false;
        draft[id + '_error'] = null;
        draft[id + '_total'] = data.total;

        break;

      case FIND_ONE_FAILED:
        draft[id + '_loading'] = false;
        draft[id] = [];
        draft[id + '_error'] = error.toString();
        break;

      case CREATE_ONE_SUCCESS:
        if (typeof draft[id] === 'undefined') {
          draft[id] = [];
        }

        if (typeof draft[id + '_all'] === 'undefined') {
          draft[id + '_all'] = [];
        }

        const preparedNewRecord = decorateRowWithIdAndTitle(newRecord, meta);
        draft[id].push(preparedNewRecord);
        draft[id + '_all'].push(preparedNewRecord);

        break;
    }
  });

export default myReducer;
