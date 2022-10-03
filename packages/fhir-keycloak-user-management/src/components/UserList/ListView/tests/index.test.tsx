import { UserList } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { URL_USER } from '@opensrp/user-management';
import { careTeams, practitioner, userFixtures } from './fixtures';
import fetch from 'jest-fetch-mock';
import { careTeamResourceType, practitionerResourceType } from '../../../../constants';
import flushPromises from 'flush-promises';

jest.mock('@opensrp/notifications', () => {
  return { _esModule: true, ...Object.assign({}, jest.requireActual('@opensrp/notifications')) };
});

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.mock('@opensrp/react-utils', () => {
  const actual = jest.requireActual('@opensrp/react-utils');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SearchForm = (props: any) => {
    const { onChangeHandler } = props;
    return (
      <div className="search-input-wrapper">
        <input onChange={onChangeHandler} data-testid="search-form"></input>
      </div>
    );
  };
  return {
    ...actual,
    SearchForm,
  };
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

const props = {
  fhirBaseURL: 'http://test.server.org',
  keycloakBaseURL: 'http://test-keycloak.server.org',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path={`${URL_USER}`}>
            {(routeProps) => <UserList {...{ ...props, ...routeProps }} />}
          </Route>
          <Route exact path={`${URL_USER}/:id`}>
            {(routeProps) => <UserList {...{ ...props, ...routeProps }} />}
          </Route>
        </Switch>
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

test('renders correctly when listing resources', async () => {
  const history = createMemoryHistory();
  history.push(URL_USER);

  fetch
    .once(JSON.stringify(15))
    .once(JSON.stringify(userFixtures))
    .once(JSON.stringify(userFixtures[0]));
  fetch.mockResponse(JSON.stringify([]));

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(fetch.mock.calls.map((x) => x[0])).toEqual([
    'http://test-keycloak.server.org/users/count',
    'http://test-keycloak.server.org/users?max=15',
  ]);

  expect(document.querySelector('.ant-page-header-heading-title')).toMatchSnapshot('Header title');

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  // sort? - by firstName
  const caretUp = document.querySelector('.anticon-caret-up:nth-child(1)');
  fireEvent.click(caretUp);
  const tdsText = [...document.querySelectorAll('tr td:nth-child(1)')].map((td) => {
    return td.textContent;
  });
  expect(tdsText).toEqual(['testhh', 'test404', 'eCBIS', 'april4', 'Roy']);

  // works with search as well.
  const searchForm = document.querySelector('[data-testid="search-form"]');
  userEvents.paste(searchForm as HTMLElement, 'petertest');

  expect(history.location.search).toEqual('?search=petertest');
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`Search ${idx} page 1`);
    });
  });

  // remove search.
  userEvents.clear(searchForm);
  expect(history.location.search).toEqual('');

  const practitionerObj = practitioner.entry[0].resource;
  // view details
  nock(props.fhirBaseURL)
    .get(`/${practitionerResourceType}/_search`)
    .query({ identifier: userFixtures[14].id })
    .reply(200, practitioner)
    .get(`/${careTeamResourceType}/_search`)
    .query({ 'participant:Practitioner': practitionerObj.id, _summary: 'count' })
    .reply(200, { total: 2 })
    .get(`/${careTeamResourceType}/_search`)
    .query({ 'participant:Practitioner': practitionerObj.id, _count: '2' })
    .reply(200, careTeams)
    .persist();

  // target the initial row view details
  const dropdown = document.querySelector('tbody tr:nth-child(1) [data-testid="action-dropdown"]');
  fireEvent.click(dropdown);

  const viewDetailsLink = screen.getByText(/View Details/);
  expect(viewDetailsLink).toMatchInlineSnapshot(`
    <a
      href="/admin/users/b79e5f2d-37de-4c7e-9b3d-4341bf62ad78"
    >
      View Details
    </a>
  `);
  fireEvent.click(viewDetailsLink);
  expect(history.location.pathname).toEqual(`${URL_USER}/${userFixtures[14].id}`);

  // this only await the first call to get the users.
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // wait for other calls to resolve.
  await waitFor(async () => {
    await flushPromises();
    // practitioner information
    expect(screen.queryByText(/Practitioner Id/i)).toBeInTheDocument();
    expect(screen.queryByText(/Practitioner status/i)).toBeInTheDocument();
    expect(screen.queryByText(/Linked care teams/i)).toBeInTheDocument();
  });

  document
    .querySelectorAll('[data-testid="key-value"]')
    .forEach((keyValue) => expect(keyValue).toMatchSnapshot('user details'));

  // close view details
  const closeButton = document.querySelector('[data-testid="close-button"]');
  fireEvent.click(closeButton);

  expect(history.location.pathname).toEqual(URL_USER);

  // try and delete certain user
  // one nock request to get practitioner is already mocked above.
  nock(props.fhirBaseURL)
    .put(`/${practitionerResourceType}/${practitionerObj.id}`, {
      ...practitionerObj,
      active: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    .reply(200, {})
    .persist();

  const deleteBtn = document.querySelector('[data-testid="delete-user"]');
  fireEvent.click(deleteBtn);

  // confirm
  const yesBtn = document.querySelectorAll('.ant-popover-buttons button')[1];
  expect(yesBtn).toMatchSnapshot('yes button');
  fireEvent.click(yesBtn);

  await act(async () => {
    await flushPromises();
  });

  await waitFor(async () => {
    expect(screen.queryByText(/Practitioner deactivated/i)).toBeInTheDocument();
  });

  expect(fetch.mock.calls.map((x) => x[0])).toEqual([
    'http://test-keycloak.server.org/users/count',
    'http://test-keycloak.server.org/users?max=15',
    'http://test-keycloak.server.org/users/b79e5f2d-37de-4c7e-9b3d-4341bf62ad78',
    'http://test-keycloak.server.org/users/b79e5f2d-37de-4c7e-9b3d-4341bf62ad78/groups',
    'http://test-keycloak.server.org/users/b79e5f2d-37de-4c7e-9b3d-4341bf62ad78',
    'http://test-keycloak.server.org/users/count',
    'http://test-keycloak.server.org/users?',
  ]);

  expect(nock.isDone()).toBeTruthy();
});

test('responds as expected to errors', async () => {
  const history = createMemoryHistory();
  history.push(URL_USER);

  const errorMessage = 'coughid';
  fetch.mockReject(new Error(errorMessage));

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/coughid/)).toBeInTheDocument();
});
