import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';

import Form from '../Form';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';

describe('containers/pages/locations/Form', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form />
        </Router>
      </Provider>
    );
    expect(wrapper.props()).toMatchSnapshot();
  });

  it('tests cancel button', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form />
        </Router>
      </Provider>
    );
    wrapper.find('button#cancel').simulate('click');
  });

  it('tests Create New Payload', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form />
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
    wrapper.simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.unmount();
  });

  it('tests Update Payload', async () => {
    fetch.once(JSON.stringify(fixtures.sampleLocationTagPayload));
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/testingid`]}>
        <Provider store={store}>
          <Route path={'/:id'} component={Form} />
        </Provider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // with values test
    // expect(toJson(wrapper)).toEqual('');
    wrapper
      .find('input[name="name"]')
      .simulate('change', { target: { name: 'name', value: 'Name213' } });
    wrapper
      .find('textarea[name="description"]')
      .simulate('change', { target: { name: 'description', value: 'this is description' } });
    wrapper.simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.unmount();
  });
});
