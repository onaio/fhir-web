import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import React from 'react';
import TeamsView, { populateTeamDetails } from '..';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import { org1, teamMember } from '../../../ducks/tests/fixtures';
import { notification } from 'antd';
import lang from '../../../lang';

describe('components/TeamsView', () => {
  const defaultProps = {
    opensrpBaseURL: '',
  };

  beforeEach(() => {
    fetch.mockClear();
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('renders without crashing', async () => {
    shallow(
      <Router history={history}>
        <TeamsView {...defaultProps} />
      </Router>
    );
  });

  it('works correctly with store', async () => {
    fetch.mockResponse(JSON.stringify([org1]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsView {...defaultProps} />
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
    expect(wrapper.find('input').first().props().value).toEqual('Sample');
    wrapper.unmount();
  });

  it('renders fetched data correctly', async () => {
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
      jest.fn()
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsView {...defaultProps} />
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
    const mockNotificationError = jest.spyOn(notification, 'error');
    fetch.mockReject(() => Promise.reject('API is down'));
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
      jest.fn()
    );
    mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamsView {...defaultProps} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: lang.ERROR_OCCURRED,
    });
  });
});
