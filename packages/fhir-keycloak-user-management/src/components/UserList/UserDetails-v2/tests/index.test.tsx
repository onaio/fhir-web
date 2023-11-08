import { UserDetails } from '../';
import {
  cleanup,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from 'react-query';
import { authenticateUser } from '@onaio/session-reducer';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';
import { store } from '@opensrp/store';
import {
  URL_USER,
  UserList,
  URL_USER_CREDENTIALS,
  UserCredentials,
  KEYCLOAK_URL_USERS,
  KEYCLOAK_URL_USER_GROUPS,
} from '@opensrp/user-management';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Router } from 'react-router';
import { createMemoryHistory } from 'history';
import {
  keycloakGroupEndpoint,
  keycloakMembersEndpoint,
  practitionerDetailsResourceType,
  practitionerResourceType,
} from '../../../../constants';
import {
  practitionerDetailsBundle,
  user1147,
  user1147Groups,
} from '../ViewDetailResources/tests/fixtures';
import * as notifications from '@opensrp/notifications';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');
global.fetch = fetch;

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
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
  keycloakBaseURL: 'http://test-keycloak.server.org',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RoleContext.Provider value={superUserRole}>
          <Switch>
            {/* <Route exact path={`${URL_USER}`}>
              {(routeProps) => <UserList {...{ ...props, ...routeProps }} />}
            </Route> */}
            <Route exact path={`${URL_USER}/:id`}>
              {(routeProps) => <UserDetails {...{ ...props, ...routeProps }} />}
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
      {
        api_token: 'hunter2',
        oAuth2Data: {
          access_token: 'sometoken',
          state: 'abcde',
        },
        user_id: 'userFixtures[0].id',
      }
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

/***
 * End of setup.
 */
const userId = 'userId';
test('Renders without crashing', async () => {
  const history = createMemoryHistory();
  history.push(`${URL_USER}/${userId}`);

  const successMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => {
      return;
    });

  nock(props.fhirBaseURL)
    .get(`/${practitionerDetailsResourceType}/_search`)
    .query({ 'keycloak-uuid': userId })
    .reply(200, practitionerDetailsBundle);

  nock(props.keycloakBaseURL).get(`${KEYCLOAK_URL_USERS}/${userId}`).reply(200, user1147);

  nock(props.keycloakBaseURL)
    .get(`${KEYCLOAK_URL_USERS}/${userId}${KEYCLOAK_URL_USER_GROUPS}`)
    .reply(200, user1147Groups);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  // this only await the first call to get the users.
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.queryByTitle(/View details/i)).toBeInTheDocument();

  // second page header details.
  const userProfile = screen.getByTestId('user-profile');
  const textContent = userProfile.textContent;
  expect(textContent).toEqual(
    '1147EnabledDeleteEditID9f72c646-dc1e-4f24-98df-6f04373b9ec6First Nametest1147Last Name1147Username1147Emailmejay2303@gmail.comVerifiedFalseAttributesfhir_core_app_id["ecbis"]'
  );

  // have a look at the tabs

  // start with group
  const groupTab = screen.getByText('Groups');
  await fireEvent.click(groupTab);

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // check table has correct number of rows. and try removing user from one group
  let detailsTabSection = document.querySelector('.details-tab');
  const groupsTable = detailsTabSection?.querySelector('table');

  const tableData = [...(groupsTable?.querySelectorAll('tr') ?? [])].map((tr) => tr.textContent);
  expect(tableData).toEqual(['NamePath', 'SuperUser/SuperUserLeave']);

  const leaveBtn = screen.getByText('Leave');
  expect(leaveBtn).toMatchInlineSnapshot(`
    <span>
      Leave
    </span>
  `);

  nock(props.keycloakBaseURL)
    .delete(`${KEYCLOAK_URL_USERS}/${userId}${KEYCLOAK_URL_USER_GROUPS}/${user1147Groups[0].id}`)
    .reply(200, user1147Groups);

  await fireEvent.click(leaveBtn);

  await waitFor(() => {
    expect(successMock).toHaveBeenCalledWith('User was removed from the keycloak group');
  });

  // go to practitioners
  const practTab = screen.getByText('Practitioners');
  await fireEvent.click(practTab);

  // Check that practitioner-details has finished loading.
  await waitFor(() => {
    expect(screen.getByText('3a801d6e-7bd3-4a5f-bc9c-64758fbb3dad')).toBeInTheDocument();
  });

  // practitioner records
  detailsTabSection = document.querySelector('div.ant-tabs-tabpane-active');
  const practitionerTable = detailsTabSection?.querySelector('table');

  const practitionerData = [...(practitionerTable?.querySelectorAll('tr') ?? [])].map(
    (tr) => tr.textContent
  );
  expect(practitionerData).toEqual([
    'IdNameActiveUser TypePractitioner Role Coding',
    '3a801d6e-7bd3-4a5f-bc9c-64758fbb3dadtest1147 1147ActivepractitionerAssigned practitioner(http://snomed.info/sct|405623001), ',
  ]);

  // go to careTeams
  const careTeamsTab = screen.getByText('CareTeams');
  await fireEvent.click(careTeamsTab);

  // practitioner records
  detailsTabSection = document.querySelector('div.ant-tabs-tabpane-active');
  const careTeamsTable = detailsTabSection?.querySelector('table');

  const careTeamsData = [...(careTeamsTable?.querySelectorAll('tr') ?? [])].map(
    (tr) => tr.textContent
  );
  expect(careTeamsData).toEqual(['IdNameStatusCategory', 'No data']);

  // go to organization
  const organizationsTab = screen.getByText('Organizations');
  await fireEvent.click(organizationsTab);

  // practitioner records
  detailsTabSection = document.querySelector('div.ant-tabs-tabpane-active');
  const organizationsTable = detailsTabSection?.querySelector('table');

  const organizationsData = [...(organizationsTable?.querySelectorAll('tr') ?? [])].map(
    (tr) => tr.textContent
  );
  expect(organizationsData).toEqual([
    'IdNameActiveType',
    '0d7ae048-9b84-4f0c-ba37-8d6c0b97dc84e2e-corporationActive(http://terminology.hl7.org/CodeSystem/organization-type|team), ',
  ]);
});

test('Edit button works correctly', async () => {
  const history = createMemoryHistory();
  history.push(`${URL_USER}/${userId}`);

  const successMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => {
      return;
    });

  nock(props.fhirBaseURL)
    .get(`/${practitionerDetailsResourceType}/_search`)
    .query({ 'keycloak-uuid': userId })
    .reply(200, practitionerDetailsBundle);

  nock(props.keycloakBaseURL).get(`${KEYCLOAK_URL_USERS}/${userId}`).reply(200, user1147);

  nock(props.keycloakBaseURL)
    .get(`${KEYCLOAK_URL_USERS}/${userId}${KEYCLOAK_URL_USER_GROUPS}`)
    .reply(200, user1147Groups);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  // this only await the first call to get the users.
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.queryByTitle(/View details/i)).toBeInTheDocument();

  const editBtn = screen.getByRole('button', {name: "Edit"})
  fireEvent.click(editBtn);

  expect(history.location.pathname).toEqual("/admin/users/edit/userId")
});