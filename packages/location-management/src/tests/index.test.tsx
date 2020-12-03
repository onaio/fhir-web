import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from '@opensrp/store';

import { LocationUnitModule } from '../LocationUnitModule';
import { LocationTagModule } from '../LocationTagModule';
import { URL_LOCATION_TAG, URL_LOCATION_UNIT } from '../constants';

describe('containers/pages/locations/LocationTagModule', () => {
  it('renders', () => {
    mount(
      <MemoryRouter initialEntries={[URL_LOCATION_TAG]}>
        <Provider store={store}>
          <LocationTagModule />
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
