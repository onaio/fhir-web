import { sendErrorNotification } from '@opensrp/notifications';
import { KeycloakService } from '@opensrp/keycloak-service';
import { store } from '@opensrp/store';
import { KEYCLOAK_URL_USER_ROLES } from '../../constants';
import { fetchKeycloakUserRoles, KeycloakUserRole } from '../../ducks/userRoles';
import type { TFunction } from '@opensrp/i18n';

/**
 * Fetch all realm roles
 *
 * @param  keycloakBaseURL - keycloak API base URL
 * @param dispatch method to dispatch action to store
 * @param  t - translator function
 */
export const fetchAllRoles = async (
  keycloakBaseURL: string,
  dispatch: typeof store.dispatch,
  t: TFunction
) => {
  const keycloakService = new KeycloakService(KEYCLOAK_URL_USER_ROLES, keycloakBaseURL);

  await keycloakService
    .list()
    .then((response: KeycloakUserRole[]) => {
      dispatch(fetchKeycloakUserRoles(response));
    })
    .catch((_: Error) => {
      sendErrorNotification(t('There was a problem fetching realm roles'));
    });
};
