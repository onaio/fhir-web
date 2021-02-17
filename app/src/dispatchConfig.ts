import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  configsSliceName,
  addConfigs,
  configsReducer,
  LanguageCode,
  ProjectLanguageCode,
} from '@opensrp/pkg-config';
import { store } from '@opensrp/store';
import type { OpenSRPConfigs } from '@opensrp/pkg-config';
import { BACKEND_ACTIVE, LANGUAGE_CODE, PROJECT_LANGUAGE_CODE } from './configs/env';
import { Dictionary } from '@onaio/utils';
import { URL_BACKEND_LOGIN, URL_REACT_LOGIN } from './constants';

/** register catalogue reducer */
reducerRegistry.register(configsSliceName, configsReducer);

export const APP_LOGIN_URL = BACKEND_ACTIVE ? URL_BACKEND_LOGIN : URL_REACT_LOGIN;

const configObject: OpenSRPConfigs = {
  languageCode: LANGUAGE_CODE as LanguageCode,
  projectLanguageCode: PROJECT_LANGUAGE_CODE as ProjectLanguageCode,
  appLoginURL: APP_LOGIN_URL,
};

store.dispatch(addConfigs(configObject as Dictionary));
