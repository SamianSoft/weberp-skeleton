import produce from 'immer';
import { USER_LOGOUT, Identifier } from 'react-admin';

import { clone } from '../../helper/DataHelper';
import { ADD_RESOURCE_DATA } from './constant';

interface RowInterface {
  id: Identifier;
  [key: string]: any;
}

interface GridListReducerProps {
  type: string;
  resourceId: string;
  data: RowInterface[];
  total?: number;
}

interface GridListReducerStoreInterface {
  [key: string]: {
    list: {
      ids: Identifier[];
      total?: number;
      loadedOnce: boolean;
    };
    data: {
      [key: string]: RowInterface;
    };
  };
}

const initialState: GridListReducerStoreInterface = {};

const myReducer = (state = initialState, { type, resourceId, data, total }: GridListReducerProps) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case USER_LOGOUT:
        draft = clone(initialState);
        break;

      case ADD_RESOURCE_DATA:
        const newIds: Identifier[] = [];
        const newData = {};

        if (data) {
          for (const row of data) {
            newIds.push(row.id);
            newData[row.id] = row;
          }
        }

        draft[resourceId] = {
          list: {
            ids: newIds,
            total: total ? total : data.length,
            loadedOnce: true,
          },
          data: newData,
        };

        break;
    }
  });

export default myReducer;
