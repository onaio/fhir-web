/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EusmCommodityList } from '../List';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { groupResourceType, listResourceType, LIST_COMMODITY_URL } from '../../../../constants';
import { firstTwentyEusmCommodities, listResource } from './fixtures';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.setTimeout(10000);

jest.mock('@opensrp/react-utils', () => {
  const actual = jest.requireActual('@opensrp/react-utils');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SearchForm = (props: any) => {
    const { onChangeHandler } = props;
    return (
      <div className="search-input-wrapper">
        <input onChange={onChangeHandler} data-testid="search-form"></input>
      </div>
    );
  };
  return {
    ...actual,
    SearchForm,
  };
});

nock.disableNetConnect();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const listResId = listResource.id;

const props = {
  fhirBaseURL: 'http://test.server.org',
  listId: listResId,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RoleContext.Provider value={superUserRole}>
          <Switch>
            <Route exact path={`${LIST_COMMODITY_URL}`}>
              {(routeProps) => <EusmCommodityList {...{ ...props, ...routeProps }} />}
            </Route>
            <Route exact path={`${LIST_COMMODITY_URL}/:id`}>
              {(routeProps) => <EusmCommodityList {...{ ...props, ...routeProps }} />}
            </Route>
          </Switch>
        </RoleContext.Provider>
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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

afterAll(() => {
  nock.enableNetConnect();
});

test('renders correctly when listing resources', async () => {
  const history = createMemoryHistory();
  history.push(LIST_COMMODITY_URL);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
      code: 'http://snomed.info/sct|386452003',
      '_has:List:item:_id': listResId,
    })
    .reply(200, firstTwentyEusmCommodities);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(document.querySelector('title')).toMatchInlineSnapshot(`
    <title>
      Commodity List
    </title>
  `);

  expect(document.querySelector('.page-header')).toMatchSnapshot('Header title');

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  // view details
  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/52cffa51-fa81-49aa-9944-5b45d9e4c117`)
    .reply(200, firstTwentyEusmCommodities.entry[0].resource);

  // target the initial row view details
  const dropdown = document.querySelector('tbody tr:nth-child(1) [data-testid="action-dropdown"]');
  fireEvent.click(dropdown!);

  const viewDetailsLink = screen.getByText(/View Details/);
  expect(viewDetailsLink).toMatchInlineSnapshot(`
    <span>
      View Details
    </span>
  `);
  fireEvent.click(viewDetailsLink);
  expect(history.location.search).toEqual('?viewDetails=52cffa51-fa81-49aa-9944-5b45d9e4c117');

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // see view details contents
  const keyValuePairs = document.querySelectorAll(
    'div[data-testid="key-value"] .singleKeyValue-pair'
  );
  keyValuePairs.forEach((pair) => {
    expect(pair).toMatchSnapshot();
  });

  // close view details
  const closeButton = document.querySelector('[data-testid="close-button"]');
  fireEvent.click(closeButton!);

  expect(history.location.pathname).toEqual('/commodity/list');
  expect(nock.isDone()).toBeTruthy();
});
