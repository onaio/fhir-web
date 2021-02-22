import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { ERROR_OCCURED } from '../../lang';
import {
  KEYCLOAK_URL_ASSIGNED_ROLES,
  KEYCLOAK_URL_AVAILABLE_ROLES,
  KEYCLOAK_URL_USER_GROUPS,
} from '../../constants';

/**
 * Fetch available roles
 *
 * @param {string} groupId - user group id
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setAvailableRolesAction method to set state for selected actions
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const fetchAvailableRoles = (
  groupId: string,
  keycloakBaseURL: string,
  setAvailableRolesAction: any,
  keycloakServiceClass: typeof KeycloakService = KeycloakService
): void => {
  const keycloakService = new keycloakServiceClass(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_AVAILABLE_ROLES}`,
    keycloakBaseURL
  );

  keycloakService
    .list()
    .then((response: any) => {
      setAvailableRolesAction(response);
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
 * @param {Function} setAvailableRolesAction method to set state for selected actions
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const fetchAssignedRoles = (
  groupId: string,
  keycloakBaseURL: string,
  setAvailableRolesAction: any,
  keycloakServiceClass: typeof KeycloakService = KeycloakService
): void => {
  const keycloakService = new keycloakServiceClass(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_ASSIGNED_ROLES}`,
    keycloakBaseURL
  );

  keycloakService
    .list()
    .then((response: any) => {
      setAvailableRolesAction(response);
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
 * @param {Function} setAvailableRolesAction method to set state for selected actions
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const fetchEffectiveRoles = (
  groupId: string,
  keycloakBaseURL: string,
  setAvailableRolesAction: any,
  keycloakServiceClass: typeof KeycloakService = KeycloakService
): void => {
  const keycloakService = new keycloakServiceClass(
    `${KEYCLOAK_URL_USER_GROUPS}/${groupId}${KEYCLOAK_URL_ASSIGNED_ROLES}`,
    keycloakBaseURL
  );

  keycloakService
    .list()
    .then((response: any) => {
      setAvailableRolesAction(response);
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};
