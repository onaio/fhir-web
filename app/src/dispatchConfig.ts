import reducerRegistry from '@onaio/redux-reducer-registry';
import { configsSliceName, addConfigs, configsReducer } from '@opensrp/pkg-config';
import { store } from '@opensrp/store';
import type { PlanFormPackageConfigs } from '@opensrp/plan-form';
import { LANGUAGE_CODE, PROJECT_LANGUAGE_CODE } from './configs/env';
import { Dictionary } from '@onaio/utils';

/** register catalogue reducer */
reducerRegistry.register(configsSliceName, configsReducer);

type ConfigObject = PlanFormPackageConfigs;

const configObject: ConfigObject = {
  languageCode: LANGUAGE_CODE as any,
  projectLanguageCode: PROJECT_LANGUAGE_CODE as any,
};

store.dispatch(addConfigs(configObject as Dictionary));
