import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { history } from '@onaio/connected-reducer-registry';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import {
  team,
  healthcareService,
  healthcareService313,
  healthcareService323,
  team366,
} from '../../../tests/fixtures';
import Form, { FormField, onSubmit } from '../Form';
import * as fhirCient from 'fhirclient';
import * as notifications from '@opensrp/notifications';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');

const FormIntialValue: FormField = {
  active: true,
  name: '',
  comment: '',
  extraDetails: '',
};

const healthcareServiceValue: FormField = {
  comment: 'test comment',
  extraDetails: 'test extra comment',
  active: false,
  name: 'My Team',
  identifier: [{ use: 'official', value: '12312421' }],
};

describe('components/HealthCareAddEdit/Form', () => {
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
          if (url === 'Organization/_search?_count=20&_getpagesoffset=0')
            return Promise.resolve(team);
          if (url === 'Organization/366') return Promise.resolve(team366);
          else if (url === 'HealthcareService/_search?_count=20&_getpagesoffset=0')
            return Promise.resolve(healthcareService);
          else if (url === 'HealthcareService/323') return Promise.resolve(healthcareService323);
          else if (url === 'HealthcareService/313') return Promise.resolve(healthcareService313);
          else {
            // eslint-disable-next-line no-console
            console.error('response not found', url);
          }
        }),
        update: jest.fn((payload) => Promise.resolve(payload)),
        create: jest.fn((payload) => Promise.resolve(payload)),
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
          <Form fhirBaseURL={fhirBaseURL} organizations={team.entry.map((e) => e.resource)} />
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
            organizations={team.entry.map((e) => e.resource)}
            initialValue={healthcareServiceValue}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('Form').prop('initialValue')).toMatchObject(healthcareServiceValue);
    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('Cancel button', () => {
    const goBackFN = jest.fn();
    const queryClient = new QueryClient();
    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <Form
            fhirBaseURL={fhirBaseURL}
            organizations={team.entry.map((e) => e.resource)}
            initialValue={healthcareServiceValue}
            onCancel={goBackFN}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('button#cancel').simulate('click');
    expect(goBackFN).toBeCalled();
  });

  it('Create Team', async () => {
    const mockSuccessNotification = jest.spyOn(notifications, 'sendSuccessNotification');
    const thenfn = jest.fn();
    const catchfn = jest.fn();

    onSubmit(fhirBaseURL, healthcareServiceValue).then(thenfn).catch(catchfn);

    await act(async () => {
      await flushPromises();
    });

    expect(catchfn).not.toBeCalled();
    expect(thenfn).toBeCalled();
    expect(mockSuccessNotification).toBeCalledWith('Successfully Created Healthcares');
  });

  it('Edit Team', async () => {
    const mockSuccessNotification = jest.spyOn(notifications, 'sendSuccessNotification');
    const thenfn = jest.fn();
    const catchfn = jest.fn();
    onSubmit(fhirBaseURL, {
      ...healthcareServiceValue,
      name: 'new name',
      id: '12312',
    })
      .then(thenfn)
      .catch(catchfn);

    await act(async () => {
      await flushPromises();
    });

    expect(catchfn).not.toBeCalled();
    expect(thenfn).toBeCalled();
    expect(mockSuccessNotification).toBeCalledWith('Successfully Updated Healthcares');
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
            fhirBaseURL={fhirBaseURL}
            organizations={team.entry.map((e) => e.resource)}
            initialValue={FormIntialValue}
          />
        </QueryClientProvider>
      </Router>
    );

    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    expect(mockSuccessNotification).toBeCalledWith('Successfully Created Healthcares');
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
            organizations={team.entry.map((e) => e.resource)}
            initialValue={FormIntialValue}
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
