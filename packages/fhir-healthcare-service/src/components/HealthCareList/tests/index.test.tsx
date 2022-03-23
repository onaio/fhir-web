import { HealthCareList } from '..';
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
import {
  healthCareServicePage1,
  healthCareServicePage2,
  healthCareServiceSearch,
} from './fixtures';
import userEvents from '@testing-library/user-event';
import { healthCareServiceResourceType, LIST_HEALTHCARE_URL } from '../../../constants';

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
        <Switch>
          <Route exact path={`${LIST_HEALTHCARE_URL}`}>
            {(routeProps) => <HealthCareList {...{ ...props, ...routeProps }} />}
          </Route>
          <Route exact path={`${LIST_HEALTHCARE_URL}/:id`}>
            {(routeProps) => <HealthCareList {...{ ...props, ...routeProps }} />}
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

test('renders correctly when listing organizations', async () => {
  const history = createMemoryHistory();
  history.push(LIST_HEALTHCARE_URL);

  nock(props.fhirBaseURL)
    .get(`/${healthCareServiceResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, healthCareServicePage1)
    .persist();

  nock(props.fhirBaseURL)
    .get(`/${healthCareServiceResourceType}/_search`)
    .query({
      _getpagesoffset: 20,
      _count: 20,
    })
    .reply(200, healthCareServicePage2);

  nock(props.fhirBaseURL)
    .get(`/${healthCareServiceResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
      'name:contains': 'testing',
    })
    .reply(200, healthCareServiceSearch);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(document.querySelector('.ant-page-header-heading-title')).toMatchSnapshot('Header title');

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  fireEvent.click(screen.getByTitle('2'));

  expect(history.location.search).toEqual('?pageSize=20&page=2');

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 2`);
    });
  });

  // works with search as well.
  const searchForm = document.querySelector('[data-testid="search-form"]');
  await userEvents.type(searchForm, 'testing');

  expect(history.location.search).toEqual('?pageSize=20&page=1&search=testing');
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`Search ${idx} page 1`);
    });
  });

  // remove search.
  userEvents.clear(searchForm);
  expect(history.location.search).toEqual('?pageSize=20&page=1');

  // view details
  nock(props.fhirBaseURL)
    .get(`/${healthCareServiceResourceType}/323`)
    .reply(200, healthCareServicePage1.entry[0].resource);

  // target the initial row view details
  const dropdown = document.querySelector('tbody tr:nth-child(1) [data-testid="action-dropdown"]');
  fireEvent.click(dropdown);

  const viewDetailsLink = screen.getByText(/View Details/);
  expect(viewDetailsLink).toMatchInlineSnapshot(`
    <a
      href="/admin/teams/205"
    >
      View Details
    </a>
  `);
  fireEvent.click(viewDetailsLink);
  expect(history.location.pathname).toEqual('/admin/teams/205');

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // close view details
  const closeButton = document.querySelector('[data-testid="close-button"]');
  fireEvent.click(closeButton);

  expect(history.location.pathname).toEqual('/admin/teams');

  expect(nock.isDone()).toBeTruthy();
});

test('responds as expected to errors', async () => {
  const history = createMemoryHistory();
  history.push(LIST_HEALTHCARE_URL);

  nock(props.fhirBaseURL)
    .get(`/${healthCareServiceResourceType}/_search`)
    .query({
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
