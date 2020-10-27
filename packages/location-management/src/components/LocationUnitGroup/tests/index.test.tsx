import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { ConnectedLocationUnitGroupAdd } from '..';

describe('packages/components/locationunitgroup', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={store}>
        <ConnectedLocationUnitGroupAdd />
      </Provider>
    );
  });

  it('should open and close locations detail', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedLocationUnitGroupAdd />
      </Provider>
    );

    // click on view detail
    const firstAction = wrapper.find('.location-table-action').first();

    firstAction.children().last().simulate('click');
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
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedLocationUnitGroupAdd />
      </Provider>
    );

    // click edit button
    let firstRow = wrapper.find('tr[data-row-key="0"]');
    firstRow.find('.ant-table-cell').last().find('.edit').simulate('click');

    firstRow = wrapper.find('tr[data-row-key="0"]');
    firstRow
      .children()
      .first()
      .find('input')
      .simulate('change', { target: { value: 'Testing 1' } });

    firstRow.find('button').first().simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
  });

  it('should cancel location detail on edit', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedLocationUnitGroupAdd />
      </Provider>
    );

    // click edit button
    let firstRow = wrapper.find('tr[data-row-key="0"]');
    firstRow.find('.ant-table-cell').last().find('.edit').simulate('click');

    firstRow = wrapper.find('tr[data-row-key="0"]');
    firstRow
      .children()
      .first()
      .find('input')
      .simulate('change', { target: { value: 'Testing 1' } });

    firstRow.find('button').last().simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
  });

  it('renders onchange without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedLocationUnitGroupAdd />
      </Provider>
    );
    const firstRow = wrapper.find('.ant-input.ant-input-lg');
    firstRow.find('input').simulate('change', { target: { value: 'Testing 1' } });
  });
});
