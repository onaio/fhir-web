import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import fetch from 'jest-fetch-mock';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { notification } from 'antd';
import { Router } from 'react-router';
import LocationUnitList, { loadSingleLocation } from '..';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { authenticateUser } from '@onaio/session-reducer';
import { baseLocationUnits, rawHierarchy, parsedHierarchy } from './fixtures';
import { baseURL } from '../../../constants';

import { generateJurisdictionTree, getBaseTreeNode } from '../../../ducks/locationHierarchy/utils';
import {
  fetchAllHierarchies,
  reducer as locationHierarchyReducer,
  reducerName as locationHierarchyReducerName,
} from '../../../ducks/location-hierarchy';
import {
  locationUnitsReducer,
  locationUnitsReducerName,
  fetchLocationUnits,
} from '../../../ducks/location-units';
import { ParsedHierarchyNode } from '../../../ducks/locationHierarchy/types';
import { QueryClient, QueryClientProvider } from 'react-query';
import { TableData } from '../Table';
import toJson from 'enzyme-to-json';
import { waitFor } from '@testing-library/react';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

LocationUnitList.defaultProps = { opensrpBaseURL: baseURL };

describe('location-management/src/components/LocationUnitList', () => {
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
    jest.spyOn(React, 'useLayoutEffect').mockImplementation(() => false);
  });

  beforeEach(() => {
    store.dispatch(fetchAllHierarchies([]));
    store.dispatch(fetchLocationUnits());
  });

  afterEach(() => {
    fetch.mockClear();
  });

  it('location unit table renders correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList opensrpBaseURL={baseURL} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],

      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/a26ca9c8-1441-495a-83b6-bb5df7698996',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/b652b2f4-a95d-489b-9e28-4629746db96a',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/6bf9c085-350b-4bb2-990f-80dc2caafb33',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    expect(wrapper.find('Table').first().props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('change table view when clicked on tree node', async () => {
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList opensrpBaseURL={baseURL} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const Tunisia = generateJurisdictionTree(rawHierarchy[0]).model as ParsedHierarchyNode;
    const Kenya = generateJurisdictionTree(rawHierarchy[1]).model as ParsedHierarchyNode;
    const Malawi = generateJurisdictionTree(rawHierarchy[2]).model as ParsedHierarchyNode;
    store.dispatch(fetchAllHierarchies([Tunisia, Kenya, Malawi]));

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // using index 0 cuz after sorting by name that is the last one
    const tablelastrow = {
      geographicLevel: Tunisia.node.attributes.geographicLevel,
      id: Tunisia.id,
      key: 2,
      label: Tunisia.label,
    };

    expect(wrapper.find('tbody BodyRow').last().prop('record')).toMatchObject(tablelastrow);

    // test table with tree node with child
    const treeItemwithchild = wrapper.find('span.ant-tree-title').first();
    treeItemwithchild.simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('tbody BodyRow').last().prop('record')).not.toMatchObject(tablelastrow); // table changed
  });

  it('test Open and close view details', async () => {
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList opensrpBaseURL={baseURL} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const firstAction = wrapper.find('.Actions').first();
    firstAction.find('button').last().simulate('click');

    // test out loading animation works correctly
    expect(wrapper.find('.ant-spin')).toHaveLength(1);
    fetch.once(JSON.stringify(baseLocationUnits[0]));

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('.ant-spin')).toHaveLength(0);
    expect(wrapper.find('LocationUnitDetail')).toHaveLength(1);

    // close LocationUnitDetail
    wrapper.find('LocationUnitDetail button').simulate('click');
    expect(wrapper.find('LocationUnitDetail')).toHaveLength(0);
    wrapper.unmount();
  });

  it('test resolve loadSingleLocation', async () => {
    fetch.mockResponse(JSON.stringify(baseLocationUnits[0]));
    const called = jest.fn();

    const row: TableData = {
      geographicLevel: parsedHierarchy[0].node.attributes.geographicLevel,
      id: parsedHierarchy[0].id,
      label: parsedHierarchy[0].label,
    };

    await loadSingleLocation(row, baseURL, called, (t) => t);

    expect(called).toBeCalledWith('loading');

    await act(async () => {
      await flushPromises();
    });

    expect(called).toBeCalledWith(baseLocationUnits[0]);
    fetch.resetMocks();
  });

  it('test fail loadSingleLocation', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockRejectOnce(new Error('API is down'));

    const row: TableData = {
      geographicLevel: parsedHierarchy[0].node.attributes.geographicLevel,
      id: parsedHierarchy[0].id,
      label: parsedHierarchy[0].label,
    };

    await loadSingleLocation(row, baseURL, jest.fn(), (t) => t);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'An error occurred',
      description: undefined,
    });
    fetch.resetMocks();
  });

  it('test getBaseTreeNode', async () => {
    fetch.mockResponse(JSON.stringify(baseLocationUnits));

    const response = await getBaseTreeNode(baseURL);

    await flushPromises();
    expect(response).toMatchObject(baseLocationUnits);
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
    fetch.resetMocks();
  });

  it('test getBaseTreeNode with parentId filter', async () => {
    fetch.mockResponse(JSON.stringify(baseLocationUnits));

    await getBaseTreeNode(baseURL, true);

    await flushPromises();
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,parentId:null',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
    fetch.resetMocks();
  });

  it('fail loading location ', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');

    fetch.mockRejectOnce();
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList opensrpBaseURL={baseURL} />
          </QueryClientProvider>
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
    wrapper.unmount();
  });

  it('fail loading location hierarchy', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');

    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockRejectOnce();
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList opensrpBaseURL={baseURL} />
          </QueryClientProvider>
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
    wrapper.unmount();
  });

  it('responds correctly to no locations', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    fetch.mockResponse(JSON.stringify([]));

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList opensrpBaseURL={baseURL} />
          </QueryClientProvider>
        </Router>
      </Provider>,
      { attachTo: div }
    );

    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await waitFor(async () => {
      await flushPromises();
      // loader, no longer - 🤣
      expect(document.querySelector('.ant-spin')).not.toBeInTheDocument();
    });

    wrapper.update();

    // table says no data
    const tableText = wrapper.find('table').text();
    expect(tableText).toContain('No Data');
    expect(tableText).toMatchInlineSnapshot(`"NameLevelActionsNo Data"`);
    expect(tableText).toMatchInlineSnapshot(`"NameLevelActionsNo Data"`);
    wrapper.unmount();
  });
});
