import React from 'react';
import { shallow, mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { authenticateUser } from '@onaio/session-reducer';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { cancelUserHandler, ConnectedUserCredentials, UserCredentials, submitForm } from '..';
import { KeycloakService, HTTPError } from '@opensrp/keycloak-service';
import * as fixtures from '../../forms/UserForm/tests/fixtures';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import * as notifications from '@opensrp/notifications';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  KeycloakUser,
} from '../../../ducks/user';
import { URL_USER } from '../../../constants';

import { history as registryHistory } from '@onaio/connected-reducer-registry';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

describe('components/Credentials', () => {
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  beforeEach(() => {
    store.dispatch(fetchKeycloakUsers(fixtures.keycloakUsersArray as KeycloakUser[]));
  });

  const props = {
    accessToken: 'hunter 2',
    keycloakUser: null,
    serviceClass: KeycloakService,
    cancelUserHandler: jest.fn(),
    history,
    location: {
      hash: '',
      pathname: `/user/credentials/${fixtures.keycloakUser.id}`,
      search: '',
      state: undefined,
    },
    match: {
      isExact: true,
      params: {
        userId: fixtures.keycloakUser.id,
      },
      path: '/user/credentials/:userId',
      url: `/user/credentials/${fixtures.keycloakUser.id}`,
    },
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    fetchKeycloakUsersCreator: fetchKeycloakUsers,
  };

  it('does not crash', () => {
    shallow(<UserCredentials {...props} />);
  });

  it('renders correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUserCredentials {...props} />
        </Router>
      </Provider>
    );
    expect(wrapper.find('Row').at(0).props()).toMatchSnapshot('row props');
    wrapper.unmount();
  });

  it('adds user credentials correctly', async () => {
    const mockNotificationSuccess = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(registryHistory, 'push');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUserCredentials {...props} />
        </Router>
      </Provider>
    );
    const password = wrapper.find('input#password');
    password.simulate('change', { target: { value: 'password123' } });

    const confirm = wrapper.find('input#confirm');
    confirm.simulate('change', { target: { value: 'password123' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const payload = {
      temporary: false,
      type: 'password',
      value: 'password123',
    };

    expect(fetch.mock.calls[0]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${fixtures.keycloakUser.id}/reset-password`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    expect(mockNotificationSuccess).toHaveBeenCalledWith('Credentials updated successfully');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users');
    wrapper.unmount();
  });

  it('shows validation error if required fields are empty', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUserCredentials {...props} />
        </Router>
      </Provider>
    );
    const password = wrapper.find('input#password');
    password.simulate('change', { target: { value: '' } });

    const confirm = wrapper.find('input#confirm');
    confirm.simulate('change', { target: { value: '' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const formContainer = wrapper.find('div.form-container');

    expect(formContainer.find('Row').at(0).find('FormItemInput').prop('errors')).toEqual([
      'Password is required',
    ]);
    expect(
      formContainer.find('Row').at(0).find('FormItemInput').find('span.ant-form-item-children-icon')
    ).toBeTruthy();

    expect(formContainer.find('Row').at(1).find('FormItemInput').prop('errors')).toEqual([
      'Confirm Password is required',
    ]);
    expect(
      formContainer.find('Row').at(1).find('FormItemInput').find('span.ant-form-item-children-icon')
    ).toBeTruthy();
    wrapper.unmount();
  });

  it('shows validation error if passwords do not match', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUserCredentials {...props} />
        </Router>
      </Provider>
    );
    const password = wrapper.find('input#password');
    password.simulate('change', { target: { value: 'password133' } });

    const confirm = wrapper.find('input#confirm');
    confirm.simulate('change', { target: { value: 'password100' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const formContainer = wrapper.find('div.form-container');

    expect(formContainer.find('Row').at(1).find('FormItemInput').prop('errors')).toEqual([
      'The two passwords that you entered do not match!',
    ]);
    expect(
      formContainer.find('Row').at(1).find('FormItemInput').find('span.ant-form-item-children-icon')
    ).toBeTruthy();
    wrapper.unmount();
  });

  it('submitForm submits form data correctly', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const historyPushMock = jest.spyOn(registryHistory, 'push');

    const values = {
      password: 'password122',
    };

    submitForm(values, fixtures.keycloakUser.id, KeycloakService, props.keycloakBaseURL, (t) => t);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b/reset-password',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: '{"temporary":false,"type":"password","value":"password122"}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
    expect(notificationSuccessMock.mock.calls).toEqual([['Credentials updated successfully']]);
    expect(historyPushMock).toHaveBeenCalledTimes(1);
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users');
  });

  it('it handles errors correctly if API response is not 200', async () => {
    fetch.mockReject(new HTTPError({} as Response, { error_description: 'An error occurred' }));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUserCredentials {...props} />
        </Router>
      </Provider>
    );

    const password = wrapper.find('input#password');
    password.simulate('change', { target: { value: 'password123' } });

    const confirm = wrapper.find('input#confirm');
    confirm.simulate('change', { target: { value: 'password123' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(mockNotificationError).toHaveBeenCalledWith('An error occurred');

    wrapper.unmount();
  });
  it('returns to user list on cancel user credentials', async () => {
    const cancelUserHandlerMock = jest.fn();
    const props2 = {
      ...props,
      cancelUserHandler: cancelUserHandlerMock,
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedUserCredentials {...props2} />
        </Router>
      </Provider>
    );
    wrapper.find('button.cancel-user').simulate('click');
    expect(cancelUserHandlerMock).toBeCalled();
    wrapper.unmount();
  });
  it('cancelUserHandler pushes to history', () => {
    const mockUseHistory = {
      push: jest.fn(),
    };
    cancelUserHandler(mockUseHistory);
    expect(mockUseHistory.push).toBeCalledWith(URL_USER);
  });
});
