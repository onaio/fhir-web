import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';

import LocationUnitGroupAdd from '..';

describe('containers/pages/locations/LocationUnitAdd', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitGroupAdd />
        </Router>
      </Provider>
    );
    expect(wrapper.find('section').props()).toMatchSnapshot();
    expect(wrapper.find('form').props()).toMatchSnapshot();
  });

  it('tests cancel button', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitGroupAdd />
        </Router>
      </Provider>
    );
    wrapper.find('form').find('button#cancel').simulate('click');
  });
});
