import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { removeKeycloakUsers } from '../../../ducks/user';
import { KEYCLOAK_URL_USERS } from '../../../constants';
import lang, { Lang } from '../../../lang';

/**
 * Delete keycloak user
 *
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} keycloakBaseURL - keycloak api base URL
 * @param {string} userId - id of user to be deleted
 * @param {Function} isLoadingCallback - callback function that sets loading state
 * @param {Lang} langObj - lang
 * @returns {void}
 */
export const deleteUser = (
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  keycloakBaseURL: string,
  userId: string,
  isLoadingCallback: (loading: boolean) => void,
  langObj: Lang = lang
): void => {
  const serviceDelete = new KeycloakService(`${KEYCLOAK_URL_USERS}/${userId}`, keycloakBaseURL);
  serviceDelete
    .delete()
    .then(() => {
      removeKeycloakUsersCreator();
      isLoadingCallback(true);
      sendSuccessNotification(langObj.USER_DELETED_SUCCESSFULLY);
    })
    .catch((_: Error) => {
      sendErrorNotification(langObj.ERROR_OCCURED);
    });
};
