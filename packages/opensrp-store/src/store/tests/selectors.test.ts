import { authenticateUser, logOutUser } from '@onaio/session-reducer';
import { FlushThunks } from 'redux-testkit';
import { store } from '../store';
import { makeAPIStateSelector } from '../selectors';

/* eslint-disable @typescript-eslint/naming-convention */

describe('store/selectors', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(logOutUser());
  });

  it('should be able to get the access token', () => {
    expect(makeAPIStateSelector()(store.getState(), { accessToken: true })).toEqual(null);
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'iLoveOov', state: 'abcde' } }
      )
    );
    expect(makeAPIStateSelector()(store.getState(), { accessToken: true })).toEqual('iLoveOov');
  });

  it('should be able to get the API token', () => {
    expect(makeAPIStateSelector()(store.getState(), { apiToken: true })).toEqual(null);
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'iLoveOov', state: 'abcde' } }
      )
    );
    expect(makeAPIStateSelector()(store.getState(), { apiToken: true })).toEqual('hunter2');
  });

  it('should be able to get the oAuth2 state parameter', () => {
    expect(makeAPIStateSelector()(store.getState(), { providerState: true })).toEqual(null);
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'iLoveOov', state: 'abcde' } }
      )
    );
    expect(makeAPIStateSelector()(store.getState(), { providerState: true })).toEqual('abcde');
  });
});
