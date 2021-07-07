import { history } from '@onaio/connected-reducer-registry';
import { Dispatch, SetStateAction } from 'react';
import { get } from 'lodash';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { KeycloakUser, UserAction, UserGroup } from '../../../ducks/user';
import FHIR from 'fhirclient';
import {
  KEYCLOAK_URL_USERS,
  URL_USER,
  KEYCLOAK_URL_REQUIRED_USER_ACTIONS,
  URL_USER_CREDENTIALS,
  KEYCLOAK_URL_USER_GROUPS,
} from '../../../constants';
import lang, { Lang } from '../../../lang';
import { FormFields } from '.';

/** Utility function to set new user UUID extracted from the
 * POST response location header
 *
 * @param {Response} response - response object from POST request
 * @param {FormFields} values - form submit values to be POSTed
 * @returns {FormFields} - new values object with userid set
 *
 */
export const buildUserObject = (response: Response, values: FormFields): FormFields => {
  const locationStr = response.headers.get('location')?.split('/') as string[];
  const newUUID = locationStr[locationStr.length - 1];
  return { ...values, id: newUUID };
};

/**
 * @param fhirBaseURL - FHIR API base url
 * @param values - form values
 * @param langObj - the language translations object
 */
export const createOrEditPractitioners = async (
  fhirBaseURL: string,
  values: FormFields & KeycloakUser,
  langObj: Lang = lang
) => {
  const requestType = values.practitioner ? 'update' : 'create';
  const successMessage = values.practitioner
    ? langObj.PRACTITIONER_UPDATED_SUCCESSFULLY
    : langObj.PRACTITIONER_CREATED_SUCCESSFULLY;

  const practitionerValues = {
    resourceType: 'Practitioner',
    id: values.practitioner ? (values.practitioner.id as string) : undefined,
    identifier: [
      {
        use: 'official',
        value: values.practitioner ? get(values.practitioner, 'identifier.0.value') : values.id,
      },
    ],
    active: true,
    name: [
      {
        use: 'official',
        family: values.lastName,
        given: [values.firstName, ''],
      },
    ],
    telecom: [
      {
        system: 'email',
        value: values.email,
      },
    ],
  };

  const fhirServe = FHIR.client(fhirBaseURL);
  fhirServe[requestType](practitionerValues)
    .then((_) => sendSuccessNotification(successMessage))
    .catch((_) => sendErrorNotification(langObj.ERROR_OCCURED));

  if (!values.practitioner) history.push(`${URL_USER_CREDENTIALS}/${values.id}`);
};

/**
 * Handle form submission
 *
 * @param values - form values
 * @param keycloakBaseURL - keycloak API base URL
 * @param fhirBaseURL - FHIR API base url
 * @param userGroups - Array of Usergroups to get data from when sending payload of user groups
 * @param langObj - the translations object lookup
 */
export const submitForm = async (
  values: FormFields & KeycloakUser,
  keycloakBaseURL: string,
  fhirBaseURL: string,
  userGroups: UserGroup[],
  langObj: Lang = lang
): Promise<void> => {
  const keycloakUserValue: Omit<FormFields, 'active' | 'practitioner' | 'userGroup'> &
    Partial<FormFields> = {
    ...values,
  };
  delete keycloakUserValue.active;
  delete keycloakUserValue.userGroup;
  delete keycloakUserValue.practitioner;

  if (values.id) {
    const serve = new KeycloakService(`${KEYCLOAK_URL_USERS}/${values.id}`, keycloakBaseURL);
    await serve.update(keycloakUserValue);
  } else {
    const serve = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
    const response: Response | undefined = await serve.create({
      ...keycloakUserValue,
    });
    // workaround to get user Id for newly created user immediately after performing a POST
    values = response ? buildUserObject(response, values) : values;
  }

  await createOrEditPractitioners(fhirBaseURL, values, langObj);

  // Assign User Group to user
  const promises: Promise<void>[] = [];

  values.userGroup?.forEach((groupId) => {
    const userGroupValue = userGroups.find((group) => group.id === groupId) as UserGroup;

    const serve = new KeycloakService(
      `${KEYCLOAK_URL_USERS}/${values.id}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`,
      keycloakBaseURL
    );

    const promise = serve.update(userGroupValue);
    promises.push(promise);
  });

  await Promise.allSettled(promises).catch((_: Error) =>
    sendErrorNotification(langObj.ERROR_OCCURED)
  );
  sendSuccessNotification(langObj.MESSAGE_USER_GROUP_EDITED);

  sendSuccessNotification(langObj.MESSAGE_USER_EDITED);
  if (keycloakUserValue.id) {
    history.push(URL_USER);
  }
};

/**
 * Fetch keycloak user action options
 *
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setUserActionOptions - method to set state for selected actions
 * @param {Lang} langObj - the language translations object
 */
export const fetchRequiredActions = (
  keycloakBaseURL: string,
  setUserActionOptions: Dispatch<SetStateAction<UserAction[]>>,
  langObj: Lang = lang
): void => {
  const keycloakService = new KeycloakService(KEYCLOAK_URL_REQUIRED_USER_ACTIONS, keycloakBaseURL);

  keycloakService
    .list()
    .then((response: UserAction[]) => {
      setUserActionOptions(
        response.filter((action: UserAction) => action.alias !== 'terms_and_conditions')
      );
    })
    .catch((_: Error) => sendErrorNotification(langObj.ERROR_OCCURED));
};
