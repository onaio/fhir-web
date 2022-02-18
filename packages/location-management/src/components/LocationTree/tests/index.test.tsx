import { mount } from 'enzyme';
import React from 'react';
import Tree from '../';
import flushPromises from 'flush-promises';
import { treedata } from '../../../ducks/locationHierarchy/tests/hierarchyFixtures';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';
import { setLocationTreeState } from '../../../ducks/location-hierarchy';

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

    // Todo need to filter out Ant tree motion child from length
    expect(treeNode.children()).toHaveLength(4); // as per structure make sure we have 3 tree

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

    expect(toJson(wrapper.find('.ant-tree-list-holder-inner').children())).toHaveLength(4);
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

  it('issue #474 Selecting nodes and caret collapsing/expanding works', async () => {
    store.dispatch(setLocationTreeState({ keys: [], node: undefined }));
    const div = document.createElement('div');
    document.body.appendChild(div);
    const tunisiaTree = treedata[0];
    const wrapper = mount(
      <Provider store={store}>
        <Tree data={[tunisiaTree]} OnItemClick={jest.fn()} />
      </Provider>,
      { attachTo: div }
    );

    await act(async () => {
      await flushPromises();
    });

    const rootNode = wrapper.find('.ant-tree-title');
    // rootNode is one and belongs to Tunisia
    expect(rootNode.text()).toMatchInlineSnapshot(`"Tunisia"`);
    // simulate click on rootNode
    rootNode.simulate('click');
    wrapper.update();

    // check the expandedKeys prop in tree.
    expect(wrapper.find('Tree').last().prop('expandedKeys')).toEqual(['Tunisia']);

    // now find the caret next to Tunisia and click to simulate collapsing Tunisia
    // that did not work so we will call the expand prop on the ant tree component directly

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.find('Tree').last().prop('onExpand') as any)?.([]);
    wrapper.update();

    // check again the list of expanded keys, should be empty
    expect(wrapper.find('Tree').last().prop('expandedKeys')).toEqual([]);

    wrapper.unmount();
  });
});
