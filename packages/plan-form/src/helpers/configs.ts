import { getConfigsFactory } from '@opensrp/pkg-config';
import { store } from '@opensrp/store';

/** interface for configs for this package */
export interface PlanFormPackageConfigs {
  languageCode?: 'en' | 'sw';
  projectLanguageCode?: 'eusm' | 'core';
}

/** gets configs from the store */
const getConfigs = (): PlanFormPackageConfigs => {
  const configsSelector = getConfigsFactory();
  const allConfigs = configsSelector(store.getState());
  return allConfigs;
};

export const planFormConfigs = getConfigs();
