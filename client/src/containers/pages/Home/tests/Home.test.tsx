import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { history } from '@onaio/connected-reducer-registry';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Router } from 'react-router';
import ConnectedHomeComponent, { Home, HomeProps } from '../Home';
import { getOpenSRPUserInfo } from '@onaio/gatekeeper';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { Provider } from 'react-redux';

describe('containers/pages/Home', () => {
  it('renders without crashing', () => {
    const props = {
      extraData: {
        roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
      },
    };
    shallow(<Home {...props} />);
  });

  it('renders Home correctly & changes Title of page', () => {
    const props = {
      extraData: {
        roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <Home {...props} />
      </Router>
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('OpenSRP Web');
    expect(toJson(wrapper.find('Home'))).toMatchSnapshot('Home page rendered');
    wrapper.unmount();
  });
  it('works correctly with store', () => {
    const { authenticated, user, extraData } = getOpenSRPUserInfo({
      oAuth2Data: {
        access_token: 'hunter2',
        expires_in: '3599',
        state: 'opensrp',
        token_type: 'bearer',
      },
      preferredName: 'Superset User',
      roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
      username: 'superset-user',
    });
    store.dispatch(authenticateUser(authenticated, user, extraData));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedHomeComponent />
        </Router>
      </Provider>
    );
    const connectedProps = wrapper.find('Home').props();
    expect((connectedProps as HomeProps).extraData).toEqual({
      oAuth2Data: {
        access_token: 'hunter2',
        expires_in: '3599',
        state: 'opensrp',
        token_type: 'bearer',
      },
      preferredName: 'Superset User',
      roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
      username: 'superset-user',
    });
  });
});
