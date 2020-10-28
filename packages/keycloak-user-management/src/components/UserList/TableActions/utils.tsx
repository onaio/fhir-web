import { notification } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { removeKeycloakUsers } from '../../../ducks/user';
import { KEYCLOAK_URL_USERS, USER_DELETED_SUCCESSFULLY, ERROR_OCCURED } from '../../../constants';

/**
 * Delete keycloak user
 *
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} accessToken - access token
 * @param {string} keycloakBaseURL - keycloak api base URL
 * @param {string} userId - id of user to be deleted
 * @param {Function} isLoadingCallback - callback function that sets loading state
 * @returns {void}
 */
export const deleteUser = (
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  accessToken: string,
  keycloakBaseURL: string,
  userId: string,
  isLoadingCallback: (loading: boolean) => void
): void => {
  const serviceDelete = new KeycloakService(
    accessToken,
    `${KEYCLOAK_URL_USERS}/${userId}`,
    keycloakBaseURL
  );
  serviceDelete
    .delete()
    .then(() => {
      removeKeycloakUsersCreator();
      isLoadingCallback(true);
      notification.success({
        message: `${USER_DELETED_SUCCESSFULLY}`,
        description: '',
      });
    })
    .catch((_: Error) => {
      notification.error({
        message: `${ERROR_OCCURED}`,
        description: '',
      });
    });
};
