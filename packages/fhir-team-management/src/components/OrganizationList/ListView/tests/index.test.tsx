import { OrganizationList } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitForElementToBeRemoved, waitFor } from '@testing-library/dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  organizationResourceType,
  ORGANIZATION_LIST_URL,
  practitionerRoleResourceType,
  organizationAffiliationResourceType,
} from '../../../../constants';
import {
  assignedPractitionerRole,
  organizationSearchPage1,
  organizationsPage1,
  organizationsPage2,
} from './fixtures';
import userEvents from '@testing-library/user-event';
import { allAffiliations } from '../../../OrganizationAffiliation/tests/fixures';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';

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

nock.disableNetConnect();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const props = {
  fhirBaseURL: 'http://test.server.org',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <RoleContext.Provider value={superUserRole}>
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route exact path={`${ORGANIZATION_LIST_URL}`}>
              {(routeProps) => <OrganizationList {...{ ...props, ...routeProps }} />}
            </Route>
            <Route exact path={`${ORGANIZATION_LIST_URL}/:id`}>
              {(routeProps) => <OrganizationList {...{ ...props, ...routeProps }} />}
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

test('renders correctly when listing organizations', async () => {
  const history = createMemoryHistory();
  history.push(ORGANIZATION_LIST_URL);

  nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .reply(200, organizationsPage1)
    .persist();

  nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _total: 'accurate', _getpagesoffset: 20, _count: 20 })
    .reply(200, organizationsPage2);

  nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _total: 'accurate', _getpagesoffset: 0, _count: 20, 'name:contains': '345' })
    .reply(200, organizationSearchPage1);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const waitForSpinner = async () => {
    return await waitFor(() => {
      expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    });
  };

  expect(document.querySelector('title')).toMatchInlineSnapshot(`
    <title>
      Organization list
    </title>
  `);

  expect(document.querySelector('.page-header')).toMatchSnapshot('Header title');

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  fireEvent.click(screen.getByTitle('2'));

  expect(history.location.search).toEqual('?pageSize=20&page=2');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 2`);
    });
  });

  // works with search as well.
  const searchForm = document.querySelector('[data-testid="search-form"]');
  await userEvents.type(searchForm, '345');

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

  // view details
  nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/205`)
    .reply(200, organizationSearchPage1.entry[0].resource);
  nock(props.fhirBaseURL)
    .get(`/${practitionerRoleResourceType}/_search`)
    .query({
      _include: 'PractitionerRole:practitioner',
      organization: `205`,
    })
    .reply(200, assignedPractitionerRole);

  // affiliations
  nock(props.fhirBaseURL)
    .get(`/${organizationAffiliationResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${organizationAffiliationResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, allAffiliations);

  // target the initial row view details
  const dropdown = document.querySelector('tbody tr:nth-child(1) [data-testid="action-dropdown"]');
  fireEvent.click(dropdown);

  const viewDetailsLink = screen.getByText(/View Details/);
  expect(viewDetailsLink).toMatchInlineSnapshot(`
    <span>
      View Details
    </span>
  `);
  fireEvent.click(viewDetailsLink);
  expect(history.location.search).toEqual('?pageSize=20&page=1&viewDetails=205');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // wait for affiliations to finish loading
  await waitFor(() => {
    const fetchingLocations = screen.queryByText(/Fetching assigned locations/);
    expect(fetchingLocations).not.toBeInTheDocument();
  });

  // see details in viewDetails
  document.querySelectorAll('.singleKeyValue-pair').forEach((pair) => {
    expect(pair).toMatchSnapshot('single key value pairs detail section');
  });

  // As organization 205 has no assigned locations
  expect(
    screen.queryByText(/Organization does not have any assigned locations/)
  ).toBeInTheDocument();

  // close view details
  const closeButton = document.querySelector('[data-testid="close-button"]');
  fireEvent.click(closeButton);

  expect(history.location.pathname).toEqual('/admin/teams');

  expect(nock.isDone()).toBeTruthy();
});

test('responds as expected to errors', async () => {
  const history = createMemoryHistory();
  history.push(ORGANIZATION_LIST_URL);

  nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _total: 'accurate', _getpagesoffset: 0, _count: 20 })
    .replyWithError('coughid');

  render(
    <Router history={history}>
      <AppWrapper debugKey="responds" {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/coughid/)).toBeInTheDocument();
});
