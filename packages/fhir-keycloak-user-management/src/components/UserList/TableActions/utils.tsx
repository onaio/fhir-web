import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { removeKeycloakUsers } from '../../../ducks/user';
import { KEYCLOAK_URL_USERS } from '../../../constants';
import lang, { Lang } from '../../../lang';
import FHIR from 'fhirclient';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { BundleEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry';

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

  // get tied practitioners from keycloak user Id
  const practitioners = await getPractitionersByUserId(userId, fhirBaseURL).catch(() => {
    sendErrorNotification(langObj.ERROR_OCCURED);
    // stop loader
    isLoadingCallback(false);
    return [];
  });

  // service class to delete keycloak user
  const serviceDelete = new KeycloakService(`${KEYCLOAK_URL_USERS}/${userId}`, keycloakBaseURL);

  return Promise.all([
    // delete keycloak user
    serviceDelete.delete(),
    // unassign and deactivate tied practitioners when you delete the base user
    ...(await unassignAndDeactivatePractitioners(practitioners, fhirBaseURL)),
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
 * function to query tied practitioners from a keycloak userId - i.e practitioners created from that user
 *
 * @param userId  - keycloak user id to get practitioners from
 * @param fhirBaseURL - fhir api base url
 * @returns - tied practitioners
 */
async function getPractitionersByUserId(userId: string, fhirBaseURL: string) {
  const serve = FHIR.client(fhirBaseURL);
  // search practitioners with keycloak userID as identifier
  const bundle: IBundle = await serve.request(`Practitioner/_search?identifier=${userId}`);
  // ideal server returns only one result but possible to have multiple
  return bundle.entry ? bundle.entry : [];
}

/**
 * unassign and deactivate practitioners
 *
 * @param practitionersBundle - array of practitioners bundles to modify
 * @param fhirBaseURL - fhir api base url
 * @returns Promise that resolves to an array of promises to unassign and deactivate practitioners
 */
async function unassignAndDeactivatePractitioners(
  practitionersBundle: BundleEntry[],
  fhirBaseURL: string
) {
  const FhirClient = FHIR.client(fhirBaseURL);

  const deletePractitionerRolePromises = [];
  const deactivatePractitionerPromises = [];

  for (const practitionerBundle of practitionersBundle) {
    // get practitioner from search result (BundleEntry array)
    const practitioner = practitionerBundle.resource as Omit<IPractitioner, 'meta'>;

    // deactivate practitioner
    const deactivatePractitionerPromise = FhirClient.update({
      ...practitioner,
      active: false,
    });
    deactivatePractitionerPromises.push(deactivatePractitionerPromise);

    // get practitioner roles tied to a practitioner
    const bundle: IBundle = await FhirClient.request(
      `PractitionerRole/_search?practitioner=${practitioner.id}`
    );

    if (bundle.entry) {
      for (const practitionerRoleBundle of bundle.entry) {
        const practitionerRole = practitionerRoleBundle.resource as IPractitionerRole;
        // delete practitioner role
        const deletePractitionerRolePromise = FhirClient.delete<IResource>(
          `PractitionerRole/${practitionerRole.id}`
        );
        deletePractitionerRolePromises.push(deletePractitionerRolePromise);
      }
    }
  }

  // array of promises to delete practitioner roles and deactivate practitioners
  return [
    // delete practitioner roles
    ...deletePractitionerRolePromises,
    // deactivate practitioners
    ...deactivatePractitionerPromises,
  ];
}
