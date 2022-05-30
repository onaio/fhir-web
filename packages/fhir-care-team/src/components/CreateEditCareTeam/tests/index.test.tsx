import React from 'react';
import { store } from '@opensrp/store';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import { Route, Router, Switch } from 'react-router';
import * as fixtures from './fixtures';
import { CreateEditCareTeam } from '..';
import {
  act,
  cleanup,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import {
  careTeamResourceType,
  groupResourceType,
  practitionerResourceType,
  ROUTE_PARAM_CARE_TEAM_ID,
} from '../../../constants';
import { screen, render } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { careTeam1, careTeam4201Edited, groups } from './fixtures';
import flushPromises from 'flush-promises';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const mockId = '0b3a3311-6f5a-40dd-95e5-008001acebe1';

jest.mock('uuid', () => {
  const actualUUID = jest.requireActual('uuid');
  const mockV4Function = jest.fn().mockImplementation(() => mockId);
  return { __esModule: true, ...actualUUID, v4: mockV4Function };
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
            <CreateEditCareTeam {...props} />
          </Route>
          <Route exact path={`/add/:${ROUTE_PARAM_CARE_TEAM_ID}`}>
            <CreateEditCareTeam {...props} />
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

test('renders correctly for create care team', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${groupResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, groups);

  nock(props.fhirBaseURL)
    .get(`/${practitionerResourceType}/_search`)
    .query({ _summary: 'count', active: true })
    .reply(200, { total: 1000 })
    .get(`/${practitionerResourceType}/_search`)
    .query({ _count: 1000, active: true })
    .reply(200, fixtures.practitioners);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  await waitFor(() => {
    expect(nock.pendingMocks()).toEqual([]);
  });

  // some small but incoclusive proof that the form rendered
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/uuid/i)).toMatchSnapshot('uuid field');

  // does not show inactive practitioners
  // find antd Select with id 'practitionersId' in the component
  const practitionersSelect = document.querySelector('[data-testid="practitionersId"]');

  // simulate click on select - to show dropdown items
  fireEvent.mouseDown(practitionersSelect.querySelector('.ant-select-selector'));

  // expect to see all options (practitioners)

  // find antd select options
  const selectOptions = document.querySelectorAll('.ant-select-item-option-content');

  // expect all practitioners (except inactive ones)
  expect([...selectOptions].map((opt) => opt.textContent)).toStrictEqual([
    'Ward N Williams MD',
    'Ward N Williams MD',
    'Ward N Williams MD',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
  ]);
});

test('renders correctly for edit care team', async () => {
  const history = createMemoryHistory();
  const careTeamId = careTeam1.id;
  history.push(`/add/${careTeamId}`);

  nock(props.fhirBaseURL).get(`/${careTeamResourceType}/${careTeamId}`).reply(200, careTeam1);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${groupResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, groups);

  nock(props.fhirBaseURL)
    .get(`/${practitionerResourceType}/_search`)
    .query({ _summary: 'count', active: true })
    .reply(200, { total: 1000 })
    .get(`/${practitionerResourceType}/_search`)
    .query({ _count: 1000, active: true })
    .reply(200, fixtures.practitioners);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  await waitFor(() => {
    expect(nock.pendingMocks()).toEqual([]);
  });

  // some small but incoclusive proof that the form rendered and has some initial values
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/uuid/i)).toMatchSnapshot('uuid field');
});

test('#1016 - does not create malformed request body', async () => {
  const history = createMemoryHistory();
  const careTeamId = fixtures.careTeam4201.id;
  history.push(`/add/${careTeamId}`);

  nock(props.fhirBaseURL)
    .get(`/${careTeamResourceType}/${careTeamId}`)
    .reply(200, fixtures.careTeam4201);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${groupResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, groups);

  nock(props.fhirBaseURL)
    .get(`/${practitionerResourceType}/_search`)
    .query({ _summary: 'count', active: true })
    .reply(200, { total: 1000 })
    .get(`/${practitionerResourceType}/_search`)
    .query({ _count: 1000, active: true })
    .reply(200, fixtures.practitioners);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  await waitFor(() => {
    expect(nock.pendingMocks()).toEqual([]);
  });

  nock(props.fhirBaseURL)
    .put(`/${careTeamResourceType}/${fixtures.careTeam4201.id}`, careTeam4201Edited)
    .reply(200, careTeam4201Edited);

  // change the name
  const nameInput = document.querySelector('input#name');
  expect(nameInput?.value).toEqual('Peter Charlmers Care team');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  userEvents.type(nameInput!, 'Who is Peter Charlmers');

  // submit
  await act(async () => {
    userEvents.click(screen.getByText(/Save/));
    await flushPromises();
  });
});

test('data loading problem', async () => {
  const history = createMemoryHistory();
  const careTeamId = careTeam1.id;
  history.push(`/add/${careTeamId}`);

  nock(props.fhirBaseURL)
    .get(`/${careTeamResourceType}/${careTeamId}`)
    .replyWithError('Something awful happened');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText(/Something awful happened/)).toBeInTheDocument();
});
