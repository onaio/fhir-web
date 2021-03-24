import { KeycloakService } from '@opensrp/keycloak-service';
import { store } from '@opensrp/store';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import lang, { Lang } from '../../lang';
import { KEYCLOAK_URL_ASSIGNED_ROLES, KEYCLOAK_URL_USER_GROUPS } from '../../constants';
import { KeycloakUserRole } from '../../ducks/userRoles';
import { fetchKeycloakUserGroups, KeycloakUserGroup } from '../../ducks/userGroups';

/**
 * Fetch available, assigned or effective roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {string} roleMappingEndpoint - keycloak endpoint for fetching assigned, available or effective roles
 * @param {Function} setRolesAction method to set state for selected actions
 * @param {Lang} langObj - the language object
 */
export const fetchRoleMappings = async (
  groupId: string,
  keycloakBaseURL: string,
  roleMappingEndpoint: string,
  setRolesAction: (role: KeycloakUserRole[]) => void,
  langObj: Lang = lang
) => {
  const keycloakService = new KeycloakService(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${roleMappingEndpoint}`,
    keycloakBaseURL
  );

  return await keycloakService
    .list()
    .then((response: KeycloakUserRole[]) => {
      setRolesAction(response);
    })
    .catch((_: Error) => {
      sendErrorNotification(langObj.ERROR_OCCURED);
    });
};

/**
 * Remove assigned roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {KeycloakUserRole[]} allRoles - an array of all realm roles
 * @param {string[]} rolesToRemove - list of role ids
 * @param {Lang} langObj - the language object
 */
export const removeAssignedRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  allRoles: KeycloakUserRole[],
  rolesToRemove: string[],
  langObj: Lang = lang
) => {
  const data: KeycloakUserRole[] = [];
  rolesToRemove.forEach((roleId: string) => {
    const roleObj = allRoles.find((role: KeycloakUserRole) => role.id === roleId);
    data.push(roleObj as KeycloakUserRole);
  });
  const keycloakService = new KeycloakService(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_ASSIGNED_ROLES}`,
    keycloakBaseURL
  );

  return await keycloakService
    .update(data, null, 'DELETE')
    .then(() => {
      sendSuccessNotification(langObj.ROLES_UPDATED_SUCCESSFULLY);
    })
    .catch((_: Error) => {
      sendErrorNotification(langObj.ERROR_OCCURED);
    });
};

/**
 * Set assigned roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {KeycloakUserRole[]} allRoles - an array of all realm roles
 * @param {string[]} rolesToAdd - list of role ids
 * @param {Lang} langObj - the language object
 */
export const assignRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  allRoles: KeycloakUserRole[],
  rolesToAdd: string[],
  langObj: Lang = lang
) => {
  const data: KeycloakUserRole[] = [];
  rolesToAdd.forEach((roleId: string) => {
    const roleObj = allRoles.find((role: KeycloakUserRole) => role.id === roleId);
    data.push(roleObj as KeycloakUserRole);
  });
  const keycloakService = new KeycloakService(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_ASSIGNED_ROLES}`,
    keycloakBaseURL
  );

  return await keycloakService
    .create(data)
    .then(() => {
      sendSuccessNotification(langObj.ROLES_UPDATED_SUCCESSFULLY);
    })
    .catch((_: Error) => {
      sendErrorNotification(langObj.ERROR_OCCURED);
    });
};

/**
 * Fetch single user group
 *
 * @param {string} groupId -
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} dispatch method to dispatch action to store
 * @param {Lang} langObj - the language object
 */
export const fetchSingleGroup = async (
  groupId: string,
  keycloakBaseURL: string,
  dispatch: typeof store.dispatch,
  langObj: Lang = lang
) => {
  const keycloakService = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);

  await keycloakService
    .read(groupId)
    .then((response: KeycloakUserGroup) => {
      dispatch(fetchKeycloakUserGroups([response]));
    })
    .catch((_: Error) => {
      sendErrorNotification(langObj.ERROR_OCCURED);
    });
};
