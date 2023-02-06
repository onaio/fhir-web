/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { disableDate, PlanForm, propsForUpdatingPlans } from '../';
import { Form } from 'antd';
import { generatePlanDefinition, getPlanFormValues } from '../../helpers/utils';
import { mission1, newPayload1 } from './fixtures';
import { act } from 'react-dom/test-utils';
import { InterventionType, PlanStatus } from '@opensrp/plan-form-core';
import { sendErrorNotification } from '@opensrp/notifications';
import { Dictionary } from '@onaio/utils';
import moment from 'moment';
import flushPromises from 'flush-promises';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('@opensrp/notifications', () => {
  return { sendSuccessNotification: jest.fn(), sendErrorNotification: jest.fn() };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

/**
 * place to mount the application/component to the JSDOM document during testing.
 * https://github.com/reactstrap/reactstrap/issues/773#issuecomment-373451256
 */
const div = document.createElement('div');
document.body.appendChild(div);

jest.setTimeout(30000);

describe('containers/forms/PlanForm', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

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
    wrapper.find('#status Radio').forEach((radio) => {
      expect(radio.find('label').text()).toMatchSnapshot('status label');
      expect(toJson(radio.find('input'))).toMatchSnapshot('status input');
    });
    expect(toJson(wrapper.find('#dateRange label'))).toMatchSnapshot('date range label');
    expect(toJson(wrapper.find('#dateRange input'))).toMatchSnapshot('start field');
    expect(wrapper.find('#date label')).toHaveLength(0);
    expect(toJson(wrapper.find('#date input'))).toMatchSnapshot('date field');
    expect(wrapper.find('#description label')).toMatchSnapshot('description label');
    expect(toJson(wrapper.find('#description textarea'))).toMatchSnapshot('date field');
    expect(toJson(wrapper.find('#planform-submit-button button'))).toMatchSnapshot('submit button');

    // should have triggers or conditions
    expect(wrapper.find('.triggers-conditions')).toHaveLength(45);

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

      expect(toJson(wrap.find('.dynamic-value-fieldset legend'))).toMatchSnapshot(
        `conditions legends ${index}`
      );

      expect(toJson(wrap.find('.dynamic-value-group label'))).toMatchSnapshot(
        `conditions labels ${index}`
      );
      expect(toJson(wrap.find('.dynamic-value-group input'))).toMatchSnapshot(
        `conditions inputs ${index}`
      );
    });
    wrapper.unmount();
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
    expect(fieldsWithErrors).toMatchSnapshot('Initial Errors, no errors shown initially');

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
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
    ).toMatchSnapshot('description error');

    // let us cause errors for other required fields and ascertain that they are indeed validated

    // Remove the date field value
    wrapper.find('#date input').simulate('change', { target: { name: 'date', value: '' } });

    // Remove the dateRange field value
    formInstance.setFieldsValue({ dateRange: '' });

    // Remove the interventionType field value
    formInstance.setFieldsValue({ interventionType: '' });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    formInstance = (wrapper.find(Form).props() as any).form;
    errors = formInstance.getFieldsError();

    fieldsWithErrors = errors.filter((error) => error.errors.length > 0);

    // we now have some more errors
    expect(fieldsWithErrors).toMatchSnapshot('more Errors, dateRange, interventionType, date');

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

    // Set title for the plan with forward slash
    wrapper
      .find('#title input')
      .simulate('change', { target: { name: 'title', value: 'Plan / Name' } });

    // Set wrong interventionType field value
    formInstance.setFieldsValue({
      interventionType: 'Oov',
    });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    formInstance = (wrapper.find(Form).props() as any).form;
    errors = formInstance.getFieldsError();

    fieldsWithErrors = errors.filter((error) => error.errors.length > 0);

    // we now have some more errors
    expect(fieldsWithErrors).toMatchSnapshot(
      'invalid data type Errors, we should have some errors'
    );
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
    wrapper.unmount();
  });

  it('disableDate should return false if no value selected', async () => {
    const dates = [];
    const current = moment('2017-07-13');
    expect(disableDate(current, dates)).toBeFalsy();
  });

  it('disableDate should return true if end date is less than todays date', async () => {
    const dates = [moment('2017-07-10'), moment('2017-07-11')];
    const current = moment('2017-07-13');
    // date today is 2017-07-13
    expect(disableDate(current, dates)).toBeTruthy();
  });

  it('disableDate should return true if start and end date is same', async () => {
    const dates = [moment('2017-07-10'), moment('2017-07-10')];
    const current = moment('2017-07-13');
    // date today is 2017-07-13
    expect(disableDate(current, dates)).toBeTruthy();
  });

  it('renders correcty when dates are passed', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>
    );

    const instance = wrapper.find('#dateRange RangePicker').at(0).props();
    instance.onCalendarChange(['2022-07-13', '2022-07-14']);
    instance.onOpenChange(true);
    expect(instance.disabledDate(moment('2017-07-13'))).toBeFalsy();
    wrapper.unmount();
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
    act(() => {
      wrapper
        .find('#interventionType Select')
        .props()
        .onChange(InterventionType.SM as any);
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
      await flushPromises();
      wrapper.update();
    });

    // submit button should not be disabled
    expect(wrapper.find('#planform-submit-button button').prop('disabled')).toBeFalsy();

    await act(async () => {
      wrapper.find('form').simulate('submit');
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalled();

    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(newPayload1);

    // the last request should be the one that is sent to OpenSRP
    expect(fetch.mock.calls[0]).toMatchObject([
      'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: expect.any(String),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
    wrapper.unmount();
  });

  it('Form submission for editing plans works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const initialValues = getPlanFormValues(mission1);

    const container = document.createElement('div');
    document.body.appendChild(container);
    const afterSubmitMock = jest.fn();

    const props = {
      initialValues,
      afterSubmit: afterSubmitMock,
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

    // try changing the status to retired
    wrapper.find('input[value="retired"]').simulate('click');
    // look for popup to confirm
    expect(wrapper.find('.ant-popover-content').text()).toMatchInlineSnapshot(
      `"Are you sure? you won't be able to change the status for retired plansnoyes"`
    );
    wrapper.find('.plan-form-status button').last().simulate('click');

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const payload = {
      ...generatePlanDefinition(initialValues),
      version: 2,
      status: PlanStatus.RETIRED,
      description: 'Mission plan description',
    };

    // expect(payload.status).toEqual(PlanStatus.RETIRED);

    // the last request should be the one that is sent to OpenSRP
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/plans'
    );

    // the last request should be the one that is sent to OpenSRP
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(payload);

    expect(afterSubmitMock).toHaveBeenCalled();
  });

  it('clicking no in popup during status change', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const initialValues = getPlanFormValues(mission1);

    const container = document.createElement('div');
    document.body.appendChild(container);
    const afterSubmitMock = jest.fn();

    const props = {
      initialValues,
      afterSubmit: afterSubmitMock,
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

    // try changing the status to retired
    wrapper.find('input[value="retired"]').simulate('click');
    // look for popup to confirm
    expect(wrapper.find('.ant-popover-content').text()).toMatchInlineSnapshot(
      `"Are you sure? you won't be able to change the status for retired plansnoyes"`
    );
    // cancel status change
    wrapper.find('.plan-form-status button').first().simulate('click');

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // no status change
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

    expect(afterSubmitMock).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('Checking disabled fields for draft plans', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const planStatus = PlanStatus.DRAFT;
    const mission = {
      ...mission1,
      status: planStatus,
      description: 'This plan will survive enemy contact',
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
      await flushPromises();
      wrapper.update();
    });
    wrapper.unmount();
  });

  it('Notifies on errors during submission', async () => {
    const errorMessage = 'Contact with the enemy';
    fetch.mockReject(new Error(errorMessage));
    const planStatus = PlanStatus.COMPLETE;
    const mission = {
      ...mission1,
      status: planStatus,
      description: 'This plan will survive enemy contact',
    };

    const errorNotificationSMock = jest.fn();
    (sendErrorNotification as jest.Mock).mockImplementation((...args) =>
      errorNotificationSMock(...args)
    );

    const initialValues = getPlanFormValues(mission);

    const container = document.createElement('div');
    document.body.appendChild(container);

    const props = {
      ...propsForUpdatingPlans(planStatus),
      initialValues,
      afterSubmit: () => false,
    };
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm {...props} />
      </MemoryRouter>,
      { attachTo: container }
    );
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(errorNotificationSMock).toHaveBeenCalledWith('Error', errorMessage);
    (sendErrorNotification as jest.Mock).mockReset();
    wrapper.unmount();
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
    wrapper.unmount();
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
      await flushPromises();
      wrapper.update();
    });
    // there are initially 4 activities
    expect(wrapper.find(`button.removeActivity`)).toHaveLength(15);
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
      await flushPromises();
      wrapper.update();
    });
    // 1 less activity
    expect(wrapper.find(`button.removeActivity`)).toHaveLength(14);
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
      await flushPromises();
      wrapper.update();
    });
    // there should be one activity that can be added back
    expect(wrapper.find(`button.addActivity`)).toHaveLength(1);
    // lets click the button in the modal and add back the activity we had removed
    await act(async () => {
      wrapper.find(`button.addActivity`).first().simulate('click');
    });
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // we should have 6 activities again
    expect(wrapper.find(`button.removeActivity`)).toHaveLength(15);
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

  it('Clicking on cancel takes you to list page', async () => {
    const cancelMock = jest.fn();
    const props = {
      onCancel: cancelMock,
    };
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm {...props} />
      </MemoryRouter>
    );

    wrapper.find('button#planform-cancel-button').simulate('click');

    wrapper.update();

    expect(cancelMock).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('test redirectPath getter', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const initialValues = getPlanFormValues(mission1);

    const container = document.createElement('div');
    document.body.appendChild(container);
    const afterSubmitMock = jest.fn();

    const getRedirectPath = (planStatus) => {
      if (planStatus === PlanStatus.DRAFT) {
        return '/draftPlans';
      } else {
        return '/otherPlans';
      }
    };

    const props = {
      initialValues,
      afterSubmit: afterSubmitMock,
      getRedirectPath,
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
      await flushPromises();
      wrapper.update();
    });

    expect(afterSubmitMock).toHaveBeenCalled();

    expect((wrapper.find('Router').props() as Dictionary).history.location.pathname).toEqual(
      '/otherPlans'
    );
  });
  it('date range picker renders correctly for no mission end date', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const initialValues = getPlanFormValues(mission1);

    const props = {
      initialValues: {
        ...initialValues,
        dateRange: [moment('2020-11-23T21:00:00.000Z'), undefined],
      },
    };

    const wrapper = mount(
      <MemoryRouter>
        <PlanForm {...props} />
      </MemoryRouter>,
      { attachTo: div }
    );

    expect(wrapper.find('#dateRange RangePicker').at(0).props().value).toMatchSnapshot(
      'date range for no end date'
    );

    // end date value is empty, and is not 'Invalid date'
    const instance = wrapper.find('#dateRange input').at(1).props();
    expect(instance.placeholder).toBe('End date');
    expect(instance.value).not.toBe('Invalid date');
    expect(instance.value).toBe('');

    wrapper.unmount();
  });
});
