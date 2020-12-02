import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PlanForm } from '../';

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
});
