import { mount } from 'enzyme';
import React from 'react';
import { LocationUnitStatus, LocationUnitSyncStatus } from '../../../ducks/location-units';
import Table, { TableData } from '../Table';

describe('containers/pages/locations/locationunit', () => {
  const tableData: TableData[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      parentId: i.toString(),
      key: i.toString(),
      name: `Edrward ${i}`,
      geographicLevel: i,
      status: LocationUnitStatus.ACTIVE,
      type: 'Feautire',
      externalId: `asdkjh123${i}`,
      username: `edward ${i}`,
      version: i,
      syncstatus: LocationUnitSyncStatus.SYNCED,
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

  it('Test Table Edit', () => {
    const wrapper = mount(<Table data={tableData} />);
    const first_action = wrapper.find('.d-flex.justify-content-end.align-items-center').first();
    first_action.find('button').simulate('click');
  });

  it('Test Name Sorting functionality', () => {
    const wrapper = mount(<Table data={tableData} />);

    let heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(3);
    heading.find('th').at(0).children().simulate('click');
    heading.find('th').at(0).children().simulate('click');

    let body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });

  it('Test Level Sorting functionality', () => {
    const wrapper = mount(<Table data={tableData} />);

    let heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(3);
    heading.find('th').at(1).children().simulate('click');
    heading.find('th').at(1).children().simulate('click');

    let body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });
});
