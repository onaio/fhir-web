import { notification } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { KeycloakUser } from '@opensrp/store';
import { Dictionary } from '@onaio/utils';
import { Dispatch, SetStateAction } from 'react';
import { KeycloakService } from '@opensrp/keycloak-service';
import { KEYCLOAK_URL_USERS, URL_ADMIN, KEYCLOAK_URL_REQUIRED_USER_ACTIONS } from '../constants';

export const submitForm = (
  values: Partial<KeycloakUser>,
  accessToken: string,
  keycloakBaseURL: string,
  keycloakServiceClass: typeof KeycloakService,
  setIsSubmitting: Dispatch<SetStateAction<boolean>>,
  userId?: string
): void => {
  setIsSubmitting(true);

  if (userId) {
    const serve = new keycloakServiceClass(
      accessToken,
      `${KEYCLOAK_URL_USERS}/${userId}`,
      keycloakBaseURL
    );
    serve
      .update(values)
      .then(() => {
        setIsSubmitting(false);
        history.push(URL_ADMIN);
        notification.success({
          message: 'User edited successfully',
          description: '',
        });
      })
      .catch((e: Error) => {
        setIsSubmitting(false);
        notification.error({
          message: `${e}`,
          description: '',
        });
      });
  } else {
    const serve = new keycloakServiceClass(accessToken, KEYCLOAK_URL_USERS, keycloakBaseURL);
    serve
      .create(values)
      .then(() => {
        setIsSubmitting(false);
        history.push(URL_ADMIN);
        notification.success({
          message: 'User created successfully',
          description: '',
        });
      })
      .catch((e: Error) => {
        setIsSubmitting(false);
        notification.error({
          message: `${e}`,
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
    .catch((err: Error) => {
      notification.error({
        message: `${err}`,
        description: '',
      });
    });
};
