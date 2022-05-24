import { PatientsList } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, render, screen } from '@testing-library/react';
import { patients, sortedAscPatients, sortedDescPatients } from './fixtures';
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

test('renders correctly in list view', async () => {
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

  // test search
  // works with search as well.
  const searchForm = document.querySelector('[data-testid="search-form"]');
  userEvents.paste(searchForm as HTMLElement, '345');

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(history.location.search).toEqual('?search=345&page=1&pageSize=20');

  // remove search.
  userEvents.clear(searchForm);
  expect(history.location.search).toEqual('?page=1&pageSize=20');

  // test sort
  const dobCaretUp = document.querySelector('.anticon-caret-up:first-child');
  expect(dobCaretUp).not.toHaveClass('active');

  const dateOfbirths = Array.from(document.querySelectorAll('tr td:nth-child(2)')).map(
    (td) => td.textContent
  );
  expect(dateOfbirths).toEqual(['1988-08-04', '1988-08-04', '1988-08-04', '1988-08-04']);

  // mock requests due to sort
  nock(props.fhirBaseURL)
    .get(`/${patientResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
      _sort: 'birthdate',
    })
    .reply(200, sortedAscPatients)
    .persist();

  nock(props.fhirBaseURL)
    .get(`/${patientResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
      _sort: 'birthdate',
      _summary: 'count',
    })
    .reply(200, { total: 20 })
    .persist();

  fireEvent.click(dobCaretUp);
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // its now selected and is active.
  expect(dobCaretUp).toHaveClass('active');

  const sortedBirthDates = Array.from(document.querySelectorAll('tr td:nth-child(2)')).map(
    (td) => td.textContent
  );
  expect(sortedBirthDates).toEqual([
    '1909-07-10',
    '1919-05-28',
    '1921-09-14',
    '1935-01-03',
    '1938-09-10',
  ]);

  // sort the other way
  const dobCaretDown = document.querySelector('.anticon-caret-down');

  nock(props.fhirBaseURL)
    .get(`/${patientResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
      _sort: '-birthdate',
    })
    .reply(200, sortedDescPatients)
    .persist();

  nock(props.fhirBaseURL)
    .get(`/${patientResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
      _sort: '-birthdate',
      _summary: 'count',
    })
    .reply(200, { total: 20 })
    .persist();

  fireEvent.click(dobCaretDown);
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const ascendingBirthDates = Array.from(document.querySelectorAll('tr td:nth-child(2)')).map(
    (td) => td.textContent
  );
  expect(ascendingBirthDates).toEqual([
    '2022-05-05',
    '2022-05-03',
    '2022-05-01',
    '2022-04-29',
    '2022-04-29',
  ]);

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
