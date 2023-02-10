import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import * as globalUtils from '@opensrp/react-utils';
import fetch from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { submitForm } from '../utils';
import { OPENSRP_URL_DOWNLOAD_REPORT } from '../../../constants';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));
jest.mock('@opensrp/react-utils', () => {
  const actual = jest.requireActual('@opensrp/react-utils');
  return {
    ...actual,
    downloadFile: jest.fn(),
    getFileNameFromCDHHeader: jest.fn(),
  };
});

describe('DistrictReport', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          api_token: 'hunter2',
          oAuth2Data: { access_token: 'hunter2', state: 'abcde' },
        }
      )
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('downloads csv correctly', async () => {
    const districtId = '0b1010010001010101';
    const period = '2022-02';
    const openSRPBaseURL = 'https://some.open.opensrp.url/opensrp/rest/';

    fetch.mockResponseOnce('test blob data', {
      status: 200,
      headers: {
        'content-disposition': 'attachment; filename=test.xlsx',
      },
    });

    const mockDownload = jest.spyOn(globalUtils, 'downloadFile');
    const mockFileName = jest.spyOn(globalUtils, 'getFileNameFromCDHHeader');

    submitForm(
      districtId,
      period,
      openSRPBaseURL
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    ).catch(() => {});

    await act(async () => {
      await flushPromises();
    });

    expect(mockDownload).toBeCalledTimes(1);
    // called with correct file name
    expect(mockFileName).toBeCalledWith('attachment; filename=test.xlsx');
    // composes download url properly
    expect(fetch.mock.calls.map((calls) => calls[0])).toMatchObject([
      `${openSRPBaseURL}${OPENSRP_URL_DOWNLOAD_REPORT}/${districtId}/${period}`,
    ]);
  });
});
