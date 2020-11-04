import { notification } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { KeycloakUser } from '@opensrp/store';
import { Dictionary } from '@onaio/utils';
import { Dispatch, SetStateAction } from 'react';
import { KeycloakService } from '@opensrp/keycloak-service';
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
        history.push(URL_ADMIN);
        notification.success({
          message: 'User edited successfully',
          description: '',
        });
      })
      .catch((_: Error) => {
        setSubmitting(false);
        notification.error({
          message: ERROR_OCCURED,
          description: '',
        });
      });
  } else {
    const serve = new keycloakServiceClass(accessToken, KEYCLOAK_URL_USERS, keycloakBaseURL);
    serve
      .create(values)
      .then(() => {
        setSubmitting(false);
        history.push(URL_ADMIN);
        notification.success({
          message: 'User created successfully',
          description: '',
        });
      })
      .catch((_: Error) => {
        setSubmitting(false);
        notification.error({
          message: ERROR_OCCURED,
          description: '',
        });
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
      notification.error({
        message: ERROR_OCCURED,
        description: '',
      });
    });
};
