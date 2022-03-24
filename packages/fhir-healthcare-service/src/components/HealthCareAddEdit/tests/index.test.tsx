/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HealthCareAddEdit } from '..';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import nock from 'nock';
import { cleanup, render, screen } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import {
  organizationResourceType,
} from '../../../constants';
import { allOrgs, healthCare313 } from './fixtures';

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
            <HealthCareAddEdit {...props} />
          </Route>
          <Route exact path="/add/:id">
            <HealthCareAddEdit {...props} />
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

test('renders correctly for new organizations', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  nock(props.fhirBaseURL)
  .get(`/${organizationResourceType}/_search`)
  .query({ _summary: 'count' })
  .reply(200, { total: 1000 })
  .get(`/${organizationResourceType}/_search`)
  .query({ _count: 1000 })
  .reply(200, allOrgs);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // some small but incoclusive proof that the form rendered
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/comment/i)).toMatchSnapshot('comment field');
});

test('renders correctly for edit locations', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${healthCare313.id}`);

  nock(props.fhirBaseURL)
  .get(`/${organizationResourceType}/_search`)
  .query({ _summary: 'count' })
  .reply(200, { total: 1000 })
  .get(`/${organizationResourceType}/_search`)
  .query({ _count: 1000 })
  .reply(200, allOrgs);

  nock(props.fhirBaseURL).get(`/${healthCare313}/${healthCare313.id}`).reply(200, healthCare313);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(document.querySelector('title')).toMatchInlineSnapshot(`
    <title>
      Edit team | OpenSRP web Test Organisation
    </title>
  `);

  // some small but incoclusive proof that the form rendered and has some initial values
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/comment/i)).toMatchSnapshot('comment field');
});

test('data loading problem', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${healthCare313.id}`);

  nock(props.fhirBaseURL)
    .get(`/${healthCare313}/${healthCare313.id}`)
    .replyWithError('something aweful happened');

    nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _summary: 'count' })
    .replyWithError('Could not get count')

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText(/something aweful happened/)).toBeInTheDocument();
});
