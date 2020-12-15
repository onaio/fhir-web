/* eslint-disable @typescript-eslint/camelcase */
import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import { getOpenSRPUserInfo } from '@onaio/gatekeeper';
import { history } from '@onaio/connected-reducer-registry';
import { authenticateUser } from '@onaio/session-reducer';
import React from 'react';
import { Provider } from 'react-redux';
import Table, { onDelete, TableData } from '../Table';
import { Router } from 'react-router';
import { notification } from 'antd';
import fetch from 'jest-fetch-mock';
import { sampleLocationUnitGroupPayload } from '../../LocationUnitGroupAddEdit/tests/fixtures';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';

jest.mock('../../../configs/env');

describe('location-management/src/components/LocationTagView', () => {
  const baseURL = 'https://opensrp-stage.smartregister.org/opensrp/rest/';
  const endpoint = 'location-tag/delete';
  const tagId = '1';

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
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table
            opensrpBaseURL={baseURL}
            data={tableData}
            onViewDetails={() => wrapper.unmount()}
          />
        </Router>
      </Provider>
    );

    wrapper.find('.more-options').first().simulate('click');
    wrapper.find('.viewdetails').first().simulate('click');

    expect(wrapper).toHaveLength(0);
  });

  it('Test Table when detail view prop is undefined', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table opensrpBaseURL={baseURL} data={tableData} />
        </Router>
      </Provider>
    );

    wrapper.find('.more-options').first().simulate('click');
    wrapper.find('.viewdetails').first().simulate('click');

    expect(wrapper).toHaveLength(1);
  });

  it('Test Table Delete', async () => {
    const mockNotificationSuccess = jest.spyOn(notification, 'success');
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table opensrpBaseURL={baseURL} data={tableData} />
        </Router>
      </Provider>
    );

    wrapper.find('.more-options').first().simulate('click');
    wrapper.find('.delete').first().simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationSuccess).toBeCalled();
  });

  it('Test Name Sorting functionality', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table opensrpBaseURL={baseURL} data={tableData} />
        </Router>
      </Provider>
    );

    const heading = wrapper.find('thead');
    expect(heading.find('th')).toHaveLength(2);
    heading.find('th').at(0).children().simulate('click');
    heading.find('th').at(0).children().simulate('click');

    const body = wrapper.find('tbody');
    expect(body.children().first().prop('rowKey')).toBe('4');
    expect(body.children().last().prop('rowKey')).toBe('1');
  });

  it('deletes location', async () => {
    const notificationSuccessMock = jest.spyOn(notification, 'success');
    fetch.mockResponse(JSON.stringify(sampleLocationUnitGroupPayload));

    onDelete(sampleLocationUnitGroupPayload, 'sometoken', baseURL);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(`${baseURL}${endpoint}/${tagId}`, {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer sometoken',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'DELETE',
    });
    expect(notificationSuccessMock).toHaveBeenCalledWith({
      message: 'Successfully Deleted!',
      description: undefined,
    });
  });

  it('hanldles failed deletion', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockReject(() => Promise.reject('An error occurred'));

    onDelete(sampleLocationUnitGroupPayload, 'sometoken', baseURL);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'An error occurred',
      description: undefined,
    });
  });
});
