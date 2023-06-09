import React from 'react';
import { DistrictReport } from '../index';
import { shallow, mount } from 'enzyme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import fetch from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { authenticateUser } from '@onaio/session-reducer';
import MockDate from 'mockdate';
import * as notifications from '@opensrp/notifications';
import { sampleTeamAssignment, locationsHierarchy } from './fixtures';

import * as submitMocks from '../utils';

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('DistrictReport', () => {
  const downloadProps = {
    opensrpBaseURL: 'https://some.open.opensrp.url/opensrp/rest/',
  };

  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          api_token: 'hunter2',
          oAuth2Data: { access_token: 'hunter2', state: 'abcde' },
        }
      )
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    const queryClient = new QueryClient();

    const wrapper = shallow(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DistrictReport {...downloadProps} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders correct elements', async () => {
    fetch.mockOnce(JSON.stringify(sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(locationsHierarchy));

    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DistrictReport {...downloadProps} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('PageHeader').text()).toMatchInlineSnapshot(`"Download District Report"`);
    expect(wrapper.find('label[htmlFor="location"]').text()).toMatchInlineSnapshot(`"Location"`);
    expect(wrapper.find('label[htmlFor="reportDate"]').text()).toMatchInlineSnapshot(
      `"Report Date"`
    );
  });

  it('submit is disabled until location and date range are selected', async () => {
    MockDate.set('2022-01-13T19:31:00.000Z');

    jest.mock('../utils.tsx');
    const submitFormMock = jest.spyOn(submitMocks, 'submitForm');

    fetch.mockOnce(JSON.stringify(sampleTeamAssignment));
    fetch.mockOnce(JSON.stringify(locationsHierarchy));

    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DistrictReport {...downloadProps} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('Button[htmlType="submit"]').prop('disabled')).toEqual(true);

    // Submit disabled if user selects date without location

    // click select to see dropdown items
    wrapper.find('input#reportDate').simulate('mousedown');

    // simulate value selection - click tree node with title = mock date
    wrapper.find('td[title="2022-01"]').simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('Button[htmlType="submit"]').prop('disabled')).toEqual(true);

    // Submit is enabled if both date range and location are selected

    // click select to see dropdown items
    wrapper.find('input[role="combobox"]').simulate('mousedown');

    // simulate value selection - click tree node with title = sample location name/label
    wrapper
      .find(
        `span[title="${locationsHierarchy.locationsHierarchy.map['some-location-uuid'].label}"]`
      )
      .simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('Button[htmlType="submit"]').prop('disabled')).toEqual(false);

    await act(async () => {
      const button = wrapper.find('.ant-btn-primary.button-submit')
      button.simulate('submit');
      await flushPromises();
      wrapper.update();
    });

    expect(submitFormMock).toHaveBeenLastCalledWith(
      'some-location-uuid',
      '2022-01',
      'https://some.open.opensrp.url/opensrp/rest/'
    );
  });

  it('handles fetch error when fetching user data - team assignments', async () => {
    fetch.mockRejectOnce(new Error('API is down'));
    fetch.mockOnce(JSON.stringify(locationsHierarchy));

    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    // turn retries off - makes fetch fail on first try
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DistrictReport {...downloadProps} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith(
      'Please confirm that the logged-in user is assigned to a team and the team is assigned to a location, otherwise contact system admin.'
    );
  });
  it('handles fetch error when fetching user data - locations hierarchy', async () => {
    fetch.mockOnce(JSON.stringify(sampleTeamAssignment));
    fetch.mockRejectOnce(new Error('API is down'));

    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    // turn retries off - makes fetch fail on first try
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router history={history}>
            <DistrictReport {...downloadProps} />
          </Router>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
  });
});
