import { UserDetailsOverview } from '../';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from 'react-query';
import { authenticateUser } from '@onaio/session-reducer';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';
import { store } from '@opensrp/store';
import { URL_USER, KEYCLOAK_URL_USERS } from '@opensrp/user-management';
import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { user1147 } from '../../Viewdetails/ViewDetailResources/tests/fixtures';

/* eslint-disable no-template-curly-in-string */

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');
global.fetch = fetch;

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

nock.disableNetConnect();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const userId = 'userId';
const props = {
  resourceId: userId,
  keycloakBaseURL: 'http://test-keycloak.server.org',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RoleContext.Provider value={superUserRole}>
          <Switch>
            <Route exact path={`${URL_USER}/:id`}>
              {(routeProps) => <UserDetailsOverview {...{ ...props, ...routeProps }} />}
            </Route>
          </Switch>
        </RoleContext.Provider>
      </QueryClientProvider>
    </Provider>
  );
};

beforeAll(() => {
  store.dispatch(
    authenticateUser(
      true,
      {
        email: 'bob@example.com',
        name: 'Bobbie',
        username: 'RobertBaratheon',
      },
      {
        api_token: 'hunter2',
        oAuth2Data: {
          access_token: 'sometoken',
          state: 'abcde',
        },
        user_id: 'userFixtures[0].id',
      }
    )
  );
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

afterAll(() => {
  nock.enableNetConnect();
});

/***
 * End of setup.
 */
test('Renders without crashing', async () => {
  const history = createMemoryHistory();
  history.push(`${URL_USER}/${userId}`);

  nock(props.keycloakBaseURL).get(`${KEYCLOAK_URL_USERS}/${userId}`).reply(200, user1147);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  // this only await the first call to get the users.
  await waitForElementToBeRemoved(screen.getByText(/Fetching user details/i));

  expect(document.body.textContent).toEqual(
    '1147EnabledID: 9f72c646-dc1e-4f24-98df-6f04373b9ec6Verified: FalseFirst Nametest1147Last Name1147Username1147Emailmejay2303@gmail.comView full details'
  );

  // view details links to correct view

  const viewDetailsLink = screen.getByRole('link', { name: 'View full details' });
  fireEvent.click(viewDetailsLink);

  expect(history.location.pathname).toEqual(
    '/admin/users/details/9f72c646-dc1e-4f24-98df-6f04373b9ec6'
  );

  expect(nock.isDone()).toBeTruthy();
});
