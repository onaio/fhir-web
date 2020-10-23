import { mount, shallow } from 'enzyme';
import flushPromises from 'flush-promises';
import React from 'react';
import { act } from 'react-dom/test-utils';
import LocationUnit, { data } from '..';
import { TREE } from '../../../../../utils/Tree';

describe('containers/pages/locations/locationunit', () => {
  const tableData: data[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      key: i.toString(),
      name: `Edrward ${i}`,
      level: i,
      lastupdated: new Date(`Thu Oct ${i} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
      status: 'Alive',
      type: 'Feautire',
      created: new Date(`Thu Oct ${i} 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
      externalid: `asdkjh123${i}`,
      openmrsid: `asdasdasdkjh123${i}`,
      username: `edward ${i}`,
      version: `${i}`,
      syncstatus: 'Synced',
    });
  }

  const tree: TREE[] = [
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
    const wrapper = shallow(<LocationUnit tableData={tableData} tree={tree} />);
    expect(wrapper.props()).toMatchSnapshot();
  });

  it('Render view details', () => {
    const wrapper = mount(<LocationUnit tableData={tableData} tree={tree} />);

    // click on view detail
    const first_action = wrapper.find('.d-flex.justify-content-end.align-items-center').first();
    first_action.children().last().simulate('click');
    wrapper.find('.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child').simulate('click');

    // find view details component
    let viewdetail = wrapper.find('.ant-col.ant-col-5.pl-3');
    expect(viewdetail.length).toBe(1);

    // Close View Details
    viewdetail.find('button').simulate('click');
    viewdetail = wrapper.find('.ant-col.ant-col-5.pl-3');
    expect(viewdetail.length).toBe(0);
  });

  it('Test view details close', () => {
    const wrapper = mount(<LocationUnit tableData={tableData} tree={tree} />);

    // click on view detail
    const first_row = wrapper.find('tr[data-row-key="1"]');
    first_row.find('span.ant-dropdown-trigger').simulate('click'); // click on dropdown icon
    wrapper.find('.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child').simulate('click'); // click on viewdetails

    // find view details component
    let viewdetail = wrapper.find('.ant-col.ant-col-5.pl-3');
    expect(viewdetail.length).toBe(1);

    // Close View Details
    viewdetail.find('button').simulate('click');
    viewdetail = wrapper.find('.ant-col.ant-col-5.pl-3');
    expect(viewdetail.length).toBe(0);
  });

  it('Test save functionality', async () => {
    const wrapper = mount(<LocationUnit tableData={tableData} tree={tree} />);

    // click edit button
    let first_row = wrapper.find('tr[data-row-key="1"]');
    first_row.find('button').simulate('click');

    first_row = wrapper.find('tr[data-row-key="1"]');
    first_row
      .children()
      .first()
      .find('input')
      .simulate('change', { target: { value: 'Testing 1' } });

    first_row.find('button').first().simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
  });

  it('Test cancel functionality', async () => {
    const wrapper = mount(<LocationUnit tableData={tableData} tree={tree} />);

    // click edit button
    let first_row = wrapper.find('tr[data-row-key="1"]');
    first_row.find('button').simulate('click');

    first_row = wrapper.find('tr[data-row-key="1"]');
    first_row
      .children()
      .first()
      .find('input')
      .simulate('change', { target: { value: 'Testing 1' } });

    first_row.find('button').last().simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
  });

  it('Test Name Sorting functionality', () => {
    const wrapper = mount(<LocationUnit tableData={tableData} tree={tree} />);

    let heading = wrapper.find('thead');
    expect(heading.find('th').length).toBe(4);
    heading.find('th').at(0).children().simulate('click');
    heading.find('th').at(0).children().simulate('click');

    let body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });

  it('Test Level Sorting functionality', () => {
    const wrapper = mount(<LocationUnit tableData={tableData} tree={tree} />);

    let heading = wrapper.find('thead');
    expect(heading.find('th').length).toBe(4);
    heading.find('th').at(1).children().simulate('click');
    heading.find('th').at(1).children().simulate('click');

    let body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });

  it('Test Last Updated Sorting functionality', () => {
    const wrapper = mount(<LocationUnit tableData={tableData} tree={tree} />);

    let heading = wrapper.find('thead');
    expect(heading.find('th').length).toBe(4);
    heading.find('th').at(2).children().simulate('click');
    heading.find('th').at(2).children().simulate('click');

    let body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });
});
