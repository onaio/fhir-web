import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from '@opensrp/store';

import { LocationUnitModule } from '../LocationUnitModule';
import { LocationGroupModule } from '../LocationGroupModule';
import { URL_LOCATION_TAG, URL_LOCATION_UNIT } from '../constants';

describe('containers/pages/locations/LocationGroupAddition', () => {
  it('renders', () => {
    mount(
      <MemoryRouter initialEntries={[URL_LOCATION_TAG]}>
        <Provider store={store}>
          <LocationGroupModule />
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
