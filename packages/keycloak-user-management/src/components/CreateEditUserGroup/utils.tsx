import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { ERROR_OCCURED } from '../../lang';
import {
  KEYCLOAK_URL_ASSIGNED_ROLES,
  KEYCLOAK_URL_AVAILABLE_ROLES,
  KEYCLOAK_URL_USER_GROUPS,
} from '../../constants';
import { KeycloakUserRole } from '../../ducks/userRoles';

/**
 * Fetch available roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setRolesAction method to set state for selected actions
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const fetchAvailableRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  setRolesAction: (role: KeycloakUserRole[]) => void,
  keycloakServiceClass: typeof KeycloakService = KeycloakService
) => {
  const keycloakService = new keycloakServiceClass(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_AVAILABLE_ROLES}`,
    keycloakBaseURL
  );

  await keycloakService
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
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const fetchAssignedRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  setRolesAction: (role: KeycloakUserRole[]) => void,
  keycloakServiceClass: typeof KeycloakService = KeycloakService
) => {
  const keycloakService = new keycloakServiceClass(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_ASSIGNED_ROLES}`,
    keycloakBaseURL
  );

  await keycloakService
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
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const fetchEffectiveRoles = (
  groupId: string,
  keycloakBaseURL: string,
  setRolesAction: (role: KeycloakUserRole[]) => void,
  keycloakServiceClass: typeof KeycloakService = KeycloakService
): void => {
  const keycloakService = new keycloakServiceClass(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_ASSIGNED_ROLES}`,
    keycloakBaseURL
  );

  keycloakService
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
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const removeAssignedRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  allRoles: KeycloakUserRole[],
  rolesToRemove: string[],
  keycloakServiceClass: typeof KeycloakService = KeycloakService
) => {
  const data: KeycloakUserRole[] = [];
  rolesToRemove.forEach((roleId: string) => {
    const roleObj = allRoles.find((role: KeycloakUserRole) => role.id === roleId);
    data.push(roleObj as KeycloakUserRole);
  });
  const keycloakService = new keycloakServiceClass(
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
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const assignRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  allRoles: KeycloakUserRole[],
  rolesToAdd: string[],
  keycloakServiceClass: typeof KeycloakService = KeycloakService
) => {
  const data: KeycloakUserRole[] = [];
  rolesToAdd.forEach((roleId: string) => {
    const roleObj = allRoles.find((role: KeycloakUserRole) => role.id === roleId);
    data.push(roleObj as KeycloakUserRole);
  });
  const keycloakService = new keycloakServiceClass(
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
