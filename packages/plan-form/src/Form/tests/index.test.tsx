/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PlanForm, propsForUpdatingPlans } from '../';
import { Form } from 'antd';
import { generatePlanDefinition, getPlanFormValues } from '../../helpers/utils';
import { mission1, newPayload1 } from './fixtures';
import { act } from 'react-dom/test-utils';
import { PlanStatus } from '@opensrp/plan-form-core';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

/** place to mount the application/component to the JSDOM document during testing.
 * https://github.com/reactstrap/reactstrap/issues/773#issuecomment-373451256
 */
const div = document.createElement('div');
document.body.appendChild(div);

describe('containers/forms/PlanForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>,
      { attachTo: div }
    );
  });

  it('renders correctly', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>,
      { attachTo: div }
    );
    expect(toJson(wrapper.find('#interventionType label'))).toMatchSnapshot(
      'interventionType label'
    );
    expect(toJson(wrapper.find('#interventionType select'))).toMatchSnapshot(
      'interventionType field'
    );

    expect(toJson(wrapper.find('#title label'))).toMatchSnapshot('title label 1');
    expect(toJson(wrapper.find('#title input'))).toMatchSnapshot('title field');

    expect(wrapper.find('#name label')).toHaveLength(0);
    expect(toJson(wrapper.find('#name input'))).toMatchSnapshot('name field');
    expect(wrapper.find('#identifier label')).toHaveLength(0);
    expect(toJson(wrapper.find('#identifier input'))).toMatchSnapshot('identifier field');
    expect(wrapper.find('#version label')).toHaveLength(0);
    expect(toJson(wrapper.find('#version input'))).toMatchSnapshot('version field');
    expect(wrapper.find('#taskGenerationStatus label')).toHaveLength(0);
    expect(toJson(wrapper.find('#taskGenerationStatus input'))).toMatchSnapshot(
      'taskGenerationStatus field'
    );
    expect(toJson(wrapper.find('#status label'))).toMatchSnapshot('status label');
    expect(toJson(wrapper.find('#status select'))).toMatchSnapshot('status field');
    expect(toJson(wrapper.find('#dateRange label'))).toMatchSnapshot('date range label');
    expect(toJson(wrapper.find('#dateRange input'))).toMatchSnapshot('start field');
    expect(wrapper.find('#date label')).toHaveLength(0);
    expect(toJson(wrapper.find('#date input'))).toMatchSnapshot('date field');
    expect(wrapper.find('#description label')).toMatchSnapshot('description label');
    expect(toJson(wrapper.find('#description textarea'))).toMatchSnapshot('date field');
    expect(toJson(wrapper.find('#planform-submit-button button'))).toMatchSnapshot('submit button');

    // should have triggers or conditions
    expect(wrapper.find('.triggers-conditions')).toHaveLength(12);

    wrapper.unmount();
  });

  it('renders dynamic plans correctly', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>,
      { attachTo: div }
    );

    // collapse the trigger panels
    wrapper.find('.ant-collapse-header').forEach((wrap) => {
      wrap.simulate('click');
    });
    wrapper.update();

    wrapper.find('.triggers-conditions').forEach((wrap, index) => {
      expect(toJson(wrap.find('.triggers-fieldset legend'))).toMatchSnapshot(
        `triggers legends ${index}`
      );
      expect(toJson(wrap.find('.trigger-group label'))).toMatchSnapshot(`triggers labels ${index}`);
      expect(toJson(wrap.find('.triggers-fieldset input'))).toMatchSnapshot(
        `triggers inputs ${index}`
      );

      expect(toJson(wrap.find('.conditions-fieldset legend'))).toMatchSnapshot(
        `conditions legends ${index}`
      );
      expect(toJson(wrap.find('.condition-group label'))).toMatchSnapshot(
        `conditions labels ${index}`
      );
      expect(toJson(wrap.find('.conditions-fieldset input'))).toMatchSnapshot(
        `conditions inputs ${index}`
      );
      expect(toJson(wrap.find('.conditions-fieldset textarea'))).toMatchSnapshot(
        `conditions textareas ${index}`
      );
    });
  });

  it('Form validation works', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>,
      { attachTo: container }
    );

    let formInstance = (wrapper.find(Form).props() as any).form;
    let errors = formInstance.getFieldsError();

    let fieldsWithErrors = errors.filter((error) => error.errors.length > 0);

    // No errors are shown initially
    expect(fieldsWithErrors).toMatchSnapshot(' Initial Errors');

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise<any>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    formInstance = (wrapper.find(Form).props() as any).form;
    errors = formInstance.getFieldsError();

    fieldsWithErrors = errors.filter((error) => error.errors.length > 0);

    // we now have some errors
    expect(fieldsWithErrors).toMatchSnapshot('Errors');

    // name is required
    expect(
      (wrapper.find('FormItem[name="name"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('name error');

    // title is required
    expect(
      (wrapper.find('FormItem[name="title"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('title error');

    // description is required
    expect(
      (wrapper.find('FormItem[name="description"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('title error');

    // let us cause errors for other required fields and ascertain that they are indeed validated

    // Remove the date field value
    wrapper.find('#date input').simulate('change', { target: { name: 'date', value: '' } });

    // Remove the dateRange field value
    formInstance.setFieldsValue({ dateRange: '' });

    // Remove the interventionType field value
    formInstance.setFieldsValue({ interventionType: '' });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise<any>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    formInstance = (wrapper.find(Form).props() as any).form;
    errors = formInstance.getFieldsError();

    fieldsWithErrors = errors.filter((error) => error.errors.length > 0);

    // we now have some more errors
    expect(fieldsWithErrors).toMatchSnapshot('more Errors');

    // date is required
    expect(
      (wrapper.find('FormItem[name="date"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('date error');

    // interventionType is required
    expect(
      (wrapper.find('FormItem[name="interventionType"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('interventionType error');

    // dateRange is required
    expect(
      (wrapper.find('FormItem[name="dateRange"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('dateRange required error');

    // description is required
    expect(
      (wrapper.find('FormItem[name="description"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('description required error');

    // next we set wrong values for fields that expect specific values

    // Set wrong interventionType field value
    formInstance.setFieldsValue({
      interventionType: 'Oov',
    });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise<any>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    formInstance = (wrapper.find(Form).props() as any).form;
    errors = formInstance.getFieldsError();

    fieldsWithErrors = errors.filter((error) => error.errors.length > 0);

    // we now have some more errors
    expect(fieldsWithErrors).toMatchSnapshot('invalid data type Errors');
  });

  it('Auto-setting name and title field values works', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>
    );
    // Set title for the plan
    wrapper
      .find('#title input')
      .simulate('change', { target: { name: 'title', value: 'Plan Name' } });

    // expect name is set the same to plan title
    expect(wrapper.find('#name input').props().value).toEqual('Plan Name');
  });

  it('Form submission for new plans works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 201 });

    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>
    );

    const formInstance = (wrapper.find(Form).props() as any).form;

    // Set interventionType field value
    formInstance.setFieldsValue({
      interventionType: 'SM',
    });

    // Set title for the plan
    wrapper
      .find('#title input')
      .simulate('change', { target: { name: 'title', value: 'Plan Name' } });

    // set description
    wrapper
      .find('#description textarea')
      .simulate('change', { target: { name: 'description', value: 'Mission plan description' } });

    await act(async () => {
      await new Promise<any>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // submit button should not be disabled
    expect(wrapper.find('#planform-submit-button button').prop('disabled')).toBeFalsy();

    await act(async () => {
      wrapper.find('form').simulate('submit');
      await new Promise<any>((resolve) => setImmediate(resolve));
    });

    expect(fetch).toHaveBeenCalled();

    // the last request should be the one that is sent to OpenSRP
    expect(fetch.mock.calls[0]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(newPayload1),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
  });

  it('Form submission for editing plans works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const initialValues = getPlanFormValues(mission1);

    const container = document.createElement('div');
    document.body.appendChild(container);

    const props = {
      initialValues,
    };
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm {...props} />
      </MemoryRouter>,
      { attachTo: container }
    );

    wrapper
      .find('#description textarea')
      .simulate('change', { target: { name: 'description', value: 'Mission plan description' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise<any>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    const payload = {
      ...generatePlanDefinition(initialValues),
      version: 2,
      description: 'Mission plan description',
    };

    // the last request should be the one that is sent to OpenSRP
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/plans'
    );

    // the last request should be the one that is sent to OpenSRP
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(payload);
  });

  it('Checking disabled fields for draft plans', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const planStatus = PlanStatus.DRAFT;
    const mission = {
      ...mission1,
      status: planStatus,
    };

    const initialValues = getPlanFormValues(mission);

    const container = document.createElement('div');
    document.body.appendChild(container);

    const props = {
      ...propsForUpdatingPlans(planStatus),
      initialValues,
      beforeSubmit: () => false,
    };
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm {...props} />
      </MemoryRouter>,
      { attachTo: container }
    );

    // [interventionType, identifier, name] should be disabled
    expect(wrapper.find('#interventionType Select').props().disabled).toBeTruthy();
    expect(wrapper.find('#identifier input').props().disabled).toBeTruthy();
    expect(wrapper.find('#name input').props().disabled).toBeTruthy();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise<any>((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it('Can add and remove jurisdictions', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const initialValues = getPlanFormValues(mission1);

    const disabledProps = propsForUpdatingPlans();

    const container = document.createElement('div');
    document.body.appendChild(container);

    const props = {
      ...disabledProps,
      initialValues,
    };
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm {...props} />
      </MemoryRouter>,
      { attachTo: container }
    );

    expect(wrapper.find('.jurisdiction-fields')).toHaveLength(5);

    // find the add field button and simulate click
    wrapper.find('button.jurisdiction-fields__add').simulate('click');

    // jurisdiction-fields columns should have increased
    expect(wrapper.find('.jurisdiction-fields')).toHaveLength(10);

    // we now click the remove button and we expect this to have dropped
    wrapper.find('.jurisdiction-fields__delete').first().simulate('click');

    expect(wrapper.find('.jurisdiction-fields')).toHaveLength(5);
  });

  it('removing dynamic activities works correctly', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>,
      { attachTo: container }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    // there are initially 4 activities
    expect(wrapper.find(`button.removeActivity`)).toHaveLength(4);
    // lets get the form input values of the triggers
    const expectedTriggerInputValues = wrapper
      .find('.triggers-fieldset input')
      .map((e) => e.props().value);
    const expectedTriggerTextValues = wrapper
      .find('.triggers-fieldset textarea')
      .map((e) => e.props().value);
    const expectedConditionInputValues = wrapper
      .find('.conditions-fieldset input')
      .map((e) => e.props().value);
    const expectedConditionTextValues = wrapper
      .find('.conditions-fieldset textarea')
      .map((e) => e.props().value);
    // the names of the input fields should be indexed from zero (0)
    expect(wrapper.find(`.triggers-fieldset input`).map((e) => e.props().name)).toMatchSnapshot(
      'Original activity trigger text input names'
    );
    expect(wrapper.find(`.triggers-fieldset textarea`).map((e) => e.props().name)).toMatchSnapshot(
      'Original activity trigger text textarea names'
    );
    expect(
      wrapper.find(`.conditions-fieldset textarea`).map((e) => e.props().name)
    ).toMatchSnapshot('Original activity conditions text textarea names');
    expect(wrapper.find(`.conditions-fieldset input`).map((e) => e.props().name)).toMatchSnapshot(
      'Original activity conditions text input names'
    );
    // lets remove one activity
    await act(async () => {
      wrapper.find(`button.removeActivity`).first().simulate('click');
    });
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    // 1 less activity
    expect(wrapper.find(`button.removeActivity`)).toHaveLength(3);
    // the slice values are determined by the type of activity that was removed
    // the meaning is that we should be left with ALL the triggers excluding the ones removed
    expect(wrapper.find(`.triggers-fieldset input`).map((e) => e.props().value)).toEqual(
      expectedTriggerInputValues.slice(2)
    );
    expect(wrapper.find(`.triggers-fieldset textarea`).map((e) => e.props().value)).toEqual(
      expectedTriggerTextValues.slice(2)
    );
    expect(wrapper.find(`.conditions-fieldset textarea`).map((e) => e.props().value)).toEqual(
      expectedConditionTextValues.slice(5)
    );
    // this one does not change because currently there are no conditions with an input field
    expect(wrapper.find(`.conditions-fieldset input`).map((e) => e.props().value)).toEqual(
      expectedConditionInputValues
    );
    // the names of the input fields should STILL be indexed from zero (0)
    expect(wrapper.find(`.triggers-fieldset input`).map((e) => e.props().name)).toMatchSnapshot(
      'Changed activity trigger text input names'
    );
    expect(wrapper.find(`.triggers-fieldset textarea`).map((e) => e.props().name)).toMatchSnapshot(
      'Changed activity trigger text textarea names'
    );
    expect(
      wrapper.find(`.conditions-fieldset textarea`).map((e) => e.props().name)
    ).toMatchSnapshot('Changed activity conditions text textarea names');
    expect(wrapper.find(`.conditions-fieldset input`).map((e) => e.props().name)).toMatchSnapshot(
      'Changed activity conditions text input names'
    );
    // there should now be one button to add activities
    expect(wrapper.find(`button.add-more-activities`)).toHaveLength(1);
    // lets bring up the modal that allows us to add activities
    await act(async () => {
      wrapper.find(`button.add-more-activities`).first().simulate('click');
    });
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    // there should be one activity that can be added back
    expect(wrapper.find(`button.addActivity`)).toHaveLength(1);
    // lets click the button in the modal and add back the activity we had removed
    await act(async () => {
      wrapper.find(`button.addActivity`).first().simulate('click');
    });
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    // we should have 6 activities again
    expect(wrapper.find(`button.removeActivity`)).toHaveLength(4);
    // and now we come full circle.  The inputs should be what we had on initial load,
    // with those of the first activity moved to the end of the arrays
    expect(wrapper.find(`.triggers-fieldset input`).map((e) => e.props().value)).toEqual(
      expectedTriggerInputValues.slice(2).concat(expectedTriggerInputValues.slice(0, 2))
    );
    expect(wrapper.find(`.triggers-fieldset textarea`).map((e) => e.props().value)).toEqual(
      expectedTriggerTextValues.slice(2).concat(expectedTriggerTextValues.slice(0, 2))
    );
    expect(wrapper.find(`.conditions-fieldset textarea`).map((e) => e.props().value)).toEqual(
      expectedConditionTextValues.slice(5).concat(expectedConditionTextValues.slice(0, 5))
    );
    expect(wrapper.find(`.conditions-fieldset input`).map((e) => e.props().value)).toEqual(
      expectedConditionInputValues
    );
    // the names of the input fields should STILL STILL! be indexed from zero (0)
    expect(wrapper.find(`.triggers-fieldset input`).map((e) => e.props().name)).toMatchSnapshot(
      'Final activity trigger text input names'
    );
    expect(wrapper.find(`.triggers-fieldset textarea`).map((e) => e.props().name)).toMatchSnapshot(
      'Final activity trigger text textarea names'
    );
    expect(
      wrapper.find(`.conditions-fieldset textarea`).map((e) => e.props().name)
    ).toMatchSnapshot('Final activity conditions text textarea names');
    expect(wrapper.find(`.conditions-fieldset input`).map((e) => e.props().name)).toMatchSnapshot(
      'Final activity conditions text input names'
    );
    // there should not be any button to add activities
    expect(wrapper.find(`button.add-more-activities`)).toHaveLength(0);
    wrapper.unmount();
  });
});
