import {
  formatDate,
  downloadManifestFile,
  fetchDrafts,
  fetchReleaseFiles,
  fetchManifests,
} from '../utils';
import { fixManifestFiles, downloadFile, fixManifestReleases } from '../../ducks/tests/fixtures';
import fetch from 'jest-fetch-mock';
import { getFetchOptions } from '@opensrp/server-service';
import { submitUploadForm, makeRelease } from '../utils';
import sampleFile from './sampleFile.json';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { FixManifestDraftFiles } from '../../ducks/tests/fixtures';
import lang from '../../lang';

/** eslint-disable @typescript-eslint/no-floating-promises */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.createObjectURL = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.revokeObjectURL = jest.fn();

describe('utils/formatDate', () => {
  it('should accept different date formats', () => {
    expect(formatDate('2019-10-20T15:21:50.227+02:00')).toEqual('2019-10-20');
    expect(formatDate('december 18, 2019, 8:45:22 PM')).toEqual('2019-12-18');
  });

  it('should add prefix 0 to days and months less than 10', () => {
    // month
    expect(formatDate('june 18, 2019, 8:45:22 PM')).toEqual('2019-06-18');
    // day
    expect(formatDate('december 8, 2019, 8:45:22 PM')).toEqual('2019-12-08');
    // day and  month
    expect(formatDate('June 8, 2019, 8:45:22 PM')).toEqual('2019-06-08');
  });
});

