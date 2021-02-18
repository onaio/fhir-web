import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { KEYCLOAK_URL_USER_GROUPS } from '../../constants';
import { KeycloakUserGroup } from '../../ducks/userGroups';
import { UserGroupMembers } from '.';

// data loader utils for user group detail view

/** Function to fetch group members from keycloak
 *
 * @param {string} groupId - user group id
 * @param {string} baseURL - keycloak base url
 * @param {Function} callback - callback function to set group members from api to state
 */
export const loadGroupMembers = async (
  groupId: string,
  baseURL: string,
  callback: (members: UserGroupMembers[]) => void
) => {
  const serve = new KeycloakService(`${KEYCLOAK_URL_USER_GROUPS}/${groupId}/members`, baseURL);
  return await serve
    .list()
    .then((response: UserGroupMembers[]) => {
      callback(response);
    })
    .catch((e: Error) => sendErrorNotification(`${e}`));
};

/** Function to fetch single group details from keycloak
 *
 * @param {string} groupId - user group id
 * @param {string} baseURL - keycloak base url
 * @param {Function} callback - callback function to set group members from api to state
 */
export const loadGroupDetails = async (
  groupId: string,
  baseURL: string,
  callback: (userGroups: KeycloakUserGroup) => void
) => {
  const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, baseURL);
  return await serve
    .read(groupId)
    .then((response: KeycloakUserGroup) => {
      callback(response);
    })
    .catch((e: Error) => sendErrorNotification(`${e}`));
};
