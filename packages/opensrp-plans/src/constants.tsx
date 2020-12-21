import { Dictionary } from '@onaio/utils';
/** Allowed action Reason values */
export const ROUTINE = 'Routine';
export const INVESTIGATION = 'Investigation';

/** Allowed goal priority values */
export const LOW_PRIORITY = 'low-priority';
export const MEDIUM_PRIORITY = 'medium-priority';
export const HIGH_PRIORITIY = 'high-priority';

/** Allowed useContext Code values */
export const INTERVENTION_TYPE_CODE = 'interventionType';
export const FI_STATUS_CODE = 'fiStatus';
export const FI_REASON_CODE = 'fiReason';
export const OPENSRP_EVENT_ID_CODE = 'opensrpEventId';
export const CASE_NUMBER_CODE = 'caseNum';
export const TASK_GENERATION_STATUS_CODE = 'taskGenerationStatus';
export const TEAM_ASSIGNMENT_STATUS_CODE = 'teamAssignmentStatus';

// task action codes
export const BCC_CODE = 'BCC';
export const IRS_CODE = 'IRS';
export const BEDNET_DISTRIBUTION_CODE = 'Bednet Distribution';
export const BLOOD_SCREENING_CODE = 'Blood Screening';
export const CASE_CONFIRMATION_CODE = 'Case Confirmation';
export const RACD_REGISTER_FAMILY_CODE = 'RACD Register Family';
export const LARVAL_DIPPING_CODE = 'Larval Dipping';
export const MOSQUITO_COLLECTION_CODE = 'Mosquito Collection';
export const MDA_POINT_DISPENSE_CODE = 'MDA Dispense';
export const MDA_POINT_ADVERSE_EFFECTS_CODE = 'MDA Adverse Event(s)';
export const MDA_ADHERENCE_CODE = 'MDA Adherence';
export const GOAL_CONFIRMATION_GOAL_ID = 'Case_Confirmation';
export const GOAL_ID = 'goal_id';
export const PRODUCT_CHECK = 'Product Check';
export const FIX_PRODUCT_PROBLEMS = 'Fix Product Problems';
export const RECORD_GPS = 'Record GPS';
export const SERVICE_POINT_CHECK = 'Service Point Check';

/** Field to sort plans by */
export const SORT_BY_EFFECTIVE_PERIOD_START_FIELD = 'date';

// opensrp api strings
export const OPENSRP_API_BASE_URL = 'https://opensrp-stage.smartregister.org/opensrp/rest/';
export const OPENSRP_PLANS = 'plans';

// router routes
export const PLANS_LIST_VIEW_URL = '/plans';
export const PLANS_CREATE_VIEW_URL = '/plans/new';
export const PLANS_EDIT_VIEW_URL = '/plans/edit';
export const ACTIVE_PLANS_LIST_VIEW_URL = '/plans/active';
export const DRAFT_PLANS_LIST_VIEW_URL = '/plans/draft';
export const COMPLETE_PLANS_LIST_VIEW_URL = '/plans/complete';
export const TRASH_PLANS_LIST_VIEW_URL = '/plans/trash';
export const HOME_URL = '/';

// other constants
/** namespace for the keys attached to the columns */
export const TableColumnsNamespace = 'plans';

/** route params for product-catalogue pages */
export interface RouteParams {
  planId?: string;
}
export interface PlanAssignmentRouteParams {
  planId: string;
}

export const GREEN = '#22B509';
export const BLACK = '#000000';
export const ORANGE = '#DBA400';

/** Enum representing the possible plan types colors*/
export const PlanStatusColors: Dictionary = {
  active: GREEN,
  complete: BLACK,
  draft: ORANGE,
  retired: BLACK,
};
