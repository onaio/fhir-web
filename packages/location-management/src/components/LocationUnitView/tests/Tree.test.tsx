import { mount } from 'enzyme';
import React from 'react';
import Tree from '../../LocationTree';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { generateJurisdictionTree } from '../../LocationTree/utils';
import { ParsedHierarchyNode, RawOpenSRPHierarchy, TreeNode } from '../../../ducks/types';

const getHierarchy: TreeNode = generateJurisdictionTree(
  (fixtures.sampleHierarchy as unknown) as RawOpenSRPHierarchy
);

describe('containers/pages/locations/locationunit', () => {
  const tree = [getHierarchy.model] as ParsedHierarchyNode[];

  it('renders without crashing', () => {
    const wrapper = mount(<Tree data={tree} />);
    expect(wrapper.find('.ant-tree')).toHaveLength(1);
    wrapper.unmount();
  });

  it('test tree search functionality', async () => {
    const wrapper = mount(<Tree data={tree} />);
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    const search = wrapper.find('input').first();
    search.simulate('change', { target: { value: 'Tunisia' } });
    expect(wrapper.find('span.ant-tree-title')).toHaveLength(1);
  });

  it('expand tree child using click', () => {
    const wrapper = mount(<Tree data={tree} OnItemClick={jest.fn()} />);
    let treeNode = wrapper.find('.ant-tree-list-holder-inner');
    const treeItem = wrapper.find('span.ant-tree-title');
    treeItem.simulate('click');
    wrapper.update();
    const expandButton = treeNode.find('span.ant-tree-switcher');
    expect(treeNode.children()).toHaveLength(1); // as per structure make sure we have one tree
    expandButton.simulate('click');
    treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children().length).toBeGreaterThan(1); // as per structure make sure the parent tree is expended i.e more child
    wrapper.unmount();
  });
});
