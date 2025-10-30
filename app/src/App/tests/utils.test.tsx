import {
  BaseProps,
  teamAffiliationProps,
  teamManagementProps,
  locationUnitProps,
  newLocationUnitProps,
  editLocationProps,
  usersListProps,
  inventoryServiceProps,
  serverSettingsProps,
  jsonValidatorListProps,
  jsonValidatorFormProps,
  draftFormProps,
  draftListProps,
  releaseListProps,
  releaseViewProps,
  inventoryItemAddEditProps,
  createEditUserProps,
  fhirCreateEditUserProps,
  patientProps,
  commmodityProps,
  fhirCreateEditLocationProps,
  userSyncProps,
} from '../utils';
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
  KEYCLOAK_API_BASE_URL,
} from '../../configs/env';
import {
  URL_UPLOAD_JSON_VALIDATOR,
  URL_JSON_VALIDATOR_LIST,
  URL_DRAFT_FILE_LIST,
  URL_UPLOAD_DRAFT_FILE,
  URL_MANIFEST_RELEASE_LIST,
} from '../../constants';

describe('App utils', () => {
  describe('BaseProps', () => {
    it('should contain baseURL from environment', () => {
      expect(BaseProps.baseURL).toBe(OPENSRP_API_BASE_URL);
    });

    it('should contain fhirBaseURL from environment', () => {
      expect(BaseProps.fhirBaseURL).toBe(FHIR_API_BASE_URL);
    });

    it('should be an object with correct keys', () => {
      expect(Object.keys(BaseProps).sort()).toEqual(['baseURL', 'fhirBaseURL'].sort());
    });
  });

  describe('teamAffiliationProps', () => {
    it('should contain fhirRootLocationId from environment', () => {
      expect(teamAffiliationProps.fhirRootLocationId).toBe(FHIR_ROOT_LOCATION_ID);
    });
  });

  describe('teamManagementProps', () => {
    it('should include BaseProps', () => {
      expect(teamManagementProps.baseURL).toBe(BaseProps.baseURL);
      expect(teamManagementProps.fhirBaseURL).toBe(BaseProps.fhirBaseURL);
    });

    it('should contain disableTeamMemberReassignment from environment', () => {
      expect(teamManagementProps.disableTeamMemberReassignment).toBe(
        DISABLE_TEAM_MEMBER_REASSIGNMENT
      );
    });

    it('should contain paginationSize from environment', () => {
      expect(teamManagementProps.paginationSize).toBe(PAGINATION_SIZE);
    });
  });

  describe('locationUnitProps', () => {
    it('should contain fhirRootLocationId from environment', () => {
      expect(locationUnitProps.fhirRootLocationId).toBe(FHIR_ROOT_LOCATION_ID);
    });
  });

  describe('newLocationUnitProps', () => {
    it('should include locationUnitProps', () => {
      expect(newLocationUnitProps.fhirRootLocationId).toBe(
        locationUnitProps.fhirRootLocationId
      );
    });
  });

  describe('editLocationProps', () => {
    it('should include newLocationUnitProps', () => {
      expect(editLocationProps.fhirRootLocationId).toBe(
        newLocationUnitProps.fhirRootLocationId
      );
    });

    it('should include locationUnitProps', () => {
      expect(editLocationProps.fhirRootLocationId).toBe(
        locationUnitProps.fhirRootLocationId
      );
    });
  });

  describe('usersListProps', () => {
    it('should contain usersPageSize from environment', () => {
      expect(usersListProps.usersPageSize).toBe(KEYCLOAK_USERS_PAGE_SIZE);
    });
  });

  describe('inventoryServiceProps', () => {
    it('should contain baseURL from environment', () => {
      expect(inventoryServiceProps.baseURL).toBe(OPENSRP_API_BASE_URL);
    });
  });

  describe('serverSettingsProps', () => {
    it('should contain baseURL without /rest suffix', () => {
      const expectedBaseURL = OPENSRP_API_BASE_URL.replace('/rest', '');
      expect(serverSettingsProps.baseURL).toBe(expectedBaseURL);
    });

    it('should contain restBaseURL from environment', () => {
      expect(serverSettingsProps.restBaseURL).toBe(OPENSRP_API_BASE_URL);
    });

    it('should contain v2BaseURL from environment', () => {
      expect(serverSettingsProps.v2BaseURL).toBe(OPENSRP_API_V2_BASE_URL);
    });
  });

  describe('jsonValidatorListProps', () => {
    it('should contain uploadFileURL from constants', () => {
      expect(jsonValidatorListProps.uploadFileURL).toBe(URL_UPLOAD_JSON_VALIDATOR);
    });

    it('should have isJsonValidator set to true', () => {
      expect(jsonValidatorListProps.isJsonValidator).toBe(true);
    });
  });

  describe('jsonValidatorFormProps', () => {
    it('should have isJsonValidator set to true', () => {
      expect(jsonValidatorFormProps.isJsonValidator).toBe(true);
    });

    it('should contain onSaveRedirectURL from constants', () => {
      expect(jsonValidatorFormProps.onSaveRedirectURL).toBe(URL_JSON_VALIDATOR_LIST);
    });
  });

  describe('draftFormProps', () => {
    it('should have isJsonValidator set to false', () => {
      expect(draftFormProps.isJsonValidator).toBe(false);
    });

    it('should contain onSaveRedirectURL from constants', () => {
      expect(draftFormProps.onSaveRedirectURL).toBe(URL_DRAFT_FILE_LIST);
    });
  });

  describe('draftListProps', () => {
    it('should contain uploadFileURL from constants', () => {
      expect(draftListProps.uploadFileURL).toBe(URL_UPLOAD_DRAFT_FILE);
    });

    it('should contain onMakeReleaseRedirectURL from constants', () => {
      expect(draftListProps.onMakeReleaseRedirectURL).toBe(URL_MANIFEST_RELEASE_LIST);
    });
  });

  describe('releaseListProps', () => {
    it('should contain uploadFileURL from constants', () => {
      expect(releaseListProps.uploadFileURL).toBe(URL_UPLOAD_DRAFT_FILE);
    });

    it('should contain viewReleaseURL from constants', () => {
      expect(releaseListProps.viewReleaseURL).toBe(URL_MANIFEST_RELEASE_LIST);
    });
  });

  describe('releaseViewProps', () => {
    it('should contain uploadFileURL from constants', () => {
      expect(releaseViewProps.uploadFileURL).toBe(URL_UPLOAD_DRAFT_FILE);
    });

    it('should have isJsonValidator set to false', () => {
      expect(releaseViewProps.isJsonValidator).toBe(false);
    });
  });

  describe('inventoryItemAddEditProps', () => {
    it('should contain openSRPBaseURL from environment', () => {
      expect(inventoryItemAddEditProps.openSRPBaseURL).toBe(OPENSRP_API_BASE_URL);
    });
  });

  describe('createEditUserProps', () => {
    it('should contain baseUrl from environment', () => {
      expect(createEditUserProps.baseUrl).toBe(OPENSRP_API_BASE_URL);
    });
  });

  describe('fhirCreateEditUserProps', () => {
    it('should include createEditUserProps', () => {
      expect(fhirCreateEditUserProps.baseUrl).toBeDefined();
    });

    it('should override baseUrl to use FHIR API', () => {
      expect(fhirCreateEditUserProps.baseUrl).toBe(FHIR_API_BASE_URL);
    });
  });

  describe('patientProps', () => {
    it('should contain sortFields from environment', () => {
      expect(patientProps.sortFields).toBe(FHIR_PATIENT_SORT_FIELDS);
    });

    it('should contain patientBundleSize from environment', () => {
      expect(patientProps.patientBundleSize).toBe(FHIR_PATIENT_BUNDLE_SIZE);
    });
  });

  describe('commmodityProps', () => {
    it('should contain listId from environment', () => {
      expect(commmodityProps.listId).toBe(COMMODITIES_LIST_RESOURCE_ID);
    });
  });

  describe('fhirCreateEditLocationProps', () => {
    it('should include BaseProps', () => {
      expect(fhirCreateEditLocationProps.baseURL).toBe(BaseProps.baseURL);
      expect(fhirCreateEditLocationProps.fhirBaseURL).toBe(BaseProps.fhirBaseURL);
    });

    it('should contain commodityListId from environment', () => {
      expect(fhirCreateEditLocationProps.commodityListId).toBe(
        COMMODITIES_LIST_RESOURCE_ID
      );
    });
  });

  describe('userSyncProps', () => {
    it('should contain fhirBaseURL from environment', () => {
      expect(userSyncProps.fhirBaseURL).toBe(FHIR_API_BASE_URL);
    });

    it('should contain keycloakBaseURL from environment', () => {
      expect(userSyncProps.keycloakBaseURL).toBe(KEYCLOAK_API_BASE_URL);
    });

    it('should have both required properties for user sync', () => {
      expect(Object.keys(userSyncProps).sort()).toEqual(
        ['fhirBaseURL', 'keycloakBaseURL'].sort()
      );
    });
  });
});
