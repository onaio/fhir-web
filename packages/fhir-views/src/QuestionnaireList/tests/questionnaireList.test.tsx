import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { QuestionnaireList } from '..';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Router, Route, Switch } from 'react-router';
import nock from 'nock';
import {
  questionnairesPage1,
  questionnairesPage2,
  questionnairesSearchPage,
} from '../../tests/fixtures';
import userEvents from '@testing-library/user-event';
import _ from 'lodash';
import { superUserRole } from '@opensrp/react-utils';
import { RoleContext } from '@opensrp/rbac';
import { Provider } from 'react-redux';

const actualDebounce = _.debounce;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customDebounce = (callback: any) => callback;
_.debounce = customDebounce;

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const props = {
  fhirBaseURL: 'http://example.com',
};

const rQClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

store.dispatch(
  authenticateUser(
    true,
    {
      email: 'bob@example.com',
      name: 'Bobbie',
      username: 'RobertBaratheon',
    },
    { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App = (props: any) => {
  return (
    <Provider store={store}>
      <Switch>
        <Route exact path="/questList">
          <RoleContext.Provider value={superUserRole}>
            <QueryClientProvider client={rQClient}>{props.children}</QueryClientProvider>
          </RoleContext.Provider>
        </Route>
      </Switch>
    </Provider>
  );
};

beforeAll(() => {
  nock.disableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

afterAll(() => {
  nock.enableNetConnect();
  _.debounce = actualDebounce;
});

test('pagination events work correctly', async () => {
  const history = createMemoryHistory();
  history.push('/questList');

  nock(props.fhirBaseURL)
    .get('/Questionnaire/_search')
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, questionnairesPage1)
    .persist();

  nock(props.fhirBaseURL)
    .get('/Questionnaire/_search')
    .query({
      _total: 'accurate',
      _getpagesoffset: 20,
      _count: 20,
    })
    .reply(200, questionnairesPage2)
    .persist();

  nock(props.fhirBaseURL)
    .get('/Questionnaire/_search')
    .query({
      _total: 'accurate',
      _getpagesoffset: 40,
      _count: 20,
    })
    .reply(200, [])
    .persist();

  nock(props.fhirBaseURL)
    .get('/Questionnaire/_search')
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
      'title:contains': 'sample,name:contains=sample',
    })
    .reply(200, questionnairesSearchPage)
    .persist();

  render(
    <Router history={history}>
      <App>
        <QuestionnaireList {...props}></QuestionnaireList>
      </App>
    </Router>
  );

  const waitForSpinner = async () => {
    return await waitFor(() => {
      expect(document.querySelector('.ant-spin')).not.toBeInTheDocument();
    });
  };

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/Questionnaire list view/)).toBeInTheDocument();

  expect(screen.getByText(/NSW Government My Personal Health Record/)).toBeInTheDocument();
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  fireEvent.click(screen.getByTitle('2'));

  expect(history.location.search).toEqual('?pageSize=20&page=2');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/426/)).toBeInTheDocument();
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 2`);
    });
  });

  // search also works
  const searchForm = document.querySelector('[data-testid="search-form"]');
  await userEvents.type(searchForm, 'sample');

  expect(history.location.search).toEqual('?pageSize=20&page=1&search=sample');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`Search ${idx} page 1`);
    });
  });

  // remove search.
  userEvents.clear(searchForm);
  expect(history.location.search).toEqual('?pageSize=20&page=1');
});

test('shows an error', async () => {
  const history = createMemoryHistory();
  history.push('/questList');

  nock(props.fhirBaseURL)
    .get('/Questionnaire/_search')
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
    })
    .replyWithError('something awful happened');

  render(
    <Router history={history}>
      <App>
        <QuestionnaireList {...props}></QuestionnaireList>
      </App>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/something awful happened/i)).toBeInTheDocument();
});
