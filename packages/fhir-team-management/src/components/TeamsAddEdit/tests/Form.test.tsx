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
import Form, { FormField, onSubmit } from '../Form';
import * as fhirCient from 'fhirclient';
import * as notifications from '@opensrp/notifications';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');

const FormintialValue: Partial<FormField> = {
  active: true,
  name: '',
  practitioners: [],
};

const TeamValue: FormField = {
  team: teamsdetail,
  active: false,
  name: 'My Team',
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

  it('renders without crashing', () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirbaseURL={fhirBaseURL}
            Practitioners={practitioner.entry.map((e) => e.resource)}
            PractitionerRoles={practitionerrole.entry.map((e) => e.resource)}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('renders without crashing with id', () => {
    const queryClient = new QueryClient();
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirbaseURL={fhirBaseURL}
            Practitioners={practitioner.entry.map((e) => e.resource)}
            PractitionerRoles={practitionerrole.entry.map((e) => e.resource)}
            initialValue={TeamValue}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('Form').prop('initialValue')).toMatchObject(TeamValue);
    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('Cancel button', () => {
    const historyback = jest.spyOn(history, 'goBack');
    const queryClient = new QueryClient();
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirbaseURL={fhirBaseURL}
            Practitioners={practitioner.entry.map((e) => e.resource)}
            PractitionerRoles={practitionerrole.entry.map((e) => e.resource)}
            initialValue={TeamValue}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('button#cancel').simulate('click');
    expect(historyback).toBeCalled();
    expect(history.location.pathname).toBe('/');
  });

  it('Create Team', async () => {
    const mockSuccessNotification = jest.spyOn(notifications, 'sendSuccessNotification');
    const thenfn = jest.fn();
    const catchfn = jest.fn();

    onSubmit(
      fhirBaseURL,
      FormintialValue,
      TeamValue,
      practitioner.entry.map((e) => e.resource),
      practitionerrole.entry.map((e) => e.resource)
    )
      .then(thenfn)
      .catch(catchfn);

    await act(async () => {
      await flushPromises();
    });

    expect(thenfn).toBeCalled();
    expect(catchfn).not.toBeCalled();
    expect(mockSuccessNotification).toHaveBeenNthCalledWith(1, 'Successfully Added Teams');
    expect(mockSuccessNotification).toHaveBeenNthCalledWith(
      2,
      'Successfully Assigned Practitioners'
    );
  });

  it('Edit Team', async () => {
    const mockSuccessNotification = jest.spyOn(notifications, 'sendSuccessNotification');
    const thenfn = jest.fn();
    const catchfn = jest.fn();
    onSubmit(
      fhirBaseURL,
      TeamValue,
      { ...TeamValue, name: 'new name', practitioners: ['116', '104'] },
      practitioner.entry.map((e) => e.resource),
      practitionerrole.entry.map((e) => e.resource)
    )
      .then(thenfn)
      .catch(catchfn);

    await act(async () => {
      await flushPromises();
    });

    expect(thenfn).toBeCalled();
    expect(catchfn).not.toBeCalled();
    expect(mockSuccessNotification).toHaveBeenNthCalledWith(1, 'Successfully Updated Teams');
    expect(mockSuccessNotification).toHaveBeenNthCalledWith(
      2,
      'Successfully Assigned Practitioners'
    );
  });

  it('test call onsubmit', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const mockSuccessNotification = jest.spyOn(notifications, 'sendSuccessNotification');

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirbaseURL={fhirBaseURL}
            Practitioners={practitioner.entry.map((e) => e.resource)}
            PractitionerRoles={practitionerrole.entry.map((e) => e.resource)}
            initialValue={FormintialValue}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    expect(mockSuccessNotification).toHaveBeenNthCalledWith(1, 'Successfully Added Teams');
    expect(mockSuccessNotification).toHaveBeenNthCalledWith(
      2,
      'Successfully Assigned Practitioners'
    );
  });

  it('fail and test call onsubmit', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    fhir.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: jest.fn(() => Promise.reject('Mock Api Fail')),
        create: jest.fn(() => Promise.reject('Mock Api Fail')),
        update: jest.fn(() => Promise.reject('Mock Api Fail')),
        delete: jest.fn(() => Promise.reject('Mock Api Fail')),
      }))
    );

    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirbaseURL={fhirBaseURL}
            Practitioners={practitioner.entry.map((e) => e.resource)}
            PractitionerRoles={practitionerrole.entry.map((e) => e.resource)}
            initialValue={FormintialValue}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith('An error occurred');
  });

  it('fail Invalidate Query After Submit', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const mockSuccessNotification = jest.spyOn(notifications, 'sendSuccessNotification');

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirbaseURL={fhirBaseURL}
            Practitioners={practitioner.entry.map((e) => e.resource)}
            PractitionerRoles={practitionerrole.entry.map((e) => e.resource)}
            initialValue={FormintialValue}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    expect(mockSuccessNotification).toHaveBeenNthCalledWith(1, 'Successfully Added Teams');
    expect(mockSuccessNotification).toHaveBeenNthCalledWith(
      2,
      'Successfully Assigned Practitioners'
    );

    // expect(mockNotificationError).toHaveBeenCalledWith('An error occurred');
  });
  it('select search filter works', async () => {
    const queryClient = new QueryClient();
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirbaseURL={fhirBaseURL}
            Practitioners={practitioner.entry.map((e) => e.resource)}
            PractitionerRoles={practitionerrole.entry.map((e) => e.resource)}
            initialValue={TeamValue}
          />
        </QueryClientProvider>
      </Router>
    );

    // find antd Select with id 'practitioners' in the 'Form' component
    const practitionersSelect = wrapper.find('Select#practitioners');

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
