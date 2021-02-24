import { KeycloakService } from '@opensrp/keycloak-service';
import { store } from '@opensrp/store';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { ERROR_OCCURED } from '../../lang';
import {
  KEYCLOAK_URL_ASSIGNED_ROLES,
  KEYCLOAK_URL_AVAILABLE_ROLES,
  KEYCLOAK_URL_EFFECTIVE_ROLES,
  KEYCLOAK_URL_USER_GROUPS,
} from '../../constants';
import { KeycloakUserRole } from '../../ducks/userRoles';
import { fetchKeycloakUserGroups, KeycloakUserGroup } from '../../ducks/userGroups';

/**
 * Fetch available roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setRolesAction method to set state for selected actions
 */
export const fetchAvailableRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  setRolesAction: (role: KeycloakUserRole[]) => void
) => {
  const keycloakService = new KeycloakService(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_AVAILABLE_ROLES}`,
    keycloakBaseURL
  );

  return await keycloakService
    .list()
    .then((response: KeycloakUserRole[]) => {
      setRolesAction(response);
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};

/**
 * Fetch assigned roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setRolesAction method to set state for selected actions
 */
export const fetchAssignedRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  setRolesAction: (role: KeycloakUserRole[]) => void
) => {
  const keycloakService = new KeycloakService(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_ASSIGNED_ROLES}`,
    keycloakBaseURL
  );

  return await keycloakService
    .list()
    .then((response: KeycloakUserRole[]) => {
      setRolesAction(response);
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};

/**
 * Fetch effective roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setRolesAction method to set state for selected actions
 */
export const fetchEffectiveRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  setRolesAction: (role: KeycloakUserRole[]) => void
) => {
  const keycloakService = new KeycloakService(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_EFFECTIVE_ROLES}`,
    keycloakBaseURL
  );

  return await keycloakService
    .list()
    .then((response: KeycloakUserRole[]) => {
      setRolesAction(response);
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};

/**
 * Remove assigned roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {KeycloakUserRole[]} allRoles - an array of all realm roles
 * @param {string[]} rolesToRemove - list of role ids
 */
export const removeAssignedRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  allRoles: KeycloakUserRole[],
  rolesToRemove: string[]
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
      sendSuccessNotification('Role Unassigned Successfully');
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};

/**
 * Set assigned roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {KeycloakUserRole[]} allRoles - an array of all realm roles
 * @param {string[]} rolesToAdd - list of role ids
 */
export const assignRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  allRoles: KeycloakUserRole[],
  rolesToAdd: string[]
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
      sendSuccessNotification('Roles Assigned Successfully');
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};

/**
 * Fetch single user group
 *
 * @param {string} groupId -
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} dispatch method to dispatch action to store
 */
export const fetchSingleGroup = async (
  groupId: string,
  keycloakBaseURL: string,
  dispatch: typeof store.dispatch
) => {
  const keycloakService = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);

  await keycloakService
    .read(groupId)
    .then((response: KeycloakUserGroup) => {
      dispatch(fetchKeycloakUserGroups([response]));
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};
