import { mount, shallow } from 'enzyme';
import flushPromises from 'flush-promises';
import * as serverLogout from '@opensrp/server-logout';
import toJson from 'enzyme-to-json';
import { history } from '@onaio/connected-reducer-registry';
import React from 'react';

import { CustomLogout } from '..';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';

describe('components/Logout', () => {
  it('renders without crashing', () => {
    shallow(<CustomLogout />);
  });
  it('renders logout component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CustomLogout />
        </Router>
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
    mount(
      <Provider store={store}>
        <Router history={history}>
          <CustomLogout />
        </Router>
      </Provider>
    );
    await flushPromises();
    expect(mock).toHaveBeenCalledWith(payload, logoutURL, keycloakURL, 'http://localhost:3000');
  });
});
