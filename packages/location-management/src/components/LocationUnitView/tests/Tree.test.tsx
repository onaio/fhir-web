import { mount } from 'enzyme';
import React from 'react';
import Tree from '../../LocationTree';
import * as fixtures from './fixtures';
import {
  generateJurisdictionTree,
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
  TreeNode,
} from '../../LocationTree/utils';

const getHierarchy: TreeNode = generateJurisdictionTree(
  (fixtures.sampleHierarchy as unknown) as RawOpenSRPHierarchy
);

describe('containers/pages/locations/locationunit', () => {
  const tree = [getHierarchy.model] as ParsedHierarchyNode[];

  it('renders without crashing', () => {
    const wrapper = mount(<Tree data={tree} />);
    expect(wrapper.find('.ant-tree')).toHaveLength(1);
  });

  it('test tree search functionality', async () => {
    const wrapper = mount(<Tree data={tree} />);
    const search = wrapper.find('input').first();
    search.simulate('change', { target: { value: 'Tunisia' } });
    expect(wrapper.find('span.site-tree-search-value')).toHaveLength(1);
  });

  it('test child node search', async () => {
    const wrapper = mount(<Tree data={tree} />);
    const search = wrapper.find('input').first();
    search.simulate('change', { target: { value: 'Sousse' } });
    expect(wrapper.find('span.site-tree-search-value')).toHaveLength(0);
  });

  it('expand tree child using click', () => {
    const wrapper = mount(<Tree data={tree} OnItemClick={jest.fn()} />);
    let treeNode = wrapper.find('.ant-tree-list-holder-inner');
    const treeItem = wrapper.find('span.ant-tree-title > span');
    treeItem.simulate('click');
    wrapper.update();
    const expandButton = treeNode.find('span.ant-tree-switcher');
    expect(treeNode.children()).toHaveLength(1); // as per structure make sure we have one tree
    expandButton.simulate('click');
    treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children().length).toBeGreaterThan(1); // as per structure make sure the parent tree is expended i.e more child
  });
});
