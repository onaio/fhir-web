import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import { notification } from 'antd';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';

import { baseLocationUnits, rawHierarchy, locationUnitgroups, id } from './fixtures';
import LocationUnitAddEdit, { getBaseTreeNode, getHierarchy } from '..';

import { act } from 'react-dom/test-utils';

describe('location-management/src/components/LocationUnitAddEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  it('test getBaseTreeNode', async () => {
    fetch.mockResponse(JSON.stringify(baseLocationUnits));

    let response = await getBaseTreeNode('accessToken');

    expect(response).toMatchObject(baseLocationUnits);
  });

  it('test getHierarchy', async () => {
    fetch.mockResponse(JSON.stringify(rawHierarchy[2]));

    let response = await getHierarchy([baseLocationUnits[2]], 'accessToken');

    expect(response).toMatchObject([rawHierarchy[2]]);
  });

  it('fail loading location ', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');

    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitAddEdit />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'An error occurred',
      description: undefined,
    });
  });

  it('fail loading location hierarchy', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');

    fetch.mockResponseOnce(JSON.stringify(locationUnitgroups));
    fetch.mockResponseOnce(JSON.stringify([baseLocationUnits[0]]));
    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitAddEdit />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'An error occurred',
      description: undefined,
    });
  });

  it('renders everything correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(locationUnitgroups));
    fetch.mockResponseOnce(JSON.stringify([baseLocationUnits[0]]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitAddEdit />
        </Router>
      </Provider>
    );

    expect(fetch.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location-tag",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status%3AActive%2CgeographicLevel%3A0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
      ]
    `);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('Fail id data fetch', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={LocationUnitAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    expect(fetch.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location-tag",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
      ]
    `);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'An error occurred',
      description: undefined,
    });
  });

  it('renders everything correctly with id', async () => {
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits[0]));
    fetch.mockResponseOnce(JSON.stringify(locationUnitgroups));
    fetch.mockResponseOnce(JSON.stringify([baseLocationUnits[0]]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={LocationUnitAddEdit} />
        </MemoryRouter>
      </Provider>
    );

    expect(fetch.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location-tag",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
      ]
    `);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('form')).toHaveLength(1);
  });
});
