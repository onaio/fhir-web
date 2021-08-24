import { KeycloakService } from '@opensrp-web/keycloak-service';
import { sendErrorNotification } from '@opensrp-web/notifications';
import { KEYCLOAK_URL_USER_GROUPS } from '../../constants';
import { KeycloakUserGroup } from '../../ducks/userGroups';
import { UserGroupMembers } from '.';
import lang, { Lang } from '../../lang';

// data loader utils for user group detail view

/** Function to fetch group members from keycloak
 *
 * @param {string} groupId - user group id
 * @param {string} baseURL - keycloak base url
 * @param {Function} callback - callback function to set group members from api to state
 * @param {Lang} langObj - the translation strings lookup
 */
export const loadGroupMembers = async (
  groupId: string,
  baseURL: string,
  callback: (members: UserGroupMembers[]) => void,
  langObj: Lang = lang
) => {
  const serve = new KeycloakService(`${KEYCLOAK_URL_USER_GROUPS}/${groupId}/members`, baseURL);
  return await serve
    .list()
    .then((response: UserGroupMembers[]) => {
      callback(response);
    })
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURED));
};

/**
 * Function to fetch single group details from keycloak
 *
 * @param {string} groupId - user group id
 * @param {string} baseURL - keycloak base url
 * @param {Function} callback - callback function to set group members from api to state
 * @param {Lang} langObj - the translation strings lookup
 */
export const loadGroupDetails = async (
  groupId: string,
  baseURL: string,
  callback: (userGroups: KeycloakUserGroup) => void,
  langObj: Lang = lang
) => {
  const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, baseURL);
  return await serve
    .read(groupId)
    .then((response: KeycloakUserGroup) => {
      callback(response);
    })
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURED));
};
