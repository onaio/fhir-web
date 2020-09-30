import React from 'react';
import { shallow, mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@onaio/redux-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import ConnectedUserCredentials, { UserCredentials } from '..';
import keycloakUsersReducer, {
  fetchKeycloakUsers,
  reducerName,
  KeycloakUser,
} from '../../../../../store/ducks/keycloak';
import { KeycloakService } from '../../../../../services';
import * as fixtures from '../../../../../store/ducks/keycloak/tests/fixtures';

reducerRegistry.register(reducerName, keycloakUsersReducer);

jest.mock('../../../../../configs/env');

const history = createBrowserHistory();

describe('src/containers/pages/Admin/Credentials/', () => {
  const props = {
    keycloakUser: null,
    serviceClass: KeycloakService,
    history,
    location: {
      hash: '',
      pathname: `/user/credentials/${fixtures.keycloakUser.id}`,
      search: '',
      state: undefined,
    },
    match: {
      isExact: true,
      params: {
        userId: fixtures.keycloakUser.id,
      },
      path: '/user/credentials/:userId',
      url: `/user/credentials/${fixtures.keycloakUser.id}`,
    },
  };

  it('does not crash', () => {
    shallow(<UserCredentials {...props} />);
  });

  it('renders correctly', () => {
    store.dispatch(fetchKeycloakUsers(fixtures.keycloakUsersArray as KeycloakUser[]));

    mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUserCredentials {...props} />
        </Router>
      </Provider>
    );
  });
});
