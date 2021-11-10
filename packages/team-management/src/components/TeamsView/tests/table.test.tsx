/* eslint-disable @typescript-eslint/camelcase */
import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import { getOpenSRPUserInfo } from '@onaio/gatekeeper';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { history } from '@onaio/connected-reducer-registry';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import React from 'react';
import { Provider } from 'react-redux';
import Table from '../Table';
import { Router } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { opensrpBaseURL } from '../../TeamsAddEdit/tests/fixtures';
import { org1, org1Assignment, org3 } from '../../../ducks/tests/fixtures';

describe('components/TeamsView/table', () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  beforeAll(() => {
    const { authenticated, user, extraData } = getOpenSRPUserInfo({
      oAuth2Data: {
        access_token: 'hunter2',
        expires_in: '3599',
        state: 'opensrp',
        token_type: 'bearer',
      },
      preferredName: 'Superset User',
      roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
      username: 'superset-user',
    });
    store.dispatch(authenticateUser(authenticated, user, extraData));
  });

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router history={history}>
            <Table
              setPractitionersList={() => jest.fn()}
              setDetail={() => jest.fn()}
              opensrpBaseURL={opensrpBaseURL}
              fetchOrgs={() => Promise.resolve([org1, org3])}
              searchParam=""
              setAssignedLocations={() => jest.fn()}
            />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
    expect(wrapper.props().children.props.children).toMatchSnapshot('Table');
  });

  it('Test Table View Detail', async () => {
    fetch.mockResponseOnce(JSON.stringify([org1, org3]));
    const onViewDetails = jest.fn();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          <Table
            setPractitionersList={() => jest.fn()}
            setDetail={() => jest.fn()}
            opensrpBaseURL={opensrpBaseURL}
            fetchOrgs={() => Promise.resolve([org1, org3])}
            searchParam=""
            setAssignedLocations={() => jest.fn()}
            onViewDetails={onViewDetails}
          />
        </Router>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const dropdown = wrapper.find('Dropdown').at(0);
    dropdown.simulate('click');
    wrapper.update();

    fetch.mockResponseOnce(JSON.stringify(org1Assignment));
    fetch.mockResponseOnce(JSON.stringify([]));

    wrapper.find('.viewdetails').at(0).simulate('click');
    wrapper.update();
    expect(onViewDetails).toBeCalled();
    wrapper.unmount();
  });

  it('Should show table pagination options', () => {
    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          <Table
            setPractitionersList={() => jest.fn()}
            setDetail={() => jest.fn()}
            opensrpBaseURL={opensrpBaseURL}
            fetchOrgs={() => Promise.resolve([org1, org3])}
            searchParam=""
            setAssignedLocations={() => jest.fn()}
          />
        </Router>
      </QueryClientProvider>
    );
    expect(wrapper.find('.ant-table-pagination')).toBeTruthy();
  });
});
