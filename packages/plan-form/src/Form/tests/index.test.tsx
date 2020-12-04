/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PlanForm } from '../';
import { getConditionAndTriggers } from '../componentsUtils/actions';
import { Form } from 'antd';
import {generatePlanDefinition, getPlanFormValues} from '@opensrp/plan-form-core';
import { mission1 } from './fixtures';

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
    expect(toJson(wrapper.find('#interventionType select'))).toMatchSnapshot(
      'interventionType field'
    );
    expect(wrapper.find('#opensrpEventId')).toHaveLength(0);
    expect(toJson(wrapper.find({ for: 'title' }))).toMatchSnapshot('title label');
    expect(toJson(wrapper.find('#title input'))).toMatchSnapshot('title field');
    expect(wrapper.find({ for: 'name' })).toHaveLength(0);
    expect(toJson(wrapper.find('#name input'))).toMatchSnapshot('name field');
    expect(wrapper.find({ for: 'identifier' })).toHaveLength(0);
    expect(toJson(wrapper.find('#identifier input'))).toMatchSnapshot('identifier field');
    expect(wrapper.find({ for: 'version' })).toHaveLength(0);
    expect(toJson(wrapper.find('#version input'))).toMatchSnapshot('version field');
    expect(wrapper.find({ for: 'taskGenerationStatus' })).toHaveLength(0);
    expect(toJson(wrapper.find('#taskGenerationStatus input'))).toMatchSnapshot(
      'taskGenerationStatus field'
    );
    expect(toJson(wrapper.find({ for: 'status' }))).toMatchSnapshot('status label');
    expect(toJson(wrapper.find('#status select'))).toMatchSnapshot('status field');
    expect(toJson(wrapper.find({ for: 'start' }))).toMatchSnapshot('start label');
    expect(toJson(wrapper.find('#start input'))).toMatchSnapshot('start field');
    expect(toJson(wrapper.find({ for: 'end' }))).toMatchSnapshot('end label');
    expect(toJson(wrapper.find('#end input'))).toMatchSnapshot('end field');
    expect(wrapper.find({ for: 'date' })).toHaveLength(0);
    expect(toJson(wrapper.find('#date input'))).toMatchSnapshot('date field');
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
      expect(toJson(wrap.find('.triggers-fieldset textarea'))).toMatchSnapshot(
        `triggers textareas ${index}`
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

    wrapper.unmount();
  });

  it('Form validation works', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>,
      { attachTo: div }
    );

    // no errors are initially shown
    // expect((wrapper.find('FieldInner').first().props() as any).formik.errors).toEqual({});

    wrapper.find('form').simulate('submit');

    await new Promise<any>((resolve) => setImmediate(resolve));
    wrapper.update();

    let formInstance = (wrapper.find(Form).props() as any).form;
    let errors = formInstance.getFieldsError();

    let fieldsWithErrors = errors.filter((error) => error.errors.length > 0);

    // we now have some errors
    expect(fieldsWithErrors).toMatchSnapshot('Errors');

    // // name is required
    expect(
      (wrapper.find('FormItem[name="name"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('name error');

    // // title is required
    expect(
      (wrapper.find('FormItem[name="title"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('title error');

    // // let us cause errors for other required fields and ascertain that they are indeed validated

    // Remove the date field value
    wrapper.find('input[name="date"]').simulate('change', { target: { name: 'date', value: '' } });
    // Remove the end field value
    wrapper.find('input[id="end"]').simulate('change', { target: { name: 'end', value: '' } });
    // Remove the interventionType field value
    wrapper
      .find('Select#interventionType')
      .simulate('change', { target: { name: 'interventionType', value: '' } });
    // Remove the start field value
    wrapper.find('input[id="start"]').simulate('change', { target: { name: 'start', value: '' } });
    // Remove the status field value

    wrapper.find('form').simulate('submit');

    await new Promise<any>((resolve) => setImmediate(resolve));
    wrapper.update();

    formInstance = (wrapper.find(Form).props() as any).form;
    errors = formInstance.getFieldsError();

    fieldsWithErrors = errors.filter((error) => error.errors.length > 0);

    // we now have some more errors
    expect(fieldsWithErrors).toMatchSnapshot('more Errors');

    // // date is required
    expect(
      (wrapper.find('FormItem[name="date"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('date error');

    // // interventionType is required
    expect(
      (wrapper.find('FormItem[name="interventionType"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('interventionType error');

    // // start is required
    expect(
      (wrapper.find('FormItem[name="start"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('start error');

    // // end is required
    expect(
      (wrapper.find('FormItem[name="end"] FormItemInput').props() as any).errors
    ).toMatchSnapshot('end error');

    // // next we set wrong values for fields that expect specific values

    // Set wrong interventionType field value
    wrapper
      .find('Select#interventionType')
      .simulate('change', { target: { name: 'interventionType', value: 'oOv' } });

    wrapper.find('form').simulate('submit');

    await new Promise<any>((resolve) => setImmediate(resolve));
    wrapper.update();

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
      .find('input[name="title"]')
      .simulate('change', { target: { name: 'title', value: 'Plan Name' } });

    expect(wrapper.find('input[name="name"]').props().value).toEqual('Plan Name');
  });

  it('Form submission for new plans works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 201 });

    const wrapper = mount(
      <MemoryRouter>
        <PlanForm />
      </MemoryRouter>
    );

    // submit button is disabled
    expect(wrapper.find('#planform-submit-button button').prop('disabled')).toBeTruthy();

    // Set FI for interventionType
    wrapper
      .find('select[name="interventionType"]')
      .simulate('change', { target: { name: 'interventionType', value: 'SM' } });

    // Set title for the plan
    wrapper
      .find('input[name="title"]')
      .simulate('change', { target: { name: 'title', value: 'Plan Name' } });

    // submit button should not be disabled
    expect(wrapper.find('#planform-submit-button button').prop('disabled')).toBeFalsy();

    await act(async () => {
      wrapper.find('form').simulate('submit');
      await new Promise<any>((resolve) => setImmediate(resolve));
    });

    const formInstance = (wrapper.find(Form).props() as any).form;

    // the expected payload
    const payload = generatePlanDefinition(
      formInstance.getFieldsValue();
    );

    // the last request should be the one that is sent to OpenSRP
    expect(fetch.mock.calls.pop()).toEqual([
      'https://test.smartregister.org/opensrp/rest/plans',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
  });
  
  it('Form submission for dynamic plans works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));

    const props = {
      initialValues: getPlanFormValues(mission1),
    };
    const wrapper = mount(
      <MemoryRouter>
        <PlanForm {...props} />
      </MemoryRouter>,
      { attachTo: div }
    );

    await act(async () => {
      wrapper.find('form').simulate('submit');
      await new Promise<any>(resolve => setImmediate(resolve));
      wrapper.update();
    });


    const payload = {
      ...generatePlanDefinition(getPlanFormValues(mission1)),
      version: 2,
    };

    // the last request should be the one that is sent to OpenSRP
    expect(fetch.mock.calls.pop()).toEqual([
      'https://test.smartregister.org/opensrp/rest/plans',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
  });
});
