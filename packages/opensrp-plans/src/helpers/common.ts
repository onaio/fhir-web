import { defaultEnvConfig, EnvConfig, PlanStatus } from '@opensrp/plan-form-core';
import { PlanFormProps } from '@opensrp/plan-form/dist/types';
import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  OPENSRP_API_BASE_URL,
  RETIRED_PLANS_LIST_VIEW_URL,
} from '../constants';

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

/** mapping of plan statuses to the redirection urls for the plan form */
export const redirectMapping = {
  [PlanStatus.DRAFT]: DRAFT_PLANS_LIST_VIEW_URL,
  [PlanStatus.ACTIVE]: ACTIVE_PLANS_LIST_VIEW_URL,
  [PlanStatus.COMPLETE]: COMPLETE_PLANS_LIST_VIEW_URL,
  [PlanStatus.RETIRED]: RETIRED_PLANS_LIST_VIEW_URL,
};

/** plan form will redirect to the returned path after form submission based on the plan status
 *
 * @param {PlanStatus} status - status of the plan
 * @returns {string} - the redirect url
 */
export const redirectPathGetter = (status: PlanStatus = PlanStatus.DRAFT) => {
  return redirectMapping[status];
};
