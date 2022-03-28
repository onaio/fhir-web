import {
  URL_UPLOAD_JSON_VALIDATOR,
  URL_JSON_VALIDATOR_LIST,
  URL_DRAFT_FILE_LIST,
  URL_UPLOAD_DRAFT_FILE,
  URL_MANIFEST_RELEASE_LIST,
  URL_LOCATION_UNIT,
} from '../constants';
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
  OPENSRP_API_V2_BASE_URL,
  PLAN_ASSIGNMENT_AT_GEO_LEVEL,
  PLAN_UUID_NAMESPACE,
  TASK_GENERATION_STATUS,
  DEFAULT_PLAN_ID,
  FHIR_API_BASE_URL,
  FILTER_BY_PARENT_ID,
  KEYCLOAK_USERS_PAGE_SIZE,
  DISABLE_TEAM_MEMBER_REASSIGNMENT,
  USER_FORM_HIDDEN_FIELDS,
  USER_FORM_RENDER_FIELDS,
  PAGINATION_SIZE,
  FHIR_ROOT_LOCATION_IDENTIFIER,
  FHIR_RESOURCES_PAGE_SIZE,
} from '../configs/env';

export const BaseProps = {
  baseURL: OPENSRP_API_BASE_URL,
  fhirBaseURL: FHIR_API_BASE_URL,
};

export const teamAssignmentProps = {
  defaultPlanId: DEFAULT_PLAN_ID,
};

export const teamAffiliationProps = {
  fhirRootLocationIdentifier: FHIR_ROOT_LOCATION_IDENTIFIER,
};

export const teamManagementProps = {
  ...BaseProps,
  disableTeamMemberReassignment: DISABLE_TEAM_MEMBER_REASSIGNMENT,
  paginationSize: PAGINATION_SIZE,
};

export const locationUnitProps = {
  filterByParentId: FILTER_BY_PARENT_ID,
  fhirRootLocationIdentifier: FHIR_ROOT_LOCATION_IDENTIFIER,
};

export const newLocationUnitProps = {
  successURLGenerator: () => URL_LOCATION_UNIT,
  cancelURLGenerator: () => URL_LOCATION_UNIT,
  hidden: ['serviceType', 'latitude', 'longitude'],
  ...locationUnitProps,
};

export const editLocationProps = {
  ...newLocationUnitProps,
  ...locationUnitProps,
};

export const usersListProps = {
  usersPageSize: KEYCLOAK_USERS_PAGE_SIZE,
};
export const inventoryServiceProps = {
  baseURL: OPENSRP_API_BASE_URL,
};

export const serverSettingsProps = {
  baseURL: OPENSRP_API_BASE_URL.replace('/rest', ''),
  restBaseURL: OPENSRP_API_BASE_URL,
  v2BaseURL: OPENSRP_API_V2_BASE_URL,
};

export const jsonValidatorListProps = {
  uploadFileURL: URL_UPLOAD_JSON_VALIDATOR,
  isJsonValidator: true,
};

export const jsonValidatorFormProps = {
  isJsonValidator: true,
  onSaveRedirectURL: URL_JSON_VALIDATOR_LIST,
};

export const draftFormProps = {
  isJsonValidator: false,
  onSaveRedirectURL: URL_DRAFT_FILE_LIST,
};

export const draftListProps = {
  uploadFileURL: URL_UPLOAD_DRAFT_FILE,
  onMakeReleaseRedirectURL: URL_MANIFEST_RELEASE_LIST,
};

export const releaseListProps = {
  uploadFileURL: URL_UPLOAD_DRAFT_FILE,
  viewReleaseURL: URL_MANIFEST_RELEASE_LIST,
};

export const releaseViewProps = {
  uploadFileURL: URL_UPLOAD_DRAFT_FILE,
  isJsonValidator: false,
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
};
export const activePlansListStatusProp = {
  allowedPlanStatus: PlanStatus.ACTIVE,
};
export const draftPlansListStatusProp = {
  allowedPlanStatus: PlanStatus.DRAFT,
};
export const completedPlansListStatusProp = {
  allowedPlanStatus: PlanStatus.COMPLETE,
};
export const retiredPlansListStatusProp = {
  allowedPlanStatus: PlanStatus.RETIRED,
};

export const missionAssignmentProps = {
  showActivateMission: true,
  showAssignmentTable: true,
  showMissionData: true,
  assignGeoLevel: PLAN_ASSIGNMENT_AT_GEO_LEVEL,
};

export const inventoryItemAddEditProps = {
  openSRPBaseURL: OPENSRP_API_BASE_URL,
};

export const createEditUserProps = {
  // TODO: this will not scale well, need a better configuration-first solution that enables us to
  // simulate a diverse set of behaviors from the same code base for a module. preferable a solution
  // that is closer to the code.
  userFormHiddenFields: USER_FORM_HIDDEN_FIELDS,
  userFormRenderFields: USER_FORM_RENDER_FIELDS,
};

export const careTeamProps = {
  ...BaseProps,
  resourcePageSize: FHIR_RESOURCES_PAGE_SIZE,
};
