import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from '@opensrp/store';

import { LocationUnitModule } from '../LocationUnitModule';
import { LocationUnitGroupModule } from '../LocationUnitGroupModule';
import { URL_LOCATION_UNIT_GROUP, URL_LOCATION_UNIT } from '../constants';

describe('containers/pages/locations/LocationUnitGroupModule', () => {
  it('renders', () => {
    mount(
      <MemoryRouter initialEntries={[URL_LOCATION_UNIT_GROUP]}>
        <Provider store={store}>
          <LocationUnitGroupModule />
        </Provider>
      </MemoryRouter>
    );
  });
});

describe('containers/pages/locations/LocationUnitModule', () => {
  it('renders', () => {
    mount(
      <MemoryRouter initialEntries={[URL_LOCATION_UNIT]}>
        <Provider store={store}>
          <LocationUnitModule />
        </Provider>
      </MemoryRouter>
    );
  });
});
