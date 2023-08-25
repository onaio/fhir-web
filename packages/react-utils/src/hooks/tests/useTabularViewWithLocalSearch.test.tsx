import {
  cleanup,
  prettyDOM,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import nock from 'nock';
import userEvents from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Input } from 'antd';
import TableLayout from '../../components/TableLayout';
import { MemoryRouter as Router, Route, Routes } from 'react-router';
import { useTabularViewWithLocalSearch } from '../useTabularViewWithLocalSearch';
import { hugeSinglePageData, hugeSinglePageDataSummary } from './fixtures';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const rQClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

// TODO - boiler plate
store.dispatch(
  authenticateUser(
    true,
    {
      email: 'bob@example.com',
      name: 'Bobbie',
      username: 'RobertBaratheon',
    },
    { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
  )
);

// we first setup the wrapper components, somewhere to run the hooks during tests
const options = {
  baseUrl: 'http://example.com',
  endpoint: 'data',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SearchForm = (props: any) => {
  const { onChangeHandler, ...otherProps } = props;

  return (
    <div className="search-input-wrapper">
      <Input onChange={onChangeHandler} {...otherProps}></Input>
    </div>
  );
};

// minimal app to wrap our hook.
const SampleApp = () => {
  const { baseUrl, endpoint } = options;
  const matchesSearch = (obj, search) => obj.name.includes(search);
  const { tablePaginationProps, queryValues, searchFormProps } = useTabularViewWithLocalSearch(
    baseUrl,
    endpoint,
    {},
    matchesSearch
  );

  const { data, isFetching, isLoading } = queryValues;

  const columns = [
    {
      title: 'Name/Id',
      dataIndex: 'name',
      width: '20%',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableProps: any = {
    datasource: data ?? [],
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return (
    <div>
      <SearchForm {...searchFormProps} data-testid="search-form" />
      <TableLayout {...tableProps} data-testid="mock-table" />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App = (props: any) => {
  return (
    <Routes>
      <Route path="/qr" element={<QueryClientProvider client={rQClient}>{props.children}</QueryClientProvider>} />
    </Routes>
  );
};

/********************************************/
/*** Test boilerplate ends here. */

// we now setup the test suites
beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.enableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

// test that it works correctly nominally - include search and pagination
// test that extra params are handled correctly.

test('integrates correctly in component', async () => {
  const history = createMemoryHistory();
  history.push('/qr');

  nock(options.baseUrl)
    .get(`/${options.endpoint}/_search`)
    .query({
      _summary: 'count',
    })
    .reply(200, hugeSinglePageDataSummary);

  nock(options.baseUrl)
    .get(`/${options.endpoint}/_search`)
    .query({
      _count: 100,
    })
    .reply(200, hugeSinglePageData);

  render(
    <Router initialEntries={['/qr']}>
      <App>
        <SampleApp />
      </App>
    </Router>
  );

  console.log(prettyDOM(document))

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  await waitFor(() => {
    expect(screen.getByText(/Jan27Test/)).toBeInTheDocument();
  });

  const renderedRecords = [...document.querySelectorAll('td')].map((td) => td.textContent);

  expect(renderedRecords).toEqual([
    'Jan27Test',
    'Jan27',
    'TEST group  1',
    'Demo FHIR Groups',
    'ANC patients',
    'ANC patients',
    'ANC patients',
    'TEST group ',
    'ANC patients',
    'ANC patients',
    'Paracetamol 100mg tablets',
    'Amoxicillin 250mg tablets',
    'Zinc sulfate 20mg tablets',
    'Male Condoms',
    'Female Condoms',
    'Artemether 20mg + Lumefatrine 120mg (1x6) Tablets',
    'Artemether 20mg + Lumefatrine 120mg (2x6) Tablets',
    'Artesunate 100mg Suppository Strips',
    'AS (25mg) + AQ (67.5mg) ( 2-11months) Tablets',
    'AS (50mg) + AQ (135mg) ( 1-5years) Tablets',
  ]);

  // pagination is ok.
  const paginationSection = document.querySelector('.ant-pagination');
  expect(paginationSection?.textContent).toEqual('12320 / pageGo toPage');

  expect(history.location.search).toEqual('');
  // go to the next page.
  const nextPage = screen.getByTitle('Next Page');
  userEvents.click(nextPage);

  // recheck that the pagination information is synced to the url.
  expect(history.location.search).toEqual('?pageSize=20&page=2');
  // what icon on pagination is selected.
  const activePaginationItem = document.querySelector('.ant-pagination-item-active');
  expect(activePaginationItem?.textContent).toEqual('2');

  // what about the records.
  const nextPageRecords = [...document.querySelectorAll('td')].map((td) => td.textContent);

  expect(nextPageRecords).toEqual([
    'Dispensing Bags for Tablets (s)',
    'Dispensing Envelopes',
    'Disposable Gloves',
    'Examination Gloves (Nitrile) Large',
    'Examination Gloves (Nitrile) Medium',
    'Examination Gloves (Nitrile) Small',
    'Face Mask, Surgical',
    'Face Shield (Flexible, Disposable)',
    'Goggles',
    'Hand sanitizer gel 250ml w/ pump',
    'Male Condoms',
    'Microgynon',
    'Microlut',
    'MNP',
    'MUAC Strap',
    'Oral Rehydration Salt 20.5g/L',
    'Paracetamol 100mg Tablets',
    'PPE Suit - Coverall, L',
    'PPE Suit - Coverall, M',
    'Rapid Diagnostic Test (RDT)',
  ]);

  // we search when on page 2
  const searchForm = screen.getByTestId('search-form');
  userEvents.type(searchForm, 'Gloves');

  // search info is synced to the url as well.
  expect(history.location.search).toEqual('?pageSize=20&page=1&search=Gloves');

  // records should reflect search status.
  const searchRecords = [...document.querySelectorAll('td')].map((td) => td.textContent);

  expect(searchRecords).toEqual([
    'Disposable Gloves',
    'Examination Gloves (Nitrile) Large',
    'Examination Gloves (Nitrile) Medium',
    'Examination Gloves (Nitrile) Small',
  ]);

  expect(nock.pendingMocks()).toEqual([]);
});
