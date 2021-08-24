import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { history } from '@onaio/connected-reducer-registry';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Router } from 'react-router';
import ConnectedHomeComponent, { Home, HomeProps } from '../Home';
import { getOpenSRPUserInfo } from '@onaio/gatekeeper';
import { store } from '@opensrp-web/store';
import { authenticateUser } from '@onaio/session-reducer';
import { Provider } from 'react-redux';
import { URL_LOCATION_UNIT, URL_LOCATION_UNIT_GROUP, URL_TEAMS } from '../../../../constants';

jest.mock('../../../../configs/env');

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
        token_expires_at: '2017-07-13T20:30:59.000Z',
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
        token_expires_at: '2017-07-13T20:30:59.000Z',
        token_type: 'bearer',
      },
      preferredName: 'Superset User',
      roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
      username: 'superset-user',
    });
  });

  it('displays links for location unit module', () => {
    const envModule = require('../../../../configs/env');
    envModule.ENABLE_LOCATIONS = true;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedHomeComponent />
        </Router>
      </Provider>
    );

    expect(wrapper.find(`Link[to="${URL_LOCATION_UNIT}"]`)).toHaveLength(1);
    expect(wrapper.find(`Link[to="${URL_LOCATION_UNIT_GROUP}"]`)).toHaveLength(1);
  });

  it('displays links for teams module', () => {
    const envModule = require('../../../../configs/env');
    envModule.ENABLE_TEAMS = true;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedHomeComponent />
        </Router>
      </Provider>
    );

    expect(wrapper.find(`Link[to="${URL_TEAMS}"]`)).toHaveLength(1);
  });
});
