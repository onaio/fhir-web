/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route, Router } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as notifications from '@opensrp/notifications';
import { createBrowserHistory } from 'history';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import HealthCareAddEdit from '..';
import {
  team,
  team366,
  healthcareservice,
  healthcareservice323,
  healthcareservice313,
} from '../../../tests/fixtures';
import * as fhirCient from 'fhirclient';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');

describe('components/TeamsAddEdit', () => {
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
          if (url === 'Organization/_search?_count=500&_getpagesoffset=0')
            return Promise.resolve(team);
          if (url === 'Organization/366') return Promise.resolve(team366);
          else if (url === 'HealthcareService/_search?_count=500&_getpagesoffset=0')
            return Promise.resolve(healthcareservice);
          else if (url === 'HealthcareService/323') return Promise.resolve(healthcareservice323);
          else if (url === 'HealthcareService/313') return Promise.resolve(healthcareservice313);
          else {
            // eslint-disable-next-line no-console
            console.error('response not found', url);
          }
        }),
      }))
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when creating Team', async () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <HealthCareAddEdit fhirBaseURL={fhirBaseURL} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('renders correctly when Editting Team', async () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: `/323`, hash: '', search: '', state: {} }]}>
        <QueryClientProvider client={queryClient}>
          <Route path="/:id" fhirBaseURL={fhirBaseURL} component={HealthCareAddEdit} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('show error message when cant load data from server', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    fhir.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: jest.fn(() => Promise.reject('Mock Api Fail')),
      }))
    );

    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: `/323`, hash: '', search: '', state: {} }]}>
        <QueryClientProvider client={queryClient}>
          <Route path="/:id" fhirBaseURL={fhirBaseURL} component={HealthCareAddEdit} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock.mock.calls).toMatchObject([
      ['An error occurred'],
      ['An error occurred'],
    ]);
  });

  it('show error message when cant team details', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    fhir.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: jest.fn((url) => {
          if (url === 'Organization/_search?_count=500&_getpagesoffset=0')
            return Promise.resolve(team);
          if (url === 'Organization/366') return Promise.resolve(team366);
          else if (url === 'HealthcareService/_search?_count=500&_getpagesoffset=0')
            return Promise.resolve(healthcareservice);
          else if (url === 'HealthcareService/323') return Promise.resolve(healthcareservice323);
          else if (url === 'HealthcareService/313') return Promise.resolve(healthcareservice313);
          else {
            // eslint-disable-next-line no-console
            console.error('response not found', url);
          }
        }),
      }))
    );

    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: `/323`, hash: '', search: '', state: {} }]}>
        <QueryClientProvider client={queryClient}>
          <Route path="/:id" fhirBaseURL={fhirBaseURL} component={HealthCareAddEdit} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock.mock.calls).toMatchObject([]);
  });
});
