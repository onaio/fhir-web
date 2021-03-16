import { mount } from 'enzyme';
import React from 'react';
import Tree from '../';
import flushPromises from 'flush-promises';
import { treedata } from '../../../ducks/locationHierarchy/tests/hierarchyFixtures';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';

describe('location-management/src/components/LocationTree', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} OnItemClick={jest.fn} />
      </Provider>
    );

    await act(async () => {
      wrapper.update();
    });

    expect(wrapper.find('.ant-tree')).toHaveLength(1);
    wrapper.unmount();
  });

  it('test tree search functionality', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} OnItemClick={jest.fn} />
      </Provider>
    );

    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'ke' } });
    wrapper.update();
    expect(wrapper.find('.searchValue').text()).toEqual('ke');
    wrapper.unmount();
  });

  it('right props are passed on click', async () => {
    const mockfn = jest.fn();

    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} OnItemClick={mockfn} />
      </Provider>
    );

    const treeItem = wrapper.find('span.ant-tree-title').last();
    treeItem.simulate('click');

    await act(async () => {
      wrapper.update();
    });

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
    wrapper.unmount();
  });

  it('expand tree child using click', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} OnItemClick={jest.fn()} />
      </Provider>
    );

    let treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children().length).toBeGreaterThan(treedata.length); // as per structure make sure we have 3 tree

    const expandButton = treeNode.find('span.ant-tree-switcher').first();
    expandButton.simulate('click');

    wrapper.update();
    treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children().length).toBeGreaterThan(treedata.length); // as per structure make sure the parent tree is expended i.e more child
    wrapper.unmount();
  });

  it('expand tree child using caret click', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} OnItemClick={jest.fn()} />
      </Provider>
    );

    wrapper.find('span.ant-tree-switcher').first().simulate('click');
    wrapper.update();
    wrapper.find('span.ant-tree-switcher').first().simulate('click');
    wrapper.update();

    expect(toJson(wrapper.find('.ant-tree-list-holder-inner').children())).toHaveLength(3);
    expect(wrapper.find('.ant-tree-treenode').children().length).toBeGreaterThan(treedata.length); // as per structure make sure the parent tree is expended i.e more child
    wrapper.unmount();
  });

  it('expand tree child using title click', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} OnItemClick={jest.fn()} />
      </Provider>
    );

    let treeNode = wrapper.find('.ant-tree-list-holder-inner');

    const treeTitle = treeNode.find('span.ant-tree-title').first();
    treeTitle.simulate('click');
    treeTitle.simulate('click');

    await act(async () => {
      wrapper.update();
    });

    treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children().length).toBeGreaterThan(treedata.length); // as per structure make sure the parent tree is expended i.e more child
    wrapper.unmount();
  });

  it('should highlight selected tree item', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} OnItemClick={jest.fn()} />
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    let treeNode = wrapper.find('.ant-tree-list-holder-inner');

    const treeTitle = treeNode.find('span.ant-tree-title').first();
    treeTitle.simulate('click');

    treeNode = wrapper.find('.ant-tree-node-selected');
    expect(treeNode).toHaveLength(1);
    wrapper.unmount();
  });
});
