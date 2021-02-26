import { sendErrorNotification } from '@opensrp/notifications';
import { KeycloakService } from '@opensrp/keycloak-service';
import { store } from '@opensrp/store';
import { KEYCLOAK_URL_USER_ROLES } from '../../constants';
import { ERROR_OCCURED } from '../../lang';
import { fetchKeycloakUserRoles, KeycloakUserRole } from '../../ducks/userRoles';

/**
 * Fetch all realm roles
 *
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} dispatch method to dispatch action to store
 */
export const fetchAllRoles = async (keycloakBaseURL: string, dispatch: typeof store.dispatch) => {
  const keycloakService = new KeycloakService(KEYCLOAK_URL_USER_ROLES, keycloakBaseURL);

  await keycloakService
    .list()
    .then((response: KeycloakUserRole[]) => {
      dispatch(fetchKeycloakUserRoles(response));
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};
