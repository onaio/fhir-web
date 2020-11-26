import { history } from '@onaio/connected-reducer-registry';
import { Dictionary } from '@onaio/utils';
import { Dispatch, SetStateAction } from 'react';
import { v4 } from 'uuid';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { KeycloakUser } from '../../../ducks/user';
import {
  KEYCLOAK_URL_USERS,
  URL_ADMIN,
  KEYCLOAK_URL_REQUIRED_USER_ACTIONS,
  ERROR_OCCURED,
} from '../../../constants';
import { OpenSRPService } from '@opensrp/server-service';
import { Practitioner } from '.';

/** Utility function to set new user UUID extracted from the
 * POST response location header
 *
 * @param {Response} response - response object from POST request
 * @param {object} values - form submit values to be POSTed
 * @returns {object} - new values object with userid set
 *
 */
export const buildUserObject = (
  response: Response,
  values: Partial<KeycloakUser> & Partial<Practitioner>
): object => {
  const locationStr = response.headers.get('location')?.split('/') as string[];
  const newUUID = locationStr[locationStr.length - 1];
  return {
    ...values,
    id: newUUID as string,
  };
};

/**
 *
 * @param {string} accessToken - access token
 * @param {string} baseURL - opensrp API base URL
 * @param {OpenSRPService} serviceClass - opensrp api service class
 * @param {Dictionary} values - form values
 * @param {Practitioner} practitioner - practitioner object
 * @param {boolean} isEdit - boolean to show whether edit mode or not
 */
export const createOrEditPractitioners = (
  accessToken: string,
  baseURL: string,
  serviceClass: typeof OpenSRPService,
  values: Partial<KeycloakUser> & Partial<Practitioner>,
  practitioner: Practitioner | undefined,
  isEdit: boolean
) => {
  const requestType = isEdit ? 'update' : 'create';
  const practitionerValues = {
    active: isEdit ? values.active : true,
    identifier: practitioner ? practitioner.identifier : v4(),
    name: `${values.firstName} ${values.lastName}`,
    userId: values.id,
    username: values.username,
  };

  const practitionersService = new serviceClass(accessToken, baseURL, 'practitioner');
  practitionersService[requestType](practitionerValues)
    .then(() => {
      sendSuccessNotification('Practitioner created successfully');
    })
    .catch((_: Error) => {
      sendErrorNotification(ERROR_OCCURED);
    });
};

/**
 * Handle form submission
 *
 * @param {Dictionary} values - form values
 * @param {string} accessToken - keycloak API access token
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {string} opensrpBaseURL - opensrp api base url
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 * @param {OpenSRPService} opensrpServiceClass - OpenSRP API service
 * @param {Function} setSubmitting - method to set submission status
 * @param {Practitioner} practitioner - single practitioner object
 * @param {string} userId - keycloak user id, required when editing a user
 */
export const submitForm = (
  values: Partial<KeycloakUser> & Partial<Practitioner>,
  accessToken: string,
  keycloakBaseURL: string,
  opensrpBaseURL: string,
  keycloakServiceClass: typeof KeycloakService,
  opensrpServiceClass: typeof OpenSRPService,
  setSubmitting: (isSubmitting: boolean) => void,
  practitioner: Practitioner | undefined,
  userId?: string
): void => {
  const isEditing = !!userId;
  setSubmitting(true);
  const keycloakUserValues = {
    ...values,
  };
  delete keycloakUserValues.active;
  if (userId) {
    const serve = new keycloakServiceClass(
      accessToken,
      `${KEYCLOAK_URL_USERS}/${userId}`,
      keycloakBaseURL
    );
    serve
      .update(keycloakUserValues)
      .then(() => {
        createOrEditPractitioners(
          accessToken,
          opensrpBaseURL,
          opensrpServiceClass,
          values,
          practitioner,
          isEditing
        );
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
      .create(keycloakUserValues)
      .then((response: Response | undefined) => {
        // workaround to get userId for newly created user
        // immediately after performing a POST
        const newValues = response ? buildUserObject(response, values) : values;
        createOrEditPractitioners(
          accessToken,
          opensrpBaseURL,
          opensrpServiceClass,
          newValues,
          practitioner,
          isEditing
        );
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
