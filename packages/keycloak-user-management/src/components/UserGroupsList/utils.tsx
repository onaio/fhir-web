import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { KEYCLOAK_URL_USER_GROUPS } from '../../constants';
import { KeycloakUserGroup } from '../../ducks/userGroups';
import { UserGroupMembers } from '.';
import type { TFunction } from 'react-i18next';
// data loader utils for user group detail view

/** Function to fetch group members from keycloak
 *
 * @param groupId - user group id
 * @param baseURL - keycloak base url
 * @param callback - callback function to set group members from api to state
 * @param t - translator function
 */
export const loadGroupMembers = async (
  groupId: string,
  baseURL: string,
  callback: (members: UserGroupMembers[]) => void,
  t: TFunction
) => {
  const serve = new KeycloakService(`${KEYCLOAK_URL_USER_GROUPS}/${groupId}/members`, baseURL);
  return await serve
    .list()
    .then((response: UserGroupMembers[]) => {
      callback(response);
    })
    .catch(() => sendErrorNotification(t('An error occurred')));
};

/**
 * Function to fetch single group details from keycloak
 *
 * @param groupId - user group id
 * @param baseURL - keycloak base url
 * @param callback - callback function to set group members from api to state
 * @param t - translator function
 */
export const loadGroupDetails = async (
  groupId: string,
  baseURL: string,
  callback: (userGroups: KeycloakUserGroup) => void,
  t: TFunction
) => {
  const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, baseURL);
  return await serve
    .read(groupId)
    .then((response: KeycloakUserGroup) => {
      callback(response);
    })
    .catch(() => sendErrorNotification(t(t('An error occurred'))));
};
