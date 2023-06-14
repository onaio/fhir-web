import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { Router } from 'react-router';
import React from 'react';
import TeamsView, { populateTeamDetails, RawAssignment, sanitizeAssignments } from '..';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import {
  org1,
  assignments,
  org2,
  org3,
  teamMember,
  practitioners,
} from '../../../ducks/tests/fixtures';
import { notification } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('components/TeamsView', () => {
  const teamViewProps = {
    opensrpBaseURL: OPENSRP_API_BASE_URL,
    history,
    location: {
      hash: '',
      pathname: `/admin/teams`,
      search: '',
      state: {},
    },
    match: {
      isExact: true,
      params: {},
      path: `/admin/teams`,
      url: `/admin/teams`,
    },
  };

  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('renders without crashing', async () => {
    shallow(
      <Router history={history}>
        <TeamsView {...teamViewProps} />
      </Router>
    );
  });

  it('works correctly with store', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    fetch.mockResponse(JSON.stringify(5));
    fetch.mockResponse(JSON.stringify([org1]));
    const wrapper = mount(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <TeamsView {...teamViewProps} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(fetch.mock.calls.map((res) => res[0])).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization?pageNumber=1&pageSize=5',
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization/count',
    ]);
    // test search input works
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'Sample' } });
    await act(async () => {
      wrapper.update();
    });
    expect(wrapper.find('input').first().props().value).toEqual('Sample');
    wrapper.unmount();
  });

  it('renders fetched data correctly', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    fetch.once(JSON.stringify(teamMember));
    populateTeamDetails(
      {
        id: 1,
        name: 'name',
        active: true,
        identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
      },
      '',
      jest.fn(),
      jest.fn(),
      jest.fn(),
      (t) => t
    );
    const wrapper = mount(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <TeamsView {...teamViewProps} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    wrapper.unmount();
  });

  it('test error thrown if API is down', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const mockNotificationError = jest.spyOn(notification, 'error');
    fetch.mockReject(new Error('API is down'));
    populateTeamDetails(
      {
        id: 1,
        name: 'name',
        active: true,
        identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
      },
      '',
      jest.fn(),
      jest.fn(),
      jest.fn(),
      (t) => t
    );
    const wrapper = mount(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <TeamsView {...teamViewProps} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: 'An error occurred',
    });
    wrapper.unmount();
  });

  it('search works correctly', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    fetch.mockResponseOnce(JSON.stringify([org1, org3]));

    const newProps = {
      ...teamViewProps,
      location: {
        ...teamViewProps.location,
        search: '?searchQuery=test',
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <TeamsView {...newProps} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const search = wrapper.find('input').first();
    await act(async () => {
      search.simulate('change', { target: { value: 'luang' } });
      wrapper.update();
    });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(history.location.search).toEqual('?searchQuery=luang');
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/search?name=test',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
    wrapper.unmount();
  });

  it('team details view render correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify([org1, org3]));
    fetch.mockResponseOnce(JSON.stringify(5));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    const wrapper = mount(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <TeamsView {...teamViewProps} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const tree = document.querySelector('.content');
    expect(tree).toMatchSnapshot();
    console.log(wrapper.debug())
    // find view details button
    const dropdown = wrapper.find('[data-testid="view-details"]')
    dropdown.simulate('click');
    wrapper.update();

    fetch.mockResponseOnce(JSON.stringify(practitioners));
    fetch.mockResponseOnce(JSON.stringify([assignments]));

    // wrapper.find('.viewdetails').at(0).simulate('click');
    // wrapper.update();

    // click view details

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find the user details
    expect(wrapper.find('TeamsDetail').text()).toMatchInlineSnapshot(
      `"Team NameThe LuangStatustrueIdentifierfcc19470-d599-11e9-bb65-2a2ae2dbcce4Team MembersTest11 ElevenGareth GrahamDemo dev UserAssigned LocationsThis team is not assigned to any Location"`
    );
    expect(fetch.mock.calls.map((x) => x[0])).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization?pageNumber=1&pageSize=5',
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization/count',
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization/practitioner/fcc19470-d599-11e9-bb65-2a2ae2dbcce4',
      'https://opensrp-stage.smartregister.org/opensrp/rest/organization/assignedLocationsAndPlans/fcc19470-d599-11e9-bb65-2a2ae2dbcce4',
    ]);

    wrapper.unmount();
  });

  it('sorting works', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    fetch.mockResponse(JSON.stringify([org1, org2]));

    const wrapper = mount(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <TeamsView {...teamViewProps} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // Default order
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('The Luang');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual('Demo Team');

    // Ascending
    wrapper.find('thead th').at(0).simulate('click');
    wrapper.update();

    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('Demo Team');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual('The Luang');

    // descending
    wrapper.find('thead th').at(0).simulate('click');
    wrapper.update();

    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('The Luang');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual('Demo Team');

    wrapper.unmount();
  });
});

describe('Teams view utils', () => {
  it('sanitize assignments works correctly', () => {
    const invalidToDate = {
      organizationId: 'InvalidToDate',
      jurisdictionId: 'null',
      planId: '335ef7a3-7f35-58aa-8263-4419464946d8',
      fromDate: 1600128000000,
      toDate: 'null',
    };
    const expiredToDate = {
      organizationId: 'expiredToDate',
      jurisdictionId: 'null',
      planId: '335ef7a3-7f35-58aa-8263-4419464946d8',
      fromDate: 1600128000000,
      toDate: 160012800000,
    };
    const noJurisdiction = {
      organizationId: 'noJurisdiction',
      jurisdictionId: null,
      planId: '335ef7a3-7f35-58aa-8263-4419464946d8',
      fromDate: 1600128000000,
      toDate: 1600128000000,
    };
    const noOrganization = {
      organizationId: null,
      jurisdictionId: 'noOrganization',
      planId: '335ef7a3-7f35-58aa-8263-4419464946d8',
      fromDate: 1600128000000,
      toDate: 1600128000000,
    };
    const validAssignment = {
      organizationId: 'validAsignment',
      jurisdictionId: 'null',
      planId: '335ef7a3-7f35-58aa-8263-4419464946d8',
      fromDate: 1600128000000,
      toDate: 1600128000000,
    };
    const inputs = [
      invalidToDate,
      expiredToDate,
      noJurisdiction,
      noOrganization,
      validAssignment,
    ] as RawAssignment[];
    const outputs = [validAssignment];
    expect(sanitizeAssignments(inputs)).toEqual(outputs);
  });
});
