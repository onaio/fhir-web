/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import {
  render,
  cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Router, Switch, Route } from 'react-router';
import { Provider } from 'react-redux';
import { locationResourceType } from '../../../../constants';
import userEvent from '@testing-library/user-event';
import {
  centralInventory,
  centralProviceChildLocations,
  centralProvince,
  emptyBundleResponse,
} from './fixtures';
import { ViewDetailsTabs } from '..';
import { createMemoryHistory } from 'history';
import { setConfig } from '@opensrp/pkg-config';
import { listResourceType } from '@opensrp/fhir-helpers';
import { superUserRole } from '@opensrp/react-utils';
import { RoleContext } from '@opensrp/rbac';
import _ from 'lodash';

const actualDebounce = _.debounce;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customDebounce = (callback: any) => callback;
_.debounce = customDebounce;

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

setConfig('projectCode', 'eusm');
jest.setTimeout(10000);
nock.disableNetConnect();

const props = {
  fhirBaseUrl: 'http://test.server.org',
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <RoleContext.Provider value={superUserRole}>
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route exact path={`/profile/:id`}>
              <ViewDetailsTabs {...props} />
            </Route>
          </Switch>
        </QueryClientProvider>
      </RoleContext.Provider>
    </Provider>
  );
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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
    )
  );
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

afterAll(() => {
  nock.enableNetConnect();
  _.debounce = actualDebounce;
});

test('works correctly - jurisdiction location', async () => {
  const history = createMemoryHistory();
  history.push(`profile/${centralProvince.id}`);

  const thisProps = {
    ...props,
    location: centralProvince,
  };

  nock(props.fhirBaseUrl)
    .get(`/${locationResourceType}/_search`)
    .query({
      partof: centralProvince.id,
      _total: 'accurate',
      _getpagesoffset: '0',
      _count: '20',
    })
    .reply(200, centralProviceChildLocations)
    .persist();

  nock(props.fhirBaseUrl)
    .get(`/${locationResourceType}/_search`)
    .query({
      partof: centralProvince.id,
      _total: 'accurate',
      _getpagesoffset: '0',
      'name:contains': 'searchLocation',
      _count: '20',
    })
    .reply(200, emptyBundleResponse)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...thisProps}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Kiambu County');
  });

  // There is a table that has this data.
  let childLocationTab = document.querySelector('[data-testid="child-location-tab"]')!;
  // check records shown in table.
  let tableData = [...childLocationTab.querySelectorAll('table tbody tr')].map(
    (tr) => tr.textContent
  );
  expect(tableData).toEqual(['Kiambu CountyBuildingactive']);

  // validate search works.
  const childLocationSearch = childLocationTab.querySelector('[data-testid="search-form"]')!;
  userEvent.paste(childLocationSearch, 'searchLocation');
  expect(history.location.pathname).toEqual('/profile/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334');
  expect(history.location.search).toEqual('?search=searchLocation&page=1&pageSize=20');
  // check records shown in table
  await waitFor(() => {
    expect(nock.isDone()).toBeTruthy();
  });
  childLocationTab = document.querySelector('[data-testid="child-location-tab"]')!;
  tableData = [...childLocationTab.querySelectorAll('table tbody tr')].map((tr) => tr.textContent);
  expect(tableData).toEqual(['No data']);

  userEvent.clear(childLocationSearch);
  await waitFor(() => {
    screen.getByText('Kiambu County');
  });
  expect(history.location.pathname).toEqual('/profile/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334');
  expect(history.location.search).toEqual('?page=1&pageSize=20');

  const addLocationCta = screen.queryByText(/Add location Unit/i)!;
  userEvent.click(addLocationCta);

  expect(history.location.pathname).toEqual('/admin/location/unit/add');

  expect(nock.isDone()).toBeTruthy();
});

test('works correctly - physical location', async () => {
  const centralBiuldingLocation = {
    ...centralProvince,
    extension: undefined,
    physicalType: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'bu',
          display: 'Biulding',
        },
      ],
    },
  };
  const history = createMemoryHistory();
  history.push(`profile/${centralBiuldingLocation.id}`);

  const thisProps = {
    ...props,
    location: centralBiuldingLocation,
  };

  nock(props.fhirBaseUrl)
    .get(`/${listResourceType}/_search`)
    .query({
      subject: 'd9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
      _include: 'List:item',
      '_include:recurse': 'Group:member',
      _summary: 'count',
    })
    .reply(200, { total: 1 })
    .persist();

  nock(props.fhirBaseUrl)
    .get(`/${listResourceType}/_search`)
    .query({
      subject: 'd9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
      _include: 'List:item',
      '_include:recurse': 'Group:member',
      _count: '1',
    })
    .reply(200, centralInventory)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...thisProps}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  screen.getByText(/Add Inventory/i);

  // There is a table that has this data.
  const inventoryTab = document.querySelector('[data-testid="inventory-tab"]')!;
  // check records shown in table.
  let tableData = [...inventoryTab.querySelectorAll('table tbody tr')].map((tr) => tr.textContent);
  expect(tableData).toEqual(['Bed nets606109db-5632-48c5-8710-b726e1b3addfHealthGAVIEdit']);

  // validate search works.
  const childLocationSearch = inventoryTab.querySelector('[data-testid="search-form"]')!;
  userEvent.type(childLocationSearch, 'someProduct');
  expect(history.location.pathname).toEqual('/profile/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334');
  expect(history.location.search).toEqual('?search=someProduct&page=1&pageSize=20');

  // check records shown in table
  tableData = [...inventoryTab.querySelectorAll('table tbody tr')].map((tr) => tr.textContent);
  expect(tableData).toEqual(['No data']);

  userEvent.clear(childLocationSearch);
  expect(history.location.pathname).toEqual('/profile/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334');
  expect(history.location.search).toEqual('?page=1&pageSize=20');

  const addLocationCta = screen.queryByText(/Add Inventory/i)!;
  userEvent.click(addLocationCta);

  expect(history.location.pathname).toEqual('/profile/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334');

  expect(nock.isDone()).toBeTruthy();
});
