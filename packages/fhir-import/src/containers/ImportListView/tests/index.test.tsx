import React from 'react';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { DataImportList } from '..';
import { Route, Router, Switch } from 'react-router';
import nock from 'nock';
import * as reactQuery from 'react-query';
import { waitForElementToBeRemoved, render, cleanup } from '@testing-library/react';
import { store } from '@opensrp/store';
import { workflows } from './fixtures';
import * as constants from '../../../constants';
import { createMemoryHistory } from 'history';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');
global.fetch = fetch;

jest.mock('../../../constants', () => {
  return {
    __esModule: true,
    ...Object.assign({}, jest.requireActual('../../../constants')),
    IMPORT_DOMAIN_URI: 'http://localhost',
  };
});

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RoleContext.Provider value={superUserRole}>
          <Switch>
            <Route exact path={`${constants.DATA_IMPORT_LIST_URL}`}>
              {(routeProps) => <DataImportList {...{ ...props, ...routeProps }} />}
            </Route>
            <Route exact path={`${constants.DATA_IMPORT_LIST_URL}/:workflowId`}>
              {(routeProps) => <DataImportList {...{ ...props, ...routeProps }} />}
            </Route>
          </Switch>
        </RoleContext.Provider>
      </QueryClientProvider>
    </Provider>
  );
};

describe('Care Teams list view', () => {
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  it('renders correctly', async () => {
    nock(constants.IMPORT_DOMAIN_URI).get('/$import').reply(200, workflows).persist();

    const history = createMemoryHistory();
    history.push(constants.DATA_IMPORT_LIST_URL);

    render(
      <Router history={history}>
        <AppWrapper />
      </Router>
    );

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
    expect(nock.pendingMocks()).toEqual([]);

    expect(document.querySelector('title')).toMatchInlineSnapshot(`
      <title>
        Data imports
      </title>
    `);

    document.querySelectorAll('tr').forEach((tr, idx) => {
      tr.querySelectorAll('td').forEach((td) => {
        expect(td).toMatchSnapshot(`table row ${idx} page 1`);
      });
    });

    expect(nock.pendingMocks()).toEqual([]);
  });
});
