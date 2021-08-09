/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as notifications from '@opensrp/notifications';
import TeamsList from '..';
import { team, practitioner102, practitioner116, practitionerrole } from '../../../tests/fixtures';
import * as fhirCient from 'fhirclient';

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');
describe('components/TeamsList', () => {
  beforeEach(() => {
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: jest.fn((url) => {
          if (url === 'Organization/') return Promise.resolve(team);
          else if (url === 'PractitionerRole/') return Promise.resolve(practitionerrole);
          else if (url === 'Practitioner/116') return Promise.resolve(practitioner116);
          else if (url === 'Practitioner/102') return Promise.resolve(practitioner102);
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

  it('renders correctly', async () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <TeamsList fhirBaseURL={fhirBaseURL} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    wrapper.update();

    expect(wrapper.find('table')).toHaveLength(1);
  });

  it('Search works correctly', async () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <TeamsList fhirBaseURL={fhirBaseURL} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // test search input works
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'Sample' } });
    await act(async () => {
      wrapper.update();
    });
    expect(((input.instance() as unknown) as HTMLInputElement).value).toEqual('Sample');
  });

  it('show error message when cant load teams from server', async () => {
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
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <TeamsList fhirBaseURL={fhirBaseURL} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock.mock.calls).toMatchObject([['An error occurred']]);
  });

  it('Test Open Table View Detail', async () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <TeamsList fhirBaseURL={fhirBaseURL} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await act(async () => {
      wrapper.find('Dropdown').first().simulate('click');
      await flushPromises();
      wrapper.update();
      wrapper.find('MenuItem').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('TeamsDetail')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Test Close Table View Detail', async () => {
    const queryClient = new QueryClient();

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <TeamsList fhirBaseURL={fhirBaseURL} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await act(async () => {
      wrapper.find('Dropdown').first().simulate('click');
      await flushPromises();
      wrapper.update();
      wrapper.find('MenuItem').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('TeamsDetail')).toHaveLength(1);

    await act(async () => {
      wrapper.find('.close-btn').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('TeamsDetail')).toHaveLength(0);
  });

  it('show error message when cant load team detail from server', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    fhir.mockImplementation(
      jest.fn().mockImplementation(() => ({
        request: jest.fn((url) => {
          if (url === 'Organization/') return Promise.resolve(team);
          else return Promise.reject('Mock Api Fail');
        }),
      }))
    );

    const wrapper = mount(
      <Router history={history}>
        <QueryClientProvider client={queryClient}>
          <TeamsList fhirBaseURL={fhirBaseURL} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await act(async () => {
      wrapper.find('Dropdown').first().simulate('click');
      await flushPromises();
      wrapper.update();
      wrapper.find('MenuItem').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock.mock.calls).toMatchObject([['An error occurred']]);
    wrapper.unmount();
  });
});
