import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import { notification } from 'antd';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

import Form, { onSubmit } from '../Form';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';
import { baseURL } from '../../../constants';
import LocationUnitGroupAddEdit from '..';

Form.defaultProps = { opensrpBaseURL: baseURL };

describe('location-management/src/components/LocationUnitGroupAddEdit', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.mockClear();
  });

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form opensrpBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('tests cancel button', () => {
    const mockBack = jest.fn();
    history.goBack = mockBack;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form opensrpBaseURL={baseURL} />
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
          <Form opensrpBaseURL={baseURL} />
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
    fetch.once(JSON.stringify(fixtures.sampleLocationUnitGroupPayload));
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/1`]}>
        <Provider store={store}>
          <Route
            path={'/:id'}
            component={() => <Form setEditTitle={jest.fn} id="1" opensrpBaseURL={baseURL} />}
          />
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
          authorization: 'Bearer sometoken',
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
          authorization: 'Bearer sometoken',
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
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    wrapper.unmount();
  });

  it('Handles errors on fetching single tag', async () => {
    fetch.mockRejectOnce(new Error('An error occurred'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/1`]}>
        <Provider store={store}>
          <Route path={'/:id'} component={() => <Form id="1" opensrpBaseURL={baseURL} />} />
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
    fetch.mockRejectOnce(new Error('An error occurred'));
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
    fetch.mockRejectOnce(new Error('An error occurred'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    onSubmit(
      fixtures.sampleLocationUnitGroupPayload,
      baseURL,
      { id: '1', opensrpBaseURL: baseURL },
      jest.fn(),
      (t) => t
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: 'An error occurred',
    });
  });

  it('render correct location unit group name in header', async () => {
    fetch.once(JSON.stringify(fixtures.sampleLocationUnitGroupPayload));
    const wrapperLocationUnitGroup = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/1`, hash: '', search: '', state: {} }]}>
          <Route path="/:id" component={LocationUnitGroupAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    const wrapper = mount(
      <MemoryRouter initialEntries={[`/1`]}>
        <Provider store={store}>
          <Route
            path={'/:id'}
            component={() => (
              <Form
                setEditTitle={jest
                  .fn()
                  .mockReturnValue(fixtures.sampleLocationUnitGroupPayload.description)}
                id="1"
                opensrpBaseURL={baseURL}
              />
            )}
          />
        </Provider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    wrapperLocationUnitGroup.update();
    expect(wrapperLocationUnitGroup.find('.mb-4.header-title').text()).toEqual(
      `Edit Location Unit Group | ${fixtures.sampleLocationUnitGroupPayload.name}`
    );
  });
});
