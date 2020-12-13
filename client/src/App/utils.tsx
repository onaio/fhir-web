import { interventionType, status, activities, PlanStatus } from '@opensrp/plan-form-core';
import { PlanFormFieldsKeys } from '@opensrp/plan-form';

import {
  ACTION_UUID_NAMESPACE,
  DATE_FORMAT,
  DEFAULT_ACTIVITY_DURATION_DAYS,
  DEFAULT_PLAN_DURATION_DAYS,
  DEFAULT_PLAN_VERSION,
  DEFAULT_TIME,
  OPENSRP_API_BASE_URL,
  PLAN_UUID_NAMESPACE,
  TASK_GENERATION_STATUS,
} from '../configs/env';

export const productCatalogueProps = {
  baseURL: OPENSRP_API_BASE_URL,
};

export const plansListProps = {
  baseURL: OPENSRP_API_BASE_URL,
};

export const planCreateEditProps = {
  baseURL: OPENSRP_API_BASE_URL,
  envConfigs: {
    dateFormat: DATE_FORMAT,
    defaultPlanDurationDays: DEFAULT_PLAN_DURATION_DAYS,
    defaultPlanVersion: DEFAULT_PLAN_VERSION,
    actionUuidNamespace: PLAN_UUID_NAMESPACE,
    planUuidNamespace: ACTION_UUID_NAMESPACE,
    defaultTime: DEFAULT_TIME,
    defaultActivityDurationDays: DEFAULT_ACTIVITY_DURATION_DAYS,
    taskGenerationStatus: TASK_GENERATION_STATUS,
  },
};

/** props for create plan page */
export const planCreateProps = {
  ...planCreateEditProps,
  hiddenFields: [interventionType, status, activities] as PlanFormFieldsKeys[],
};

/** props for plan edit page */
export const planEditProps = {
  ...planCreateEditProps,
  hiddenFields: [interventionType, activities],
}
export const activePlansListStatusProp = {
  allowedPlanStatus: PlanStatus.ACTIVE,
};
export const draftPlansListStatusProp = {
  allowedPlanStatus: PlanStatus.DRAFT,
};
export const completedPlansListStatusProp = {
  allowedPlanStatus: PlanStatus.COMPLETE,
};
export const trashPlansListStatusProp = {
  allowedPlanStatus: PlanStatus.RETIRED,
};
