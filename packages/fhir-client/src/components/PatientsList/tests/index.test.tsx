import { PatientsList } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, render, screen } from '@testing-library/react';
import { patients } from './fixtures';
import userEvents from '@testing-library/user-event';
import { LIST_PATIENTS_URL, patientResourceType } from '../../../constants';

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
          <Route exact path={`${LIST_PATIENTS_URL}`}>
            {(routeProps) => <PatientsList {...{ ...props, ...routeProps }} />}
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
  history.push(LIST_PATIENTS_URL);

  nock(props.fhirBaseURL)
    .get(`/${patientResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, patients)
    .persist();

  nock(props.fhirBaseURL)
    .get(`/${patientResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
      'name:contains': '345',
    })
    .reply(200, patients);

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

  // works with search as well.
  const searchForm = document.querySelector('[data-testid="search-form"]');
  userEvents.paste(searchForm as HTMLElement, '345');

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(history.location.search).toEqual('?search=345&page=1&pageSize=20');

  // remove search.
  userEvents.clear(searchForm);
  expect(history.location.search).toEqual('?page=1&pageSize=20');
  expect(nock.isDone()).toBeTruthy();
});

test('responds as expected to errors', async () => {
  const history = createMemoryHistory();
  history.push(LIST_PATIENTS_URL);

  nock(props.fhirBaseURL)
    .get(`/${patientResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
    })
    .replyWithError('An error happened');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/An error happened/)).toBeInTheDocument();
});
