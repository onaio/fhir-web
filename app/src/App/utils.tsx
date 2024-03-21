import {
  URL_UPLOAD_JSON_VALIDATOR,
  URL_JSON_VALIDATOR_LIST,
  URL_DRAFT_FILE_LIST,
  URL_UPLOAD_DRAFT_FILE,
  URL_MANIFEST_RELEASE_LIST,
  URL_LOCATION_UNIT,
} from '../constants';
import {
  OPENSRP_API_BASE_URL,
  OPENSRP_API_V2_BASE_URL,
  PAGINATION_SIZE,
  FHIR_PATIENT_SORT_FIELDS,
  FHIR_PATIENT_BUNDLE_SIZE,
  FHIR_ROOT_LOCATION_ID,
  COMMODITIES_LIST_RESOURCE_ID,
  DISABLE_TEAM_MEMBER_REASSIGNMENT,
  FHIR_API_BASE_URL,
  KEYCLOAK_USERS_PAGE_SIZE,
  FHIR_LOCATION_LIST_RESOURCE_ID,
} from '../configs/env';

export const BaseProps = {
  baseURL: OPENSRP_API_BASE_URL,
  fhirBaseURL: FHIR_API_BASE_URL,
};

export const teamAffiliationProps = {
  fhirRootLocationId: FHIR_ROOT_LOCATION_ID,
};

export const teamManagementProps = {
  ...BaseProps,
  disableTeamMemberReassignment: DISABLE_TEAM_MEMBER_REASSIGNMENT,
  paginationSize: PAGINATION_SIZE,
};

export const locationUnitProps = {
  fhirRootLocationId: FHIR_ROOT_LOCATION_ID,
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

export const inventoryItemAddEditProps = {
  openSRPBaseURL: OPENSRP_API_BASE_URL,
};

export const createEditUserProps = {
  baseUrl: OPENSRP_API_BASE_URL,
};

export const fhirCreateEditUserProps = {
  ...createEditUserProps,
  baseUrl: FHIR_API_BASE_URL,
};

export const patientProps = {
  sortFields: FHIR_PATIENT_SORT_FIELDS,
  patientBundleSize: FHIR_PATIENT_BUNDLE_SIZE,
};

export const commmodityProps = {
  listId: COMMODITIES_LIST_RESOURCE_ID,
};

export const fhirCreateEditLocationProps = {
  ...BaseProps,
  listId: FHIR_LOCATION_LIST_RESOURCE_ID,
}