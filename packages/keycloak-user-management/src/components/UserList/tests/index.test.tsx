/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import fetch from 'jest-fetch-mock';
import * as fixtures from '../../forms/UserForm/tests/fixtures';
import { mount, shallow } from 'enzyme';
import { ConnectedUserList, UserList } from '..';
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
import { keycloakUsersArray, keycloakUsersArray1 } from '../../forms/UserForm/tests/fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import { URL_USER } from '../../../constants';
import lang from '../../../lang';

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/store')),
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

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

describe('components/UserList', () => {
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'simple-token', state: 'abcde' } }
      )
    );
  });

  it('renders users table without crashing', () => {
    shallow(<UserList {...locationProps} />);
  });
  it('works correctly with store', async () => {
    fetch.once(JSON.stringify(4));
    fetch.once(JSON.stringify(fixtures.keycloakUsersArray));
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
      usersPageSize: 20,
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
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
    fetch.once(JSON.stringify(4));
    fetch.once(JSON.stringify(keycloakUsersArray));
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
      usersPageSize: 20,
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
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

    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/count',
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
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users?first=0&max=20',
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

    const userList = wrapper.find('UserList');
    const headerRow = userList.find('Row').at(0);

    expect(headerRow.find('Col').at(0).text()).toMatchSnapshot('header actions col props');
    expect(headerRow.find('Table').first().text()).toMatchSnapshot('table text');
    // look for pagination
    expect(wrapper.find('Pagination').at(0).text()).toMatchInlineSnapshot(`"120 / page"`);
    wrapper.unmount();
  });

  it('search works correctly', async () => {
    fetch.once(JSON.stringify(4));
    fetch.once(JSON.stringify(keycloakUsersArray));
    const props = {
      ...locationProps,
      location: {
        ...locationProps.location,
        search: '?searchQuery=opensrp',
      },
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
      usersPageSize: 20,
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const search = wrapper.find('.search-input-wrapper');
    // fireEvent.change(search, { target: { value: 'opensrp' } });
    await act(async () => {
      search.find('.ant-input').simulate('change', { target: { value: 'test' } });
    });
    await flushPromises();
    wrapper.update();
    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/count',
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
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users?first=0&max=20&search=opensrp',
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
    fetch.once(JSON.stringify(7));
    fetch.once(JSON.stringify([...keycloakUsersArray, ...keycloakUsersArray1]));
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
      usersPageSize: 5,
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
        </Router>
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
      `"User ManagementAdd UserUsernameEmailFirst NameLast NameActionszkaliminaZembaKaliminaEditzkapeleZyingaKapeleEdit125 / pageGo to)"`
    );
  });

  it('redirects to new user form', async () => {
    const historyPushMock = jest.spyOn(history, 'push');
    fetch.once(JSON.stringify(4));
    fetch.once(JSON.stringify(fixtures.keycloakUsersArray));
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
      usersPageSize: 20,
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // expect(toJson(wrapper.find('.create-user').at(1))).toEqual('');
    wrapper.find('.create-user').at(0).simulate('click');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users/new');
  });

  it('handles user list fetch failure', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    fetch.mockReject(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
        </Router>
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
      `"User ManagementAdd UserUsernameEmailFirst NameLast NameActionsNo Data)"`
    );
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });
});
