import React from 'react';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { DataImportList } from '..';
import { Route, Router, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import nock from 'nock';
import * as reactQuery from 'react-query';
import { waitForElementToBeRemoved, fireEvent, render, cleanup } from '@testing-library/react';
import { store } from '@opensrp/store';
import { workflows } from './fixtures';
import { DATA_IMPORT_LIST_URL, IMPORT_DOMAIN_URI } from '../../../constants';
import { createMemoryHistory } from 'history';
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

const history = createBrowserHistory();

const props = {
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RoleContext.Provider value={superUserRole}>
          <Switch>
            <Route exact path={`${DATA_IMPORT_LIST_URL}`}>
              {(routeProps) => <DataImportList {...{ ...props, ...routeProps }} />}
            </Route>
            <Route exact path={`${DATA_IMPORT_LIST_URL}/:workflowId`}>
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
    nock(IMPORT_DOMAIN_URI)
      .get(`/$import`)
      .reply(200, workflows)
      .persist();

    const history = createMemoryHistory();
    history.push(DATA_IMPORT_LIST_URL);

   render(
      <Router history={history}>
        <AppWrapper {...props} />
      </Router>
    );

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

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

    // view details
    nock(IMPORT_DOMAIN_URI)
      .get(`/$import/${workflows?.[0].workflowId}`)
      .query({ _id: '308', _include: 'CareTeam:*' })
      .reply(200, workflows[0])
      .persist();

    // target the initial row view details
    const dropdown = document.querySelector(
      'tbody tr:nth-child(1) [data-testid="action-dropdown"]'
    ) as Element;
    fireEvent.click(dropdown);

    expect(history.location).toEqual({})

  });
});
