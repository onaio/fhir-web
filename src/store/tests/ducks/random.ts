import { AnyAction } from 'redux';

export const reducerName = 'random';

const initialState = '';

// actions
export const SET_RANDOM = 'reveal-test/reducer/SET_RANDOM';

export default function reducer(state = initialState, action: AnyAction): string {
  switch (action.type) {
    case SET_RANDOM:
      if (action.payload) {
        return action.payload;
      }
      return state;
    default:
      return state;
  }
}
