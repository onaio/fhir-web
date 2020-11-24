import { mount } from 'enzyme';
import React from 'react';
import { Router } from 'react-router';
import { history } from '@onaio/connected-reducer-registry';
import Table, { TableData } from '../Table';

describe('containers/pages/locations/locationunit', () => {
  const tableData: TableData[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      id: i.toString(),
      key: i.toString(),
      name: `Edrward ${i}`,
      geographicLevel: i,
    });
  }

  it('renders without crashing', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table setDetail={() => jest.fn()} accessToken="hunter 2" data={tableData} />
      </Router>
    );
    expect(wrapper.props()).toMatchSnapshot();
  });

  it('Test Table View Detail', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table
          setDetail={() => jest.fn()}
          accessToken="hunter 2"
          data={tableData}
          onViewDetails={() => wrapper.unmount()}
        />
      </Router>
    );

    wrapper.find('.more-options').first().simulate('click');
    wrapper.find('.viewdetails').first().simulate('click');

    expect(wrapper).toHaveLength(0);
  });

  it('Test Table Edit', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table setDetail={() => jest.fn()} accessToken="hunter 2" data={tableData} />
      </Router>
    );
    const firstAction = wrapper.find('.d-flex.justify-content-end.align-items-center').first();
    firstAction.find('button').simulate('click');
  });

  it('Test Name Sorting functionality', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table setDetail={() => jest.fn()} accessToken="hunter 2" data={tableData} />
      </Router>
    );

    const heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(3);
    heading.find('th').at(0).children().simulate('click');
    heading.find('th').at(0).children().simulate('click');

    const body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });

  it('Test Level Sorting functionality', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table setDetail={() => jest.fn()} accessToken="hunter 2" data={tableData} />
      </Router>
    );

    const heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(3);
    heading.find('th').at(1).children().simulate('click');
    heading.find('th').at(1).children().simulate('click');

    const body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });
});
