/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GroupList } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { groupResourceType, LIST_GROUP_URL } from '../../../constants';
import { firstTwentygroups } from './fixtures';
import userEvents from '@testing-library/user-event';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';

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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RoleContext.Provider value={superUserRole}>
          <Switch>
            <Route exact path={`${LIST_GROUP_URL}`}>
              {(routeProps) => <GroupList {...{ ...props, ...routeProps }} />}
            </Route>
            <Route exact path={`${LIST_GROUP_URL}/:id`}>
              {(routeProps) => <GroupList {...{ ...props, ...routeProps }} />}
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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
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
  history.push(LIST_GROUP_URL);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, firstTwentygroups)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(document.querySelector('title')).toMatchInlineSnapshot(`
    <title>
      Groups List
    </title>
  `);

  // does not render the add group button
  const addGroupBtn = screen.queryByText(/Add Group/);
  expect(addGroupBtn).not.toBeInTheDocument();

  expect(document.querySelector('.page-header')).toMatchSnapshot('Header title');

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  fireEvent.click(screen.getByTitle('2'));

  expect(history.location.search).toEqual('?pageSize=20&page=2');

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 2`);
    });
  });

  // works with search as well.
  const searchForm = document.querySelector('[data-testid="search-form"]');
  userEvents.type(searchForm!, 'jan27');

  expect(history.location.search).toEqual('?pageSize=20&page=1&search=jan27');
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`Search ${idx} page 1`);
    });
  });

  // remove search.
  userEvents.clear(searchForm!);
  expect(history.location.search).toEqual('?pageSize=20&page=1');

  // view details

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/145838`)
    .reply(200, firstTwentygroups.entry[1].resource);

  // target the initial row view details
  const dropdown = document.querySelector('tbody tr:nth-child(1) [data-testid="action-dropdown"]');
  fireEvent.click(dropdown!);

  const viewDetailsLink = screen.getByText(/View Details/);
  expect(viewDetailsLink).toMatchInlineSnapshot(`
    <span>
      View Details
    </span>
  `);
  fireEvent.click(viewDetailsLink);
  expect(history.location.search).toEqual('?pageSize=20&page=1&viewDetails=145838');
  expect(history.location.pathname).toEqual(`/groups/list`);

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // see view details contents
  const keyValuePairs = document.querySelectorAll(
    'div[data-testid="key-value"] .singleKeyValue-pair'
  );
  keyValuePairs.forEach((pair) => {
    expect(pair).toMatchSnapshot();
  });

  // close view details
  const closeButton = document.querySelector('[data-testid="close-button"]');
  fireEvent.click(closeButton!);

  expect(history.location.pathname).toEqual('/groups/list');
  expect(nock.isDone()).toBeTruthy();
}, 10000);

test('responds as expected to errors', async () => {
  const history = createMemoryHistory();
  history.push(LIST_GROUP_URL);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
    })
    .replyWithError('coughid');

  render(
    <Router history={history}>
      <AppWrapper debugKey="responds" {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/coughid/)).toBeInTheDocument();
});
