import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { removeKeycloakUsers } from '../../../ducks/user';
import { KEYCLOAK_URL_USERS } from '../../../constants';
import lang, { Lang } from '../../../lang';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { CareTeamParticipant } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/careTeamParticipant';

/**
 * Delete keycloak user and practitioner
 *
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} keycloakBaseURL - keycloak api base URL
 * @param fhirBaseURL - fhir api base url
 * @param {string} userId - id of user to be deleted
 * @param {Lang} langObj - lang
 * @returns {void}
 */
export const deleteUser = async (
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  keycloakBaseURL: string,
  fhirBaseURL: string,
  userId: string,
  langObj: Lang = lang
) => {
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
    // unassign and deactivate tied practitioners
    // unwrap from fns
    ...unassignAndDeactivatePromises.map((promise) => promise()),
  ])
    .then(() => {
      sendSuccessNotification(langObj.USER_DELETED_SUCCESSFULLY);
      sendSuccessNotification(langObj.PRACTITIONER_UNASSIGNED_SUCCESSFULLY);
      sendSuccessNotification(langObj.PRACTITIONER_DEACTIVATED_SUCCESSFULLY);
      sendSuccessNotification(langObj.PRACTITIONER_UNASSIGNED_FROM_CARE_TEAMS_SUCCESSFULLY);
      removeKeycloakUsersCreator();
    })
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURED));
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
  const updateCareTeams: (() => Promise<ICareTeam>)[] = [];

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

    if (practitioner.id) {
      const careTeamsToUpdate = await removePractitionerFromCareTeam(fhirBaseURL, practitioner.id);
      updateCareTeams.push(...careTeamsToUpdate);
    }
  }

  // flatten 2D array - [[][][]]
  return [...deletePractitionerRolePromises, ...deactivatePractitionerPromises, ...updateCareTeams];
}

/**
 * remove practitioner from care team
 *
 * @param fhirBaseURL - fhir api base url
 * @param practitionerId - practitioner.id
 * @returns array of wrapped promises to remove practitioner from care teams
 */
async function removePractitionerFromCareTeam(fhirBaseURL: string, practitionerId: string) {
  const careTeams = new FHIRServiceClass<ICareTeam>(fhirBaseURL, 'CareTeam');

  const careTeamsBundle = await careTeams.list({
    'participant:practitioner': practitionerId,
  });

  const updateCareTeams: (() => Promise<ICareTeam>)[] = [];

  if (careTeamsBundle.entry) {
    for (const careTeamEntry of careTeamsBundle.entry) {
      if (careTeamEntry.resource.participant) {
        const filteredParticipants = filterObjFromArr(
          careTeamEntry.resource.participant,
          practitionerId
        );
        const updateCareTeamPromise = () =>
          careTeams.update({ ...careTeamEntry.resource, participant: filteredParticipants });
        updateCareTeams.push(updateCareTeamPromise);
      }
    }
  }

  return updateCareTeams;
}

/**
 * filter out practitioner from care team participant array
 *
 * @param arr - care team participants array
 * @param practitionerId - practitioner.id
 * @returns filtered array - one without given practitioner id
 */
function filterObjFromArr(arr: CareTeamParticipant[], practitionerId: string) {
  const filteredArr = arr.filter(
    (participant) => participant?.member?.reference !== `Practitioner/${practitionerId}`
  );
  return filteredArr;
}
