/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import fetch from 'jest-fetch-mock';
import * as fixtures from '../../forms/UserForm/tests/fixtures';
import { mount } from 'enzyme';
import { ConnectedUserList } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as opensrpStore from '@opensrp/store';
import { Provider } from 'react-redux';
import { KeycloakService } from '@opensrp/keycloak-service';
import * as notifications from '@opensrp/notifications';
import {
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
  fetchKeycloakUsers,
  removeKeycloakUsers,
} from '../../../ducks/user';
import {
  keycloakUsersArray,
  keycloakUsersArray1,
  practitioner1,
  organization,
} from '../../forms/UserForm/tests/fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import { URL_USER } from '../../../constants';
import { QueryClient, QueryClientProvider } from 'react-query';
import { superUserRole } from '@opensrp/test-utils';
import { RoleContext } from '@opensrp/rbac';

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/store')),
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

describe('components/UserList', () => {
  const locationProps = {
    history,
    location: {
      hash: '',
      pathname: `${URL_USER}`,
      search: '',
      state: {},
    },
    match: {
      isExact: true,
      params: {},
      path: `${URL_USER}`,
      url: `${URL_USER}`,
    },
  };

  const props = {
    ...locationProps,
    extraData: {
      user_id: fixtures.keycloakUser.id,
    },
    fetchKeycloakUsersCreator: fetchKeycloakUsers,
    removeKeycloakUsersCreator: removeKeycloakUsers,
    serviceClass: KeycloakService,
    keycloakBaseURL: 'https://some-keycloak.server/auth/admin/realms/some-realm',
    opensrpBaseURL: 'https://some-opensrp.server/app/',
    usersPageSize: 20,
  };

  beforeEach(() => {
    fetch.resetMocks();
    opensrpStore.store.dispatch(removeKeycloakUsers());
  });

  beforeAll(() => {
    opensrpStore.store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'simple-token', state: 'abcde' } }
      )
    );
  });

  it('works correctly with store', async () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.keycloakUsersArray));
    fetch.mockResponseOnce(JSON.stringify(4));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <RoleContext.Provider value={superUserRole}>
              <RoleContext.Provider value={superUserRole}>
                <ConnectedUserList {...props} />
              </RoleContext.Provider>
            </RoleContext.Provider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('Table')).toBeTruthy();
    expect(wrapper.text()).toMatchSnapshot('full rendered text');
    wrapper.unmount();
  });

  it('renders user list correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(fixtures.keycloakUsersArray));
    fetch.mockResponseOnce(JSON.stringify(4));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <RoleContext.Provider value={superUserRole}>
              <ConnectedUserList {...props} />
            </RoleContext.Provider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );
    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // Loader should be hiddern
    expect(toJson(wrapper.find('.ant-spin'))).toBeFalsy();

    expect(fetch.mock.calls.map((call) => call[0])).toMatchObject([
      'https://some-keycloak.server/auth/admin/realms/some-realm/users?first=0&max=20',
      'https://some-keycloak.server/auth/admin/realms/some-realm/users/count',
    ]);

    const userList = wrapper.find('UserList');
    const headerRow = userList.find('Row').at(0);

    expect(headerRow.find('Col').at(0).text()).toMatchSnapshot('header actions col props');
    expect(headerRow.find('Table').first().text()).toMatchSnapshot('table text');
    // look for the delete button and click, expect that the removed user is not present in the final render.
    // look for pagination
    expect(wrapper.find('Pagination').at(0).text()).toMatchInlineSnapshot(`"120 / page"`);
    wrapper.unmount();
  });

  it('search works correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(keycloakUsersArray));
    fetch.mockResponseOnce(JSON.stringify(4));

    const newProps = {
      ...props,
      location: {
        ...props.location,
        search: '?searchQuery=opensrp',
      },
    };

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <RoleContext.Provider value={superUserRole}>
              <ConnectedUserList {...newProps} />
            </RoleContext.Provider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // const search = wrapper.find('.search-input-wrapper').find('.ant-input');
    const search = wrapper.find('input').first();
    await act(async () => {
      search.simulate('change', { target: { value: 'test' } });
      wrapper.update();
    });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(history.location.search).toEqual('?searchQuery=test');
    expect(fetch.mock.calls).toMatchObject([
      [
        'https://some-keycloak.server/auth/admin/realms/some-realm/users?first=0&max=20&search=opensrp',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer simple-token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://some-keycloak.server/auth/admin/realms/some-realm/users/count?search=opensrp',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer simple-token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('pagination works', async () => {
    const data = [...keycloakUsersArray, ...keycloakUsersArray1];
    fetch.mockResponseOnce(JSON.stringify(data.slice(0, 5)));
    fetch.mockResponseOnce(JSON.stringify(7));
    fetch.mockResponseOnce(JSON.stringify(data.slice(5, 10)));
    fetch.mockResponseOnce(JSON.stringify(7));

    const newProps = {
      ...props,
      usersPageSize: 5,
    };
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <RoleContext.Provider value={superUserRole}>
              <ConnectedUserList {...newProps} />
            </RoleContext.Provider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('.ant-pagination-item-2').simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"User ManagementAdd UserFirst NameLast NameUsernameActionsZembaKaliminazkaliminaEditZyingaKapelezkapeleEdit125 / pageGo toPage"`
    );
  });

  it('redirects to new user form', async () => {
    const historyPushMock = jest.spyOn(history, 'push');
    fetch.mockResponseOnce(JSON.stringify(fixtures.keycloakUsersArray));
    fetch.mockResponseOnce(JSON.stringify(4));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <RoleContext.Provider value={superUserRole}>
              <ConnectedUserList {...props} />
            </RoleContext.Provider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // expect(toJson(wrapper.find('.create-user').at(1))).toEqual('');
    wrapper.find('.create-user button').at(0).simulate('click');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users/new');
  });

  it('handles user list fetch failure', async () => {
    fetch.mockReject(new Error('API is down'));

    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    const newProps = {
      ...props,
      usersPageSize: undefined,
    };

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <RoleContext.Provider value={superUserRole}>
              <ConnectedUserList {...newProps} />
            </RoleContext.Provider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    /**
     * Loader should not be displayed
     * since we've set loading to false
     * on the final block
     */
    expect(toJson(wrapper.find('div.lds-ripple'))).toBeFalsy();
    // check that table has No Data
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"User ManagementAdd UserFirst NameLast NameUsernameActionsNo data"`
    );
    expect(mockNotificationError).toHaveBeenCalledWith('There was a problem fetching Users');
  });

  it('sorting works', async () => {
    fetch.mockResponseOnce(JSON.stringify(keycloakUsersArray));
    fetch.mockResponseOnce(JSON.stringify(4));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <RoleContext.Provider value={superUserRole}>
              <ConnectedUserList {...props} />
            </RoleContext.Provider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // get ordered tr keys
    const rowKeys = wrapper.find('tr[data-row-key]').map((row) => row.props()['data-row-key']);
    expect(rowKeys).toMatchObject([
      '97f36061-52fb-4474-88f2-fd286311ff1d',
      '80385001-f385-42ec-8edf-8591dc181a54',
      '520b579e-70e9-4ae9-b1f8-0775c605b8d2',
      'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    ]);

    // trigger sort on second column
    const sorter = wrapper.find('th.ant-table-column-has-sorters').at(1);
    sorter.simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // get newly ordered tr keys
    const rowKeys2 = wrapper.find('tr[data-row-key]').map((row) => row.props()['data-row-key']);
    expect(rowKeys2).toMatchObject([
      '80385001-f385-42ec-8edf-8591dc181a54',
      'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      '97f36061-52fb-4474-88f2-fd286311ff1d',
      '520b579e-70e9-4ae9-b1f8-0775c605b8d2',
    ]);

    wrapper.unmount();
  });

  it('user details render correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(keycloakUsersArray));
    fetch.mockResponseOnce(JSON.stringify(keycloakUsersArray.length));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <RoleContext.Provider value={superUserRole}>
              <ConnectedUserList {...props} />
            </RoleContext.Provider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find view details button
    const table = wrapper.find('TableActions');
    const dropdown = table.find('Dropdown').first();
    const options = dropdown.find('.more-options [data-testid="action-dropdown"]').first();

    expect(options).toHaveLength(1);
    options.simulate('click');

    const items = wrapper.find('[data-testid="viewDetails"]').last();

    fetch.mockResponseOnce(JSON.stringify(practitioner1));
    fetch.mockResponseOnce(JSON.stringify(organization));

    // click view details
    items.simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find the user details
    expect(wrapper.find('#username').text()).toEqual(keycloakUsersArray[0].username);
    expect(wrapper.find('#keycloakId').text()).toEqual(keycloakUsersArray[0].id);
    expect(wrapper.find('#practitionerId').text()).toEqual(practitioner1.identifier);
    expect(wrapper.find('#practitionerStatus').text()).toMatchInlineSnapshot(`"active"`);
    const assignedTeams = wrapper.find('#assignedTeam').map((team) => team.text());
    expect(assignedTeams).toEqual(organization.map((team) => team.name));
  });
});
