/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { healthcareservice } from '../../../tests/fixtures';
import Table from '../Table';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { HealthcareService } from '../../../types';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();
const data: HealthcareService[] = healthcareservice.entry.map((e, i) => ({
  ...e.resource,
  key: i,
}));

describe('components/TeamsList/table.tsx', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('renders without crashing', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table data={data} />
      </Router>
    );
    expect(wrapper.props().children.props.children).toMatchSnapshot('Table');
  });

  it('Test Table View Detail', async () => {
    const onViewDetails = jest.fn();

    const wrapper = mount(
      <Router history={history}>
        <Table data={data} onViewDetails={onViewDetails} />
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
        <Table data={data} />
      </Router>
    );

    const heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(4);
    heading.find('th').at(0).children().simulate('click');
    heading.find('th').at(0).children().simulate('click');

    const body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe(0);
    expect(body.children().last().prop('rowKey')).toBe(1);
  });

  it('Test Active Sorting functionality', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table data={data} />
      </Router>
    );

    const heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(4);
    heading.find('th').at(1).children().simulate('click');
    heading.find('th').at(1).children().simulate('click');

    const body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe(2);
    expect(body.children().last().prop('rowKey')).toBe(4);
  });

  it('Test Last Updated Sorting functionality', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table data={data} />
      </Router>
    );

    const heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(4);
    heading.find('th').at(2).children().simulate('click');
    heading.find('th').at(2).children().simulate('click');

    const body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe(0);
    expect(body.children().last().prop('rowKey')).toBe(1);
  });

  it('Should show table pagination options', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table data={data} />
      </Router>
    );
    expect(wrapper.find('.ant-table-pagination')).toBeTruthy();
  });
});
