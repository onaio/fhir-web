import flushPromises from 'flush-promises';
import * as serverLogout from '@opensrp/server-logout';
import toJson from 'enzyme-to-json';
import React from 'react';
import { CustomLogout } from '..';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from '@opensrp/store';
import * as notifications from '@opensrp/notifications';
import { act } from 'react-dom/test-utils';
import { mountWithTranslations } from '../../../helpers/testUtils';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('../../../configs/env');

describe('components/Logout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders logout component', () => {
    const wrapper = mountWithTranslations(
      <Provider store={store}>
        <MemoryRouter>
          <CustomLogout />
        </MemoryRouter>
      </Provider>
    );
    expect(toJson(wrapper.find('CustomLogout'))).toMatchSnapshot();
  });

  it('calls logout with correct params', async () => {
    const mock = jest.spyOn(serverLogout, 'logout');
    mock.mockRejectedValue('Logout failed');
    const payload = {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer null',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    };
    const logoutURL = 'https://opensrp-stage.smartregister.org/opensrp/logout.do';
    const keycloakURL =
      'https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/logout';
    mountWithTranslations(
      <Provider store={store}>
        <MemoryRouter>
          <CustomLogout />
        </MemoryRouter>
      </Provider>
    );
    await flushPromises();
    expect(mock).toHaveBeenCalledWith(payload, logoutURL, keycloakURL, 'http://localhost:3000');
  });

  it('handles logout failure correctly', async () => {
    jest.spyOn(serverLogout, 'logout').mockRejectedValueOnce(new Error('error'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    mountWithTranslations(
      <Provider store={store}>
        <MemoryRouter>
          <CustomLogout />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
    });
    expect(mockNotificationError).toHaveBeenCalledWith('An error occurred');
  });
});
