import { KeycloakService } from '@opensrp/keycloak-service';
import { OpenSRPService } from '@opensrp/react-utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { removeKeycloakUsers } from '../../../ducks/user';
import {
  KEYCLOAK_URL_USERS,
  PRACTITIONER,
  OPENSRP_CREATE_PRACTITIONER_ENDPOINT,
  DELETE_PRACTITIONER_ROLE,
} from '../../../constants';
import { Practitioner } from '@opensrp/team-management';
import { TFunction } from 'react-i18next';

/**
 * Delete keycloak user and practitioner
 *
 * @param removeKeycloakUsersCreator - remove users action creator
 * @param keycloakBaseURL - keycloak api base URL
 * @param opensrpBaseURL - opensrp api base url
 * @param userId - id of user to be deleted
 * @param  t - translator function
 * @returns {void}
 */
export const deleteUser = async (
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  keycloakBaseURL: string,
  opensrpBaseURL: string,
  userId: string,
  t: TFunction
) => {
  // get tied practitioner from base user Id
  const practitioner = await getPractitionerByUserId(
    OPENSRP_CREATE_PRACTITIONER_ENDPOINT,
    userId,
    opensrpBaseURL
  ).catch(() => {
    sendErrorNotification(t('An error occurred'));
    // stop loader
    return undefined;
  });

  if (!practitioner) return;

  // service class to delete keycloak user
  const serviceDelete = new KeycloakService(`${KEYCLOAK_URL_USERS}/${userId}`, keycloakBaseURL);

  return Promise.all([
    // delete keycloak user
    serviceDelete.delete(),
    // unassign and deactivate the tied practitioner when you delete the base user
    unassignAndDeactivatePractitioner(
      DELETE_PRACTITIONER_ROLE,
      PRACTITIONER,
      practitioner,
      opensrpBaseURL
    ),
  ])
    .then(() => {
      removeKeycloakUsersCreator();
      sendSuccessNotification(t('User deleted successfully'));
      sendSuccessNotification(t('Practitioner unassigned successfully'));
      sendSuccessNotification(t('Practitioner deactivated successfully'));
    })
    .catch((_: Error) => {
      sendErrorNotification(t('An error occurred'));
    });
};

/**
 * function to query a tied practitioner from a userId - practitioner created from that user
 *
 * @param practitionerEndpoint - opensrp practitioner end point
 * @param userId  - the user id to get practitioner for
 * @param opensrpBaseURL - opensrp base url
 * @returns {Practitioner} - the tied practitioner
 */
async function getPractitionerByUserId(
  practitionerEndpoint: string,
  userId: string,
  opensrpBaseURL: string
) {
  // get practitioner from userId
  const openSrpService = new OpenSRPService(practitionerEndpoint + '/' + userId, opensrpBaseURL);
  const practitioner: Practitioner = await openSrpService.list();
  return practitioner;
}

/**
 * unassign and deactivate a practitioner
 *
 * @param deletePractitionerRoleEndpoint - opensrp endpoint to delete practitioner role
 * @param deactivatePractitionerEndpoint - opensrp endpoint to deactivate practitioner
 * @param practitioner - practitioner to modify
 * @param opensrpBaseURL - opensrp base url
 * @returns Promise to unassign and deactivate a practitioner
 */
async function unassignAndDeactivatePractitioner(
  deletePractitionerRoleEndpoint: string,
  deactivatePractitionerEndpoint: string,
  practitioner: Practitioner,
  opensrpBaseURL: string
) {
  // delete practitioner role
  const openSrpDeletePractitionerRole = new OpenSRPService(
    `${deletePractitionerRoleEndpoint}${practitioner.identifier}`,
    opensrpBaseURL
  );

  // deactivate practitioner
  const openSrpDeactivatePractitioner = new OpenSRPService(
    deactivatePractitionerEndpoint,
    opensrpBaseURL
  );

  return Promise.all([
    openSrpDeletePractitionerRole.delete(),
    openSrpDeactivatePractitioner.update({
      ...practitioner,
      active: false,
    }),
  ]);
}
