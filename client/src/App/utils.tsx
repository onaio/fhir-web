import { OPENSRP_API_BASE_URL } from '../configs/env';
import { URL_UPLOAD_JSON_VALIDATOR } from '../constants';

export const productCatalogueProps = {
  baseURL: OPENSRP_API_BASE_URL,
};

export const jsonValidatorsProps = {
  opensrpBaseURL: OPENSRP_API_BASE_URL,
  formVersion: null,
  formRoute: URL_UPLOAD_JSON_VALIDATOR,
  isJsonValidator: true,
};
