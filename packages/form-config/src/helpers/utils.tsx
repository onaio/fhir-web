import { URLParams, OpenSRPService, getFetchOptions, HTTPError } from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';
import { UploadFileFieldTypes } from './types';
import {
  ERROR_OCCURRED,
  OPENSRP_FORMS_ENDPOINT,
  OPENSRP_FORM_METADATA_ENDPOINT,
  OPENSRP_MANIFEST_ENDPOINT,
} from '../constants';
import { ManifestFilesTypes } from '../ducks/manifestFiles';
import { handleDownload } from './fileDownload';
import { fetchManifestDraftFiles, removeManifestDraftFiles } from '../ducks/manifestDraftFiles';
import { Dispatch } from 'redux';

type StrNum = string | number;

/**
 * format long date to YYY-mm-dd
 *
 * @param {string} stringDate - date as a string
 * @returns {string} - string of date in YYY-mm-dd format
 */
export const formatDate = (stringDate: string): string => {
  const date = new Date(stringDate);
  let dd: StrNum = date.getDate();
  let mm: StrNum = date.getMonth() + 1;
  const yyy = date.getFullYear();
  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;
  return `${yyy}-${mm}-${dd}`;
};

/**
 * Handle download link click
 *
 * @param {string} accessToken - opensrp API access token
 * @param {string} baseURL OpenSRP API base URL
 * @param {string} downloadEndPoint opensrp download URL
 * @param {ManifestFilesTypes} obj manifest object file to be downloaded
 * @param {boolean} isJsonValidator pass true if is json validator. Default is false
 *  @param {getFetchOptions} getPayload custom fetch options
 */
export const downloadManifestFile = async (
  accessToken: string,
  baseURL: string,
  downloadEndPoint: string,
  obj: ManifestFilesTypes,
  isJsonValidator = false,
  getPayload?: typeof getFetchOptions
) => {
  const { identifier } = obj;
  const params: URLParams = {
    form_identifier: identifier, // eslint-disable-line @typescript-eslint/camelcase
    form_version: obj.version, // eslint-disable-line @typescript-eslint/camelcase
  };
  if (isJsonValidator) {
    params['is_json_validator'] = true;
  }
  const clientService = new OpenSRPService(accessToken, baseURL, downloadEndPoint, getPayload);
  await clientService.list(params).then((res) => {
    handleDownload(res.clientForm.json, identifier);
  });
};

/**
 * Handle form upload submission
 *
 * @param {Dictionary} values - submitted values
 * @param {string} accessToken  - Opensrp API access token
 * @param {string} opensrpBaseURL - Opensrp API base URL
 * @param {boolean} isJsonValidator - boolean to confirm if the form is json validator or not
 * @param {Function} setSubmitting - set the form state for isSubmitting
 * @param {Function} setIfDoneHere - set the form state for ifDoneHere
 * @param {Function} alertError - receive error description
 * @param {string} endpoint - Opensrp endpoint
 */
export const submitUploadForm = (
  values: UploadFileFieldTypes,
  accessToken: string,
  opensrpBaseURL: string,
  isJsonValidator: boolean,
  setSubmitting: (isSubmitting: boolean) => void,
  setIfDoneHere: (ifDoneHere: boolean) => void,
  alertError: (err: string) => void,
  endpoint = OPENSRP_FORMS_ENDPOINT
): void => {
  setSubmitting(true);
  const formData = new FormData();
  const { form } = values;

  Object.keys(values).forEach((key) => {
    if (key === 'form') {
      formData.append('form', form);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formData.append(key, (values as any)[key]);
    }
  });

  if (isJsonValidator) {
    formData.append('is_json_validator', 'true');
  }

  const customOptions = () => {
    return {
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'POST',
    };
  };

  const clientService = new OpenSRPService(accessToken, opensrpBaseURL, endpoint, customOptions);
  clientService
    .create(formData)
    .then(() => {
      setIfDoneHere(true);
    })
    .catch((err: HTTPError) => {
      alertError(err.description);
    })
    .finally(() => {
      setSubmitting(false);
    });
};

/**
 * Handle make release
 *
 * @param {ManifestFilesTypes[]} data draft files to make release for
 * @param {string} accessToken  Opensrp API access token
 * @param {string} opensrpBaseURL Opensrp API base URL
 * @param {Function} removeDraftFiles redux action to remove draft files
 * @param {Function} setIfDoneHere set ifDoneHere form status
 * @param {Function} alertError - receive error description
 * @param {string} endpoint - Opensrp endpoint
 * @param {Dispatch} dispatch - dispatch function from redux store
 * @param {Function} customFetchOptions custom opensrp API fetch options
 */
export const makeRelease = (
  data: ManifestFilesTypes[],
  accessToken: string,
  opensrpBaseURL: string,
  removeDraftFiles: typeof removeManifestDraftFiles,
  setIfDoneHere: (ifDoneHere: boolean) => void,
  alertError: (err: string) => void,
  endpoint = OPENSRP_MANIFEST_ENDPOINT,
  dispatch?: Dispatch,
  customFetchOptions?: typeof getFetchOptions
) => {
  const identifiers = data.map((form) => form.identifier);
  const json = {
    /* eslint-disable-next-line @typescript-eslint/camelcase */
    forms_version: data[0].version,
    identifiers,
  };
  const clientService = new OpenSRPService(
    accessToken,
    opensrpBaseURL,
    endpoint,
    customFetchOptions
  );
  clientService
    .create({ json: JSON.stringify(json) })
    .then(() => {
      if (dispatch) {
        dispatch(removeDraftFiles());
      } else {
        removeDraftFiles();
      }

      setIfDoneHere(true);
    })
    .catch((_: Error) => {
      alertError(ERROR_OCCURRED);
    });
};
/**
 * Fetch manifest draft files
 *
 * @param {string} accessToken  Opensrp API access token
 * @param {string} opensrpBaseURL Opensrp API base URL
 * @param {Function} fetchDraftFiles redux action to remove draft files
 * @param {Function} setLoading set ifDoneHere form status
 * @param {Function} alertError - receive error description
 * @param {string} endpoint - Opensrp endpoint
 * @param {Dispatch} dispatch - dispatch function from redux store
 * @param {Function} customFetchOptions custom opensrp API fetch options
 */
export const fetchDrafts = (
  accessToken: string,
  opensrpBaseURL: string,
  fetchDraftFiles: typeof fetchManifestDraftFiles,
  setLoading: (loading: boolean) => void,
  alertError: (err: string) => void,
  endpoint = OPENSRP_FORM_METADATA_ENDPOINT,
  dispatch?: Dispatch,
  customFetchOptions?: typeof getFetchOptions
) => {
  /** get manifest Draftfiles */
  setLoading(true);
  /* eslint-disable-next-line @typescript-eslint/camelcase */
  const params = { is_draft: true };
  const clientService = new OpenSRPService(
    accessToken,
    opensrpBaseURL,
    endpoint,
    customFetchOptions
  );
  clientService
    .list(params)
    .then((res: ManifestFilesTypes[]) => {
      if (dispatch) {
        dispatch(fetchDraftFiles(res));
      } else {
        fetchDraftFiles(res);
      }
    })
    .catch((_: Error) => {
      alertError(ERROR_OCCURRED);
    })
    .finally(() => setLoading(false));
};
