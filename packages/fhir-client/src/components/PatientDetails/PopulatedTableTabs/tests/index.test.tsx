import React from 'react';
import { Provider } from 'react-redux';
import { PopulatedTableTabs } from '..';
import { Route, Router, Switch } from 'react-router';
import * as reactQuery from 'react-query';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import {
  resourceEntriesCount,
  patientCarePlans,
  patientConditions,
  patientTask,
  patientEncounters,
  patientImmunization,
} from './fixtures';
import { LIST_PATIENTS_URL } from '../../../../constants';
import {
  cleanup,
  screen,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import { patientResourceDetails } from '../../tests/fixtures';
import { last } from 'lodash';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const patientId = patientResourceDetails.id;
const props = {
  fhirBaseURL: 'http://test.server.org',
  patientId,
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
  nock.disableNetConnect();
});

afterAll(() => {
  nock.enableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
  jest.resetAllMocks();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path={`${LIST_PATIENTS_URL}/:id`}>
            {(routeProps) => (
              <RoleContext.Provider value={superUserRole}>
                <PopulatedTableTabs {...{ ...props, ...routeProps }} />
              </RoleContext.Provider>
            )}
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

const tabsTitleCountQueries = () => {
  nock(props.fhirBaseURL)
    .get(`/CarePlan/_search`)
    .query({ _summary: 'count', 'subject:Patient': patientId })
    .reply(200, resourceEntriesCount);

  nock(props.fhirBaseURL)
    .get(`/Condition/_search`)
    .query({ _summary: 'count', 'subject:Patient': patientId })
    .reply(200, resourceEntriesCount);

  nock(props.fhirBaseURL)
    .get(`/Task/_search`)
    .query({ _summary: 'count', patient: patientId })
    .reply(200, resourceEntriesCount);

  nock(props.fhirBaseURL)
    .get(`/Immunization/_search`)
    .query({ _summary: 'count', patient: patientId })
    .reply(200, resourceEntriesCount);

  nock(props.fhirBaseURL)
    .get(`/Encounter/_search`)
    .query({ _summary: 'count', 'subject:Patient': patientId })
    .reply(200, resourceEntriesCount);
};

it('renders correctly', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}`);

  nock(props.fhirBaseURL)
    .get(`/CarePlan/_search`)
    .query({ 'subject:Patient': patientId, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .reply(200, patientCarePlans);

  nock(props.fhirBaseURL)
    .get(`/Condition/_search`)
    .query({ 'subject:Patient': patientId, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .reply(200, patientConditions);
  // title count nocks
  tabsTitleCountQueries();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  await waitFor(() => {
    expect(screen.getByRole('tablist').textContent).toBe(
      'Care plan 1Condition 1Task 1Immunization 1Patient encounter 1'
    );
  });

  // Care Plan tab
  const carePlanTableHeaders = document.querySelector('.ant-table-thead');
  const carePlanTableData = document.querySelectorAll('.ant-table-tbody td');
  let sideViewElement = document.querySelector('.view-details-content');
  expect(carePlanTableHeaders?.textContent).toBe('TitleDescriptionPeriodActions');
  expect([...carePlanTableData].map((tr) => tr.textContent)).toEqual([
    'Child Routine visit Plan',
    'This defines the schedule of care for patients under 5 years old',
    '5/26/2022-5/14/2025',
    'View',
  ]);
  expect(sideViewElement).not.toBeInTheDocument();
  // opens side view
  const viewBtn = last(carePlanTableData)?.querySelector('button') as Element;
  fireEvent.click(viewBtn);
  expect(history.location.pathname).toEqual('/fhir/Patient/1');
  expect(history.location.search).toEqual('?sideView=131386');
  sideViewElement = document.querySelector('.view-details-content');
  expect(sideViewElement).toBeInTheDocument();

  const bodyElementValues = [
    ...(sideViewElement?.querySelectorAll('.singleKeyValue-pair__default') || []),
  ].map((keyValue) => keyValue.textContent);
  expect(bodyElementValues).toEqual([
    'Category',
    'Period5/26/2022-5/14/2025',
    'Statuscompleted',
    'Intentplan',
  ]);
  const headerLeftElementValues = [...document.querySelectorAll('.header-bottom')].map(
    (keyValue) => keyValue.textContent
  );
  expect(headerLeftElementValues).toEqual(['ID: 131386']);

  // condition tab
  fireEvent.click(document.querySelector('[data-node-key=condition] .ant-tabs-tab-btn') as Element);
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  expect(history.location.search).toEqual('?tabView=tabView&activeTab=condition');
});

it('Condition tab renders correctly', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}?tabView=tabView&activeTab=condition`);

  nock(props.fhirBaseURL)
    .get(`/Condition/_search`)
    .query({ 'subject:Patient': patientId, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .reply(200, patientConditions);
  // title count nocks
  tabsTitleCountQueries();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  await waitFor(() => {
    expect(screen.getByRole('tablist').textContent).toBe(
      'Care plan 1Condition 1Task 1Immunization 1Patient encounter 1'
    );
  });

  // Care Plan tab
  const conditionTableHeaders = document.querySelector('.ant-table-thead');
  const conditionTableData = document.querySelectorAll('.ant-table-tbody td');
  expect(conditionTableHeaders?.textContent).toBe('ConditionSeverityVerification StatusActions');
  expect([...conditionTableData].map((tr) => tr.textContent)).toEqual([
    '77386006',
    '',
    'confirmed',
    'View',
  ]);

  // opens side view
  const viewBtn = last(conditionTableData)?.querySelector('button') as Element;
  fireEvent.click(viewBtn);
  expect(history.location.search).toEqual(
    '?tabView=tabView&activeTab=condition&sideView=349d8947-3009-4fb3-b3d5-99ff30aa5614'
  );
  expect(document.querySelector('.view-details-content')).toBeInTheDocument();
  expect(document.querySelector('.view-details-content')?.textContent).toMatchSnapshot();
});

it('Task tab renders correctly', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}?tabView=tabView&activeTab=task`);

  nock(props.fhirBaseURL)
    .get(`/Task/_search`)
    .query({ patient: patientId, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .reply(200, patientTask);
  // title count nocks
  tabsTitleCountQueries();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  await waitFor(() => {
    expect(screen.getByRole('tablist').textContent).toBe(
      'Care plan 1Condition 1Task 1Immunization 1Patient encounter 1'
    );
  });

  // Care Plan tab
  const taskTableHeaders = document.querySelector('.ant-table-thead');
  const taskTableData = document.querySelectorAll('.ant-table-tbody td');
  expect(taskTableHeaders?.textContent).toBe('TaskPeriodDescriptionActions');
  expect([...taskTableData].map((tr) => tr.textContent)).toEqual([
    'Hygiene Visit',
    '9/30/2021-10/1/2021',
    'Hygiene Visit',
    'View',
  ]);

  // opens side view
  const viewBtn = last(taskTableData)?.querySelector('button') as Element;
  fireEvent.click(viewBtn);
  expect(history.location.search).toEqual('?tabView=tabView&activeTab=task&sideView=14205');
  expect(document.querySelector('.view-details-content')).toBeInTheDocument();
  expect(document.querySelector('.view-details-content')?.textContent).toMatchSnapshot();
});

it('immunization encounter tab renders correctly', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}?tabView=tabView&activeTab=immunization`);

  nock(props.fhirBaseURL)
    .get(`/Immunization/_search`)
    .query({ patient: patientId, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .reply(200, patientImmunization);
  // title count nocks
  tabsTitleCountQueries();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  await waitFor(() => {
    expect(screen.getByRole('tablist').textContent).toBe(
      'Care plan 1Condition 1Task 1Immunization 1Patient encounter 1'
    );
  });

  const immunizationTableHeaders = document.querySelector('.ant-table-thead');
  const immunizationTableData = document.querySelectorAll('.ant-table-tbody td');
  expect(immunizationTableHeaders?.textContent).toBe(
    'Vaccine AdmnisteredStatusAdministration DateActions'
  );
  expect([...immunizationTableData].map((tr) => tr.textContent)).toEqual([
    'SARSCoV2  mRNA vaccine',
    'completed',
    '7/8/2021',
    'View',
  ]);

  // opens side view
  const viewBtn = last(immunizationTableData)?.querySelector('button') as Element;
  fireEvent.click(viewBtn);
  expect(history.location.search).toEqual('?tabView=tabView&activeTab=immunization&sideView=979');
  expect(document.querySelector('.view-details-content')).toBeInTheDocument();
  expect(document.querySelector('.view-details-content')?.textContent).toMatchSnapshot();
});

