import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import * as notifications from '@opensrp/notifications';
import { unicefSections } from '../../../components/InventoryItemForm/tests/fixtures';
import { fetchSettings } from '../utils';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const translator = (str) => str;

describe('containers/InventoryAddEdit/utils/fetchSettings', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const openSRPBaseURL = 'https://mg-eusm-staging.smartregister.org/opensrp/rest/';
  const params = { serverVersion: 0, identifier: 'inventory_unicef_sections' };
  const setSettingsMock = jest.fn();

  it('fetches settings', async () => {
    fetch.once(JSON.stringify(unicefSections));

    fetchSettings(openSRPBaseURL, params, setSettingsMock, translator);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toHaveLength(1);
    expect(fetch.mock.calls[0]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_unicef_sections',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setSettingsMock.mock.calls).toHaveLength(1);
    expect(setSettingsMock.mock.calls[0][0]).toEqual(unicefSections);
  });

  it('handles API error', async () => {
    fetch.mockResponse('Server error here', { status: 500 });
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    fetchSettings(openSRPBaseURL, params, setSettingsMock, translator);

    await act(async () => {
      await flushPromises();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
    expect(setSettingsMock).not.toHaveBeenCalled();
  });
});
