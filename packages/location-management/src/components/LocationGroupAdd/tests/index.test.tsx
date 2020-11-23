import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';

import LocationUnitGroupAdd from '..';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';

describe('containers/pages/locations/LocationGroupAddition', () => {
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

  it('tests Create New Payload', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitGroupAdd />
        </Router>
      </Provider>
    );

    // with values test
    wrapper
      .find('input[name="name"]')
      .simulate('change', { target: { name: 'name', value: 'Name213' } });
    wrapper
      .find('textarea[name="description"]')
      .simulate('change', { target: { name: 'description', value: 'this is description' } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.unmount();
  });

  it('tests Update Payload', async () => {
    fetch.once(JSON.stringify(fixtures.sampleLocationGroupPayload));
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/testingid`]}>
        <Provider store={store}>
          <Route path={'/:id'} component={LocationUnitGroupAdd} />
        </Provider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // with values test
    // expect(toJson(wrapper.find('Form'))).toEqual('');
    wrapper
      .find('input[name="name"]')
      .simulate('change', { target: { name: 'name', value: 'Name213' } });
    wrapper
      .find('textarea[name="description"]')
      .simulate('change', { target: { name: 'description', value: 'this is description' } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.unmount();
  });
});
