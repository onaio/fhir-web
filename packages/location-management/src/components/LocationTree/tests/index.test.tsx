import { mount } from 'enzyme';
import React from 'react';
import Tree from '../';
import { treedata } from './fixtures';
import { store } from '@onaio/redux-reducer-registry';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';

describe('Location-module/locationunit', () => {
  it('renders without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} />
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    expect(wrapper.find('.ant-tree')).toHaveLength(1);
  });

  it('test tree search functionality', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} />
      </Provider>
    );

    const search = wrapper.find('input').first();
    search.simulate('change', { target: { value: 'kairouan' } });

    await act(async () => {
      await flushPromises();
    });

    expect(wrapper.find('.searchValue')).toHaveLength(1);
  });

  it('expand tree child using click', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={treedata} />
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    const treeItem = wrapper.find('span.ant-tree-title').first();
    treeItem.simulate('click');

    let treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children()).toHaveLength(treedata.length); // as per structure make sure we have 3 tree

    const expandButton = treeNode.find('span.ant-tree-switcher').first();
    expandButton.simulate('click');

    treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children().length).toBeGreaterThan(treedata.length); // as per structure make sure the parent tree is expended i.e more child
  });
});
