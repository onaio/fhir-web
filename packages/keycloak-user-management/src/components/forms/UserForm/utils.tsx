import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { KeycloakService } from '@opensrp-web/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp-web/notifications';
import { KeycloakUser, UserGroup } from '../../../ducks/user';
import {
  KEYCLOAK_URL_USERS,
  URL_USER,
  URL_USER_CREDENTIALS,
  KEYCLOAK_URL_USER_GROUPS,
  PRACTITIONER,
} from '../../../constants';
import { OpenSRPService } from '@opensrp-web/react-utils';
import lang, { Lang } from '../../../lang';
import { FormFields, SelectOption } from './types';
import { Practitioner } from '@opensrp-web/team-management';
import { defaultUserFormInitialValues } from '.';
import { pickBy, some } from 'lodash';
/**
 * Utility function to get new user UUID from POST response location header
 *
 * @param {Response} response - response object from POST request
 * @returns {string} - userId extracted from location header
 */
const getUserId = (response: Response): string => {
  const locationStr = response.headers.get('location')?.split('/') as string[];
  const newUUID = locationStr[locationStr.length - 1];
  return newUUID;
};

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

  if (!isEditMode) history.push(`${URL_USER_CREDENTIALS}/${payload.userId}`);
};

/**
 * util to help create/edit a keycloak user
 *
 * @param keycloakBaseURL -  base url for the keycloak instance
 * @param keycloakUserPayload - the keycloak user payload
 * @param isEditMode - whether editing or creating the keycloak user
 * @param updateGroupsAndPractitionerCallback - function called when user is successfully posted or updated
 * @param langObj - the translation store object
 */
const createEditKeycloakUser = async (
  keycloakBaseURL: string,
  keycloakUserPayload: KeycloakUser,
  isEditMode: boolean,
  updateGroupsAndPractitionerCallback: (id: string) => Promise<void>,
  langObj = lang
) => {
  if (isEditMode) {
    const serve = new KeycloakService(
      `${KEYCLOAK_URL_USERS}/${keycloakUserPayload.id}`,
      keycloakBaseURL
    );
    return serve
      .update(keycloakUserPayload)
      .then(() => {
        sendSuccessNotification(langObj.MESSAGE_USER_EDITED);
        updateGroupsAndPractitionerCallback(keycloakUserPayload.id).catch(() =>
          sendErrorNotification(langObj.ERROR_OCCURED)
        );
      })
      .catch((error) => {
        throw error;
      });
  } else {
    // create new keycloak user
    const serve = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
    return serve
      .create(keycloakUserPayload)
      .then((res) => {
        sendSuccessNotification(langObj.MESSAGE_USER_CREATED);
        const keycloakUserId = getUserId(res);
        updateGroupsAndPractitionerCallback(keycloakUserId).catch(() =>
          sendErrorNotification(langObj.ERROR_OCCURED)
        );
      })
      .catch((error) => {
        throw error;
      });
  }
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

  /**
   * callback to update groups and practitioners upon successfully updating keycloak user
   *
   * @param keycloakUserId - id of the keycloak user
   */
  const updateGroupsAndPractitioner = async (keycloakUserId: string) => {
    const promises: Promise<void>[] = [];

    const practitionerPayload = { ...practitionerValue, userId: keycloakUserId };
    promises.push(
      createOrEditPractitioners(opensrpBaseURL, practitionerPayload, practitionerIsEditMode)
    );

    // Assign User Group to user
    if (values.userGroups) {
      values.userGroups.forEach((groupId) => {
        const userGroupValue = allUserGroups.find((group) => group.id === groupId) as UserGroup;
        const serve = new KeycloakService(
          `${KEYCLOAK_URL_USERS}/${keycloakUserId}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`,
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
            `${KEYCLOAK_URL_USERS}/${keycloakUserId}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`,
            keycloakBaseURL
          );
          const promise = serve.delete();
          promises.push(promise);
        }
      });
    }

    return await Promise.allSettled(promises)
      .catch((error) => {
        throw error;
      })
      .then(() => {
        sendSuccessNotification(langObj.MESSAGE_USER_GROUP_EDITED);
      });
  };

  await createEditKeycloakUser(
    keycloakBaseURL,
    keycloakUser,
    isEditMode,
    updateGroupsAndPractitioner
  ).catch(() => {
    sendErrorNotification(langObj.ERROR_OCCURED);
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
    id: isEditMode ? id : '', // id is generated by keycloak for after POST new user
    lastName,
    username,
    ...(email ? { email } : {}),
    enabled,
    ...(some(cleanedAttributes) ? { attributes: cleanedAttributes } : {}),
  };

  // initialize for new practitioner
  const practitionerId = v4();
  let practitioner = {
    active: true,
    identifier: practitionerId,
    name: `${firstName} ${lastName}`,
    userId: '', // need to override this with the new keycloak users' id
    username,
  };

  // if the base keycloak user is disabled, also disable the tied opensrp practitioner
  // otherwise follow the practitioner's activation field
  const practitionerActive = enabled === false ? false : active === undefined ? false : active;
  if (values.practitioner?.identifier) {
    practitioner = {
      ...values.practitioner,
      active: practitionerActive,
      name: `${firstName} ${lastName}`,
      userId: id,
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

/**
 * converts userGroups to options that can be passed to antd Select
 *
 * @param userGroups - the userGroups in an array
 */
export const getUserGroupsOptions = (userGroups: UserGroup[]): SelectOption[] =>
  userGroups.map((userGroup) => {
    return { value: userGroup.id, label: userGroup.name };
  });

/**
 * filters options listed once user types in userGroups select
 *
 * @param inputValue - the search text,
 * @param option - one of the options
 */
export const userGroupOptionsFilter = (inputValue: string, option?: SelectOption) => {
  return !!option?.label.toLowerCase().includes(inputValue.toLowerCase());
};
