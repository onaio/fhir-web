/** This is the main configuration module
 *
 * **** CODE RULES ****
 * To keep things simple, the code in this module should be simple statements.  Use of
 * functions is discouraged and should only be done if there is no other way.
 */

import {
  A1_DESCRIPTION,
  A1_NAME,
  A2_DESCRIPTION,
  A2_NAME,
  B1_DESCRIPTION,
  B1_NAME,
  B2_DESCRIPTION,
  B2_NAME,
  CASE_TRIGGERED_TITLE,
  GOAL_UNIT_ACTIVITY,
  GOAL_UNIT_CASE,
  GOAL_UNIT_PERCENT,
  GOAL_UNIT_PERSON,
  GOAL_UNIT_UNKNOWN,
  HIGH_PRIORITIY_LABEL,
  INVESTIGATION as INVESTIGATION_TITLE,
  LOW_PRIORITY_LABEL,
  MEDIUM_PRIORITY_LABEL,
  PLAN_STATUS_ACTIVE,
  PLAN_STATUS_COMPLETE,
  PLAN_STATUS_DRAFT,
  PLAN_STATUS_RETIRED,
  ROUTINE_TITLE,
} from './constants/lang';
import {
  A1,
  A2,
  B1,
  B2,
  CASE_TRIGGERED,
  HIGH_PRIORITIY,
  INVESTIGATION,
  LOW_PRIORITY,
  MEDIUM_PRIORITY,
  ROUTINE,
} from './constants/stringConstants';
import { Classification, EnvConfig } from './types';

export const FIReasonsDisplay: { [key: string]: string } = {
  [ROUTINE]: ROUTINE_TITLE,
  [CASE_TRIGGERED]: CASE_TRIGGERED_TITLE,
};

export const planStatusDisplay: { [key: string]: string } = {
  active: PLAN_STATUS_ACTIVE,
  complete: PLAN_STATUS_COMPLETE,
  draft: PLAN_STATUS_DRAFT,
  retired: PLAN_STATUS_RETIRED,
};

export const goalUnitDisplay: { [key: string]: string } = {
  'activit(y|ies)': GOAL_UNIT_ACTIVITY,
  'case(s)': GOAL_UNIT_CASE,
  Percent: GOAL_UNIT_PERCENT,
  'Person(s)': GOAL_UNIT_PERSON,
  unknown: GOAL_UNIT_UNKNOWN,
};

/** Allowed goal priority values */
export const goalPrioritiesDisplay: { [key: string]: string } = {
  [LOW_PRIORITY]: LOW_PRIORITY_LABEL,
  [MEDIUM_PRIORITY]: MEDIUM_PRIORITY_LABEL,
  [HIGH_PRIORITIY]: HIGH_PRIORITIY_LABEL,
};

/** Allowed action Reason values */
export const actionReasonsDisplay: { [key: string]: string } = {
  [INVESTIGATION]: INVESTIGATION_TITLE,
  [ROUTINE]: ROUTINE_TITLE,
};

/** Focus Investigation case classifications */
export const FIClassifications: Classification[] = [
  {
    code: A1,
    description: A1_DESCRIPTION,
    name: A1_NAME,
  },
  {
    code: A2,
    description: A2_DESCRIPTION,
    name: A2_NAME,
  },
  {
    code: B1,
    description: B1_DESCRIPTION,
    name: B1_NAME,
  },
  {
    code: B2,
    description: B2_DESCRIPTION,
    name: B2_NAME,
  },
];

/** the default env configuration object */
export const defaultEnvConfig: EnvConfig = {
  dateFormat: 'YYYY-MM-DD',
  defaultPlanDurationDays: 20,
  defaultPlanVersion: '1',
  enabledFiReasons: [],
  planTypesAllowedToCreate: [],
  planTypesWithMultiJurisdictions: [],
  actionUuidNamespace: 'ea2d1b7b-828b-4898-947e-586858971529',
  planUuidNamespace: '8326dd0c-faa5-4a24-9eaa-252bd245e0ff',
  defaultTime: 'T00:00:00+00:00',
  defaultActivityDurationDays: 7,
  displayedPlanTypes: [],
  taskGenerationStatus: 'internal',
};
