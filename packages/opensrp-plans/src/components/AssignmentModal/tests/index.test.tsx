/* eslint-disable no-irregular-whitespace */
import { mount, shallow } from 'enzyme';
import { EditAssignmentsModal } from '..';
import React from 'react';

import { act } from 'react-dom/test-utils';
import { Dictionary } from '@onaio/utils';

describe('planAssignment modal', () => {
  it('renders without crashing', () => {
    shallow(<EditAssignmentsModal />);
  });

  it('renders correctly', async () => {
    const saveHandlerMock = jest.fn(() => Promise.resolve());
    const cancelHandlerMock = jest.fn();
    const invokeText = 'invoke modal';
    const modalTitle = 'Modal title';
    const placeHolder = 'placeholder';
    const options = [
      { label: 'label1', value: 'value1' },
      { label: 'label2', value: 'value2' },
    ];
    const props = {
      saveHandler: saveHandlerMock,
      cancelHandler: cancelHandlerMock,
      invokeText,
      modalTitle,
      placeHolder,
      existingOptions: [options[0]],
      options,
    };
    const wrapper = mount(<EditAssignmentsModal {...props} />);
    expect(wrapper.find('button').text()).toEqual(invokeText);

    // simulate to open modal
    wrapper.find('button').simulate('click');
    wrapper.update();

    // modal text: cancel button, save button, placeholder and default option
    expect(wrapper.find('Modal').text()).toMatchInlineSnapshot(`"Modal titlelabel1 CancelSave"`);

    act(() => {
      // TODO - find a way to properly mock antd multi select onchange event
      (wrapper.find('Modal Select').props() as Dictionary).onChange(
        ['value2'],
        [{ label: 'label2', value: 'value2' }]
      );
      wrapper.update();
    });

    // show search is true
    expect((wrapper.find('Modal Select').props() as Dictionary).showSearch).toBeTruthy();

    // filter props works correctly
    expect(
      (wrapper.find('Modal Select').props() as Dictionary).filterOption('abel2', {
        label: 'label2',
        value: 'value2',
      })
    ).toBeTruthy();

    expect(
      (wrapper.find('Modal Select').props() as Dictionary).filterOption('lube2', {
        label: 'label2',
        value: 'value2',
      })
    ).toBeFalsy();

    // try saving
    const saveButton = wrapper.find('button').at(3);
    expect(saveButton.text()).toEqual('Save');
    await act(async () => {
      saveButton.simulate('click');
      wrapper.update();
    });

    // expect save handler to have been called
    expect(saveHandlerMock).toHaveBeenCalledTimes(1);
    expect(saveHandlerMock.mock.calls[0]).toEqual([
      [
        {
          label: 'label2',
          value: 'value2',
        },
      ],
    ]);
  });

  it('save Error', async () => {
    const errorMessage = 'Something went wrong';
    const saveHandlerMock = jest.fn(async () => {
      throw new Error(errorMessage);
    });

    const props = {
      saveHandler: saveHandlerMock,
    };
    const wrapper = mount(<EditAssignmentsModal {...props} />);

    // simulate to open modal
    wrapper.find('button').simulate('click');
    wrapper.update();

    // modal text: cancel button, save button, placeholder and default option
    expect(wrapper.find('Modal').text()).toMatchInlineSnapshot(`"Edit teams SelectCancelSave"`);

    // try saving
    const saveButton = wrapper.find('button').at(3);
    expect(saveButton.text()).toEqual('Save');
    await act(async () => {
      saveButton.simulate('click');
      wrapper.update();
    });

    // expect save handler to have been called
    expect(saveHandlerMock).toHaveBeenCalledTimes(1);

    // should have errorMessage:
    expect(wrapper.find('Modal').text()).toMatchInlineSnapshot(
      `"Edit teamsSomething went wrong SelectCancelSave"`
    );
    expect(wrapper.text().includes(errorMessage)).toBeTruthy();
  });

  it('calls cancel callback', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const cancelHandlerMock = jest.fn();

    const props = {
      cancelHandler: cancelHandlerMock,
    };
    const wrapper = mount(<EditAssignmentsModal {...props} />, { attachTo: div });

    // simulate to open modal
    wrapper.find('button').simulate('click');
    wrapper.update();

    // modal text: cancel button, save button
    expect(wrapper.find('Modal').text()).toMatchInlineSnapshot(`"Edit teams SelectCancelSave"`);

    // try canceling
    const cancelButton = wrapper.find('button').at(2);
    expect(cancelButton.text()).toEqual('Cancel');
    act(() => {
      cancelButton.simulate('click');
      wrapper.update();
    });

    // expect save handler to have been called
    expect(cancelHandlerMock).toHaveBeenCalledTimes(1);
  });
});
