import { URLParams, OpenSRPService, getFetchOptions, HTTPError } from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';
import { UploadFileFieldTypes } from '../components/Antd/UploadForm';
import { OPENSRP_FORMS_ENDPOINT } from '../constants';
import { ManifestFilesTypes } from '../ducks/manifestFiles';
import { handleDownload } from './fileDownload';

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
export const submitForm = (
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
