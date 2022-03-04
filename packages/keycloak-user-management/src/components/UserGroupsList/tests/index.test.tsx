/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import { mount, shallow } from 'enzyme';
import { UserGroupsList } from '..';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as opensrpStore from '@opensrp/store';
import { Provider } from 'react-redux';
import * as notifications from '@opensrp/notifications';
import {
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
  removeKeycloakUserGroups,
} from '../../../ducks/userGroups';
import { unsortedUserGroups, userGroups } from '../../../ducks/tests/fixtures';
import { URL_USER_GROUPS } from '../../../constants';
import lang from '../../../lang';

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/store'),
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createMemoryHistory();
history.push(URL_USER_GROUPS);

const locationProps = {
  history,
  location: {
    hash: '',
    pathname: `${URL_USER_GROUPS}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { userGroupId: null },
    path: `${URL_USER_GROUPS}`,
    url: `${URL_USER_GROUPS}`,
  },
};

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

describe('components/UserGroupsList', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
    opensrpStore.store.dispatch(removeKeycloakUserGroups());
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

  it('renders users table without crashing', () => {
    shallow(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserGroupsList
            {...locationProps}
            keycloakBaseURL="https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage"
          />
        </Router>
      </Provider>
    );
  });
  it('works correctly with store', async () => {
    fetch.once(JSON.stringify(userGroups));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserGroupsList {...props} />
        </Router>
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
    fetch.once(JSON.stringify(userGroups));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserGroupsList {...props} />
        </Router>
      </Provider>
    );
    // Loader should be displayed
    expect(toJson(wrapper.find('[data-testid="group-list-loader"]'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // Loader should be hidden
    expect(toJson(wrapper.find('[data-testid="group-list-loader"]'))).toBeFalsy();

    const userList = wrapper.find('UserGroupsList');
    const headerRow = userList.find('Row').at(0);

    expect(headerRow.find('Col').at(0).text()).toMatchSnapshot('header actions col props');
    expect(headerRow.find('Table').first().text()).toMatchSnapshot('table text');
    expect(userList.find('tbody tr')).toHaveLength(4);
    expect(userList.find('tbody').text()).toMatchSnapshot(
      'full table body has 4 user group entries'
    );
    wrapper.unmount();
  });

  it('handles user group list fetch failure', async () => {
    fetch.mockReject(new Error('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserGroupsList {...props} />
        </Router>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('shows table with no data if user groups list from api is empty', async () => {
    fetch.once(JSON.stringify([]));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserGroupsList {...props} />
        </Router>
      </Provider>
    );
    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    //Table should be empty
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const userList = wrapper.find('UserGroupsList');
    expect(userList.find('Table').first().text()).toEqual('NameActionsNo Data');
    wrapper.unmount();
  });

  it('sorts by group name', async () => {
    fetch.once(JSON.stringify(unsortedUserGroups));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserGroupsList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    // Default order
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('New Group');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual('Admin');
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual(
      'Test User Group'
    );
    expect(wrapper.find('tbody').find('tr').at(3).find('td').at(0).text()).toEqual('Super User');

    // Ascending
    wrapper.find('thead th').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('Admin');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual('New Group');
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual('Super User');
    expect(wrapper.find('tbody').find('tr').at(3).find('td').at(0).text()).toEqual(
      'Test User Group'
    );

    //Descending
    wrapper.find('thead th').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual(
      'Test User Group'
    );
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual('Super User');
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual('New Group');
    expect(wrapper.find('tbody').find('tr').at(3).find('td').at(0).text()).toEqual('Admin');
    wrapper.unmount();
  });

  it('correctly redirects to user group detail view url', async () => {
    fetch.once(JSON.stringify(userGroups));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserGroupsList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    wrapper.find('Dropdown').at(0).simulate('click');
    wrapper.update();
    wrapper.find('.viewdetails').at(0).simulate('click');
    wrapper.update();
    // Redirect to user group detail view
    expect(history.location.pathname).toEqual(URL_USER_GROUPS);
  });
});
