import { authenticateUser, logOutUser } from '@onaio/session-reducer';
import { FlushThunks } from 'redux-testkit';
import { store } from '../store';
import { getAccessToken, getApiToken, getOauthProviderState } from '../selectors';

describe('store/selectors', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(logOutUser());
  });

  it('should be able to get the access token', () => {
    expect(getAccessToken(store.getState())).toEqual(null);
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
    expect(getAccessToken(store.getState())).toEqual('iLoveOov');
  });

  it('should be able to get the API token', () => {
    expect(getApiToken(store.getState())).toEqual(null);
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
    expect(getApiToken(store.getState())).toEqual('hunter2');
  });

  it('should be able to get the oAuth2 state parameter', () => {
    expect(getOauthProviderState(store.getState())).toEqual(null);
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
    expect(getOauthProviderState(store.getState())).toEqual('abcde');
  });
});
