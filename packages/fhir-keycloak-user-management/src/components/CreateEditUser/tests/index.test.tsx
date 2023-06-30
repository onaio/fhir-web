/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  CreateEditUser,
  getGroup,
  createEditGroupResource,
  practitionerUpdater,
  getPractitioner,
  getPractitionerRole,
} from '..';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import nock from 'nock';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import fetch from 'jest-fetch-mock';
import {
  keycloakUser,
  practitioner,
  updatedPractitioner,
  userGroup,
  group,
  updatedGroup,
  practitionerRoleBundle,
  updatedPractitionerRole,
  compositionResource,
} from './fixtures';
import userEvent from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import { practitionerResourceType, practitionerRoleResourceType } from '../../../constants';
import { fetchKeycloakUsers } from '@opensrp/user-management';
import { history } from '@onaio/connected-reducer-registry';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => 'acb9d47e-7247-448f-be93-7a193a5312da',
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const props = {
  baseUrl: 'http://test.server.org',
  keycloakBaseURL: 'http://test-keycloak.server.org',
  history,
  location: {
    hash: '',
    pathname: '/users/edit',
    search: '',
    state: '',
  },
  match: {
    isExact: true,
    params: { userId: keycloakUser.id },
    path: `/add/:id`,
    url: `/add/${keycloakUser.id}`,
  },
  keycloakUser,
  extraData: {},
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  getPractitionerFun: getPractitioner,
  getPractitionerRoleFun: getPractitionerRole,
  postPutPractitionerFactory: practitionerUpdater,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/add">
            <CreateEditUser {...props} />
          </Route>
          <Route exact path="/add/:id">
            <CreateEditUser {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  nock.cleanAll();
  fetch.resetMocks();
  jest.resetAllMocks();
});

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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

test('renders correctly for edit user', async () => {
  const history = createMemoryHistory();
  history.push('/add/id');

  fetch.once(JSON.stringify(userGroup)).once(JSON.stringify(keycloakUser)).once(JSON.stringify([]));
  fetch.mockResponses(JSON.stringify([]));

  nock(props.baseUrl)
    .get(`/${practitionerResourceType}/_search`)
    .query({
      identifier: keycloakUser.id,
    })
    .reply(200, practitioner);

  nock(props.baseUrl)
    .get('/PractitionerRole/_search')
    .query({
      identifier: keycloakUser.id,
    })
    .reply(200, practitionerRoleBundle);

  nock(props.baseUrl)
    .put(`/${practitionerResourceType}/${updatedPractitioner.id}`, updatedPractitioner)
    .reply(200, updatedPractitioner);

  nock(props.baseUrl)
    .put(
      `/${practitionerRoleResourceType}/${practitionerRoleBundle.entry[0].resource.id}`,
      updatedPractitionerRole
    )
    .reply(200, {});

  nock(props.baseUrl)
    .get(`/Group/_search`)
    .query({
      identifier: keycloakUser.id,
    })
    .reply(200, group);

  nock(props.baseUrl)
    .put('/Group/acb9d47e-7247-448f-be93-7a193a5312da', updatedGroup)
    .reply(200, {});

  nock(props.baseUrl)
    .get(`/Composition/_search`)
    .query({
      _getpagesoffset: '0',
      _count: '20',
      type: `http://snomed.info/sct|1156600005`,
      _elements: 'identifier,title',
    })
    .reply(200, compositionResource)
    .persist();

  const successStub = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(jest.fn);

  const errorStub = jest.spyOn(notifications, 'sendErrorNotification').mockImplementation(jest.fn);

  const { getByTestId, getByText, queryByTitle } = render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  expect(getByTestId('custom-create-user-spinner')).toBeInTheDocument();

  await waitFor(() => {
    expect(getByText(/User Type/)).toBeInTheDocument();
  });

  expect(fetch.mock.calls.map((req) => req[0])).toEqual([
    'http://test-keycloak.server.org/groups',
    'http://test-keycloak.server.org/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    'http://test-keycloak.server.org/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b/groups',
  ]);

  // simulate first Name change
  const firstNameInput = document.querySelector('input#firstName');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  userEvent.type(firstNameInput!, 'flotus');

  const lastNameInput = document.querySelector('input#lastName');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  userEvent.type(lastNameInput!, 'plotus');

  const emailInput = document.querySelector('input#email');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  userEvent.type(emailInput!, 'flotus@plotus.duck');

  const usernameInput = document.querySelector('input#username');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  userEvent.type(usernameInput!, 'flopo');

  // change mark as practitioner to tue
  const yesMarkPractitioner = document.querySelectorAll('input[name="active"]')[0];
  userEvent.click(yesMarkPractitioner);

  const markSupervisor = document.querySelectorAll('input[name="userType"]')[1];
  userEvent.click(markSupervisor);

  const submitButton = document.querySelector('button[type="submit"]');

  // find antd Select with id 'fhirCoreAppId' in the 'Form' component
  const appIdSection = document.querySelector('[data-testid="fhirCoreAppId"]') as Element;

  // click on input. - should see the first 5 records by default
  const appIdInput = appIdSection.querySelector('.ant-select-selector') as Element;

  // simulate click on select - to show dropdown items
  fireEvent.mouseDown(appIdInput);

  // await waitForElementToBeRemoved(appIdSection.querySelector('.anticon-spin'));
  await waitFor(() => {
    const spin = appIdSection.querySelector('.anticon-spin');
    expect(spin).toBeNull();
  });

  fireEvent.click(queryByTitle('Device configurations(cha)') as Element);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  fireEvent.click(submitButton!);

  // need not concern ourselves with groups, should be tested in user-management package

  await waitFor(() => {
    expect(errorStub.mock.calls).toEqual([]);
    expect(successStub.mock.calls).toEqual([
      ['User edited successfully'],
      ['Practitioner updated successfully'],
      ['User Group edited successfully'],
      ['Group resource updated successfully'],
      ['PractitionerRole updated successfully'],
    ]);
  });

  expect(
    fetch.mock.calls.map((call) => ({
      endpoint: call[0],
      method: call[1]?.method,
    }))
  ).toEqual([
    { endpoint: 'http://test-keycloak.server.org/groups', method: 'GET' },
    {
      endpoint: 'http://test-keycloak.server.org/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      method: 'GET',
    },
    {
      endpoint: 'http://test-keycloak.server.org/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b/groups',
      method: 'GET',
    },
    {
      endpoint: 'http://test-keycloak.server.org/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      method: 'PUT',
    },
  ]);
});

test('it fetches groups', async () => {
  nock(props.baseUrl)
    .get(`/Group/_search`)
    .query({
      identifier: keycloakUser.id,
    })
    .reply(200, group);

  const fetchGroup = await getGroup(props.baseUrl, keycloakUser.id);
  expect(fetchGroup).toEqual(group.entry[0].resource);
});

test('it creates a group resource', async () => {
  const successMessage = { message: 'Successfully created' };

  nock(props.baseUrl).put(`/Group/${updatedGroup.id}`, updatedGroup).reply(200, successMessage);

  const successStub = jest.fn();
  const errorStub = jest.fn();

  await createEditGroupResource(
    updatedGroup.active,
    updatedGroup.identifier[1].value,
    updatedGroup.name,
    updatedGroup.member[0].entity.reference.split('/')[1],
    props.baseUrl
  )
    .then((resp) => successStub(resp))
    .catch(() => errorStub());

  await waitFor(() => {
    expect(errorStub).not.toHaveBeenCalled();
    expect(successStub).toHaveBeenCalledWith(successMessage);
  });
});
