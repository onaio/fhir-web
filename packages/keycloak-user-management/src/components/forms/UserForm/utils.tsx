import { history } from '@onaio/connected-reducer-registry';
import { Dispatch, SetStateAction } from 'react';
import { v4 } from 'uuid';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { UserAction, UserGroup } from '../../../ducks/user';
import {
  KEYCLOAK_URL_USERS,
  URL_USER,
  KEYCLOAK_URL_REQUIRED_USER_ACTIONS,
  URL_USER_CREDENTIALS,
  KEYCLOAK_URL_USER_GROUPS,
} from '../../../constants';
import { OpenSRPService } from '@opensrp/react-utils';
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
 * @param baseURL - opensrp API base URL
 * @param values - form values
 * @param langObj - the language translations object
 */
export const createOrEditPractitioners = async (
  baseURL: string,
  values: FormFields,
  langObj: Lang = lang
) => {
  const requestType = values.practitioner ? 'update' : 'create';
  const successMessage = values.practitioner
    ? langObj.PRACTITIONER_UPDATED_SUCCESSFULLY
    : langObj.PRACTITIONER_CREATED_SUCCESSFULLY;
  const practitionerValues = {
    active: values.practitioner ? values.active : true,
    identifier: values.practitioner ? values.practitioner.identifier : v4(),
    name: `${values.firstName} ${values.lastName}`,
    userId: values.practitioner ? values.practitioner.userId : values.id,
    username: values.username,
  };

  const practitionersService = new OpenSRPService('practitioner', baseURL);
  await practitionersService[requestType](practitionerValues).catch((_: Error) =>
    sendErrorNotification(langObj.ERROR_OCCURED)
  );

  if (!values.practitioner) history.push(`${URL_USER_CREDENTIALS}/${values.id}`);
  sendSuccessNotification(successMessage);
};

/**
 * Handle form submission
 *
 * @param values - form values
 * @param keycloakBaseURL - keycloak API base URL
 * @param opensrpBaseURL - opensrp api base url
 * @param userGroups - Array of Usergroups to get data from when sending payload of user groups
 * @param langObj - the translations object lookup
 */
export const submitForm = async (
  values: FormFields,
  keycloakBaseURL: string,
  opensrpBaseURL: string,
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
      enabled: true,
    });
    // workaround to get user Id for newly created user immediately after performing a POST
    values = response ? buildUserObject(response, values) : values;
  }

  await createOrEditPractitioners(opensrpBaseURL, values);

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
  history.push(URL_USER);
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
