import { mount } from 'enzyme';
import React from 'react';
import Tree, { TreeData } from '../Tree';

describe('containers/pages/locations/locationunit', () => {
  const tree: TreeData[] = [
    {
      title: 'Sierra Leone',
      key: 'Sierra Leone',
      children: [
        { title: 'Bo', key: 'Bo', children: [{ title: '1', key: '1' }] },
        { title: 'Bombali', key: 'Bombali', children: [{ title: '2', key: '2' }] },
        {
          title: 'Bonthe',
          key: 'Bonthe',
          children: [
            {
              title: 'Kissi Ten',
              key: 'Kissi Ten',
              children: [{ title: 'Bayama CHP', key: 'Bayama CHP' }],
            },
          ],
        },
      ],
    },
  ];

  it('renders without crashing', () => {
    const wrapper = mount(<Tree data={tree} />);
    expect(wrapper.find('.ant-tree')).toHaveLength(1);
  });

  it('tree search functionality', async () => {
    const wrapper = mount(<Tree data={tree} />);
    const search = wrapper.find('input').first();
    search.simulate('change', { target: { value: '1' } });
    expect(wrapper.find('span.site-tree-search-value')).toHaveLength(1);
  });

  it('expand tree child using click', () => {
    const wrapper = mount(<Tree data={tree} />);
    let treeNode = wrapper.find('.ant-tree-list-holder-inner');
    const expandButton = treeNode.find('span.ant-tree-switcher');
    expect(treeNode.children()).toHaveLength(1); // as per structure make sure we have one tree
    expandButton.simulate('click');

    treeNode = wrapper.find('.ant-tree-list-holder-inner');
    expect(treeNode.children().length).toBeGreaterThan(1); // as per structure make sure the parent tree is expended i.e more child
  });
});
