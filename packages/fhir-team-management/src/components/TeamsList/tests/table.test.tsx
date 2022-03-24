/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { team } from '../../../tests/fixtures';
import Table from '../Table';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { Organization } from '../../../types';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();
const fhirBaseURL = 'https://fhirBaseURL.com';
const data: Organization[] = team.entry.map((e) => e.resource);

describe('components/TeamsList/table.tsx', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table fhirBaseURL={fhirBaseURL} data={data} />
      </Router>
    );
    expect(wrapper.find('table')).toHaveLength(1);
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

  it('Test Name Sorting functionality', async () => {
    const wrapper = mount(
      <Router history={history}>
        <Table fhirBaseURL={fhirBaseURL} data={data} />
      </Router>
    );

    const rowKeys = wrapper.find('tr[data-row-key]').map((row) => row.props()['data-row-key']);
    expect(rowKeys).toMatchObject([0, 1, 2, 3, 4]);

    // trigger sort on second column (first name)
    const sorter = wrapper.find('th.ant-table-column-has-sorters').at(0);
    sorter.simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // get newly ordered tr keys
    const rowKeys2 = wrapper.find('tr[data-row-key]').map((row) => row.props()['data-row-key']);
    expect(rowKeys2).toMatchObject([13, 14, 15, 16, 17]);
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
