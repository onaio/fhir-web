import {
  ConfigState,
  LanguageCode,
  ProjectLanguageCode,
  setAllConfigs,
  getAllConfigs,
} from '@opensrp/pkg-config';
import {
  BACKEND_ACTIVE,
  DEFAULTS_TABLE_PAGE_SIZE,
  KEYCLOAK_API_BASE_URL,
  LANGUAGE_CODE,
  OPENSRP_API_BASE_URL,
  PROJECT_LANGUAGE_CODE,
  FHIR_API_BASE_URL,
} from './configs/env';
import { URL_BACKEND_LOGIN, URL_REACT_LOGIN } from './constants';
import i18n from './mls';

export const APP_LOGIN_URL = BACKEND_ACTIVE ? URL_BACKEND_LOGIN : URL_REACT_LOGIN;

const defaultvalues = getAllConfigs();

const configObject: ConfigState = {
  ...defaultvalues,
  languageCode: LANGUAGE_CODE as LanguageCode,
  projectLanguageCode: PROJECT_LANGUAGE_CODE as ProjectLanguageCode,
  appLoginURL: APP_LOGIN_URL,
  keycloakBaseURL: KEYCLOAK_API_BASE_URL,
  opensrpBaseURL: OPENSRP_API_BASE_URL,
  fhirBaseURL: FHIR_API_BASE_URL,
  i18n,
  defaultTablesPageSize: DEFAULTS_TABLE_PAGE_SIZE,
};

setAllConfigs(configObject);
