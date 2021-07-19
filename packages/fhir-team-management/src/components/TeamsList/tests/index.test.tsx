/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import toJson from 'enzyme-to-json';
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
fhir.mockImplementation(
  jest.fn().mockImplementation(() => {
    return {
      request: jest.fn((url) => {
        if (url === 'Organization/') return Promise.resolve(team);
        else if (url === 'PractitionerRole/') return Promise.resolve(practitionerrole);
        else if (url === 'Practitioner/116') return Promise.resolve(practitioner116);
        else if (url === 'Practitioner/102') return Promise.resolve(practitioner102);
        else {
          console.error(url);
        }
      }),
    };
  })
);

describe('components/TeamsList', () => {
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

  // it('show error message when cant load teams from server', async () => {
  //   const queryClient = new QueryClient();

  //   const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

  //   fhir.mockImplementation(
  //     jest.fn().mockImplementation(() => jest.fn().mockRejectedValue('API Failed'))
  //   );

  //   const wrapper = mount(
  //     <Router history={history}>
  //       <QueryClientProvider client={queryClient}>
  //         <TeamsList fhirBaseURL={fhirBaseURL} />
  //       </QueryClientProvider>
  //     </Router>
  //   );

  //   await act(async () => {
  //     await flushPromises();
  //     wrapper.update();
  //   });

  //   console.warn(notificationErrorMock.mock);

  //   expect(notificationErrorMock.mock.calls).toMatchObject([['An error occurred']]);
  // });

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

  // it('redirects to new user form', async () => {
  //   const historyPushMock = jest.spyOn(history, 'push');
  //   const queryClient = new QueryClient();

  //   const fhir = jest.spyOn(fhirCient, 'client');
  //   fhir.mockImplementation(
  //     jest.fn().mockImplementation(() => {
  //       return {
  //         request: jest.fn().mockResolvedValue(teams),
  //       };
  //     })
  //   );

  //   const wrapper = mount(
  //     <Router history={history}>
  //       <QueryClientProvider client={queryClient}>
  //         <TeamsList fhirBaseURL={fhirBaseURL} />
  //       </QueryClientProvider>
  //     </Router>
  //   );

  //   await act(async () => {
  //     await flushPromises();
  //     wrapper.update();
  //   });

  //   expect(toJson(wrapper)).toMatchSnapshot();

  //   wrapper.find('.create').first().simulate('click');

  //   await act(async () => {
  //     await flushPromises();
  //     wrapper.update();
  //   });

  //   expect(historyPushMock).toBeCalled();
  // });
});
