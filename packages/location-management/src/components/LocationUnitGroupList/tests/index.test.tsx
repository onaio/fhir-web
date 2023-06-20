import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { authenticateUser } from '@onaio/session-reducer';
import { Router } from 'react-router';
import React from 'react';
import LocationUnitGroupList from '..';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import fetch from 'jest-fetch-mock';
import { sampleLocationUnitGroupPayload } from '../../LocationUnitGroupAddEdit/tests/fixtures';
import { baseURL } from '../../../constants';
import * as notifications from '@opensrp/notifications';


jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

LocationUnitGroupList.defaultProps = { opensrpBaseURL: baseURL };

describe('location-management/src/components/LocationUnitGroupList', () => {
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

  beforeEach(() => {
    fetch.resetMocks();
  });
  it('renders without crashing', async () => {
    shallow(
      <Router history={history}>
        <LocationUnitGroupList opensrpBaseURL={baseURL} />
      </Router>
    );
  });

  it('works correctly with store', async () => {
    fetch.mockResponse(JSON.stringify([sampleLocationUnitGroupPayload]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitGroupList opensrpBaseURL={baseURL} />
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

  it('test error thrown if An error occurred', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    fetch.mockReject(new Error('An error occurred'));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitGroupList opensrpBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
  });
});