describe('utils/downloadManifestFile', () => {
  const baseURL = 'https://test-example.com/rest/';
  const downloadEndPoint = 'form-download';
  const accessToken = 'hunter2';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('downloads manifest file correctly', async () => {
    fetch.once(JSON.stringify(downloadFile));
    await downloadManifestFile(
      accessToken,
      baseURL,
      downloadEndPoint,
      fixManifestFiles[0],
      true,
      getFetchOptions
    );

    expect(fetch.mock.calls).toEqual([
      [
        'https://test-example.com/rest/form-download?form_identifier=test-form-1.json&form_version=1.0.26&is_json_validator=true',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('it downloads correctly if is not json validator', async () => {
    fetch.once(JSON.stringify(downloadFile));
    await downloadManifestFile(
      accessToken,
      baseURL,
      downloadEndPoint,
      fixManifestFiles[0],
      false,
      getFetchOptions
    );

    expect(fetch.mock.calls).toEqual([
      [
        'https://test-example.com/rest/form-download?form_identifier=test-form-1.json&form_version=1.0.26',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });
});

describe('helpers/utils/submitUploadForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const values = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    form_name: 'foo',
    module: 'bar',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    form_relation: 'baz',
    form: sampleFile,
  };
  const accessToken = 'hunter2';
  const opensrpBaseURL = 'https://test-example.com/rest/';
  const setSubmittingMock = jest.fn();
  const setIfDoneMock = jest.fn();
  const alertErrorMock = jest.fn();
  const endpoint = 'clientForm';

  it('submits', async () => {
    await submitUploadForm(
      values,
      accessToken,
      opensrpBaseURL,
      true,
      setSubmittingMock,
      setIfDoneMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/clientForm',
      expect.any(Object)
    );
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(setIfDoneMock.mock.calls[0][0]).toEqual(true);
  });

  it('submits with default endpoint value', async () => {
    await submitUploadForm(
      values,
      accessToken,
      opensrpBaseURL,
      true,
      setSubmittingMock,
      setIfDoneMock,
      alertErrorMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/clientForm',
      expect.any(Object)
    );
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(setIfDoneMock.mock.calls[0][0]).toEqual(true);
  });

  it('submits if json validator is false', async () => {
    await submitUploadForm(
      values,
      accessToken,
      opensrpBaseURL,
      false,
      setSubmittingMock,
      setIfDoneMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://test-example.com/rest/clientForm',
      expect.any(Object)
    );
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(setIfDoneMock.mock.calls[0][0]).toEqual(true);
  });

  it('handles error if form creation fails', async () => {
    fetch.mockResponse(
      'Unknown error. Kindly confirm that the form does not already exist on the server',
      { status: 500 }
    );

    await submitUploadForm(
      values,
      accessToken,
      opensrpBaseURL,
      true,
      setSubmittingMock,
      setIfDoneMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(alertErrorMock).toHaveBeenCalledWith(
      'Unknown error. Kindly confirm that the form does not already exist on the server'
    );
    expect(setIfDoneMock).not.toHaveBeenCalled();
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
  });
});

describe('helpers/utils/makeRelease', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const accessToken = 'hunter2';
  const opensrpBaseURL = 'https://test-example.com/rest/';
  const removeDraftFilesMock = jest.fn();
  const setIfDoneHereMock = jest.fn();
  const alertErrorMock = jest.fn();
  const dispatchMock = jest.fn();
  const endpoint = 'foo';

  it('makes a release', async () => {
    makeRelease(
      FixManifestDraftFiles,
      accessToken,
      opensrpBaseURL,
      removeDraftFilesMock,
      setIfDoneHereMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    const postData = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body: '{"json":"{\\"forms_version\\":\\"1.0.26\\",\\"identifiers\\":[\\"test-form-1.json\\",\\"reveal-test-file.json\\"]}"}',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer hunter2',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
    };

    expect(fetch.mock.calls[0]).toEqual(['https://test-example.com/rest/foo', postData]);
    expect(setIfDoneHereMock).toHaveBeenCalledWith(true);
    expect(removeDraftFilesMock).toHaveBeenCalled();
  });

  it('makes a release with the default endpoint', async () => {
    makeRelease(
      FixManifestDraftFiles,
      accessToken,
      opensrpBaseURL,
      removeDraftFilesMock,
      setIfDoneHereMock,
      alertErrorMock
    );

    await act(async () => {
      await flushPromises();
    });

    const postData = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body: '{"json":"{\\"forms_version\\":\\"1.0.26\\",\\"identifiers\\":[\\"test-form-1.json\\",\\"reveal-test-file.json\\"]}"}',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer hunter2',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
    };

    expect(fetch.mock.calls[0]).toEqual(['https://test-example.com/rest/manifest', postData]);
    expect(setIfDoneHereMock).toHaveBeenCalledWith(true);
    expect(removeDraftFilesMock).toHaveBeenCalled();
  });

  it('handles failure if make release fails', async () => {
    fetch.mockRejectOnce(new Error('API taking a break'));

    makeRelease(
      FixManifestDraftFiles,
      accessToken,
      opensrpBaseURL,
      removeDraftFilesMock,
      setIfDoneHereMock,
      alertErrorMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setIfDoneHereMock).not.toHaveBeenCalled();
    expect(removeDraftFilesMock).not.toHaveBeenCalled();
    expect(alertErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURRED);
  });

  it('calls dispatch if dispatch is passed', async () => {
    makeRelease(
      FixManifestDraftFiles,
      accessToken,
      opensrpBaseURL,
      removeDraftFilesMock,
      setIfDoneHereMock,
      alertErrorMock,
      endpoint,
      dispatchMock
    );

    await act(async () => {
      await flushPromises();
    });

    const postData = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      body: '{"json":"{\\"forms_version\\":\\"1.0.26\\",\\"identifiers\\":[\\"test-form-1.json\\",\\"reveal-test-file.json\\"]}"}',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer hunter2',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
    };

    expect(fetch.mock.calls[0]).toEqual(['https://test-example.com/rest/foo', postData]);
    expect(setIfDoneHereMock).toHaveBeenCalledWith(true);
    expect(dispatchMock).toHaveBeenCalledWith(removeDraftFilesMock());
  });
});

describe('helpers/utils/fetchDrafts', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const accessToken = 'hunter2';
  const opensrpBaseURL = 'https://test-example.com/rest/';
  const fetchDraftFilesMock = jest.fn();
  const setLoadingMock = jest.fn();
  const alertErrorMock = jest.fn();
  const dispatchMock = jest.fn();
  const endpoint = 'foo';

  it('fetches drafts', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));

    fetchDrafts(
      accessToken,
      opensrpBaseURL,
      fetchDraftFilesMock,
      setLoadingMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/foo?is_draft=true`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchDraftFilesMock).toHaveBeenCalledWith(FixManifestDraftFiles);
  });

  it('fetches drafts with the default endpoint', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));

    fetchDrafts(accessToken, opensrpBaseURL, fetchDraftFilesMock, setLoadingMock, alertErrorMock);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm/metadata?is_draft=true`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchDraftFilesMock).toHaveBeenCalledWith(FixManifestDraftFiles);
  });

  it('handles failure if fetch drafts fails', async () => {
    fetch.mockRejectOnce(new Error('API taking a break'));

    fetchDrafts(
      accessToken,
      opensrpBaseURL,
      fetchDraftFilesMock,
      setLoadingMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchDraftFilesMock).not.toHaveBeenCalled();
    expect(alertErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURRED);
  });

  it('calls dispatch if dispatch is passed', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));

    fetchDrafts(
      accessToken,
      opensrpBaseURL,
      fetchDraftFilesMock,
      setLoadingMock,
      alertErrorMock,
      endpoint,
      dispatchMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/foo?is_draft=true`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(dispatchMock).toHaveBeenCalledWith(fetchDraftFilesMock());
  });
});

describe('helpers/utils/fetchReleaseFiles', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const accessToken = 'hunter2';
  const opensrpBaseURL = 'https://test-example.com/rest/';
  const fetchReleasesMock = jest.fn();
  const setLoadingMock = jest.fn();
  const alertErrorMock = jest.fn();
  const dispatchMock = jest.fn();
  const endpoint = 'foo';

  it('fetches releases', async () => {
    fetch.once(JSON.stringify(fixManifestReleases));

    fetchReleaseFiles(
      accessToken,
      opensrpBaseURL,
      fetchReleasesMock,
      setLoadingMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/foo`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchReleasesMock).toHaveBeenCalledWith(fixManifestReleases);
  });

  it('fetches releases with the default endpoint', async () => {
    fetch.once(JSON.stringify(fixManifestReleases));

    fetchReleaseFiles(
      accessToken,
      opensrpBaseURL,
      fetchReleasesMock,
      setLoadingMock,
      alertErrorMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/manifest`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchReleasesMock).toHaveBeenCalledWith(fixManifestReleases);
  });

  it('handles failure if fetch releases fails', async () => {
    fetch.mockRejectOnce(new Error('API taking a break'));

    fetchReleaseFiles(
      accessToken,
      opensrpBaseURL,
      fetchReleasesMock,
      setLoadingMock,
      alertErrorMock,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchReleasesMock).not.toHaveBeenCalled();
    expect(alertErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURRED);
  });

  it('calls dispatch if dispatch is passed', async () => {
    fetch.once(JSON.stringify(FixManifestDraftFiles));

    fetchReleaseFiles(
      accessToken,
      opensrpBaseURL,
      fetchReleasesMock,
      setLoadingMock,
      alertErrorMock,
      endpoint,
      dispatchMock
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/foo`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(dispatchMock).toHaveBeenCalledWith(fetchReleasesMock());
  });
});

