import reducerRegistry from '@onaio/redux-reducer-registry';
import { authenticateUser, getUser, isAuthenticated, logOutUser } from '@onaio/session-reducer';
import { FlushThunks } from 'redux-testkit';
import { store } from '../store';
import messages, { selectAllMessages, sendMessage } from './ducks/messages';
import random, { reducerName as randomReducer } from './ducks/random';

describe('store', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    reducerRegistry.register(randomReducer, random);
    jest.resetAllMocks();
  });

  it('should be a redux store', () => {
    expect(typeof store.subscribe).toEqual('function');
    expect(typeof store.dispatch).toEqual('function');
    expect(typeof store.getState).toEqual('function');
    expect(typeof store.replaceReducer).toEqual('function');
  });

  it('should work with default reducers', () => {
    /** Users reducer */
    const moshUser = {
      email: 'mosh@example.com',
      gravatar:
        'https://secure.gravatar.com/avatar/ae22ab897231db07205bd5d00e64cbbf?d=https%3A%2F%2Fona.io%2Fstatic%2Fimages%2Fdefault_avatar.png&s=60',
      name: 'mosh',
      username: 'moshthepitt',
    };
    // initially logged out
    expect(isAuthenticated(store.getState())).toBe(false);
    // call action to log in
    store.dispatch(authenticateUser(true, moshUser));
    // now should BE authenticated
    expect(isAuthenticated(store.getState())).toBe(true);
    expect(getUser(store.getState())).toEqual(moshUser);
    // call action to log out
    store.dispatch(logOutUser());
    // now should NOT be authenticated
    expect(isAuthenticated(store.getState())).toBe(false);
  });

  it('should be able to use loaded reducers', () => {
    reducerRegistry.register('messages', messages);
    // dispatch action should work
    store.dispatch(sendMessage({ user: 'bob', message: 'hello' }));
    expect(store.getState().messages).toEqual({ messages: [{ user: 'bob', message: 'hello' }] });
    // retrieving data should work
    expect(selectAllMessages(store.getState())).toEqual([{ message: 'hello', user: 'bob' }]);
  });
});
