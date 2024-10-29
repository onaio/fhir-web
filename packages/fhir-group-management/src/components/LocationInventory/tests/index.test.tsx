import React from 'react';
import { Route, Router, Switch } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { cleanup, render, waitForElementToBeRemoved, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import nock from 'nock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { createMemoryHistory } from 'history';
import { AddLocationInventory } from '..';
import {
  servicePointId,
  servicePointDatum,
  mockResourceId,
  locationResourcePayload,
} from './fixtures';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const mockv4 = '9b782015-8392-4847-b48c-50c11638656b';
jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => mockv4,
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const listResId = 'list-resource-id';
const props = {
  fhirBaseURL: 'http://test.server.org',
  listId: listResId,
};
const addLocationPath = `/location/inventory/${servicePointId}`;
const BasePath = `/location/inventory/:servicePointId`;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path={BasePath}>
            <AddLocationInventory {...props} />
          </Route>
          <Route exact path={`${BasePath}/:inventoryId`}>
            <AddLocationInventory {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  nock.cleanAll();
  jest.resetAllMocks();
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

it('shows broken page', async () => {
  const history = createMemoryHistory();
  history.push(addLocationPath);
  nock(props.fhirBaseURL).get(`/Location/${servicePointId}`).replyWithError({
    message: 'something awful happened',
    code: 'AWFUL_ERROR',
  });

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  expect(screen.getByText(/failed, reason: something awful happened/)).toBeInTheDocument();
});

test('renders correctly', async () => {
  const history = createMemoryHistory();
  history.push(addLocationPath);
  nock(props.fhirBaseURL).get(`/Location/${servicePointId}`).reply(200, servicePointDatum);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  screen.getByText('Add Service Point Inventory');
  // form items
  screen.getByText('Product name');
  screen.getByText('Quantity');
  screen.getByText('Delivery date');
  screen.getByText('Accountability end date');
  screen.getByText('UNICEF section');
  expect(screen.queryByAltText('Serial number')).not.toBeInTheDocument();
  screen.getByText('Donor');
  screen.getByText('PO number');
  screen.getByText('Expiry date');
  screen.getByText('product Id');
  screen.getByText('Active');
  screen.getByText('Actual');
  screen.getByText('Name');
  screen.getByText('Type');
});

test('renders correctly on edit', async () => {
  const history = createMemoryHistory();
  history.push(`${addLocationPath}/${mockResourceId}`);
  nock(props.fhirBaseURL)
    .get(`/Group/${mockResourceId}`)
    .reply(200, locationResourcePayload)
    .persist();
  nock(props.fhirBaseURL)
    .get(`/Location/${servicePointId}`)
    .reply(200, servicePointDatum)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  screen.getByText('Edit Service Point Inventory');
});
