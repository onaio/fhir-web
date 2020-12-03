import { OPENSRP_API_BASE_URL } from '../configs/env';
import { URL_UPLOAD_JSON_VALIDATOR, URL_JSON_VALIDATOR_LIST } from '../constants';

export const productCatalogueProps = {
  baseURL: OPENSRP_API_BASE_URL,
};

export const jsonValidatorListProps = {
  formVersion: null,
  formRoute: URL_UPLOAD_JSON_VALIDATOR,
  isJsonValidator: true,
};

export const jsonValidatorFormProps = {
  isJsonValidator: true,
  onSaveRedirectURL: URL_JSON_VALIDATOR_LIST,
};
