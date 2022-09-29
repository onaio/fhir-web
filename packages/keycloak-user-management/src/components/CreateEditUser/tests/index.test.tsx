/* eslint-disable @typescript-eslint/naming-convention */
import reducerRegistry from '@onaio/redux-reducer-registry';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import * as opensrpStore from '@opensrp/store';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { CreateEditUser, ConnectedCreateEditUser } from '..';
import flushPromises from 'flush-promises';
import * as notifications from '@opensrp/notifications';
import fetch from 'jest-fetch-mock';
import toJson from 'enzyme-to-json';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  removeKeycloakUsers,
} from '../../../ducks/user';
import { authenticateUser } from '@onaio/session-reducer';

import {
  keycloakUser,
  practitioner1,
  requiredActions,
  userGroup,
} from '../../forms/UserForm/tests/fixtures';
import { defaultUserFormInitialValues } from '../../forms/UserForm';
import { getFormValues } from '../../forms/UserForm/utils';
import { Dictionary } from '@onaio/utils/dist/types/types';

jest.mock('@opensrp/store', () => {
  const actualStore = jest.requireActual('@opensrp/store');
  return {
    __esModule: true,
    ...actualStore,
  };
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

describe('components/CreateEditUser', () => {
  const props = {
    history,
    keycloakUser: keycloakUser,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    practitioner: undefined,
    fetchKeycloakUsersCreator: fetchKeycloakUsers,
    opensrpBaseURL: OPENSRP_API_BASE_URL,
    location: {
      hash: '',
      pathname: '/users/edit',
      search: '',
      state: '',
    },
    match: {
      isExact: true,
      params: { userId: keycloakUser.id },
      path: `/users/edit/:id`,
      url: `/users/edit/${keycloakUser.id}`,
    },
    extraData: {},
  };

  const propsCreate = {
    history,
    keycloakUser: null,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    fetchKeycloakUsersCreator: fetchKeycloakUsers,
    opensrpBaseURL: OPENSRP_API_BASE_URL,
    location: {
      hash: '',
      pathname: '/users/new',
      search: '',
      state: '',
    },
    match: {
      isExact: true,
      params: { userId: null },
      path: `/users/new/`,
      url: `/users/new/`,
    },
    extraData: {},
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
    store.dispatch(removeKeycloakUsers());
    fetch.mockClear();
    fetch.resetMocks();
    jest.clearAllMocks();
    // jest.resetAllMocks();
  });

  it('renders correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(userGroup));
    fetch.mockResponseOnce(JSON.stringify(requiredActions));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateEditUser {...propsCreate} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer bamboocha',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    const row = wrapper.find('Row').at(0);

    expect(row.props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('renders correctly with user id', async () => {
    fetch
      .once(JSON.stringify(userGroup))
      .once(JSON.stringify(keycloakUser))
      .once(JSON.stringify(userGroup))
      .once(JSON.stringify(practitioner1));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUser {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const fetchMockCalls = fetch.mock.calls.map((call) => call[0]);
    expect(fetchMockCalls).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups',
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b/groups',
      'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner/user/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    ]);

    expect(wrapper.find('UserForm')).toHaveLength(1);
    const userFormProps = wrapper.find('UserForm').props() as Dictionary;
    expect(userFormProps.initialValues).toEqual(
      getFormValues(keycloakUser, practitioner1, userGroup)
    );

    wrapper.unmount();
  });

  it('renders correctly for create user', async () => {
    fetch.mockResponseOnce(JSON.stringify(userGroup));
    fetch.mockResponseOnce(JSON.stringify(keycloakUser));

    const wrapper = mount(
      <Router history={history}>
        <CreateEditUser {...propsCreate} />
      </Router>
    );

    expect(wrapper.exists('.ant-spin')).toBeTruthy();
    expect(wrapper.exists('Row')).toBeFalsy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const row = wrapper.find('Row').at(0);

    expect(row.find('UserForm').prop('initialValues')).toEqual(defaultUserFormInitialValues);
    wrapper.unmount();
  });

  it('fetches user if page is refreshed', async () => {
    fetch.mockResponseOnce(JSON.stringify(userGroup));
    fetch.mockResponseOnce(JSON.stringify(keycloakUser));
    fetch.mockResponseOnce(JSON.stringify(userGroup));
    fetch.mockResponseOnce(JSON.stringify(practitioner1));
    fetch.mockResponseOnce(JSON.stringify(requiredActions));

    opensrpStore.store.dispatch(
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

    const propsPageRefreshed = {
      ...props,
      accessToken: '',
      keycloakUser: null,
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUser {...propsPageRefreshed} />
        </Router>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer bamboocha',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer bamboocha',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b/groups',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer bamboocha',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/practitioner/user/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer bamboocha',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
    wrapper.unmount();
  });

  it('loads edit user page without breaking if user is not a practitioner', async () => {
    fetch.mockResponseOnce(JSON.stringify(userGroup));
    fetch.mockResponseOnce(JSON.stringify(keycloakUser));
    fetch.mockResponseOnce(JSON.stringify(userGroup));
    fetch.mockResponseOnce(JSON.stringify(null)); // practitioner response
    fetch.mockResponseOnce(JSON.stringify(requiredActions));

    opensrpStore.store.dispatch(
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

    const userProps = {
      ...props,
      keycloakUser: null,
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUser {...userProps} />
        </Router>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(toJson(wrapper.find('.ant-spin'))).toBeFalsy();
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Edit User | opensrpFirst NameLast NameEmailUsernameEnable userYesNoMark as PractitionerYesNoKeycloak User GroupAdminAdmin 2New GroupSaveCancel"`
    );
    wrapper.unmount();
  });

  it('handles error if fetch user fails if page is refreshed', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    opensrpStore.store.dispatch(
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

    const propsPageRefreshed = {
      ...props,
      accessToken: opensrpStore.makeAPIStateSelector()(opensrpStore.store.getState(), {
        accessToken: true,
      }),
      keycloakUser: null,
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUser {...propsPageRefreshed} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationError).toHaveBeenCalledWith('An error occurred');
    wrapper.unmount();
  });

  it('works correctly with the store', async () => {
    store.dispatch(fetchKeycloakUsers([keycloakUser]));
    opensrpStore.store.dispatch(
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

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUser {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('CreateEditUser').prop('keycloakUser')).toEqual(keycloakUser);
    expect(wrapper.find('CreateEditUser').prop('extraData')).toEqual({
      api_token: 'hunter2',
      oAuth2Data: { access_token: 'bamboocha', state: 'abcde' },
    });

    wrapper.unmount();
  });

  it('renders edit form once after all props update', async () => {
    fetch
      .once(JSON.stringify(userGroup))
      .once(JSON.stringify(keycloakUser))
      .once(JSON.stringify(userGroup))
      .once(JSON.stringify(practitioner1))
      .once(JSON.stringify(requiredActions));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUser {...props} />
        </Router>
      </Provider>
    );

    expect(wrapper.exists('.ant-spin')).toBeTruthy();
    expect(wrapper.exists('Row')).toBeFalsy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.exists('.ant-spin')).toBeFalsy();
    expect(wrapper.exists('Row')).toBeTruthy();

    wrapper.unmount();
  });
});
