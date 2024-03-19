import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import {
  render,
  cleanup,
  screen,
} from '@testing-library/react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { locationResourceType } from '../../../../constants';
import userEvent from '@testing-library/user-event';
import { centralInventory, centralProviceChildLocations, centralProvince } from './fixtures';
import { ViewDetailsTabs } from '..';
import { createMemoryHistory } from 'history';
import { setConfig } from '@opensrp/pkg-config';
import { listResourceType } from '@opensrp/fhir-helpers';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

setConfig("projectCode", "eusm");
jest.setTimeout(10000);
nock.disableNetConnect();

const props = {
  fhirBaseUrl: 'http://test.server.org',
};
const history = createBrowserHistory();
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
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path={`/profile/:id`}>
            <ViewDetailsTabs {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
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


test('works correctly - jurisdiction location', async () => {
  const history = createMemoryHistory();
  history.push(`profile/${centralProvince.id}`);

  const thisProps = {
    ...props,
    location: centralProvince
  }

  nock(props.fhirBaseUrl)
    .get(`/${locationResourceType}/_search`)
    .query({ partof: centralProvince.id })
    .reply(200, centralProviceChildLocations);

  render(
    <Router history={history}>
      <AppWrapper {...thisProps}></AppWrapper>
    </Router>
  );

  // There is a table that has this data.
  const childLocationTab = document.querySelector('[data-testid="child-location-tab"]')!
  // check records shown in table.
  let tableData = [...childLocationTab.querySelectorAll("table tbody tr")].map(tr => tr.textContent)
  expect(tableData).toEqual()


  // validate search works.
  const childLocationSearch = childLocationTab?.querySelector('[data-testid="search-from"]')!
  userEvent.type(childLocationSearch, "otherLocation")
  expect(history.location.pathname).toEqual("")

  // check records shown in table
  tableData = [...childLocationTab.querySelectorAll("table tbody tr")].map(tr => tr.textContent)
  expect(tableData).toEqual()

  userEvent.clear(childLocationSearch)
  expect(history.location.pathname).toEqual("")

  const addLocationCta = screen.queryByText(/Add location Unit/i)!
  userEvent.click(addLocationCta)

  expect(history.location.pathname).toEqual("")

  expect(nock.isDone()).toBeTruthy();
});

test('works correctly - physical location', async () => {
  const centralBiulidingLocation = {
    ...centralProvince,
    extension: undefined,
    "physicalType": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
          "code": "bu",
          "display": "Biulding"
        }
      ]
    },

  }
  const history = createMemoryHistory();
  history.push(`profile/${centralBiulidingLocation.id}`);

  const thisProps = {
    ...props,
    location: centralBiulidingLocation
  }

  nock(props.fhirBaseUrl)
    .get(`/${listResourceType}/_search`)
    .query({ location: "locationID", _include: "List:item", "_include:recurse": "Group:member" })
    .reply(200, centralInventory);

  render(
    <Router history={history}>
      <AppWrapper {...thisProps}></AppWrapper>
    </Router>
  );

  // There is a table that has this data.
  const inventoryTab = document.querySelector('[data-testid="inventory-tab"]')!
  // check records shown in table.
  let tableData = [...inventoryTab.querySelectorAll("table tbody tr")].map(tr => tr.textContent)
  expect(tableData).toEqual()


  // validate search works.
  const childLocationSearch = inventoryTab?.querySelector('[data-testid="search-from"]')!
  userEvent.type(childLocationSearch, "someProduct")
  expect(history.location.pathname).toEqual("")

  // check records shown in table
  tableData = [...inventoryTab.querySelectorAll("table tbody tr")].map(tr => tr.textContent)
  expect(tableData).toEqual()

  userEvent.clear(childLocationSearch)
  expect(history.location.pathname).toEqual("")

  const addLocationCta = screen.queryByText(/Add Inventory/i)!
  userEvent.click(addLocationCta)

  expect(history.location.pathname).toEqual("")

  expect(nock.isDone()).toBeTruthy();
});

