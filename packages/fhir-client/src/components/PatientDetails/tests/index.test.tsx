import React from 'react';
import { Provider } from 'react-redux';
import { PatientDetails } from '..';
import { Route, Router, Switch } from 'react-router';
import * as reactQuery from 'react-query';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { patientResourceDetails, planDefinitionResource } from './fixtures';
import { LIST_PATIENTS_URL } from '../../../constants';
import {
  cleanup,
  screen,
  render,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import {
  patientCarePlans,
  patientConditions,
  patientEncounters,
  patientImmunization,
  patientTask,
  resourceEntriesCount,
} from '../PopulatedTableTabs/tests/fixtures';
import { last } from 'lodash';

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

const props = {
  fhirBaseURL: 'http://test.server.org',
  path: `${LIST_PATIENTS_URL}/:id`,
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
          <Route exact path={props.path}>
            {(routeProps) => <PatientDetails {...{ ...props, ...routeProps }} />}
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

it('renders patient details page correctly', async () => {
  const patientId = patientResourceDetails.id;
  const carePlanResource = patientCarePlans.entry[0].resource;
  const carePlanId = carePlanResource.id;
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}`);

  nock(props.fhirBaseURL).get(`/Patient/${patientId}`).reply(200, patientResourceDetails);

  nock(props.fhirBaseURL)
    .get(`/CarePlan/_search`)
    .query({ 'subject:Patient': patientId, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .reply(200, patientCarePlans);

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

  nock(props.fhirBaseURL).get(`/CarePlan/${carePlanId}`).reply(200, carePlanResource);

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

  const breadcrumb = document.querySelectorAll('.ant-breadcrumb li');
  breadcrumb.forEach((list, i) => {
    expect(list.innerHTML).toMatchSnapshot(`patient breadCrum-${i}`);
  });
  expect(document.querySelector('.ant-page-header-heading')?.textContent).toEqual('View details1');

  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual([
    'First nameJohn',
    'Last nameDoe',
    'UUID',
    'Date of birth8/4/1988',
    'Phone+254722123456',
    'MRNUnknown',
    'Address213,One Pademore',
    'CountryKenya',
  ]);

  const headerRightData = [...document.querySelectorAll('.singleKeyValue-pair__light')].map(
    (keyValue) => keyValue.textContent
  );
  expect(headerRightData).toEqual(['Date created3/10/2021, 1:27:48 PM']);

  const headerLeftElementValues = document.querySelector('.header-bottom');
  expect(headerLeftElementValues?.textContent).toEqual(
    'ID: 1Gender: maleDate created3/10/2021, 1:27:48 PM'
  );

  // partially check if tabs were loaded
  const carePlanTableData = document.querySelectorAll('.ant-table-tbody td');
  // side view
  const viewBtn = last(carePlanTableData)?.querySelector('button') as Element;
  fireEvent.click(viewBtn);
  expect(history.location.search).toEqual('?sideView=131386');
  const fullDetailBtn = document.querySelector('.details-section a');
  fireEvent.click(fullDetailBtn as Element);
  expect(history.location.pathname).toEqual(
    `${LIST_PATIENTS_URL}/${patientId}/${carePlanResource.resourceType}/${carePlanId}`
  );
});

it('renders care plan resources correctly', async () => {
  const newProps = {
    ...props,
    path: `${LIST_PATIENTS_URL}/:id/:resourceType/:resourceId`,
  };
  const patientId = patientResourceDetails.id;
  const carePlanResource = patientCarePlans.entry[0].resource;
  const carePlanId = carePlanResource.id;
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}/${carePlanResource.resourceType}/${carePlanId}`);

  // nock(props.fhirBaseURL).get(`/Patient/${patientId}`).reply(200, patientResourceDetails);

  nock(props.fhirBaseURL).get(`/CarePlan/${carePlanId}`).reply(200, carePlanResource);

  nock(props.fhirBaseURL)
    .get(`/PlanDefinition/${planDefinitionResource.id}`)
    .reply(200, planDefinitionResource);

  render(
    <Router history={history}>
      <AppWrapper {...newProps}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const breadcrumb = document.querySelectorAll('.ant-breadcrumb li');
  breadcrumb.forEach((list, i) => {
    expect(list.innerHTML).toMatchSnapshot(`other resource breadCrum-${i}`);
  });
  expect(document.querySelector('.ant-page-header-heading')?.textContent).toEqual(
    'View details131386'
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual([
    'Category',
    'Period5/26/2022-5/14/2025',
    'Statuscompleted',
    'Intentplan',
    'Canonical (PlanDefinition)Child Routine visit Plan',
    'AddressN/A',
    'DescriptionThis defines the schedule of care for patients under 5 years old',
  ]);

  const headerRightData = [...document.querySelectorAll('.singleKeyValue-pair__light')].map(
    (keyValue) => keyValue.textContent
  );
  expect(headerRightData).toEqual(['Date created5/25/2022, 10:24:04 PM']);

  const headerLeftElementValues = document.querySelector('.header-bottom');
  expect(headerLeftElementValues?.textContent).toEqual(
    'Id: 131386Date created5/25/2022, 10:24:04 PM'
  );
});

it('renders task resources correctly', async () => {
  const newProps = {
    ...props,
    path: `${LIST_PATIENTS_URL}/:id/:resourceType/:resourceId`,
  };
  const patientId = patientResourceDetails.id;
  const resourceData = patientTask.entry[0].resource;
  const { id, resourceType } = resourceData;
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}/${resourceType}/${id}`);

  nock(props.fhirBaseURL).get(`/Task/${id}`).reply(200, resourceData);

  render(
    <Router history={history}>
      <AppWrapper {...newProps}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const breadcrumb = document.querySelectorAll('.ant-breadcrumb li');
  breadcrumb.forEach((list, i) => {
    expect(list.innerHTML).toMatchSnapshot(`other resource breadCrum-${i}`);
  });
  expect(document.querySelector('.ant-page-header-heading')?.textContent).toEqual(
    'View details14205'
  );

  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual([
    'Period9/30/2021-10/1/2021',
    'Priority',
    'Statuscompleted',
    'Business status',
    'Intentorder',
    'reason',
    'DescriptionHygiene Visit',
  ]);

  const headerLeftElementValues = document.querySelector('.header-bottom');
  expect(headerLeftElementValues?.textContent).toEqual(
    'Id: 14205Date created3/11/2016, 2:39:32 AM'
  );
});

it('renders condition resources correctly', async () => {
  const newProps = {
    ...props,
    path: `${LIST_PATIENTS_URL}/:id/:resourceType/:resourceId`,
  };
  const patientId = patientResourceDetails.id;
  const resourceData = patientConditions.entry[0].resource;
  const { id, resourceType } = resourceData;
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}/${resourceType}/${id}`);

  nock(props.fhirBaseURL).get(`/Condition/${id}`).reply(200, resourceData);

  render(
    <Router history={history}>
      <AppWrapper {...newProps}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const breadcrumb = document.querySelectorAll('.ant-breadcrumb li');
  breadcrumb.forEach((list, i) => {
    expect(list.innerHTML).toMatchSnapshot(`other resource breadCrum-${i}`);
  });
  expect(document.querySelector('.ant-page-header-heading')?.textContent).toEqual(
    'View details349d8947-3009-4fb3-b3d5-99ff30aa5614'
  );

  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual([
    'Condition77386006',
    'Severity',
    'Category',
    'stage',
    'Onset date',
    'Abatement date',
    'Clinical statusactive',
    'Verification statusconfirmed',
  ]);

  const headerLeftElementValues = document.querySelector('.header-bottom');
  expect(headerLeftElementValues?.textContent).toEqual(
    'Id: 349d8947-3009-4fb3-b3d5-99ff30aa5614Date created12/14/2021, 2:40:38 PM'
  );
});

it('renders immunization resources correctly', async () => {
  const newProps = {
    ...props,
    path: `${LIST_PATIENTS_URL}/:id/:resourceType/:resourceId`,
  };
  const patientId = patientResourceDetails.id;
  const resourceData = patientImmunization.entry[0].resource;
  const { id, resourceType } = resourceData;
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}/${resourceType}/${id}`);

  nock(props.fhirBaseURL).get(`/Immunization/${id}`).reply(200, resourceData);

  render(
    <Router history={history}>
      <AppWrapper {...newProps}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const breadcrumb = document.querySelectorAll('.ant-breadcrumb li');
  breadcrumb.forEach((list, i) => {
    expect(list.innerHTML).toMatchSnapshot(`other resource breadCrum-${i}`);
  });
  expect(document.querySelector('.ant-page-header-heading')?.textContent).toEqual(
    'View details979'
  );

  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual([
    'Vaccine AdmnisteredSARSCoV2  mRNA vaccine',
    'Administration Date7/8/2021',
    'Vaccine expiry date12/15/2018',
    'protocol applied1',
    'Dose quantity',
    'statuscompleted',
    'Primary source',
    'Report originrecord',
    'Reason',
  ]);

  const headerLeftElementValues = document.querySelector('.header-bottom');
  expect(headerLeftElementValues?.textContent).toEqual('Id: 979Date created7/29/2021, 9:37:03 AM');
});

it('renders patientEncounter resources correctly', async () => {
  const newProps = {
    ...props,
    path: `${LIST_PATIENTS_URL}/:id/:resourceType/:resourceId`,
  };
  const patientId = patientResourceDetails.id;
  const resourceData = patientEncounters.entry[0].resource;
  const { id, resourceType } = resourceData;
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientId}/${resourceType}/${id}`);

  nock(props.fhirBaseURL).get(`/Encounter/${id}`).reply(200, resourceData);

  render(
    <Router history={history}>
      <AppWrapper {...newProps}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const breadcrumb = document.querySelectorAll('.ant-breadcrumb li');
  breadcrumb.forEach((list, i) => {
    expect(list.innerHTML).toMatchSnapshot(`other resource breadCrum-${i}`);
  });
  expect(document.querySelector('.ant-page-header-heading')?.textContent).toEqual(
    'View detailsa1f3a048-8863-42b7-9d2e-2e9efbbca9a8'
  );

  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual([
    'ClassAMB',
    'Type',
    'Priority',
    'Reason',
    'PeriodInvalid Date-Invalid Date',
    'Service provider',
    'Encounter Duration',
    'Service Type581',
    'Episode of care',
  ]);

  const headerLeftElementValues = document.querySelector('.header-bottom');
  expect(headerLeftElementValues?.textContent).toEqual('Id: a1f3a048-8863-42b7-9d2e-2e9efbbca9a8');
});

it('shows broken page if fhir api is down', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}/${patientResourceDetails.id}`);

  nock(props.fhirBaseURL).get(`/Patient/${patientResourceDetails.id}`).replyWithError({
    message: 'something awful happened',
    code: 'AWFUL_ERROR',
  });

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/something awful happened/)).toBeInTheDocument();
});
