import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from '@opensrp/store';

import { LocationUnitModule } from '../LocationUnitModule';

describe('containers/pages/locations/LocationUnitAddition', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/location/group']}>
        <Provider store={store}>
          <LocationUnitModule />
        </Provider>
      </MemoryRouter>
    );
    expect(wrapper.props()).toMatchSnapshot();
  });
});
