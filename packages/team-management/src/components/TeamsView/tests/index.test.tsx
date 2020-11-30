import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import React from 'react';
import TeamsView, { loadSingleTeam } from '..';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { org1, teamMember } from '../../../ducks/tests/fixtures';
import { notification } from 'antd';

describe('containers/pages/teams/TeamsView', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('renders without crashing', async () => {
    shallow(
      <Router history={history}>
        <TeamsView />
      </Router>
    );
  });

  it('works correctly with store', async () => {
    fetch.mockResponse(JSON.stringify([org1]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsView />
        </Router>
      </Provider>
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
    expect(input.instance().value).toEqual('Sample');
    wrapper.unmount();
  });

  it('renders fetched data correctly', async () => {
    fetch.once(JSON.stringify(teamMember));
    loadSingleTeam(
      {
        key: 'key',
        id: 1,
        name: 'name',
        active: true,
        identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
      },
      'sometoken',
      jest.fn(),
      jest.fn()
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsView />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    wrapper.unmount();
  });

  it('test error thrown if API is down', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockReject(() => Promise.reject('API is down'));
    loadSingleTeam(
      {
        key: 'key',
        id: 1,
        name: 'name',
        active: true,
        identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
      },
      'sometoken',
      jest.fn(),
      jest.fn()
    );
    mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsView />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'API is down',
      description: '',
    });
  });
});
