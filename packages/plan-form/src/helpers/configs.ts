import { getConfigsFactory } from '@opensrp/pkg-config';
import { store } from '@opensrp/store';

const getConfigs = () => {
  const configsSelector = getConfigsFactory();
  const allConfigs = configsSelector(store.getState());
  return allConfigs;
};

export const configs = getConfigs() ?? {};
