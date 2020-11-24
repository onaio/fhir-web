import { URLParams, OpenSRPService, getFetchOptions } from '@opensrp/server-service';
import { ManifestFilesTypes } from '../ducks/manifestFiles';
import { handleDownload } from '../helpers/fileDownload';

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
 * @param {string} baseURL OpenSRP API base URL
 * @param {string} downloadEndPoint opensrp download URL
 * @param {ManifestFilesTypes} obj manifest object file to be downloaded
 * @param {boolean} isJsonValidator pass true if is json validator. Default is false
 *  @param {getFetchOptions} getPayload custom fetch options
 */
export const downloadManifestFile = async (
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
  const clientService = new OpenSRPService(baseURL, downloadEndPoint, getPayload);
  await clientService.list(params).then((res) => {
    handleDownload(res.clientForm.json, identifier);
  });
};
