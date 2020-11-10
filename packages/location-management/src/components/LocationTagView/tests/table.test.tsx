import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Table, { TableData } from '../Table';

describe('containers/pages/locations/locationTagView', () => {
  const tableData: TableData[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      key: i.toString(),
      id: i,
      name: `Edrward ${i}`,
      active: i % 2 === 0,
      description: `asdasdasdkjh123${i}`,
    });
  }

  it('renders without crashing', () => {
    const wrapper = mount(<Table data={tableData} />);

    expect(wrapper.props()).toMatchSnapshot();
  });

  it('Test Table View Detail', () => {
    const wrapper = mount(<Table data={tableData} onViewDetails={() => wrapper.unmount()} />);

    wrapper.find('.more-options').first().simulate('click');
    wrapper.find('.viewdetails').first().simulate('click');

    expect(wrapper).toHaveLength(0);
  });

  it('Test Table Delete', () => {
    const wrapper = mount(<Table data={tableData} />);

    wrapper.find('.more-options').first().simulate('click');
    wrapper.find('.delete').first().simulate('click');
    const temp = wrapper.find('div.ant-popover-content');
    const temp2 = temp.find('.ant-popover-buttons');
    expect(toJson(temp)).toMatchSnapshot();
    temp2.find('button').simulate('click');
  });

  it('Test Name Sorting functionality', () => {
    const wrapper = mount(<Table data={tableData} />);

    let heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(2);
    heading.find('th').at(0).children().simulate('click');
    heading.find('th').at(0).children().simulate('click');

    let body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });
});
