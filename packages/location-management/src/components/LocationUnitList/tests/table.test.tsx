import { mount } from 'enzyme';
import React from 'react';
import { Router } from 'react-router';
import { history } from '@onaio/connected-reducer-registry';
import Table, { TableData } from '../Table';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';

describe('location-management/src/components/LocationUnitList', () => {
  const tableData: TableData[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      id: i.toString(),
      label: `Edrward ${i}`,
      geographicLevel: i,
    });
  }

  it('renders without crashing', async () => {
    const wrapper = mount(
      <Router history={history}>
        <Table data={tableData} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.prop('children')).toMatchSnapshot();
  });

  it('Test Table View Detail', async () => {
    const onViewDetails = jest.fn();

    const wrapper = mount(
      <Router history={history}>
        <Table data={tableData} onViewDetails={onViewDetails} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('table')).toHaveLength(1);

    const firstAction = wrapper.find('.Actions').first();
    firstAction.find('button').last().simulate('click');

    expect(onViewDetails).toBeCalled();
  });

  it('Test Table View Detai prop is undefined', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table data={tableData} />
      </Router>
    );

    const firstAction = wrapper.find('.Actions').first();
    firstAction.find('button').last().simulate('click');

    expect(wrapper).toHaveLength(1);
  });

  it('Test Table Edit', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table data={tableData} />
      </Router>
    );

    const firstAction = wrapper.find('.Actions').first();
    firstAction.find('button').first().simulate('click');
  });

  it('Should show table pagination options', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table data={tableData} />
      </Router>
    );
    expect(wrapper.find('.ant-table-pagination')).toBeTruthy();
  });
});
