import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { KeycloakUser, UserGroup } from '../../../ducks/user';
import {
  KEYCLOAK_URL_USERS,
  URL_USER,
  URL_USER_CREDENTIALS,
  KEYCLOAK_URL_USER_GROUPS,
  PRACTITIONER,
} from '../../../constants';
import { OpenSRPService } from '@opensrp/react-utils';
import lang, { Lang } from '../../../lang';
import { FormFields } from './types';
import { Practitioner } from '@opensrp/team-management';
import { defaultUserFormInitialValues } from '.';
import { pickBy, some } from 'lodash';

/**
 * @param baseURL - opensrp API base URL
 * @param payload - the practitioner payload
 * @param isEditMode - whether we are creating or editing user.
 * @param langObj - the language translations object
 */
export const createOrEditPractitioners = async (
  baseURL: string,
  payload: Practitioner,
  isEditMode = false,
  langObj: Lang = lang
) => {
  const practitionersService = new OpenSRPService(PRACTITIONER, baseURL);

  // initialize values for creating a practitioner
  let requestType: 'update' | 'create' = 'create';

  let successMessage: string = langObj.PRACTITIONER_CREATED_SUCCESSFULLY;

  // if practitioner exists re-initialize as update practitioner
  if (isEditMode) {
    requestType = 'update';
    successMessage = langObj.PRACTITIONER_UPDATED_SUCCESSFULLY;
  }

  // update or create new practitioner
  await practitionersService[requestType](payload)
    .catch((_: Error) => sendErrorNotification(langObj.ERROR_OCCURED))
    .then(() => sendSuccessNotification(successMessage));

  if (!isEditMode) history.push(`${URL_USER_CREDENTIALS}/${payload.identifier}`);
};

/**
 * Handle form submission
 *
 * @param values - form values
 * @param keycloakBaseURL - keycloak API base URL
 * @param opensrpBaseURL - opensrp api base url
 * @param allUserGroups - Array of Usergroups to get data from when sending payload of user groups
 * @param previousUserGroupIds - An array of previously selected user group ids
 * @param langObj - the translations object lookup
 */
export const submitForm = async (
  values: FormFields,
  keycloakBaseURL: string,
  opensrpBaseURL: string,
  allUserGroups: UserGroup[],
  previousUserGroupIds: string[] | undefined,
  langObj: Lang = lang
): Promise<void> => {
  const {
    isEditMode,
    keycloakUser,
    practitioner: practitionerValue,
    practitionerIsEditMode,
  } = getUserFormPayload(values);

  let keycloakUserPromise: Promise<string | void>;

  if (isEditMode) {
    const serve = new KeycloakService(`${KEYCLOAK_URL_USERS}/${values.id}`, keycloakBaseURL);
    keycloakUserPromise = serve
      .update(keycloakUser)
      .then(() => sendSuccessNotification(langObj.MESSAGE_USER_EDITED))
      .catch(() => langObj.AN_ERROR_OCCURRED);
  } else {
    // create new keycloak user
    const serve = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
    keycloakUserPromise = serve
      .create(keycloakUser)
      .then(() => sendSuccessNotification(langObj.MESSAGE_USER_CREATED))
      .catch(() => langObj.AN_ERROR_OCCURRED);
  }

  Promise.all([
    keycloakUserPromise,
    createOrEditPractitioners(opensrpBaseURL, practitionerValue, practitionerIsEditMode),
  ]).catch(() => sendErrorNotification(langObj.ERROR_OCCURED));

  // Assign User Group to user
  const promises: Promise<void>[] = [];
  if (values.userGroups) {
    values.userGroups.forEach((groupId) => {
      const userGroupValue = allUserGroups.find((group) => group.id === groupId) as UserGroup;
      const serve = new KeycloakService(
        `${KEYCLOAK_URL_USERS}/${keycloakUser.id}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`,
        keycloakBaseURL
      );
      const promise = serve.update(userGroupValue);
      promises.push(promise);
    });
  }

  if (previousUserGroupIds) {
    previousUserGroupIds.forEach((groupId) => {
      if (!values.userGroups?.includes(groupId)) {
        const serve = new KeycloakService(
          `${KEYCLOAK_URL_USERS}/${keycloakUser.id}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`,
          keycloakBaseURL
        );
        const promise = serve.delete();
        promises.push(promise);
      }
    });
  }

  await Promise.allSettled(promises)
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURED))
    .then(() => {
      sendSuccessNotification(langObj.MESSAGE_USER_GROUP_EDITED);
    });
  if (isEditMode) {
    history.push(URL_USER);
  }
};

/**
 * abstraction to derive formValues from keycloak user and optional associated practitioner
 *
 * @param keycloakUser - the keycloak user to be edited, undefined if creating user
 * @param practitioner - the associated practitioner
 * @param userGroups -  user groups assigned to this user
 */
export const getFormValues = (
  keycloakUser?: KeycloakUser,
  practitioner?: Practitioner,
  userGroups?: UserGroup[]
): FormFields => {
  if (!keycloakUser) {
    // this should mean we are in create mode
    return defaultUserFormInitialValues;
  }
  const { id, username, firstName, lastName, email, enabled } = keycloakUser;
  const { contact: contacts } = keycloakUser.attributes ?? {};
  const { active } = practitioner ?? {};
  return {
    id,
    firstName,
    lastName,
    email,
    username,
    enabled,
    contact: contacts?.[0],
    active,
    practitioner,
    userGroups: userGroups?.map((tag) => tag.id),
    keycloakUser,
  };
};

/**
 * convert form fields values to objects that can be sent to api
 * creates the keycloakUser, practitioner, userGroups
 *
 * @param values - the form's values
 */
export const getUserFormPayload = (values: FormFields) => {
  const isEditMode = !!values.id;
  // possibility of creating a practitioner for an existing user if one was not created before
  const practitionerIsEditMode = !!values.practitioner?.identifier;

  const { id, username, firstName, lastName, email, enabled, contact, active } = values;
  const preUserAttributes = {
    ...(contact ? { contact: [contact] } : {}),
  };

  const cleanedAttributes = pickBy(
    preUserAttributes,
    (value) => value !== undefined && value !== null
  );

  const keycloakUser = {
    ...(values.keycloakUser ?? {}),
    firstName,
    id: isEditMode ? id : v4(),
    lastName,
    username,
    ...(email ? { email } : {}),
    enabled,
    ...(some(cleanedAttributes) ? { attributes: cleanedAttributes } : {}),
  };

  // if the base keycloak user is disabled, also disable the tied opensrp practitioner
  // otherwise follow the practitioner's activation field
  const practitionerActive = enabled === false ? false : active ?? false;
  let practitioner = {
    active: practitionerActive,
    identifier: v4(),
    name: `${firstName} ${lastName}`,
    userId: keycloakUser.id,
    username,
  };
  if (values.practitioner?.identifier) {
    practitioner = {
      ...values.practitioner,
      active: practitionerActive,
      name: `${firstName} ${lastName}`,
      userId: keycloakUser.id,
      username,
    };
  }

  return {
    practitionerIsEditMode,
    isEditMode,
    keycloakUser,
    practitioner,
    userGroups: values.userGroups ?? [],
  };
};