it('Patient encounter tab renders correctly', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}?tabView=tabView&activeTab=patientEncounter`);

  nock(props.fhirBaseURL)
    .get(`/Encounter/_search`)
    .query({ 'subject:Patient': patientId, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .reply(200, patientEncounters);
  // title count nocks
  tabsTitleCountQueries();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  await waitFor(() => {
    expect(screen.getByRole('tablist').textContent).toBe(
      'Care plan 1Condition 1Task 1Immunization 1Patient encounter 1'
    );
  });

  const patientTableHeaders = document.querySelector('.ant-table-thead');
  const patientTableData = document.querySelectorAll('.ant-table-tbody td');
  expect(patientTableHeaders?.textContent).toBe('ClassPeriodService typeActions');
  expect([...patientTableData].map((tr) => tr.textContent)).toEqual(['AMB', '', '581', 'View']);

  // opens side view
  const viewBtn = last(patientTableData)?.querySelector('button') as Element;
  fireEvent.click(viewBtn);
  expect(history.location.search).toEqual(
    '?tabView=tabView&activeTab=patientEncounter&sideView=a1f3a048-8863-42b7-9d2e-2e9efbbca9a8'
  );
  expect(document.querySelector('.view-details-content')).toBeInTheDocument();
  expect(document.querySelector('.view-details-content')?.textContent).toMatchSnapshot();
});

it('shows broken table page', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}`);
  nock(props.fhirBaseURL)
    .get(`/CarePlan/_search`)
    .query({ 'subject:Patient': patientId, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .replyWithError({
      message: 'something awful happened',
      code: 'AWFUL_ERROR',
    });
  // title count nocks
  tabsTitleCountQueries();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  expect(screen.getByText(/failed, reason: something awful happened/)).toBeInTheDocument();
});
