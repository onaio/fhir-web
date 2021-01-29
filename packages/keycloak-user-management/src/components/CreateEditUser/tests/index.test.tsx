import reducerRegistry from '@onaio/redux-reducer-registry';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import * as opensrpStore from '@opensrp/store';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { OpenSRPService } from '@opensrp/react-utils';
import * as fixtures from './fixtures';
import { CreateEditUser, ConnectedCreateEditUser } from '..';
import flushPromises from 'flush-promises';
import { KeycloakService } from '@opensrp/keycloak-service';
import * as notifications from '@opensrp/notifications';
import fetch from 'jest-fetch-mock';
import { defaultInitialValues } from '../../forms/UserForm';
import toJson from 'enzyme-to-json';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  removeKeycloakUsers,
} from '../../../ducks/user';
import { authenticateUser } from '@onaio/session-reducer';
import { ERROR_OCCURED } from '../../../constants';
import { practitioner1 } from '../../forms/UserForm/tests/fixtures';

/* eslint-disable @typescript-eslint/camelcase */

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/store'),
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

describe('components/CreateEditUser', () => {
  const props = {
    history,
    keycloakUser: fixtures.keycloakUser,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    serviceClass: KeycloakService,
    practitioner: undefined,
    fetchKeycloakUsersCreator: fetchKeycloakUsers,
    opensrpBaseURL: OPENSRP_API_BASE_URL,
    opensrpServiceClass: OpenSRPService,
    accessToken: 'access token',
    location: {
      hash: '',
      pathname: '/users/edit',
      search: '',
      state: '',
    },
    match: {
      isExact: true,
      params: { userId: fixtures.keycloakUser.id },
      path: `/users/edit/:id`,
      url: `/users/edit/${fixtures.keycloakUser.id}`,
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    store.dispatch(removeKeycloakUsers());
    jest.clearAllMocks();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    act(() => {
      shallow(
        <Router history={history}>
          <CreateEditUser {...props} />
        </Router>
      );
    });
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify(fixtures.keycloakUser)).once(JSON.stringify(practitioner1));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateEditUser {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const row = wrapper.find('Row').at(0);

    expect(row.props()).toMatchSnapshot();

    wrapper.unmount();
  });

  it('renders correctly for create user', () => {
    const propsCreate = {
      history,
      keycloakUser: null,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
      serviceClass: KeycloakService,
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      opensrpBaseURL: OPENSRP_API_BASE_URL,
      opensrpServiceClass: OpenSRPService,
      accessToken: 'access token',
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

    const wrapper = mount(
      <Router history={history}>
        <CreateEditUser {...propsCreate} />
      </Router>
    );

    const row = wrapper.find('Row').at(0);

    expect(row.find('UserForm').prop('initialValues')).toEqual(defaultInitialValues);

    wrapper.unmount();
  });

  it('fetches user if page is refreshed', async () => {
    fetch.once(JSON.stringify(fixtures.keycloakUser));

    opensrpStore.store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
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

    expect(fetch.mock.calls[1]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${fixtures.keycloakUser.id}`,
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

  it('handles error if fetch user fails if page is refreshed', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    opensrpStore.store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
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

    expect(mockNotificationError).toHaveBeenCalledWith(ERROR_OCCURED);
  });

  it('works correctly with the store', async () => {
    store.dispatch(fetchKeycloakUsers([fixtures.keycloakUser]));
    const mockSelector = jest.spyOn(opensrpStore, 'makeAPIStateSelector');
    opensrpStore.store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
      )
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUser
            {...props}
            accessToken={opensrpStore.makeAPIStateSelector()(opensrpStore.store.getState(), {
              accessToken: true,
            })}
          />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('CreateEditUser').prop('keycloakUser')).toEqual(fixtures.keycloakUser);
    expect(wrapper.find('CreateEditUser').prop('accessToken')).toEqual('bamboocha');
    expect(wrapper.find('CreateEditUser').prop('extraData')).toEqual({
      api_token: 'hunter2',
      oAuth2Data: { access_token: 'bamboocha', state: 'abcde' },
    });
    expect(mockSelector).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('initializes form fields with user data if page is refreshed', async () => {
    fetch.once(JSON.stringify(fixtures.keycloakUser));

    opensrpStore.store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
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

    expect(fetch.mock.calls[0]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${fixtures.keycloakUser.id}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer bamboocha',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(wrapper.find('input#firstName').prop('value')).toEqual('Demo');
    expect(wrapper.find('input#lastName').prop('value')).toEqual('kenya');
    expect(wrapper.find('input#username').prop('value')).toEqual('opensrp');
    expect(wrapper.find('input#email').prop('value')).toEqual('test@onatest.com');
    wrapper.unmount();
  });
});
