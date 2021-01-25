import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import fetch from 'jest-fetch-mock';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { notification } from 'antd';
import { Router } from 'react-router';
import LocationUnitView, { loadSingleLocation, parseTableData } from '..';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { authenticateUser } from '@onaio/session-reducer';
import { baseLocationUnits, rawHierarchy, parsedHierarchy } from './fixtures';
import { baseURL, ERROR_OCCURED } from '../../../constants';
import { getBaseTreeNode, getHierarchy } from '../../../ducks/locationHierarchy/utils';

LocationUnitView.defaultProps = { opensrpBaseURL: baseURL };

describe('location-management/src/components/LocationUnitView', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  it('test resolve loadSingleLocation', async () => {
    fetch.mockResponse(JSON.stringify(baseLocationUnits[0]));
    const called = jest.fn();

    const row = {
      geographicLevel: parsedHierarchy[0].node.attributes.geographicLevel,
      id: parsedHierarchy[0].id,
      key: '0',
      name: parsedHierarchy[0].title,
    };

    await loadSingleLocation(row, baseURL, called);

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

    await loadSingleLocation(row, baseURL, jest.fn());

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: ERROR_OCCURED,
      description: undefined,
    });
  });

  it('test getBaseTreeNode', async () => {
    fetch.mockResponse(JSON.stringify(baseLocationUnits));

    const response = await getBaseTreeNode(baseURL);

    await new Promise((resolve) => setImmediate(resolve));
    expect(response).toMatchObject(baseLocationUnits);
  });

  it('test parseTableData', () => {
    const response = parseTableData(parsedHierarchy);

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

    await flushPromises();
    const response = await getHierarchy([baseLocationUnits[2]], baseURL);

    await flushPromises();

    expect(response).toMatchObject([rawHierarchy[2]]);
  });

  it('fail loading location ', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');

    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView opensrpBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: ERROR_OCCURED,
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
          <LocationUnitView opensrpBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: ERROR_OCCURED,
      description: undefined,
    });
  });

  it('location unit table renders correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView opensrpBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchObject([
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
  });

  it('change table view when clicked on tree node', async () => {
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView opensrpBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const tablelastrow = {
      geographicLevel: baseLocationUnits[2].properties.geographicLevel,
      id: baseLocationUnits[2].id,
      key: '2',
      name: baseLocationUnits[2].properties.name,
    };

    expect(wrapper.find('tbody BodyRow').last().prop('record')).toMatchObject(tablelastrow);

    // test table with tree node without any child
    const treeItemwithoutchild = wrapper.find('span.ant-tree-title').last();
    treeItemwithoutchild.simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('tbody BodyRow').last().prop('record')).toMatchObject(tablelastrow); // table didn't change

    // test table with tree node with child
    const treeItemwithchild = wrapper.find('span.ant-tree-title').first();
    treeItemwithchild.simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('tbody BodyRow').last().prop('record')).not.toMatchObject(tablelastrow); // table changed
  });

  it('test Open view details', async () => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits[0]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView opensrpBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('.more-options').first().simulate('click');
    wrapper.find('.viewdetails').first().simulate('click');

    // test out loading animation works correctly
    expect(wrapper.find('.ant-spin')).toHaveLength(1);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('.ant-spin')).toHaveLength(0);
    expect(wrapper.find('LocationUnitDetail')).toHaveLength(1);
  });

  it('test Close view details', async () => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits[0]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView opensrpBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('.more-options').first().simulate('click');
    wrapper.find('.viewdetails').first().simulate('click');

    // test out loading animation works correctly
    expect(wrapper.find('.ant-spin')).toHaveLength(1);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('.ant-spin')).toHaveLength(0);
    expect(wrapper.find('LocationUnitDetail')).toHaveLength(1);

    // close LocationUnitDetail
    wrapper.find('LocationUnitDetail button').simulate('click');
    expect(wrapper.find('LocationUnitDetail')).toHaveLength(0);
  });
});
