import { defaultEnvConfig, EnvConfig } from '@opensrp/plan-form-core';
import { PlanFormProps } from '@opensrp/plan-form/dist/types';
import { OPENSRP_API_BASE_URL } from '../constants';

/** props that are common to majority of exported components */
export interface CommonProps {
  baseURL: string;
  envConfigs: EnvConfig;
}

export const defaultCommonProps: CommonProps = {
  baseURL: OPENSRP_API_BASE_URL,
  envConfigs: defaultEnvConfig,
};

/** props that the plan creation pages will take and pass on to the plan form */
export type PropsForPlanForm = Pick<PlanFormProps, 'hiddenFields'>;

export const defaultPropsForPlanForm = {
  hiddenFields: [],
};
