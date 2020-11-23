import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import React from 'react';
import LocationGroupView from '..';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { sampleLocationGroupPayload } from '../../LocationGroupAdd/tests/fixtures';
import { notification } from 'antd';

describe('containers/pages/locations/LocationGroupView', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('renders without crashing', async () => {
    shallow(
      <Router history={history}>
        <LocationGroupView />
      </Router>
    );
  });

  it('works correctly with store', async () => {
    fetch.mockResponse(JSON.stringify([sampleLocationGroupPayload]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationGroupView />
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

  it('test error thrown if API is down', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockReject(() => Promise.reject('API is down'));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationGroupView />
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
