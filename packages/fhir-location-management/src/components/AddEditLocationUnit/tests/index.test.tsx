import { NewEditLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { locationHierarchyResourceType, locationResourceType } from '../../../constants';
import { fhirHierarchy, locationSData } from '../../../ducks/tests/fixtures';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createdLocation1 } from '../../LocationForm/tests/fixtures';
import { cleanup, render, screen, waitFor } from '@testing-library/react';

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
  fhirRootLocationIdentifier: '2252',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/add">
            <NewEditLocationUnit {...props} />
          </Route>
          <Route exact path="/add/:id">
            <NewEditLocationUnit {...props} />
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

test('renders correctly for new locations', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  const cancelUrlGenerator = '/cancelled';

  nock(props.fhirBaseURL)
  .get(`/${locationResourceType}/_search`)
  .query({ _summary: 'count' })
  .reply(200, { total: 1000 });

nock(props.fhirBaseURL)
  .get(`/${locationResourceType}/_search`)
  .query({ _count: 1000 })
  .reply(200, locationSData)
  
  nock(props.fhirBaseURL).get('/Location/someId').reply(200, createdLocation1);

  render(
    <Router history={history}>
      <AppWrapper cancelUrlGenerator={cancelUrlGenerator} {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  await waitFor(() => {
    expect(screen.getByText('Add Location Unit')).toBeInTheDocument();
  });

  // some small but inconclusive proof that the form rendered
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/alias/i)).toMatchSnapshot('alias field');
});

test('renders correctly for edit locations', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${createdLocation1.partOf.identifier}?parentId=Location/303`);

  nock(props.fhirBaseURL)
  .get(`/${locationResourceType}/_search`)
  .query({ _summary: 'count' })
  .reply(200, { total: 1000 });

nock(props.fhirBaseURL)
  .get(`/${locationResourceType}/_search`)
  .query({ _count: 1000 })
  .reply(200, locationSData)

  nock(props.fhirBaseURL)
    .get(`/Location/${createdLocation1.partOf.identifier}`)
    .reply(200, createdLocation1);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // some small but inconclusive proof that the form rendered and has some initial values
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/alias/i)).toMatchSnapshot('alias field');
});

test('data loading problem', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ identifier: props.fhirRootLocationIdentifier })
    .replyWithError('something aweful happened');

  nock(props.fhirBaseURL).get('/Location/someId').replyWithError('Throw in the towel, as well');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText('Unable to load the location or location hierarchy')).toBeInTheDocument();
});

test('data loading but undefined', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ identifier: props.fhirRootLocationIdentifier })
    .reply(200, null);

  nock(props.fhirBaseURL).get('/Location/someId').reply(200, null);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText('Unable to load the location or location hierarchy')).toBeInTheDocument();
});
