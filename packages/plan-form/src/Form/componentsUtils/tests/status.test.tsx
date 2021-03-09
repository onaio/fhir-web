import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { PlanStatusRenderer } from '../status';

describe('status Renderer', () => {
  it('renderers correctly', () => {
    const props = { disabledFields: [], disAllowedStatusChoices: [], setFieldsValue: jest.fn() };
    const wrapper = mount(<PlanStatusRenderer {...props} />);

    expect(wrapper.find('.status-radio')).toHaveLength(8);
    wrapper.find('Radio.status-radio').forEach((radio) => {
      expect(radio.find('label').text()).toMatchSnapshot('radio button label');
      expect(toJson(radio.find('input'))).toMatchSnapshot('radio button input');
    });
  });

  it('shows a popup when changing to complete', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const setFieldMock = jest.fn();
    const props = { disabledFields: [], disAllowedStatusChoices: [], setFieldsValue: setFieldMock };
    const wrapper = mount(<PlanStatusRenderer {...props} />, { attachTo: container });

    // attempt simulating confirm on complete radio button
    wrapper.find('input[value="complete"]').simulate('click');
    // look for popup to confirm
    expect(wrapper.find('.ant-popover-content').text()).toMatchInlineSnapshot(
      `"Are you sure? you won't be able to change the status for complete plansnoyes"`
    );

    // simulate click on deny button
    expect(wrapper.find('button').first().text()).toMatchInlineSnapshot(`"no"`);
    wrapper.find('button').first().simulate('click');
    // nothing should change
    expect(setFieldMock).not.toHaveBeenCalled();

    // simulate click on confirm button
    expect(wrapper.find('button').last().text()).toMatchInlineSnapshot(`"yes"`);
    wrapper.find('button').last().simulate('click');
    // nothing should change
    expect(setFieldMock).toHaveBeenCalledWith({ status: 'complete' });
    wrapper.unmount();
  });

  it('shows a popup when clicking on active', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const setFieldMock = jest.fn();
    const props = { disabledFields: [], disAllowedStatusChoices: [], setFieldsValue: setFieldMock };
    const wrapper = mount(<PlanStatusRenderer {...props} />, { attachTo: container });

    // attempt simulating confirm on active radio button
    wrapper.find('input[value="active"]').simulate('click');
    // look for popup to confirm
    expect(wrapper.find('.ant-popover-content').text()).toMatchInlineSnapshot(
      `"Are you sure? you won't be able to change the status back to draftnoyes"`
    );

    // simulate click on deny button
    wrapper.find('button').first().simulate('click');
    // nothing should change
    expect(setFieldMock).not.toHaveBeenCalled();

    // simulate click on confirm button
    wrapper.find('button').last().simulate('click');
    // nothing should change
    expect(setFieldMock).toHaveBeenCalledWith({ status: 'active' });
  });

  it('shows a popup when clicking on draft', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const setFieldMock = jest.fn();
    const props = { disabledFields: [], disAllowedStatusChoices: [], setFieldsValue: setFieldMock };
    const wrapper = mount(<PlanStatusRenderer {...props} />, { attachTo: container });

    // attempt simulating confirm on active radio button
    wrapper.find('input[value="draft"]').simulate('click');
    // look for popup to confirm
    expect(wrapper.find('.ant-popover-content').text()).toMatchInlineSnapshot(
      `"Are you sure? status will be set to draftnoyes"`
    );

    // simulate click on deny button
    wrapper.find('button').first().simulate('click');
    // nothing should change
    expect(setFieldMock).not.toHaveBeenCalled();

    // simulate click on confirm button
    wrapper.find('button').last().simulate('click');
    // nothing should change
    expect(setFieldMock).toHaveBeenCalledWith({ status: 'draft' });
  });

  it('shows a popup when clicking on retired', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const setFieldMock = jest.fn();
    const props = { disabledFields: [], disAllowedStatusChoices: [], setFieldsValue: setFieldMock };
    const wrapper = mount(<PlanStatusRenderer {...props} />, { attachTo: container });

    // attempt simulating confirm on active radio button
    wrapper.find('input[value="retired"]').simulate('click');
    // look for popup to confirm
    expect(wrapper.find('.ant-popover-content').text()).toMatchInlineSnapshot(
      `"Are you sure? you won't be able to change the status for retired plansnoyes"`
    );

    // simulate click on deny button
    wrapper.find('button').first().simulate('click');
    // nothing should change
    expect(setFieldMock).not.toHaveBeenCalled();

    // simulate click on confirm button
    wrapper.find('button').last().simulate('click');
    // nothing should change
    expect(setFieldMock).toHaveBeenCalledWith({ status: 'retired' });
  });
  it('shows popup when trying to click activate but assigned Jurisdictions is null', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const setFieldMock = jest.fn();
    const props = {
      disabledFields: [],
      disAllowedStatusChoices: [],
      setFieldsValue: setFieldMock,
      assignedJurisdictions: [],
    };
    const wrapper = mount(<PlanStatusRenderer {...props} />, { attachTo: container });

    // attempt simulating confirm on active radio button
    wrapper.find('input[value="active"]').simulate('click');
    // look for popup with info that require activating plan
    expect(wrapper.find('.ant-popover-content').text()).toMatchInlineSnapshot(
      `"Assign jurisdictions to the Plan, to enable activating itCancelOK"`
    );

    // simulate click on both accept deny button
    wrapper.find('button').first().simulate('click');
    wrapper.find('button').last().simulate('click');

    // nothing should change
    expect(setFieldMock).not.toHaveBeenCalled();
  });
});
