import { mount, shallow } from 'enzyme';
import flushPromises from 'flush-promises';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { LocationUnit } from '..';

describe('containers/pages/locations/locationunit', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<LocationUnit />);
    expect(wrapper.props()).toMatchSnapshot();
  });

  it('Render Set details', () => {
    const wrapper = mount(<LocationUnit />);

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

  it('Render Set details', () => {
    const wrapper = mount(<LocationUnit />);

    // click on view detail
    const first_row = wrapper.find('tr[data-row-key="0"]');
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
    const wrapper = mount(<LocationUnit />);

    // click edit button
    let first_row = wrapper.find('tr[data-row-key="0"]');
    first_row.find('button').simulate('click');

    first_row = wrapper.find('tr[data-row-key="0"]');
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

  it('Test canale functionality', async () => {
    const wrapper = mount(<LocationUnit />);

    // click edit button
    let first_row = wrapper.find('tr[data-row-key="0"]');
    first_row.find('button').simulate('click');

    first_row = wrapper.find('tr[data-row-key="0"]');
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
});
