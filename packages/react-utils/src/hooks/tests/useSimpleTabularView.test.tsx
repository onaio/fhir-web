import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { QueryClientProvider, QueryClient } from 'react-query';
import { MemoryRouter as Router, Route, Routes } from 'react-router';
import { TableLayout } from '../../components/TableLayout';
import { useSimpleTabularView } from '../useSimpleTabularView';
import nock from 'nock';
import { dataPage1, dataPage2, searchData } from './fixtures';
import userEvents from '@testing-library/user-event';
import { Input } from 'antd';

const history = createMemoryHistory()
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
  const { tablePaginationProps, queryValues, searchFormProps } = useSimpleTabularView(
    options.baseUrl,
    options.endpoint
  );

  const { data, isFetching, isLoading } = queryValues;

  const columns = [
    {
      title: 'Name/Id',
      dataIndex: 'title',
      width: '20%',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableProps: any = {
    datasource: data?.records ?? [],
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return (
    <div>
      <SearchForm {...searchFormProps} data-testid="search-form" />
      <TableLayout {...tableProps} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App = (props: any) => {
  return (
  <QueryClientProvider client={rQClient}>
    <Routes>
      <Route path="/qr" element={props.children} />
    </Routes>
    </QueryClientProvider>
  );
};

// we now setup the tests
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

test('pagination and search work correctly', async () => {
  // const history = createMemoryHistory();
  // history.push('/qr');
  window.history.replaceState({}, "test page", '/qr');
  console.log(window.history.state)

  nock(options.baseUrl)
    .get(`/${options.endpoint}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, dataPage1)
    .persist();

  nock(options.baseUrl)
    .get(`/${options.endpoint}/_search`)
    .query({
      _getpagesoffset: 20,
      _count: 20,
    })
    .reply(200, dataPage2)
    .persist();

  nock(options.baseUrl)
    .get(`/${options.endpoint}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
      'name:contains': '345',
    })
    .reply(200, searchData)
    .persist();

  render(
    <Router initialEntries={['/qr']}>
      <App>
        <SampleApp />
      </App>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const waitForSpinner = async () => {
    return await waitFor(() => {
      expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    });
  };

  await waitFor(() => {
    expect(screen.getByText(/NSW Government My Personal Health Record/)).toBeInTheDocument();
  });

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  fireEvent.click(screen.getByTitle('2'));

  expect(window.location.search).toEqual('?pageSize=20&page=2');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/426 - title/)).toBeInTheDocument();
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 2`);
    });
  });

  // works with search as well.
  const searchForm = document.querySelector('[data-testid="search-form"]') as Element;
  userEvents.type(searchForm, '345');

  expect(history.location.search).toEqual('?pageSize=20&page=1&search=345');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`Search ${idx} page 1`);
    });
  });

  // remove search.
  userEvents.clear(searchForm);
  expect(history.location.search).toEqual('?pageSize=20&page=1');

  expect(nock.pendingMocks()).toEqual([]);
});
