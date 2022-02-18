/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import { mount, shallow } from 'enzyme';
import { UserRolesList } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as opensrpStore from '@opensrp/store';
import { Provider } from 'react-redux';
import * as notifications from '@opensrp/notifications';
import {
  reducerName as keycloakUserRolesReducerName,
  reducer as keycloakUserRolesReducer,
  removeKeycloakUserRoles,
} from '../../../ducks/userRoles';
import { userRoles } from '../../../ducks/tests/fixtures';
import { URL_USER_ROLES } from '../../../constants';
import lang from '../../../lang';
import { unorderedUserRoles } from './fixtures';

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/store'),
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

const locationProps = {
  history,
  location: {
    hash: '',
    pathname: `${URL_USER_ROLES}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: {},
    path: `${URL_USER_ROLES}`,
    url: `${URL_USER_ROLES}`,
  },
};

reducerRegistry.register(keycloakUserRolesReducerName, keycloakUserRolesReducer);

describe('components/UserRolesList', () => {
  beforeEach(() => {
    fetch.resetMocks();
    opensrpStore.store.dispatch(removeKeycloakUserRoles());
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'simple-token', state: 'abcde' } }
      )
    );
  });

  it('renders users table without crashing', () => {
    shallow(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList
            {...locationProps}
            keycloakBaseURL="https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage"
          />
        </Router>
      </Provider>
    );
  });
  it('works correctly with store', async () => {
    fetch.once(JSON.stringify(userRoles));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList {...props} />
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
    fetch.once(JSON.stringify(userRoles));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList {...props} />
        </Router>
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

    const userList = wrapper.find('UserRolesList');
    const headerRow = userList.find('Row').at(0);

    expect(headerRow.find('Col').at(0).text()).toMatchSnapshot('header actions col props');
    expect(headerRow.find('Table').first().text()).toMatchSnapshot('table text');
    expect(userList.find('tbody tr')).toHaveLength(5);
    expect(userList.find('tbody').text()).toMatchSnapshot(
      'full table body has 8 user role entries'
    );
    wrapper.unmount();
  });

  it('handles user role list fetch failure', async () => {
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
          <UserRolesList {...props} />
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

  it('shows table with no data if user roles list from api is empty', async () => {
    fetch.once(JSON.stringify([]));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList {...props} />
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

    const userList = wrapper.find('UserRolesList');
    expect(userList.find('Table').first().text()).toEqual('NameCompositeDescriptionNo Data');
  });

  it('sorts by role name', async () => {
    fetch.once(JSON.stringify(unorderedUserRoles));

    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    // Default order
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('ALL_EVENTS');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'PLANS_FOR_USER'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual(
      'EDIT_KEYCLOAK_USERS'
    );

    // Ascending
    wrapper.find('thead th').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('ALL_EVENTS');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'EDIT_KEYCLOAK_USERS'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual(
      'PLANS_FOR_USER'
    );

    //Descending
    wrapper.find('thead th').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual(
      'PLANS_FOR_USER'
    );
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'EDIT_KEYCLOAK_USERS'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual('ALL_EVENTS');
    wrapper.unmount();
  });
});
