import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';

import LocationUnitGroupAddEdit from '..';

describe('Location-module/LocationUnitGroupAddEdit', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitGroupAddEdit />
        </Router>
      </Provider>
    );
    expect(wrapper.find('Row').at(0).props()).toMatchSnapshot();
  });
});
