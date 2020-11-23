import { history } from '@onaio/connected-reducer-registry';
import { Dictionary } from '@onaio/utils';
import { Dispatch, SetStateAction } from 'react';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { KeycloakUser } from '../../../ducks/user';
import {
  KEYCLOAK_URL_USERS,
  URL_ADMIN,
  KEYCLOAK_URL_REQUIRED_USER_ACTIONS,
  ERROR_OCCURED,
} from '../../../constants';

/**
 * Handle form submission
 *
 * @param {Dictionary} values - form values
 * @param {string} accessToken - keycloak API access token
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 * @param {Function} setSubmitting - method to set submission status
 * @param {string} userId - keycloak user id, required when editing a user
 */
export const submitForm = (
  values: Partial<KeycloakUser>,
  accessToken: string,
  keycloakBaseURL: string,
  keycloakServiceClass: typeof KeycloakService,
  setSubmitting: (isSubmitting: boolean) => void,
  userId?: string
): void => {
  setSubmitting(true);

  if (userId) {
    const serve = new keycloakServiceClass(
      accessToken,
      `${KEYCLOAK_URL_USERS}/${userId}`,
      keycloakBaseURL
    );
    serve
      .update(values)
      .then(() => {
        setSubmitting(false);
        sendSuccessNotification('User edited successfully');
        history.push(URL_ADMIN);
      })
      .catch((_: Error) => {
        setSubmitting(false);
        sendErrorNotification(ERROR_OCCURED);
      });
  } else {
    const serve = new keycloakServiceClass(accessToken, KEYCLOAK_URL_USERS, keycloakBaseURL);
    serve
      .create(values)
      .then(() => {
        setSubmitting(false);
        sendSuccessNotification('User created successfully');
        history.push(URL_ADMIN);
      })
      .catch((_: Error) => {
        setSubmitting(false);

        sendErrorNotification(ERROR_OCCURED);
      });
  }
};

/** interface user action */
export interface UserAction {
  alias: string;
  name: string;
  providerId: string;
  enabled: boolean;
  defaultAction: boolean;
  priority: number;
  config: Dictionary;
}

/**
 * Fetch keycloak user action options
 *
 * @param {string} accessToken - keycloak API access token
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setUserActionOptions - method to set state for selected actions
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export const fetchRequiredActions = (
  accessToken: string,
  keycloakBaseURL: string,
  setUserActionOptions: Dispatch<SetStateAction<UserAction[]>>,
  keycloakServiceClass: typeof KeycloakService
): void => {
  const keycloakService = new keycloakServiceClass(
    accessToken,
    KEYCLOAK_URL_REQUIRED_USER_ACTIONS,
    keycloakBaseURL
  );

  keycloakService
    .list()
    .then((response: UserAction[]) => {
      setUserActionOptions(
        response.filter((action: UserAction) => action.alias !== 'terms_and_conditions')
      );
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};
