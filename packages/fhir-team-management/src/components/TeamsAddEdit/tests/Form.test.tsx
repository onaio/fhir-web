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
  practitionerRole,
  practitioner,
  team212,
  teamsDetail,
} from '../../../tests/fixtures';
import Form, { FormField, onSubmit } from '../Form';
import * as fhirCient from 'fhirclient';
import * as notifications from '@opensrp/notifications';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import { Require } from '@opensrp/react-utils';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  /* eslint-disable react/prop-types */
  const select = ({ children, onChange, id }) => (
    <select onChange={(e) => onChange(e.target.value)} id={id}>
      {children}
    </select>
  );

  const Option = ({ children, ...otherProps }) => {
    return <option {...otherProps}>{children}</option>;
  };
  /* eslint-disable react/prop-types */

  select.Option = Option;

  return {
    __esModule: true,
    ...antd,
    Select: select,
  };
});

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');

const TeamValue: Require<FormField, 'active' | 'name'> = {
  ...teamsDetail,
  practitioners: ['116', '102'],
};

describe('Team-management/TeamsAddEdit/Form', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: jest.fn((url) => {
          if (url === 'Organization') return Promise.resolve(team);
          if (url === 'Organization/212') return Promise.resolve(team212);
          else if (url === 'Practitioner') return Promise.resolve(practitioner);
          else if (url === 'PractitionerRole') return Promise.resolve(practitionerRole);
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
            fhirBaseURL={fhirBaseURL}
            practitioners={practitioner.entry.map((e) => e.resource)}
            practitionerRoles={practitionerRole.entry.map((e) => e.resource)}
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
            fhirBaseURL={fhirBaseURL}
            practitioners={practitioner.entry.map((e) => e.resource)}
            practitionerRoles={practitionerRole.entry.map((e) => e.resource)}
            value={TeamValue}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('Form').prop('value')).toMatchObject(TeamValue);
    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('Cancel button', () => {
    const historyback = jest.spyOn(history, 'goBack');
    const queryClient = new QueryClient();
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirBaseURL={fhirBaseURL}
            practitioners={practitioner.entry.map((e) => e.resource)}
            practitionerRoles={practitionerRole.entry.map((e) => e.resource)}
            value={TeamValue}
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
      {},
      TeamValue,
      practitioner.entry.map((e) => e.resource),
      practitionerRole.entry.map((e) => e.resource)
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
      practitionerRole.entry.map((e) => e.resource)
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

  it('test call onsubmit with correct values', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const mockSuccessNotification = jest.spyOn(notifications, 'sendSuccessNotification');

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirBaseURL={fhirBaseURL}
            practitioners={practitioner.entry.map((e) => e.resource)}
            practitionerRoles={practitionerRole.entry.map((e) => e.resource)}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('input#name').simulate('change', {
      target: { value: 'my name' },
    });

    wrapper
      .find('select#practitioners')
      .last()
      .simulate('change', {
        target: { value: teamsDetail.practitionerInfo.map((e) => e.id) },
      });

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
            fhirBaseURL={fhirBaseURL}
            practitioners={practitioner.entry.map((e) => e.resource)}
            practitionerRoles={practitionerRole.entry.map((e) => e.resource)}
            value={TeamValue}
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
});
