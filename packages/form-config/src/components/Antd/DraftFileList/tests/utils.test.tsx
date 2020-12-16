import fetch from 'jest-fetch-mock';
import { getTableColumns, makeRelease } from '../utils';
import { FixManifestDraftFiles } from '../../../../ducks/tests/fixtures';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import * as notifications from '@opensrp/notifications';
import { ERROR_OCCURRED } from '../../../../constants';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

describe('components/Antd/DraftFileList/utils/getTableColumns', () => {
  it('builds table columns correctly', () => {
    const accessToken = 'sometoken';
    const opensrpBaseURL = 'https://opensrp.smartregister.org/rest';

    expect(getTableColumns(accessToken, opensrpBaseURL, true)).toMatchSnapshot('table columns');
  });
});

describe('components/Antd/DraftFileList/utils/makeRelease', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const accessToken = 'hunter2';
  const opensrpBaseURL = 'https://test-example.com/rest';
  const dispatchMock = jest.fn();
  const removeDraftFilesMock = jest.fn();
  const setIfDoneHereMock = jest.fn();

  it('makes a release', async () => {
    makeRelease(
      FixManifestDraftFiles,
      accessToken,
      opensrpBaseURL,
      dispatchMock,
      removeDraftFilesMock,
      setIfDoneHereMock
    );

    await act(async () => {
      await flushPromises();
    });

    const postData = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body:
        '{"json":"{\\"forms_version\\":\\"1.0.26\\",\\"identifiers\\":[\\"test-form-1.json\\",\\"reveal-test-file.json\\"]}"}',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer hunter2',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
    };

    expect(fetch.mock.calls[0]).toEqual(['https://test-example.com/rest/manifest', postData]);
    expect(setIfDoneHereMock).toHaveBeenCalledWith(true);
    expect(dispatchMock).toHaveBeenCalledWith(removeDraftFilesMock());
  });

  it('handles failure if make release fails', async () => {
    fetch.mockRejectOnce(() => Promise.reject('API taking a break'));

    makeRelease(
      FixManifestDraftFiles,
      accessToken,
      opensrpBaseURL,
      dispatchMock,
      removeDraftFilesMock,
      setIfDoneHereMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setIfDoneHereMock).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
    expect(mockNotificationError).toHaveBeenCalledWith(ERROR_OCCURRED);
  });
});
