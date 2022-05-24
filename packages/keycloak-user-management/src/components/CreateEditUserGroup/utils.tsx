import { Dispatch, SetStateAction } from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { KeycloakService } from '@opensrp/keycloak-service';
import { store } from '@opensrp/store';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import {
  KEYCLOAK_URL_ASSIGNED_ROLES,
  KEYCLOAK_URL_USER_GROUPS,
  URL_USER_GROUPS,
  URL_USER_GROUP_EDIT,
} from '../../constants';
import { KeycloakUserRole } from '../../ducks/userRoles';
import { fetchKeycloakUserGroups, KeycloakUserGroup } from '../../ducks/userGroups';
import type { TFunction } from '@opensrp/i18n';

/**
 * Fetch available, assigned or effective roles
 *
 * @param groupId - user group id
 * @param keycloakBaseURL - keycloak API base URL
 * @param roleMappingEndpoint - keycloak endpoint for fetching assigned, available or effective roles
 * @param setRolesAction method to set state for selected actions
 * @param t - translator function
 */
export const fetchRoleMappings = async (
  groupId: string,
  keycloakBaseURL: string,
  roleMappingEndpoint: string,
  setRolesAction: (role: KeycloakUserRole[]) => void,
  t: TFunction
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
      sendErrorNotification(t('An error occurred'));
    });
};

/**
 * Remove assigned roles
 *
 * @param groupId - user group id
 * @param keycloakBaseURL - keycloak API base URL
 * @param allRoles - an array of all realm roles
 * @param rolesToRemove - list of role ids
 * @param t - translator function
 */
export const removeAssignedRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  allRoles: KeycloakUserRole[],
  rolesToRemove: string[],
  t: TFunction
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
      sendSuccessNotification(t('Role Mappings Updated Successfully'));
    })
    .catch((_: Error) => {
      sendErrorNotification(t('An error occurred'));
    });
};

/**
 * Set assigned roles
 *
 * @param groupId - user group id
 * @param keycloakBaseURL - keycloak API base URL
 * @param allRoles - an array of all realm roles
 * @param rolesToAdd - list of role ids
 * @param t - the language object
 */
export const assignRoles = async (
  groupId: string,
  keycloakBaseURL: string,
  allRoles: KeycloakUserRole[],
  rolesToAdd: string[],
  t: TFunction
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
      sendSuccessNotification(t('Role Mappings Updated Successfully'));
    })
    .catch((_: Error) => {
      sendErrorNotification(t('An error occurred'));
    });
};

/**
 * Fetch single user group
 *
 * @param groupId -
 * @param keycloakBaseURL - keycloak API base URL
 * @param dispatch method to dispatch action to store
 * @param t - translator function
 */
export const fetchSingleGroup = async (
  groupId: string,
  keycloakBaseURL: string,
  dispatch: typeof store.dispatch,
  t: TFunction
) => {
  const keycloakService = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);

  await keycloakService
    .read(groupId)
    .then((response: KeycloakUserGroup) => {
      dispatch(fetchKeycloakUserGroups([response]));
    })
    .catch((_: Error) => {
      sendErrorNotification(t('An error occurred'));
    });
};

export const submitForm = async (
  values: KeycloakUserGroup & { roles?: string[] },
  keycloakBaseURL: string,
  setSubmittingCallback: Dispatch<SetStateAction<boolean>>,
  t: TFunction
): Promise<void> => {
  if (values.id) {
    const serve = new KeycloakService(`${KEYCLOAK_URL_USER_GROUPS}/${values.id}`, keycloakBaseURL);
    serve
      .update(values)
      .then(() => sendSuccessNotification(t('User Group edited successfully')))
      .catch((_: Error) => sendErrorNotification(t('An error occurred')))
      .finally(() => {
        history.push(URL_USER_GROUPS);
        setSubmittingCallback(false);
      });
  } else {
    let newUUID: string | undefined;
    const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
    serve
      .create({ name: values.name })
      .then((res: Response) => {
        const locationStr = res.headers.get('location')?.split('/') as string[];
        newUUID = locationStr[locationStr.length - 1];
        sendSuccessNotification(t('User Group created successfully'));
      })
      .catch((_: Error) => sendErrorNotification(t('An error occurred')))
      .finally(() => {
        setSubmittingCallback(false);
        if (newUUID) {
          history.push(`${URL_USER_GROUP_EDIT}/${newUUID}`);
        }
      });
  }
};
