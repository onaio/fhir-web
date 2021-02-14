import { history } from '@onaio/connected-reducer-registry';
import { Dispatch, SetStateAction } from 'react';
import { v4 } from 'uuid';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { UserAction } from '../../../ducks/user';
import {
  KEYCLOAK_URL_USERS,
  URL_USER,
  KEYCLOAK_URL_REQUIRED_USER_ACTIONS,
  URL_USER_CREDENTIALS,
} from '../../../constants';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  MESSAGE_USER_EDITED,
  ERROR_OCCURED,
  PRACTITIONER_UPDATED_SUCCESSFULLY,
  PRACTITIONER_CREATED_SUCCESSFULLY,
} from '../../../lang';
import { FormFields } from '.';
import { Dictionary } from '@onaio/utils';

/** Utility function to set new user UUID extracted from the
 * POST response location header
 *
 * @param {Response} response - response object from POST request
 * @param {FormFields} values - form submit values to be POSTed
 * @returns {FormFields} - new values object with userid set
 *
 */
export const buildUserObject = (response: Response, values: FormFields) => {
  const locationStr = response.headers.get('location')?.split('/') as string[];
  const newUUID = locationStr[locationStr.length - 1];
  return { ...values, id: newUUID as string };
};

/**
 *
 * @param {string} baseURL - opensrp API base URL
 * @param {Dictionary} values - form values
 */
export const createOrEditPractitioners = (baseURL: string, values: FormFields) => {
  const requestType = values.practitioner ? 'update' : 'create';
  const successMessage = values.practitioner
    ? PRACTITIONER_UPDATED_SUCCESSFULLY
    : PRACTITIONER_CREATED_SUCCESSFULLY;
  const practitionerValues = {
    active: values.practitioner ? values.active : true,
    identifier: values.practitioner ? values.practitioner.identifier : v4(),
    name: `${values.firstName} ${values.lastName}`,
    userId: values.practitioner ? values.practitioner.userId : values.id,
    username: values.username,
  };

  const practitionersService = new OpenSRPService('practitioner', baseURL);
  practitionersService[requestType](practitionerValues)
    .then(() => {
      if (!values.practitioner) history.push(`${URL_USER_CREDENTIALS}/${values.id}`);
      sendSuccessNotification(successMessage);
    })
    .catch((_: Error) => sendErrorNotification(ERROR_OCCURED));
};

/**
 * Handle form submission
 *
 * @param {Dictionary} values - form values
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {string} opensrpBaseURL - opensrp api base url
 */
export const submitForm = async (
  values: FormFields,
  keycloakBaseURL: string,
  opensrpBaseURL: string
): Promise<void> => {
  const keycloakUserValues: Omit<FormFields, 'active' | 'practitioner' | 'userGroup'> &
    Partial<FormFields> = {
    ...values,
  };
  delete keycloakUserValues.active;
  delete keycloakUserValues.userGroup;
  delete keycloakUserValues.practitioner;

  if (values.id) {
    const serve = new KeycloakService(`${KEYCLOAK_URL_USERS}/${values.id}`, keycloakBaseURL);
    await serve.update(keycloakUserValues);
  } else {
    const serve = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
    const response: Response | undefined = await serve.create({
      ...keycloakUserValues,
      enabled: true,
    });
    // workaround to get user Id for newly created user
    // immediately after performing a POST
    values = response ? buildUserObject(response, values) : values;
  }

  createOrEditPractitioners(opensrpBaseURL, values);
  sendSuccessNotification(MESSAGE_USER_EDITED);
  history.push(URL_USER);
};

/**
 * Fetch keycloak user action options
 *
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setUserActionOptions - method to set state for selected actions
 */
export const fetchRequiredActions = (
  keycloakBaseURL: string,
  setUserActionOptions: Dispatch<SetStateAction<UserAction[]>>
): void => {
  const keycloakService = new KeycloakService(KEYCLOAK_URL_REQUIRED_USER_ACTIONS, keycloakBaseURL);

  keycloakService
    .list()
    .then((response: UserAction[]) => {
      setUserActionOptions(
        response.filter((action: UserAction) => action.alias !== 'terms_and_conditions')
      );
    })
    .catch((_: Error) => sendErrorNotification(ERROR_OCCURED));
};
