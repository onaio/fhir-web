import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import { store } from '@opensrp/store';

import { id } from './fixtures';
import LocationUnitAdd from '..';
import { act } from 'react-dom/test-utils';

describe('containers/pages/locations/LocationUnitAdd', () => {
  it('renders without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitAdd />
        </Router>
      </Provider>
    );
    expect(wrapper.props()).toMatchSnapshot();

    await act(async () => {
      await flushPromises();
    });
  });

  it('renders without crashing when editting', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={LocationUnitAdd} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.props()).toMatchSnapshot();

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      await flushPromises();
    });
  });
});
