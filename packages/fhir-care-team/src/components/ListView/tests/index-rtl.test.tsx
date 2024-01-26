import React from 'react';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { CareTeamList } from '..';
import { Route, Router, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import nock from 'nock';
import * as reactQuery from 'react-query';
import { waitForElementToBeRemoved, fireEvent, render, cleanup } from '@testing-library/react';
import { store } from '@opensrp/store';
import { careTeam4214, careTeams } from './fixtures';
import { careTeamResourceType, URL_CARE_TEAM } from '../../../constants';
import { createMemoryHistory } from 'history';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/test-utils';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

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
  fhirBaseURL: 'https://r4.smarthealthit.org/',
  history,
  careTeamPageSize: 5,
  location: {
    hash: '',
    pathname: `${URL_CARE_TEAM}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { careTeamId: undefined },
    path: `${URL_CARE_TEAM}`,
    url: `${URL_CARE_TEAM}`,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RoleContext.Provider value={superUserRole}>
          <Switch>
            <Route exact path={`${URL_CARE_TEAM}`}>
              {(routeProps) => <CareTeamList {...{ ...props, ...routeProps }} />}
            </Route>
            <Route exact path={`${URL_CARE_TEAM}/:careTeamId`}>
              {(routeProps) => <CareTeamList {...{ ...props, ...routeProps }} />}
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
    nock(props.fhirBaseURL)
      .get(`/${careTeamResourceType}/_search`)
      .query({
        _total: 'accurate',
        _getpagesoffset: 0,
        _count: 20,
      })
      .reply(200, careTeams)
      .persist();

    const history = createMemoryHistory();
    history.push(URL_CARE_TEAM);

    const { getByText, queryByText } = render(
      <Router history={history}>
        <AppWrapper {...props} />
      </Router>
    );

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(document.querySelector('title')).toMatchInlineSnapshot(`
      <title>
        FHIR Care Team
      </title>
    `);

    document.querySelectorAll('tr').forEach((tr, idx) => {
      tr.querySelectorAll('td').forEach((td) => {
        expect(td).toMatchSnapshot(`table row ${idx} page 1`);
      });
    });

    // view details
    nock(props.fhirBaseURL)
      .get(`/${careTeamResourceType}/_search`)
      .query({ _id: '308', _include: 'CareTeam:*' })
      .reply(200, careTeam4214)
      .persist();

    // target the initial row view details
    const dropdown = document.querySelector(
      'tbody tr:nth-child(1) [data-testid="action-dropdown"]'
    ) as Element;
    fireEvent.click(dropdown);

    const viewDetailsLink = getByText(/View Details/);
    expect(viewDetailsLink).toMatchInlineSnapshot(`
      <span>
        View Details
      </span>
    `);
    fireEvent.click(viewDetailsLink);
    expect(history.location.pathname).toEqual('/admin/CareTeams');
    expect(history.location.search).toEqual('?viewDetails=308');

    await waitForElementToBeRemoved(queryByText(/Fetching Care team/i));
    document.querySelectorAll('.display-block').forEach((block) => {
      expect(block).toMatchSnapshot('view details display block');
    });

    // close view details
    const closeButton = document.querySelector('[data-testid="cancel"]');
    fireEvent.click(closeButton);
  });
});
