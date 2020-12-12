import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import fetch from 'jest-fetch-mock';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { notification } from 'antd';
import { Router } from 'react-router';
import LocationUnitView, {
  loadSingleLocation,
  getBaseTreeNode,
  parseTableData,
  getHierarchy,
} from '..';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { baseLocationUnits, parsedTreeNode, rawHierarchy, parsedHierarchy } from './fixtures';
import { fetchCurrentChildren } from '../../../ducks/location-hierarchy';
import { TreeNode } from '../../../ducks/types';
import toJson from 'enzyme-to-json';

describe('Location-module/location unit', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('test resolve loadSingleLocation', async () => {
    fetch.mockResponse(JSON.stringify(baseLocationUnits[0]));
    let called = jest.fn();

    const row = {
      geographicLevel: parsedHierarchy[0].node.attributes.geographicLevel,
      id: parsedHierarchy[0].id,
      key: '0',
      name: parsedHierarchy[0].title,
    };

    loadSingleLocation(row, 'accessToken', called);

    expect(called).toBeCalledWith('loading');

    await act(async () => {
      await flushPromises();
    });

    expect(called).toBeCalledWith(baseLocationUnits[0]);
  });

  it('test fail loadSingleLocation', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockReject();

    const row = {
      geographicLevel: parsedHierarchy[0].node.attributes.geographicLevel,
      id: parsedHierarchy[0].id,
      key: '0',
      name: parsedHierarchy[0].title,
    };

    loadSingleLocation(row, 'accessToken', jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'An error occurred',
      description: undefined,
    });
  });

  it('test getBaseTreeNode', async () => {
    fetch.mockResponse(JSON.stringify(baseLocationUnits));

    let response = await getBaseTreeNode('accessToken');

    expect(response).toMatchObject(baseLocationUnits);
  });

  it('test parseTableData', () => {
    let response = parseTableData(parsedHierarchy);

    expect(response).toMatchObject([
      {
        geographicLevel: parsedHierarchy[0].node.attributes.geographicLevel,
        id: parsedHierarchy[0].id,
        key: '0',
        name: parsedHierarchy[0].title,
      },
      {
        geographicLevel: parsedHierarchy[1].node.attributes.geographicLevel,
        id: parsedHierarchy[1].id,
        key: '1',
        name: parsedHierarchy[1].title,
      },
      {
        geographicLevel: parsedHierarchy[2].node.attributes.geographicLevel,
        id: parsedHierarchy[2].id,
        key: '2',
        name: parsedHierarchy[2].title,
      },
    ]);
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
          <LocationUnitView />
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

    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView />
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

  it('location unit table renders correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
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
      ]
    `);
    expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        "https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/a26ca9c8-1441-495a-83b6-bb5df7698996",
        Object {
          "headers": Object {
            "accept": "application/json",
            "authorization": "Bearer null",
            "content-type": "application/json;charset=UTF-8",
          },
          "method": "GET",
        },
      ]
    `);
    expect(fetch.mock.calls[2]).toMatchInlineSnapshot(`
      Array [
        "https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/b652b2f4-a95d-489b-9e28-4629746db96a",
        Object {
          "headers": Object {
            "accept": "application/json",
            "authorization": "Bearer null",
            "content-type": "application/json;charset=UTF-8",
          },
          "method": "GET",
        },
      ]
    `);
    expect(fetch.mock.calls[3]).toMatchInlineSnapshot(`
      Array [
        "https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/6bf9c085-350b-4bb2-990f-80dc2caafb33",
        Object {
          "headers": Object {
            "accept": "application/json",
            "authorization": "Bearer null",
            "content-type": "application/json;charset=UTF-8",
          },
          "method": "GET",
        },
      ]
    `);

    expect(wrapper.find('Table').first().props()).toMatchSnapshot();
  });

  // it('renders fetched data correctly', async () => {
  //   fetch.once(JSON.stringify(baseLocationUnits));
  //   loadSingleLocation(
  //     { id: '1', geographicLevel: 0, key: 'key', name: 'Name' },
  //     'sometoken',
  //     jest.fn()
  //   );
  //   store.dispatch(fetchCurrentChildren((treedata[0].children as unknown) as TreeNode[]));
  //   const wrapper = mount(
  //     <Provider store={store}>
  //       <Router history={history}>
  //         <LocationUnitView />
  //       </Router>
  //     </Provider>
  //   );
  //   await act(async () => {
  //     await flushPromises();
  //     wrapper.update();
  //   });

  //   expect(fetch.mock.calls[0]).toEqual([
  //     'https://opensrp-stage.smartregister.org/opensrp/rest/location/1?is_jurisdiction=true',
  //     {
  //       headers: {
  //         accept: 'application/json',
  //         authorization: 'Bearer sometoken',
  //         'content-type': 'application/json;charset=UTF-8',
  //       },
  //       method: 'GET',
  //     },
  //   ]);
  //   expect(wrapper.find('Table').at(1).text()).toEqual(
  //     'NameLevelActionsNairobi West2EditCentral2Edit1'
  //   );
  // });
});
