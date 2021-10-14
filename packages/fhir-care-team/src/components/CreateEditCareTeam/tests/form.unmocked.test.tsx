import React from 'react';
import { mount } from 'enzyme';
import flushPromises from 'flush-promises';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';
import { defaultInitialValues } from '..';
import { CareTeamForm } from '../Form';
import { getPatientName } from '../utils';

describe('components/forms/CreateTeamForm', () => {
  const props = {
    initialValues: defaultInitialValues,
    fhirBaseURL: 'https://r4.smarthealthit.org/',
    practitioners: fixtures.practitioners.entry.map((p) => ({
      id: p.resource.id,
      name: getPatientName(p.resource),
    })),
    groups: fixtures.groups.entry.map((p) => ({
      id: p.resource.id,
      name: getPatientName(p.resource),
    })),
  };

  it('filter select by text', async () => {
    const wrapper = mount(<CareTeamForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find antd Select with id 'practitionersId' in the component
    const practitionersSelect = wrapper.find('Select#practitionersId');

    // simulate click on select - to show dropdown items
    practitionersSelect.find('.ant-select-selector').simulate('mousedown');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // expect to see all options (practitioners)
    const practitionersSelect2 = wrapper.find('Select#practitionersId');
    // find antd select options
    const selectOptions = practitionersSelect2.find('.ant-select-item-option-content');

    // expect all practitioner options
    expect(selectOptions.map((opt) => opt.text())).toStrictEqual([
      'Ward N Williams MD',
      'Ward N Williams MD',
      'Ward N Williams MD',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
      'test fhir',
    ]);

    // find search input field
    const inputField = practitionersSelect.find('input#practitionersId');
    // simulate change (type search phrase)
    inputField.simulate('change', { target: { value: 'Williams' } });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // expect to see only filtered options
    const practitionersSelect3 = wrapper.find('Select#practitionersId');
    const selectOptions2 = practitionersSelect3.find('.ant-select-item-option-content');
    expect(selectOptions2.map((opt) => opt.text())).toMatchInlineSnapshot(`
      Array [
        "Ward N Williams MD",
        "Ward N Williams MD",
        "Ward N Williams MD",
      ]
    `);
  });
});
