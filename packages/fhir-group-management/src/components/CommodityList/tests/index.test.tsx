/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommodityList } from '..';
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
import { groupResourceType, listResourceType, LIST_COMMODITY_URL } from '../../../constants';
import { firstFiftyCommodities, listResource } from './fixtures';

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
        <Switch>
          <Route exact path={`${LIST_COMMODITY_URL}`}>
            {(routeProps) => <CommodityList {...{ ...props, ...routeProps }} />}
          </Route>
          <Route exact path={`${LIST_COMMODITY_URL}/:id`}>
            {(routeProps) => <CommodityList {...{ ...props, ...routeProps }} />}
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
      _summary: 'count',
      code: 'http://snomed.info/sct|386452003',
      '_has:List:item:_id': listResId,
    })
    .reply(200, { total: 50 });

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      _count: 50,
      code: 'http://snomed.info/sct|386452003',
      '_has:List:item:_id': listResId,
    })
    .reply(200, firstFiftyCommodities);

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
    .get(`/${groupResourceType}/6f3980e0-d1d6-4a7a-a950-939f3ca7b301`)
    .reply(200, firstFiftyCommodities.entry[1].resource);

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
  expect(history.location.search).toEqual('?viewDetails=6f3980e0-d1d6-4a7a-a950-939f3ca7b301');

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

test('Can delete commodity', async () => {
  const history = createMemoryHistory();
  history.push(LIST_COMMODITY_URL);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      _summary: 'count',
      code: 'http://snomed.info/sct|386452003',
      '_has:List:item:_id': listResId,
    })
    .reply(200, { total: 50 });

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      code: 'http://snomed.info/sct|386452003',
      '_has:List:item:_id': listResId,
      _count: 50,
    })
    .reply(200, firstFiftyCommodities)
    .persist();

  const { queryByRole, queryByText } = render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const firstMoreOptions = document.querySelectorAll('.more-options')[0];

  fireEvent.click(firstMoreOptions);
  const editedGroup = {
    ...firstFiftyCommodities.entry[0].resource,
    active: false,
  };
  const editedListResource = {
    ...listResource,
    entry: [listResource.entry[1]],
  };

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/${editedGroup.id}`, editedGroup)
    .reply(201, {});
  nock(props.fhirBaseURL).get(`/${listResourceType}/${listResId}`).reply(200, listResource);
  nock(props.fhirBaseURL)
    .put(`/${listResourceType}/${editedListResource.id}`, editedListResource)
    .reply(200, {});

  const deleteBtn = queryByRole('button', { name: 'Delete' }) as Element;
  fireEvent.click(deleteBtn);
  const promptText = queryByText(/Are you sure you want to delete this Commodity\?/);
  expect(promptText).toBeInTheDocument();
  // simulate yes
  const yesBtn = queryByRole('button', { name: 'Yes' }) as Element;
  fireEvent.click(yesBtn);

  await waitFor(() => {
    expect(screen.queryByText(/Successfully deleted commodity/)).toBeInTheDocument();
  });

  fireEvent.click(document.querySelector('.ant-notification-notice-close') as Element);
});

test('Failed commodity deletion', async () => {
  const history = createMemoryHistory();
  history.push(LIST_COMMODITY_URL);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      _summary: 'count',
      code: 'http://snomed.info/sct|386452003',
      '_has:List:item:_id': listResId,
    })
    .reply(200, { total: 50 });

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      _count: 50,
      code: 'http://snomed.info/sct|386452003',
      '_has:List:item:_id': listResId,
    })
    .reply(200, firstFiftyCommodities);

  const { queryByRole, queryByText } = render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const firstMoreOptions = document.querySelectorAll('.more-options')[0];

  fireEvent.click(firstMoreOptions);
  const editedGroup = {
    ...firstFiftyCommodities.entry[0].resource,
    active: false,
  };
  const editedListResource = {
    ...listResource,
    entry: [listResource.entry[1]],
  };

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/${editedGroup.id}`, editedGroup)
    .reply(201, {});
  nock(props.fhirBaseURL).get(`/${listResourceType}/${listResId}`).reply(200, listResource);
  nock(props.fhirBaseURL)
    .put(`/${listResourceType}/${editedListResource.id}`, editedListResource)
    .reply(500, 'server down');

  const deleteBtn = queryByRole('button', { name: 'Delete' }) as Element;
  fireEvent.click(deleteBtn);
  const promptText = queryByText(/Are you sure you want to delete this Commodity\?/);
  expect(promptText).toBeInTheDocument();
  // simulate yes
  const yesBtn = queryByRole('button', { name: 'Yes' }) as Element;
  fireEvent.click(yesBtn);

  await waitFor(() => {
    expect(screen.queryByText(/Deletion of commodity failed/)).toBeInTheDocument();
  });
});
