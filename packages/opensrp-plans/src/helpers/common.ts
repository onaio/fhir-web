import { defaultEnvConfig, EnvConfig } from '@opensrp/plan-form-core';
import { OPENSRP_API_BASE_URL } from '../constants';

export interface CommonProps {
  baseURL: string;
  envConfigs: EnvConfig;
}

export const defaultCommonProps: CommonProps = {
  baseURL: OPENSRP_API_BASE_URL,
  envConfigs: defaultEnvConfig,
};
