/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CreateEditUser } from '..';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import nock from 'nock';
import { cleanup, render, screen } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import { practitionerResourceType } from '../../../constants';
import fetch from 'jest-fetch-mock';
import { userGroup } from './fixtures';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const props = {
  baseUrl: 'http://test.server.org',
  keycloakBaseURL: 'http://test-keycloak.server.org',
  match: {
    isExact: true,
    params: {},
    path: `/add`,
    url: `/add`,
  },
};

// match: {
//   isExact: true,
//   params: { userId: keycloakUser.id },
//   path: `/users/edit/:id`,
//   url: `/users/edit/${keycloakUser.id}`,
// },

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/add">
            <CreateEditUser {...props} />
          </Route>
          <Route exact path="/add/:id">
            <CreateEditUser {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  nock.cleanAll();
  fetch.resetMocks();
});

beforeAll(() => {
  nock.disableNetConnect();
  store.dispatch(
    authenticateUser(
      true,
      {
        email: 'bob@example.com',
        name: 'Bobbie',
        username: 'RobertBaratheon',
      },
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

test('renders correctly for new user', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  fetch.once(JSON.stringify(userGroup));
  fetch.mockResponses(JSON.stringify([]));

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(fetch.mock.calls.map((req) => req[0])).toEqual([]);
  // some small but incoclusive proof that the form rendered
  expect(screen.getByLabelText(/email/i)).toMatchSnapshot('email field');
  expect(screen.getByLabelText(/username/i)).toMatchSnapshot('username field');
});
