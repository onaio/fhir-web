import { OPENSRP_API_BASE_URL } from '../configs/env';
import {
  URL_UPLOAD_JSON_VALIDATOR,
  URL_JSON_VALIDATOR_LIST,
  URL_DRAFT_FILE_LIST,
  URL_UPLOAD_DRAFT_FILE,
  URL_MANIFEST_RELEASE_LIST,
} from '../constants';

export const productCatalogueProps = {
  baseURL: OPENSRP_API_BASE_URL,
};

export const jsonValidatorListProps = {
  formVersion: null,
  uploadFileURL: URL_UPLOAD_JSON_VALIDATOR,
  isJsonValidator: true,
};

export const jsonValidatorFormProps = {
  isJsonValidator: true,
  onSaveRedirectURL: URL_JSON_VALIDATOR_LIST,
};

export const draftFormProps = {
  isJsonValidator: false,
  onSaveRedirectURL: URL_DRAFT_FILE_LIST,
};

export const draftListProps = {
  uploadFileURL: URL_UPLOAD_DRAFT_FILE,
  onMakeReleaseRedirectURL: URL_MANIFEST_RELEASE_LIST,
};

export const releaseListProps = {
  uploadFileURL: URL_UPLOAD_DRAFT_FILE,
  currentURL: URL_MANIFEST_RELEASE_LIST,
};
