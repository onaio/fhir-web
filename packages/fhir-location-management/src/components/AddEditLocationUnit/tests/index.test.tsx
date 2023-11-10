import { NewEditLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { locationHierarchyResourceType } from '../../../constants';
import { fhirHierarchy } from '../../../ducks/tests/fixtures';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createdLocation1 } from '../../LocationForm/tests/fixtures';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => '13cafa46-7251-429a-8d19-8da0583c0c5a',
  };
});

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
  fhirRootLocationId: 'someId',
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
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ _id: props.fhirRootLocationId })
    .reply(200, fhirHierarchy);

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
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ _id: props.fhirRootLocationId })
    .reply(200, fhirHierarchy);

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

test('#1277 - works ok for new locations', async () => {
  const history = createMemoryHistory();
  history.push(`/add`);

  const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
  const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 });

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, locationSData);

  const createdLoc = {
    resourceType: 'Location',
    status: 'active',
    name: 'area51',
    partOf: { reference: 'Location/2252', display: 'Root FHIR Location' },
    identifier: [{ use: 'official', value: '13cafa46-7251-429a-8d19-8da0583c0c5a' }],
    physicalType: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'jdn',
          display: 'Jurisdiction',
        },
      ],
    },
    id: '13cafa46-7251-429a-8d19-8da0583c0c5a',
  };

  nock(props.fhirBaseURL).put(`/Location/${createdLoc.id}`, createdLoc).reply(201, {}).persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // simulate name change
  const nameInput = screen.getByLabelText('Name');
  userEvent.type(nameInput, 'area51');

  const save = screen.getByRole('button', { name: 'Save' });
  userEvent.click(save);

  await waitFor(() => {
    expect(notificationSuccessMock).toHaveBeenCalledWith('Location was successfully created');
  });

  // successful submission after action should not result in a disabled
  // query immediately fetching data and thus running into an error.
  expect(notificationErrorMock).not.toHaveBeenCalled();
  expect(nock.isDone()).toBeTruthy();
});

test('data loading problem', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ _id: props.fhirRootLocationId })
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
    .query({ _id: props.fhirRootLocationId })
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
