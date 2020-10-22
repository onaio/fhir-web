import { mount, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { LocationUnitGroup } from '..';

describe('containers/pages/locations/locationunitgroup', () => {
  it('renders without crashing', () => {
    shallow(<LocationUnitGroup />);
  });

  it('should open and close locations detail', () => {
    const wrapper = mount(<LocationUnitGroup />);

    // click on view detail
    const first_action = wrapper.find('.location-table-action').first();

    first_action.children().last().simulate('click');
    wrapper
      .find('.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child')
      .first()
      .simulate('click');

    let viewDetail = wrapper.find('.ant-col.ant-col-8.pl-3.border-left');
    expect(viewDetail.length).toBe(1);

    viewDetail.find('button').simulate('click');
    viewDetail = wrapper.find('.ant-col.ant-col-8.pl-3.border-left');
    expect(viewDetail.length).toBe(0);
  });

  it('should save location detail on edit', async () => {
    const wrapper = mount(<LocationUnitGroup />);

    // click edit button
    let first_row = wrapper.find('tr[data-row-key="0"]');
    first_row.find('.ant-table-cell').last().find('.edit').simulate('click');

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

  it('should cancel location detail on edit', async () => {
    const wrapper = mount(<LocationUnitGroup />);

    // click edit button
    let first_row = wrapper.find('tr[data-row-key="0"]');
    first_row.find('.ant-table-cell').last().find('.edit').simulate('click');

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

  it('renders onchange without crashing', () => {
    const wrapper = mount(<LocationUnitGroup />);
    let first_row = wrapper.find('.ant-input.ant-input-lg');
    first_row.find('input').simulate('change', { target: { value: 'Testing 1' } });
  });
});
