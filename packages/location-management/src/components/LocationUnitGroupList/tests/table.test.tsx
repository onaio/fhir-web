/* eslint-disable @typescript-eslint/naming-convention */
import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import { getOpenSRPUserInfo } from '@onaio/gatekeeper';
import { history } from '@onaio/connected-reducer-registry';
import { authenticateUser } from '@onaio/session-reducer';
import React from 'react';
import { Provider } from 'react-redux';
import Table, { onDelete, TableData } from '../Table';
import { Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { sampleLocationUnitGroupPayload } from '../../LocationUnitGroupAddEdit/tests/fixtures';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { baseURL } from '../../../constants';
import * as notifications from '@opensrp/notifications';

Table.defaultProps = { opensrpBaseURL: baseURL };

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

export const jwtAccessToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHZ0NjX3c0UG9Gd25vbThILXpQMEQ4UTc1ZjZ1LWdHLUJTZV9Xc1QxSkU0In0.eyJleHAiOjE2NTg3MzQyMTcsImlhdCI6MTY1ODczNDE1NywiYXV0aF90aW1lIjoxNjU4NzM0MTUxLCJqdGkiOiJkZmNhNDExOS05NDViLTQ5ZDYtOWI2Mi00OGM1OTcwNWZhMGQiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLXN0YWdlLnNtYXJ0cmVnaXN0ZXIub3JnL2F1dGgvcmVhbG1zL29wZW5zcnAtd2ViLXN0YWdlIiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6ImRiOTAwOTJmLWI5ODMtNGYyNi1iMTI5LWRhZGRhZjAyMzg0ZiIsInR5cCI6IkJlYXJlciIsImF6cCI6Im9wZW5zcnAtc3RhZ2Utc2VydmVyIiwic2Vzc2lvbl9zdGF0ZSI6Ijk1NjIyZDM3LTE3NTctNDJkMy05ZWRhLWRhOTkxMjExNTNlYSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3dlYi5vbi1wcmVtaXNlLms4cy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vb3BlbnNycC5vbi1wcmVtaXNlLms4cy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vc3VwZXJzZXQtb2F1dGgtZGVtby5yaXZlcnMub25hbGFicy5vcmciLCJodHRwczovL3dlYi5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnLyoiLCJodHRwOi8vbG9jYWxob3N0OjkwOTAvKiIsImh0dHBzOi8vemVpci5zbWFydHJlZ2lzdGVyLm9yZy8qIiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyoiLCJodHRwOi8vd2ViLnplaXIuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHBzOi8vb3BlbnNycC1zdGFnZS1zZW50aW5lbC5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnLyoiLCJodHRwczovL3dlYi5vcGVuc3JwLXN0YWdlLnNtYXJ0cmVnaXN0ZXIub3JnIiwiaHR0cHM6Ly9maGlyLmxhYnMuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwczovL29wZW5zcnAtc3RhZ2UubGFicy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vd2ViLndlbGxuZXNzcGFzcy1wcmV2aWV3LnNtYXJ0cmVnaXN0ZXIub3JnLyIsImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImh0dHBzOi8vb3BlbnNycC1zdGFnZS5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHA6Ly8xOTIuMTY4LjEwMC4yOjgwODAvKiIsImh0dHBzOi8vd2ViLnplaXIuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwOi8vd2ViLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly8xNzIuMjAuMTI3LjIzMTo5MDkwLyoiLCJodHRwczovL2ZoaXItd2ViLm9wZW5zcnAtc3RhZ2Uuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwOi8vZmhpci5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnIiwiaHR0cDovL29wZW5zcnAub24tcHJlbWlzZS5rOHMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly9vcGVuc3JwLXN0YWdlLXNlbnRpbmVsLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly9vcGVuc3JwLXN0YWdlLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly93ZWIub24tcHJlbWlzZS5rOHMuc21hcnRyZWdpc3Rlci5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIk1BTkFHRV9SRVBPUlRTIiwiT1BFTk1SUyIsInJlYWxtLWFkbWluIiwiRURJVF9LRVlDTE9BS19VU0VSUyIsIlZJRVdfS0VZQ0xPQUtfVVNFUlMiLCJQTEFOU19GT1JfVVNFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJBTExfRVZFTlRTIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiLCJ2aWV3LXVzZXJzIiwicXVlcnktZ3JvdXBzIiwicXVlcnktdXNlcnMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHJlYWQgcHJvZmlsZSB3cml0ZSBlbWFpbCIsInNpZCI6Ijk1NjIyZDM3LTE3NTctNDJkMy05ZWRhLWRhOTkxMjExNTNlYSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkRlbW8gVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6ImRlbW8iLCJnaXZlbl9uYW1lIjoiRGVtbyIsImZhbWlseV9uYW1lIjoiVXNlciJ9.AhC1rYONG37Er8YUw0OvEM6h3FqaFYFBN845kOZN2bFo8_x3kpaWuZ5qGGxh8LfPqnMsjnpkL4dXD_3E8uTvjBZBFIeLdck2RaYmxoPXK7j0lDnf4ia36oz2TKUVSBDijacNFdmxmVbyeddFcN6ZPluzO9bvgFkIqIEyCwrLLZEnZwsUdUlgfD4V_ebwkOcSH0z69AkQprZSRPksd5CsY8cPqqDYNRhjRBNqvBdcxtlPwv48Mtpau4rs3yucYKahscNolVAkE_FetEI0KenZdYV5g9N3VdneCsjW4DdZkcuZDrKaA6g64gBUyXEptRsL4wYPwup4_G5NU8vrD-L2cA';

describe('location-management/src/components/LocationTagView', () => {
  const endpoint = 'location-tag/delete';
  const tagId = '1';

  beforeAll(() => {
    const { authenticated, user, extraData } = getOpenSRPUserInfo({
      oAuth2Data: {
        access_token: jwtAccessToken,
        expires_in: '3599',
        state: 'opensrp',
        token_type: 'bearer',
      },
    });
    store.dispatch(authenticateUser(authenticated, user, extraData));
  });
  const tableData: TableData[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      key: i.toString(),
      id: i,
      name: `Edrward ${i}`,
      active: i % 2 === 0,
      description: `asdasdasdkjh123${i}`,
    });
  }

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table opensrpBaseURL={baseURL} data={tableData} />
        </Router>
      </Provider>
    );

    expect(wrapper.find('table')).toHaveLength(1);
  });

  it('Test Table View Detail', () => {
    const onViewDetails = jest.fn();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table opensrpBaseURL={baseURL} data={tableData} onViewDetails={onViewDetails} />
        </Router>
      </Provider>
    );

    const dropdown = wrapper.find('.more-options').first();
    dropdown.simulate('click');
    wrapper.update();
    const dropdownItems = wrapper.find('button[data-testid="viewdetails"]');
    expect(dropdownItems).toHaveLength(1);
    dropdownItems.simulate('click');

    expect(onViewDetails).toBeCalled();
  });

  it('Test Table when detail view prop is undefined', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table opensrpBaseURL={baseURL} data={tableData} />
        </Router>
      </Provider>
    );

    // wrapper.find('.more-options').first().simulate('click');
    // wrapper.find('.viewdetails').first().simulate('click');
    const dropdown = wrapper.find('.more-options').first();
    dropdown.simulate('click');
    wrapper.update();
    const dropdownItems = wrapper.find('button[data-testid="viewdetails"]');
    expect(dropdownItems).toHaveLength(1);
    dropdownItems.simulate('click');

    expect(wrapper).toHaveLength(1);
  });

  it('Test Table Delete', async () => {
    const mockNotificationSuccess = jest.spyOn(notifications, 'sendSuccessNotification');
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table opensrpBaseURL={baseURL} data={tableData} />
        </Router>
      </Provider>
    );

    const dropdown = wrapper.find('.more-options').first();
    dropdown.simulate('click');
    wrapper.update();
    const dropdownItems = wrapper.find('button[data-testid="delete"]');
    expect(dropdownItems).toHaveLength(1);
    dropdownItems.simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationSuccess).toBeCalled();
  });

  it('deletes location', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    fetch.mockResponse(JSON.stringify(sampleLocationUnitGroupPayload));

    onDelete(sampleLocationUnitGroupPayload, baseURL, (t) => t);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(`${baseURL}${endpoint}/${tagId}`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${jwtAccessToken}`,
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'DELETE',
    });
    expect(notificationSuccessMock).toHaveBeenCalledWith('Successfully Deleted!');
  });

  it('hanldles failed deletion', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.mockReject(new Error('An error occurred'));

    onDelete(sampleLocationUnitGroupPayload, baseURL, (t) => t);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith('There was a problem deleting group');
  });

  it('Should show table pagination options', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table opensrpBaseURL={baseURL} data={tableData} />
        </Router>
      </Provider>
    );
    expect(wrapper.find('.ant-table-pagination')).toBeTruthy();
  });
});
