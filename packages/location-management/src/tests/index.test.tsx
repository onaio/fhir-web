import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from '@opensrp/store';

import { LocationTagModule } from '../LocationTagModule';

describe('containers/pages/locations/LocationTagAddition', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/location/group']}>
        <Provider store={store}>
          <LocationTagModule />
        </Provider>
      </MemoryRouter>
    );
    expect(wrapper.props()).toMatchSnapshot();
  });
});
