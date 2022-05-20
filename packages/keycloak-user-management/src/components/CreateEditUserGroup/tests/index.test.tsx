import reducerRegistry from '@onaio/redux-reducer-registry';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import * as opensrpStore from '@opensrp/store';
import * as fixtures from './fixtures';
import flushPromises from 'flush-promises';
import * as notifications from '@opensrp/notifications';
import fetch from 'jest-fetch-mock';
import { defaultInitialValues } from '../Form';
import toJson from 'enzyme-to-json';
import {
  reducer,
  reducerName,
  fetchKeycloakUserGroups,
  removeKeycloakUserGroups,
  makeKeycloakUserGroupsSelector,
} from '../../../ducks/userGroups';
import {
  reducer as rolesReducer,
  reducerName as rolesReducername,
  removeKeycloakUserRoles,
} from '../../../ducks/userRoles';
import { CreateEditUserGroup } from '..';

import {
  assignedRoles,
  availableRoles,
  effectiveRoles,
  userRoles,
} from '../../../ducks/tests/fixtures';
import { fetchKeycloakUserRoles, makeKeycloakUserRolesSelector } from '../../../ducks/userRoles';

reducerRegistry.register(reducerName, reducer);
reducerRegistry.register(rolesReducername, rolesReducer);

/* eslint-disable @typescript-eslint/naming-convention */

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/store')),
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const userGroupSelector = makeKeycloakUserGroupsSelector();
const userRolesSelector = makeKeycloakUserRolesSelector();

describe('components/CreateEditUserGroup', () => {
  const props = {
    history,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    location: {
      hash: '',
      pathname: '/users/groups/edit',
      search: '',
      state: '',
    },
    match: {
      isExact: true,
      params: { userGroupId: fixtures.userGroup.id },
      path: `/users/groups/edit/:userGroupId`,
      url: `/users/groups/edit/${fixtures.userGroup.id}`,
    },
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    store.dispatch(removeKeycloakUserGroups());
    store.dispatch(removeKeycloakUserRoles());
    fetch.mockClear();
  });

  it('renders without crashing', () => {
    act(() => {
      shallow(
        <Provider store={opensrpStore.store}>
          <Router history={history}>
            <CreateEditUserGroup {...props} />
          </Router>
        </Provider>
      );
    });
  });

  it('renders correctly', async () => {
    fetch
      .once(JSON.stringify(fixtures.userGroup))
      .once(JSON.stringify(userRoles))
      .once(JSON.stringify(availableRoles))
      .once(JSON.stringify(assignedRoles))
      .once(JSON.stringify(effectiveRoles));

    store.dispatch(fetchKeycloakUserGroups([fixtures.userGroup]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateEditUserGroup {...props} />
        </Router>
      </Provider>
    );

    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    // expect(fetch.mock.calls).toEqual('');

    const row = wrapper.find('Row').at(0);

    expect(row.text()).toMatchSnapshot('full user group form');

    wrapper.unmount();
  });

  it('renders correctly for create user group', () => {
    const propsCreate = {
      history,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
      location: {
        hash: '',
        pathname: '/users/groups/new',
        search: '',
        state: '',
      },
      match: {
        isExact: true,
        params: { userGroupId: '' },
        path: `/users/groups/new/`,
        url: `/users/groups/new/`,
      },
    };

    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <CreateEditUserGroup {...propsCreate} />
        </Router>
      </Provider>
    );

    wrapper.update();

    const row = wrapper.find('Row').at(0);

    expect(row.find('UserGroupForm').prop('initialValues')).toEqual(defaultInitialValues);

    wrapper.unmount();
  });

  it('fetches user group if page is refreshed', async () => {
    fetch
      .once(JSON.stringify(fixtures.userGroup))
      .once(JSON.stringify(userRoles))
      .once(JSON.stringify(availableRoles))
      .once(JSON.stringify(assignedRoles))
      .once(JSON.stringify(effectiveRoles));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateEditUserGroup {...props} />
        </Router>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups/${fixtures.userGroup.id}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer bamboocha',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    wrapper.unmount();
  });

  it('handles error if fetch user group fails when page reloads', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateEditUserGroup {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationError).toHaveBeenCalledWith("An error occurred");
    wrapper.unmount();
  });

  it('works correctly with the store', async () => {
    store.dispatch(fetchKeycloakUserGroups([fixtures.userGroup]));
    store.dispatch(fetchKeycloakUserRoles([userRoles[0]]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateEditUserGroup {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('input#name').prop('value')).toEqual('Admin');
    expect(userGroupSelector(store.getState(), { name: fixtures.userGroup.name })).toEqual([
      fixtures.userGroup,
    ]);
    expect(userRolesSelector(store.getState(), { name: userRoles[0].name })).toEqual([
      userRoles[0],
    ]);
    wrapper.unmount();
  });

  it('initializes form field with data if page is refreshed', async () => {
    fetch
      .once(JSON.stringify(fixtures.userGroup))
      .once(JSON.stringify(userRoles))
      .once(JSON.stringify(availableRoles))
      .once(JSON.stringify(assignedRoles))
      .once(JSON.stringify(effectiveRoles));

    store.dispatch(fetchKeycloakUserGroups([fixtures.userGroup]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateEditUserGroup {...props} />
        </Router>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups/${fixtures.userGroup.id}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer bamboocha',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(wrapper.find('input#name').prop('value')).toEqual('Admin');
    wrapper.unmount();
  });
});
