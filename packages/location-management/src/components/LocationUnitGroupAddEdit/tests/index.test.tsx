import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import { store } from '@opensrp-web/store';

import LocationUnitGroupAddEdit from '..';

describe('location-management/src/components/LocationUnitGroupAddEdit/tests', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitGroupAddEdit />
        </Router>
      </Provider>
    );

    expect(wrapper.find('Row').first().prop('children')).toMatchSnapshot();
  });

  it('render with id without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/54`, hash: '', search: '', state: {} }]}>
          <Route path="/:id" component={LocationUnitGroupAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('Row').first().prop('children')).toMatchSnapshot();
  });
});
