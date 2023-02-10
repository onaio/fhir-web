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

export const jwtAccessToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHZ0NjX3c0UG9Gd25vbThILXpQMEQ4UTc1ZjZ1LWdHLUJTZV9Xc1QxSkU0In0.eyJleHAiOjE2NTg3MzQyMTcsImlhdCI6MTY1ODczNDE1NywiYXV0aF90aW1lIjoxNjU4NzM0MTUxLCJqdGkiOiJkZmNhNDExOS05NDViLTQ5ZDYtOWI2Mi00OGM1OTcwNWZhMGQiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLXN0YWdlLnNtYXJ0cmVnaXN0ZXIub3JnL2F1dGgvcmVhbG1zL29wZW5zcnAtd2ViLXN0YWdlIiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6ImRiOTAwOTJmLWI5ODMtNGYyNi1iMTI5LWRhZGRhZjAyMzg0ZiIsInR5cCI6IkJlYXJlciIsImF6cCI6Im9wZW5zcnAtc3RhZ2Utc2VydmVyIiwic2Vzc2lvbl9zdGF0ZSI6Ijk1NjIyZDM3LTE3NTctNDJkMy05ZWRhLWRhOTkxMjExNTNlYSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3dlYi5vbi1wcmVtaXNlLms4cy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vb3BlbnNycC5vbi1wcmVtaXNlLms4cy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vc3VwZXJzZXQtb2F1dGgtZGVtby5yaXZlcnMub25hbGFicy5vcmciLCJodHRwczovL3dlYi5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnLyoiLCJodHRwOi8vbG9jYWxob3N0OjkwOTAvKiIsImh0dHBzOi8vemVpci5zbWFydHJlZ2lzdGVyLm9yZy8qIiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyoiLCJodHRwOi8vd2ViLnplaXIuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHBzOi8vb3BlbnNycC1zdGFnZS1zZW50aW5lbC5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnLyoiLCJodHRwczovL3dlYi5vcGVuc3JwLXN0YWdlLnNtYXJ0cmVnaXN0ZXIub3JnIiwiaHR0cHM6Ly9maGlyLmxhYnMuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwczovL29wZW5zcnAtc3RhZ2UubGFicy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vd2ViLndlbGxuZXNzcGFzcy1wcmV2aWV3LnNtYXJ0cmVnaXN0ZXIub3JnLyIsImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImh0dHBzOi8vb3BlbnNycC1zdGFnZS5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHA6Ly8xOTIuMTY4LjEwMC4yOjgwODAvKiIsImh0dHBzOi8vd2ViLnplaXIuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwOi8vd2ViLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly8xNzIuMjAuMTI3LjIzMTo5MDkwLyoiLCJodHRwczovL2ZoaXItd2ViLm9wZW5zcnAtc3RhZ2Uuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwOi8vZmhpci5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnIiwiaHR0cDovL29wZW5zcnAub24tcHJlbWlzZS5rOHMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly9vcGVuc3JwLXN0YWdlLXNlbnRpbmVsLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly9vcGVuc3JwLXN0YWdlLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly93ZWIub24tcHJlbWlzZS5rOHMuc21hcnRyZWdpc3Rlci5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIk1BTkFHRV9SRVBPUlRTIiwiT1BFTk1SUyIsInJlYWxtLWFkbWluIiwiRURJVF9LRVlDTE9BS19VU0VSUyIsIlZJRVdfS0VZQ0xPQUtfVVNFUlMiLCJQTEFOU19GT1JfVVNFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJBTExfRVZFTlRTIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiLCJ2aWV3LXVzZXJzIiwicXVlcnktZ3JvdXBzIiwicXVlcnktdXNlcnMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHJlYWQgcHJvZmlsZSB3cml0ZSBlbWFpbCIsInNpZCI6Ijk1NjIyZDM3LTE3NTctNDJkMy05ZWRhLWRhOTkxMjExNTNlYSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkRlbW8gVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6ImRlbW8iLCJnaXZlbl9uYW1lIjoiRGVtbyIsImZhbWlseV9uYW1lIjoiVXNlciJ9.AhC1rYONG37Er8YUw0OvEM6h3FqaFYFBN845kOZN2bFo8_x3kpaWuZ5qGGxh8LfPqnMsjnpkL4dXD_3E8uTvjBZBFIeLdck2RaYmxoPXK7j0lDnf4ia36oz2TKUVSBDijacNFdmxmVbyeddFcN6ZPluzO9bvgFkIqIEyCwrLLZEnZwsUdUlgfD4V_ebwkOcSH0z69AkQprZSRPksd5CsY8cPqqDYNRhjRBNqvBdcxtlPwv48Mtpau4rs3yucYKahscNolVAkE_FetEI0KenZdYV5g9N3VdneCsjW4DdZkcuZDrKaA6g64gBUyXEptRsL4wYPwup4_G5NU8vrD-L2cA';

describe('components/TeamsView/table', () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  beforeAll(() => {
    const { authenticated, user, extraData } = getOpenSRPUserInfo({
      oAuth2Data: {
        access_token: jwtAccessToken,
        state: 'opensrp',
        token_type: 'bearer',
      },
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
