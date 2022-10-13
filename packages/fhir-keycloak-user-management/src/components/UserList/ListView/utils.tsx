import { KeycloakService, URLParams } from '@opensrp/keycloak-service/';
import { keycloakCountEndpoint } from '../../../constants';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { KEYCLOAK_URL_USERS } from '@opensrp/user-management';
import { FHIRServiceClass, getResourcesFromBundle, FhirApiFilter } from '@opensrp/react-utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { practitionerResourceType } from '../../../constants';
import type { TFunction } from '@opensrp/i18n';

/**
 * Delete keycloak user and practitioner
 *
 * @param keycloakBaseURL - remove users action creator
 * @param baseUrl - server base url
 * @param userId - id of user to be deleted
 * @param t - translator function
 */
export const deleteUser = async (
  keycloakBaseURL: string,
  baseUrl: string,
  userId: string,
  t: TFunction
) => {
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

  const groupsServe = new FHIRServiceClass<IGroup>(baseUrl, 'Group');
  const groupsForThisUser = await groupsServe
    .list({ identifier: userId })
    .then((res) => getResourcesFromBundle<IGroup>(res as IBundle));
  const updatedGroups: IGroup[] = groupsForThisUser.map((obj) => ({
    ...obj,
    active: false,
  }));

  return Promise.allSettled([
    // delete keycloak user
    deleteKeycloakUser.delete(),
    // deactivate practitioners, we cannot guarantee that we can delink
    ...updatedPracts.map((obj) => practitionerServe.update(obj)),
    // deactivate groups, we cannot guarantee that we can delink
    ...updatedGroups.map((group) => groupsServe.update(group)),
  ])
    .then(() => {
      sendSuccessNotification(t('User deleted successfully'));
      sendSuccessNotification(t('Practitioner deactivated'));
      sendSuccessNotification(t('Group deactivated'));
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
