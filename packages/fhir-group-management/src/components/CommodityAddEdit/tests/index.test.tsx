/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CommodityAddEdit } from '..';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import nock from 'nock';
import { cleanup, render, screen } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import { commodity1 } from './fixtures';
import { groupResourceType } from '../../../constants';

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
  fhirBaseURL: 'http://test.server.org',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/add">
            <CommodityAddEdit {...props} />
          </Route>
          <Route exact path="/add/:id">
            <CommodityAddEdit {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

test('renders correctly for new resource', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  // some small but inconclusive proof that the form rendered
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/type/i)).toMatchSnapshot('type field');
});

test('renders correctly for edit resource', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${commodity1.id}`);

  nock(props.fhirBaseURL).get(`/${groupResourceType}/${commodity1.id}`).reply(200, commodity1);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // some small but inconclusive proof that the form rendered and has some initial values
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/type/i)).toMatchSnapshot('type field');
});

test('data loading problem', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${commodity1.id}`);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/${commodity1.id}`)
    .replyWithError('something aweful happened');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText(/something aweful happened/)).toBeInTheDocument();
});
