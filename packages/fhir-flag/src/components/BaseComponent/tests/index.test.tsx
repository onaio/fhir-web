import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router';
import { screen, render, waitForElementToBeRemoved, cleanup } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider } from 'react-redux';
import { CloseFlag } from '..';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';
import { flag, practitionerBundle } from '../../Utils/tests/fixtures';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import { FlagResourceType, PractitionerResourceType } from '@opensrp/fhir-helpers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const fhirBaseURL = 'http://test.server.org';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RoleContext.Provider value={superUserRole}>
        <Route exact path="/close-flag/:id">
          <CloseFlag {...props} />
        </Route>
      </RoleContext.Provider>
    </QueryClientProvider>
  </Provider>
);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  nock.cleanAll();
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
      {
        api_token: 'hunter2',
        oAuth2Data: { access_token: 'sometoken', state: 'abcde' },
        user_id: 'bobbie',
      }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

test('renders correctly and fetches data', async () => {
  const history = createMemoryHistory();
  history.push('/close-flag/flagId');

  const scope = nock(fhirBaseURL)
    .get(`/${FlagResourceType}/flagId`)
    .reply(200, flag)
    .get(`/${PractitionerResourceType}/_search`)
    .query({
      identifier: 'bobbie',
    })
    .reply(200, practitionerBundle)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper fhirBaseURL={fhirBaseURL} />
      );
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText('An error occurred while fetching the inventory')).toBeInTheDocument();

  expect(scope.isDone()).toBeTruthy();
});
