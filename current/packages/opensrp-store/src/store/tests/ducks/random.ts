import { AnyAction } from 'redux';

export const reducerName = 'random';

const initialState = '';

// actions
export const SET_RANDOM = 'reveal-test/reducer/SET_RANDOM';

/**
 *
 * @param {initialState} state The initial value
 * @param {AnyAction} action - should have type or payload
 * @returns {Object} object be used to initialize a Redux store
 */
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
