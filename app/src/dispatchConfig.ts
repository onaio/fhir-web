import { configStore, LanguageCode, ProjectLanguageCode } from '@opensrp/pkg-config';
import type { OpenSRPConfigs } from '@opensrp/pkg-config';
import {
  BACKEND_ACTIVE,
  KEYCLOAK_API_BASE_URL,
  LANGUAGE_CODE,
  OPENSRP_API_BASE_URL,
  PROJECT_LANGUAGE_CODE,
} from './configs/env';
import { Dictionary } from '@onaio/utils';
import { URL_BACKEND_LOGIN, URL_REACT_LOGIN } from './constants';

export const APP_LOGIN_URL = BACKEND_ACTIVE ? URL_BACKEND_LOGIN : URL_REACT_LOGIN;

const configObject: OpenSRPConfigs = {
  languageCode: LANGUAGE_CODE as LanguageCode,
  projectLanguageCode: PROJECT_LANGUAGE_CODE as ProjectLanguageCode,
  appLoginURL: APP_LOGIN_URL,
  keycloakBaseURL: KEYCLOAK_API_BASE_URL,
  opensrpBaseURL: OPENSRP_API_BASE_URL,
};

configStore.addConfig(configObject as Dictionary);
