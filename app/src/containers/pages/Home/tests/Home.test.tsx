import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { history } from '@onaio/connected-reducer-registry';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Router } from 'react-router';
import { Home } from '../Home';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import {
  URL_LOCATION_UNIT,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAMS,
  URL_USER,
} from '../../../../constants';

jest.mock('../../../../configs/env');
jest.mock('../../../../configs/settings');

describe('containers/pages/Home', () => {
  it('renders Home correctly & changes Title of page', () => {
    const wrapper = mount(
      <Router history={history}>
        <Home />
      </Router>
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('OpenSRP Web');
    wrapper.find('.admin-link').forEach((adminLink) => {
      expect(toJson(adminLink)).toMatchSnapshot('links on home page');
    });
    wrapper.unmount();
  });

  it('displays links for user management module', () => {
    const envModule = require('../../../../configs/env');
    envModule.ENABLE_USER_MANAGEMENT = true;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Home />
        </Router>
      </Provider>
    );

    expect(wrapper.find(`Link[to="${URL_USER}"]`)).toHaveLength(1);
  });

  it('displays links for location unit module', () => {
    const envModule = require('../../../../configs/env');
    envModule.ENABLE_LOCATIONS = true;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Home />
        </Router>
      </Provider>
    );

    expect(wrapper.find(`Link[to="${URL_LOCATION_UNIT}"]`)).toHaveLength(1);
    expect(wrapper.find(`Link[to="${URL_LOCATION_UNIT_GROUP}"]`)).toHaveLength(0);
  });

  it('displays links for teams module', () => {
    const envModule = require('../../../../configs/env');
    envModule.ENABLE_TEAMS = true;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Home />
        </Router>
      </Provider>
    );

    expect(wrapper.find(`Link[to="${URL_TEAMS}"]`)).toHaveLength(1);
  });
});
