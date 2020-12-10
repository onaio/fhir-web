import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import { store } from '@opensrp/store';

import LocationTagAddEdit from '..';

describe('Location-module/LocationTagAddEdit', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationTagAddEdit />
        </Router>
      </Provider>
    );

    expect(wrapper.find('Row').first().prop('children')).toMatchSnapshot();
  });

  it('render with id without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/54`, hash: '', search: '', state: {} }]}>
          <Route path="/:id" component={LocationTagAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('Row').first().prop('children')).toMatchSnapshot();
  });
});
