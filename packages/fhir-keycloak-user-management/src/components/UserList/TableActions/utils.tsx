import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { removeKeycloakUsers } from '../../../ducks/user';
import { KEYCLOAK_URL_USERS } from '../../../constants';
import lang, { Lang } from '../../../lang';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';

/**
 * Delete keycloak user and practitioner
 *
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} keycloakBaseURL - keycloak api base URL
 * @param fhirBaseURL - fhir api base url
 * @param {string} userId - id of user to be deleted
 * @param {Function} isLoadingCallback - callback function that sets loading state
 * @param {Lang} langObj - lang
 * @returns {void}
 */
export const deleteUser = async (
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  keycloakBaseURL: string,
  fhirBaseURL: string,
  userId: string,
  isLoadingCallback: (loading: boolean) => void,
  langObj: Lang = lang
) => {
  // start loader
  isLoadingCallback(true);

  const deleteKeycloakUser = new KeycloakService(
    `${KEYCLOAK_URL_USERS}/${userId}`,
    keycloakBaseURL
  );

  // get practitioners tied to the keycloak user
  const practitioners = await getPractitionersByUserId(userId, fhirBaseURL, langObj);

  // get promises to unassign and deactivate tied practitioners
  const unassignAndDeactivatePromises = await unassignAndDeactivatePractitioners(
    practitioners,
    fhirBaseURL
  );

  return Promise.all([
    // delete keycloak user
    deleteKeycloakUser.delete(),
    // unassign and deactivate tied practitioners when you delete the base user
    ...unassignAndDeactivatePromises,
  ])
    .then(() => {
      sendSuccessNotification(langObj.USER_DELETED_SUCCESSFULLY);
      sendSuccessNotification(langObj.PRACTITIONER_UNASSIGNED_SUCCESSFULLY);
      sendSuccessNotification(langObj.PRACTITIONER_DEACTIVATED_SUCCESSFULLY);
      removeKeycloakUsersCreator();
    })
    .catch((_: Error) => {
      sendErrorNotification(langObj.ERROR_OCCURED);
    })
    .finally(() => {
      // stop loader
      isLoadingCallback(false);
    });
};

/**
 * get practitioners tied to a keycloak user
 *
 * @param userId  - keycloak user id to get practitioners from
 * @param fhirBaseURL - fhir api base url
 * @param {Lang} langObj - lang
 * @returns - array of practitioners
 */
async function getPractitionersByUserId(userId: string, fhirBaseURL: string, langObj: Lang) {
  const FhirClient = new FHIRServiceClass<IPractitioner>(fhirBaseURL, 'Practitioner');
  try {
    // search all practitioners with keycloak userID as identifier
    const practitionerBundle = await FhirClient.list({ identifier: userId });
    // at least one result found (also practitionerBundle.total > 0)
    // return array of practitioners or empty array
    /* eslint-disable @typescript-eslint/no-unnecessary-condition */
    if (practitionerBundle.entry) return practitionerBundle.entry.map((bundle) => bundle.resource);
    return [];
  } catch (_) {
    sendErrorNotification(langObj.ERROR_OCCURED);
    return [];
  }
}

/**
 * unassign and deactivate practitioners promises
 *
 * @param practitioners - array of practitioners
 * @param fhirBaseURL - fhir api base url
 * @returns array of Promises that resolve to unassign and deactivate practitioners
 */
async function unassignAndDeactivatePractitioners(
  practitioners: IPractitioner[],
  fhirBaseURL: string
) {
  const deactivatePractitioner = new FHIRServiceClass<IPractitioner>(fhirBaseURL, 'Practitioner');
  const practitionerRoles = new FHIRServiceClass<IPractitionerRole>(
    fhirBaseURL,
    `PractitionerRole`
  );

  const deletePractitionerRolePromises: (() => Promise<IPractitionerRole>)[] = [];
  const deactivatePractitionerPromises: (() => Promise<IPractitioner>)[] = [];

  for (const practitioner of practitioners) {
    // deactivate practitioner promise
    // wrap in function to avoid immediate evocation
    const deactivatePractitionerPromise = () =>
      deactivatePractitioner.update({
        ...practitioner,
        active: false,
      });

    deactivatePractitionerPromises.push(deactivatePractitionerPromise);

    // get practitioner roles tied to a practitioner
    const practitionerRoleBundle = await practitionerRoles.list({
      practitioner: practitioner.id,
    });

    // map practitioner roles and push delete function for each to promise array
    /* eslint-disable @typescript-eslint/no-unnecessary-condition */
    if (practitionerRoleBundle.entry) {
      for (const practitionerRoleEntry of practitionerRoleBundle.entry) {
        const practitionerRole = practitionerRoleEntry.resource;
        // delete practitioner role
        const deletePractitionerRolePromise = () =>
          practitionerRoles.delete(practitionerRole.id ?? '') as Promise<IPractitionerRole>;
        deletePractitionerRolePromises.push(deletePractitionerRolePromise);
      }
    }
  }

  // flatten 2D array - [[][]]
  return [...deletePractitionerRolePromises, ...deactivatePractitionerPromises];
}
