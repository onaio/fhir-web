import { KeycloakService } from '@opensrp/keycloak-service';
import { KEYCLOAK_URL_USER_GROUPS } from '../../constants';
import { KeycloakUserGroup } from '../../ducks/userGroups';
import { UserGroupMembers } from '.';

// data loader utils for user group detail view

/**
 * Function to fetch group members from keycloak
 *
 * @param {string} groupId - user group id
 * @param {string} baseURL - keycloak base url
 */
export const loadGroupMembers = async (groupId: string, baseURL: string) => {
  const serve = new KeycloakService(`${KEYCLOAK_URL_USER_GROUPS}/${groupId}/members`, baseURL);
  return await serve.list().then((response: UserGroupMembers[]) => {
    return response;
  });
};

/**
 * Function to fetch single group details from keycloak
 *
 * @param {string} groupId - user group id
 * @param {string} baseURL - keycloak base url
 */
export const loadGroupDetails = async (groupId: string, baseURL: string) => {
  const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, baseURL);
  return await serve.read(groupId).then((response: KeycloakUserGroup) => {
    return response;
  });
};
