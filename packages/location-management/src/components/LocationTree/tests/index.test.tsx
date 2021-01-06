import { mount } from 'enzyme';
import React from 'react';
import Tree, { getBaseTreeNode, getHierarchy } from '../';
import { accessToken, opensrpBaseURL, rawHierarchy, treedata } from './fixtures';
import { store } from '@onaio/redux-reducer-registry';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { baseLocationUnits } from '../../LocationUnitView/tests/fixtures';
import { baseURL } from '../../../constants';

describe('location-management/src/components/LocationTree', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('test getHierarchy', async () => {
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));
    const response = await getHierarchy([baseLocationUnits[2]], 'accessToken', baseURL);
    expect(response).toMatchObject([rawHierarchy[2]]);
  });

  it('test getBaseTreeNode', async () => {
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    const response = await getBaseTreeNode('accessToken', baseURL);
    expect(response).toMatchObject(baseLocationUnits);
  });

  it('renders without crashing', async () => {
    fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

    const wrapper = mount(
      <Provider store={store}>
        <Tree opensrpBaseURL={opensrpBaseURL} accessToken={accessToken} OnItemClick={jest.fn} />
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls).toMatchObject([
      [
        'https://test-example.com/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer Token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://test-example.com/rest/location/hierarchy/a26ca9c8-1441-495a-83b6-bb5df7698996',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer Token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://test-example.com/rest/location/hierarchy/b652b2f4-a95d-489b-9e28-4629746db96a',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer Token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://test-example.com/rest/location/hierarchy/6bf9c085-350b-4bb2-990f-80dc2caafb33',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer Token',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    expect(wrapper.find('.ant-tree')).toHaveLength(1);
  });

  it('test tree search functionality', async () => {
    // fetch.mockResponseOnce(JSON.stringify(baseLocationUnits));
    // fetch.mockResponseOnce(JSON.stringify(rawHierarchy[0]));
    // fetch.mockResponseOnce(JSON.stringify(rawHierarchy[1]));
    // fetch.mockResponseOnce(JSON.stringify(rawHierarchy[2]));

    const wrapper = mount(
      <Provider store={store}>
        <Tree opensrpBaseURL={opensrpBaseURL} accessToken={accessToken} OnItemClick={jest.fn} />
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    const search = wrapper.find('input').first();
    search.simulate('change', { target: { value: 'kairouan' } });

    expect(wrapper.find('.searchValue')).toHaveLength(1);
  });

  it('right props are passed on click', async () => {
    const mockfn = jest.fn();

    const wrapper = mount(
      <Provider store={store}>
        <Tree opensrpBaseURL={opensrpBaseURL} accessToken={accessToken} OnItemClick={mockfn} />
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    const treeItem = wrapper.find('span.ant-tree-title').last();
    treeItem.simulate('click');

    expect(mockfn).toBeCalledWith({
      children: undefined,
      id: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
      key: 'Malawi',
      label: 'Malawi',
      node: {
        attributes: {
          geographicLevel: 0,
        },
        locationId: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
        name: 'Malawi',
        voided: false,
      },
      title: 'Malawi',
    });
  });

  it('expand tree child using click', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree opensrpBaseURL={opensrpBaseURL} accessToken={accessToken} OnItemClick={jest.fn()} />
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    let treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children()).toHaveLength(treedata.length); // as per structure make sure we have 3 tree

    const expandButton = treeNode.find('span.ant-tree-switcher').first();
    expandButton.simulate('click');

    treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children().length).toBeGreaterThan(treedata.length); // as per structure make sure the parent tree is expended i.e more child
  });
});
