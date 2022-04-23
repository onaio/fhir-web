import { KeycloakService, URLParams } from '@opensrp/keycloak-service/';
import { keycloakCountEndpoint } from '../../../constants';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { KEYCLOAK_URL_USERS } from '@opensrp/user-management';
import { FHIRServiceClass, getResourcesFromBundle, FhirApiFilter } from '@opensrp/react-utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { practitionerResourceType } from '../../../constants';

/**
 * Delete keycloak user and practitioner
 *
 * @param keycloakBaseURL - remove users action creator
 * @param baseUrl - server base url
 * @param userId - id of user to be deleted
 */
export const deleteUser = async (keycloakBaseURL: string, baseUrl: string, userId: string) => {
  const deleteKeycloakUser = new KeycloakService(
    `${KEYCLOAK_URL_USERS}/${userId}`,
    keycloakBaseURL
  );

  const practitionerServe = new FHIRServiceClass<IPractitioner>(baseUrl, practitionerResourceType);
  const practsForThisUser = await practitionerServe
    .list({ identifier: userId })
    .then((res) => getResourcesFromBundle<IPractitioner>(res as IBundle));
  const updatedPracts: IPractitioner[] = practsForThisUser.map((obj) => ({
    ...obj,
    active: false,
  }));

  return Promise.all([
    // delete keycloak user
    deleteKeycloakUser.delete(),
    // deactivate practitioners, we cannot quarantee that we can delink
    ...updatedPracts.map((obj) => practitionerServe.update(obj)),
  ])
    .then(() => {
      sendSuccessNotification('User deleted successfully');
      sendSuccessNotification('Practitioner deactivated');
    })
    .catch((error) => sendErrorNotification(error.message));
};

export const loadKeycloakResources = async (
  baseUrl: string,
  endpoint: string,
  params: Partial<FhirApiFilter> = {}
) => {
  const count: number = await new KeycloakService(
    `${endpoint}/${keycloakCountEndpoint}`,
    baseUrl
  ).list();

  if (!count) return { total: count, records: [] };
  const { search } = params;
  const paginationFilters: URLParams = {
    max: count,
  };
  if (search) {
    paginationFilters['search'] = search;
  }
  const records = await new KeycloakService(endpoint, baseUrl).list(paginationFilters);
  return { total: count, records };
};
