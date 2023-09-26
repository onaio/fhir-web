import {
  ConfigState,
  LanguageCode,
  ProjectCode,
  setAllConfigs,
  getAllConfigs,
} from '@opensrp/pkg-config';
import {
  BACKEND_ACTIVE,
  KEYCLOAK_API_BASE_URL,
  LANGUAGE_CODE,
  OPENSRP_API_BASE_URL,
  PROJECT_CODE,
  FHIR_API_BASE_URL,
  DEFAULTS_TABLE_PAGE_SIZE,
  PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY,
} from './env';
import { URL_BACKEND_LOGIN, URL_REACT_LOGIN } from '../constants';

export const APP_LOGIN_URL = BACKEND_ACTIVE ? URL_BACKEND_LOGIN : URL_REACT_LOGIN;

const defaultvalues = getAllConfigs();

const configObject: ConfigState = {
  ...defaultvalues,
  languageCode: LANGUAGE_CODE as LanguageCode,
  projectCode: PROJECT_CODE as ProjectCode,
  appLoginURL: APP_LOGIN_URL,
  keycloakBaseURL: KEYCLOAK_API_BASE_URL,
  opensrpBaseURL: OPENSRP_API_BASE_URL,
  fhirBaseURL: FHIR_API_BASE_URL,
  defaultTablesPageSize: DEFAULTS_TABLE_PAGE_SIZE,
  practToOrgAssignmentStrategy: PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY,
  rbacStrategy: AUTHN_STRATEGY,
};

setAllConfigs(configObject);
