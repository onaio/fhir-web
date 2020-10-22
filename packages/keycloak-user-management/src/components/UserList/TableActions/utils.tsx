import { notification } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { fetchKeycloakUsers, KeycloakUser, removeKeycloakUsers } from '@opensrp/store';
import { KEYCLOAK_URL_USERS, USER_DELETED_SUCCESSFULLY, ERROR_OCCURED } from '../../../constants';

/**
 * Delete keycloak user
 *
 * @param {Function} fetchKeycloakUsersCreator - fetch users action creator
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} accessToken - access token
 * @param {string} keycloakBaseURL - keycloak api base URL
 * @param {string} userId - id of user to be deleted
 * @returns {void}
 */
export const deleteUser = (
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers,
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  accessToken: string,
  keycloakBaseURL: string,
  userId: string
): void => {
  const serviceDelete = new KeycloakService(
    accessToken,
    `${KEYCLOAK_URL_USERS}/${userId}`,
    keycloakBaseURL
  );
  serviceDelete
    .delete()
    .then(() => {
      notification.success({
        message: `${USER_DELETED_SUCCESSFULLY}`,
        description: '',
      });
      const serviceGet = new KeycloakService(accessToken, KEYCLOAK_URL_USERS, keycloakBaseURL);

      serviceGet
        .list()
        .then((res: KeycloakUser[]) => {
          // @todo Add action to handle removing one user from the store and
          // remove this workaround that first removes then refetches users
          removeKeycloakUsersCreator();
          fetchKeycloakUsersCreator(res);
        })
        .catch((_: Error) => {
          notification.error({
            message: `${ERROR_OCCURED}`,
            description: '',
          });
        });
    })
    .catch((_: Error) => {
      notification.error({
        message: `${ERROR_OCCURED}`,
        description: '',
      });
    });
};
