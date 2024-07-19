import React from 'react';
import { Provider } from 'react-redux';
import { TabsTable } from '..';
import { Route, Router, Switch } from 'react-router';
import * as reactQuery from 'react-query';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { patientEncounters } from './fixtures';
import { cleanup, screen, render, waitForElementToBeRemoved } from '@testing-library/react';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import { Dictionary } from '@onaio/utils';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { TFunction } from '@opensrp/i18n';

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

const extractSideViewDetails = (data: IEncounter, t: TFunction) => {
  const { id, meta, status, class: dataClass } = data;
  return {
    title: 'Test Name',
    headerRightData: { [t('Date created')]: meta?.lastUpdated },
    headerLeftData: { [t('ID')]: id },
    bodyData: { [t('status')]: status, [t('Class')]: dataClass.code },
    status: {
      title: status,
      color: 'green',
    },
  };
};

const props = {
  fhirBaseURL: 'http://test.server.org',
  resourceId: 1,
  resourceType: 'Encounter',
  tableColumns: [
    { title: 'id', dataIndex: 'id' },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Resource Type', dataIndex: 'resourceType' },
  ],
  tableDataGetter: (data: Dictionary) => data,
  searchParamsFactory: (id: string) => ({ 'subject:Patient': id }),
  enableSearch: true,
  extractSideViewDetails,
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
          <Route exact path="/table">
            {(routeProps) => <TabsTable {...{ ...props, ...routeProps }} />}
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

it('renders correctly', async () => {
  const history = createMemoryHistory();
  history.push(`/table`);

  nock(props.fhirBaseURL)
    .get(`/Encounter/_search`)
    .query({
      'subject:Patient': props.resourceId,
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, patientEncounters);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  const patientTableHeaders = document.querySelector('.ant-table-thead');
  const patientTableData = document.querySelectorAll('.ant-table-tbody td');
  expect(patientTableHeaders?.textContent).toBe('idStatusResource Type');
  expect([...patientTableData].map((tr) => tr.textContent)).toEqual([
    'a1f3a048-8863-42b7-9d2e-2e9efbbca9a8',
    'finished',
    'Encounter',
  ]);

  // open side view
  history.push('/table?sideView=a1f3a048-8863-42b7-9d2e-2e9efbbca9a8');
  expect(document.querySelector('.view-details-content')).toBeInTheDocument();
  expect(document.querySelector('.view-details-content')?.textContent).toMatchSnapshot();
});

it('shows broken table page', async () => {
  const history = createMemoryHistory();
  history.push('/table');
  nock(props.fhirBaseURL)
    .get(`/Encounter/_search`)
    .query({ 'subject:Patient': 1, _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .replyWithError({
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