describe('helpers/utils/fetchManifests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  const accessToken = 'hunter2';
  const opensrpBaseURL = 'https://test-example.com/rest/';
  const fetchFilesMock = jest.fn();
  const removeFilesMock = jest.fn();
  const setLoadingMock = jest.fn();
  const alertErrorMock = jest.fn();
  const dispatchMock = jest.fn();
  const endpoint = 'foo';
  const formVersion = fixManifestReleases[0].identifier;

  it('fetches manifest files', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));

    fetchManifests(
      accessToken,
      opensrpBaseURL,
      fetchFilesMock,
      removeFilesMock,
      setLoadingMock,
      alertErrorMock,
      formVersion,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/foo?identifier=${fixManifestReleases[0].identifier}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchFilesMock).toHaveBeenCalledWith(fixManifestFiles);
    expect(removeFilesMock.mock.calls).toHaveLength(1);
  });

  it('fetches manifest files with the default endpoint', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));

    fetchManifests(
      accessToken,
      opensrpBaseURL,
      fetchFilesMock,
      removeFilesMock,
      setLoadingMock,
      alertErrorMock,
      formVersion
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/clientForm/metadata?identifier=${fixManifestReleases[0].identifier}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchFilesMock).toHaveBeenCalledWith(fixManifestFiles);
    expect(removeFilesMock.mock.calls).toHaveLength(1);
  });

  it('handles failure if fetch fails', async () => {
    fetch.mockRejectOnce(new Error('API taking a break'));

    fetchManifests(
      accessToken,
      opensrpBaseURL,
      fetchFilesMock,
      removeFilesMock,
      setLoadingMock,
      alertErrorMock,
      formVersion
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchFilesMock).not.toHaveBeenCalled();
    expect(alertErrorMock).toHaveBeenCalledWith(lang.ERROR_OCCURRED);
    expect(removeFilesMock.mock.calls).toHaveLength(1);
  });

  it('calls dispatch if dispatch is passed', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));

    fetchManifests(
      accessToken,
      opensrpBaseURL,
      fetchFilesMock,
      removeFilesMock,
      setLoadingMock,
      alertErrorMock,
      formVersion,
      endpoint,
      dispatchMock
    );
    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/foo?identifier=${fixManifestReleases[0].identifier}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(dispatchMock.mock.calls).toHaveLength(2);
    expect(dispatchMock.mock.calls[0][0]).toBe(removeFilesMock());
    expect(dispatchMock.mock.calls[1][0]).toBe(fetchFilesMock());
  });

  it('fetches correctly if formVersion is null', async () => {
    fetch.once(JSON.stringify(fixManifestFiles));

    fetchManifests(
      accessToken,
      opensrpBaseURL,
      fetchFilesMock,
      removeFilesMock,
      setLoadingMock,
      alertErrorMock,
      null,
      endpoint
    );

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      `https://test-example.com/rest/foo?is_json_validator=true`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(setLoadingMock.mock.calls[0][0]).toBe(true);
    expect(setLoadingMock.mock.calls[1][0]).toBe(false);
    expect(fetchFilesMock).toHaveBeenCalledWith(fixManifestFiles);
    expect(removeFilesMock.mock.calls).toHaveLength(1);
  });
});
