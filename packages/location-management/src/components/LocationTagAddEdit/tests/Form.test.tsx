import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import { notification } from 'antd';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';

import Form, { onSubmit } from '../Form';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';

describe('Location-module/Form', () => {
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
    const mockBack = jest.fn();
    history.goBack = mockBack;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form />
        </Router>
      </Provider>
    );

    wrapper.find('button#cancel').simulate('click');

    // click go back
    expect(wrapper.find('button').first().text()).toMatchInlineSnapshot(`"Save"`);
    wrapper.find('button').first().simulate('click');

    // click go back
    expect(wrapper.find('button').last().text()).toMatchInlineSnapshot(`"Cancel"`);
    wrapper.find('button').last().simulate('click');

    expect(mockBack).toHaveBeenCalled();
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

    expect(fetch.mock.calls[0]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag/1',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

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

    expect(fetch.mock.calls[0]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag/1',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(fetch.mock.calls[1]).toEqual([
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
    ]);
    wrapper.unmount();
  });

  it('Handles errors on fetching single tag', async () => {
    fetch.mockRejectOnce(() => Promise.reject('An error occurred'));
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
      description: undefined,
      message: 'An error occurred',
    });

    wrapper.unmount();
  });

  it('Handles errors on creating tag', async () => {
    fetch.mockRejectOnce(() => Promise.reject('An error occurred'));
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
      description: undefined,
      message: 'An error occurred',
    });

    wrapper.unmount();
  });

  it('Handles errors on editing tag', async () => {
    fetch.mockRejectOnce(() => Promise.reject('An error occurred'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    onSubmit(fixtures.sampleLocationTagPayload, 'sometoken', { id: '1' }, jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: 'An error occurred',
    });
  });
});
