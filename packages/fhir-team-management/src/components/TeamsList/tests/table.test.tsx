/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { team } from '../../../tests/fixtures';
import Table, { TableData } from '../Table';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/store')),
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();
const fhirBaseURL = 'https://fhirBaseURL.com';
const data: TableData[] = team.entry.map((e, i) => ({
  ...e.resource,
  key: i,
}));

describe('components/TeamsList/table.tsx', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table fhirBaseURL={fhirBaseURL} data={data} />
      </Router>
    );
    expect(wrapper.props().children.props.children).toMatchSnapshot('Table');
  });

  it('Test Table View Detail', async () => {
    const onViewDetails = jest.fn();

    const wrapper = mount(
      <Router history={history}>
        <Table fhirBaseURL={fhirBaseURL} data={data} onViewDetails={onViewDetails} />
      </Router>
    );
    await act(async () => {
      wrapper.find('Dropdown').first().simulate('click');
      await flushPromises();
      wrapper.update();
      wrapper.find('MenuItem').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });
    expect(onViewDetails).toBeCalled();
    wrapper.unmount();
  });

  it('Test Name Sorting functionality', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table fhirBaseURL={fhirBaseURL} data={data} />
      </Router>
    );

    const heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(3);
    heading.find('th').at(0).children().simulate('click');
    heading.find('th').at(0).children().simulate('click');

    const body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe(11);
    expect(body.children().last().prop('rowKey')).toBe(9);
  });

  it('Should show table pagination options', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table fhirBaseURL={fhirBaseURL} data={data} />
      </Router>
    );
    expect(wrapper.find('.ant-table-pagination')).toBeTruthy();
  });
});
