import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { history } from '@onaio/connected-reducer-registry';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import {
  team,
  practitioner102,
  practitioner116,
  practitioner104,
  practitionerrole,
  practitioner,
  team212,
  teamsdetail,
} from '../../../tests/fixtures';
import Form, { FormField } from '../Form';
import * as fhirCient from 'fhirclient';

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');

const TeamValue: FormField = {
  ...teamsdetail,
  practitioners: ['116', '102'],
};

describe('Team-management/TeamsAddEdit/Form', () => {
  beforeEach(() => {
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: jest.fn((url) => {
          if (url === 'Organization/') return Promise.resolve(team);
          if (url === 'Organization/212') return Promise.resolve(team212);
          else if (url === 'Practitioner/') return Promise.resolve(practitioner);
          else if (url === 'PractitionerRole/') return Promise.resolve(practitionerrole);
          else if (url === 'Practitioner/116') return Promise.resolve(practitioner116);
          else if (url === 'Practitioner/102') return Promise.resolve(practitioner102);
          else if (url === 'Practitioner/104') return Promise.resolve(practitioner104);
          else {
            // eslint-disable-next-line no-console
            console.error('response not found', url);
          }
        }),
        create: jest.fn((payload) => Promise.resolve(payload)),
        update: jest.fn((payload) => Promise.resolve(payload)),
        delete: jest.fn(() => Promise.resolve(true)),
      }))
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('select search filter works', async () => {
    const queryClient = new QueryClient();
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirbaseURL={fhirBaseURL}
            practitioners={practitioner.entry.map((e) => e.resource)}
            practitionerRoles={practitionerrole.entry.map((e) => e.resource)}
            value={TeamValue}
          />
        </QueryClientProvider>
      </Router>
    );

    // find antd Select with id 'practitioners' in the 'Form' component
    const practitionersSelect = wrapper.find('Select#practitioners').last();

    // simulate click on select - to show dropdown items
    practitionersSelect.find('.ant-select-selector').simulate('mousedown');
    wrapper.update();

    // find antd select options
    const selectOptions = wrapper.find('.ant-select-item-option-content');

    // expect all groups options
    expect(selectOptions.map((opt) => opt.text())).toStrictEqual([
      'Ward N',
      'Ward N',
      'Ward N',
      'test',
      'test',
      'test',
      'test',
      'test',
      'test',
      'test',
      'test',
      'test',
    ]);

    // find search input field
    const inputField = practitionersSelect.find('input#practitioners');
    // simulate change (type search phrase)
    inputField.simulate('change', { target: { value: 'ward' } });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // expect to see only 3 filtered options
    const selectOptions2 = wrapper.find('.ant-select-item-option-content');
    expect(selectOptions2.map((opt) => opt.text())).toStrictEqual(['Ward N', 'Ward N', 'Ward N']);
  });
});
