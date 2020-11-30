import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import { notification } from 'antd';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';

import Form from '../Form';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';

describe('containers/pages/locations/Form', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
    wrapper.update();
    wrapper
      .find('textarea[name="description"]')
      .simulate('change', { target: { name: 'description', value: 'this is description' } });
    wrapper.update();
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
      <MemoryRouter initialEntries={[`/1`]}>
        <Provider store={store}>
          <Route path={'/:id'} component={() => <Form id="1" />} />
        </Provider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag/1',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    // with values test
    // expect(toJson(wrapper)).toEqual('');
    wrapper
      .find('input[name="name"]')
      .simulate('change', { target: { name: 'name', value: 'Name213' } });
    wrapper.update();
    wrapper
      .find('textarea[name="description"]')
      .simulate('change', { target: { name: 'description', value: 'this is description' } });
    wrapper.update();
    wrapper.simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag/1',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: '{"active":false,"description":"this is description","name":"Name213","id":"1"}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
    wrapper.unmount();
  });

  it('Handles errors on fetching single tag', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API request Failed'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/1`]}>
        <Provider store={store}>
          <Route path={'/:id'} component={() => <Form id="1" />} />
        </Provider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: '',
      message: 'API request Failed',
    });

    wrapper.unmount();
  });

  it('Handles errors on creating', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API request Failed'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/1`]}>
        <Provider store={store}>
          <Route path={'/:id'} component={Form} />
        </Provider>
      </MemoryRouter>
    );

    wrapper
      .find('input[name="name"]')
      .simulate('change', { target: { name: 'name', value: 'Name213' } });
    wrapper.update();
    wrapper
      .find('textarea[name="description"]')
      .simulate('change', { target: { name: 'description', value: 'this is description' } });
    wrapper.update();
    wrapper.simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: '',
      message: 'API request Failed',
    });

    wrapper.unmount();
  });
});
