import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { UserGroup } from '../../../ducks/user';
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
 * @param values - form values
 * @param langObj - the language translations object
 */
export const createOrEditPractitioners = async (
  baseURL: string,
  values: FormFields,
  langObj: Lang = lang
) => {
  const practitionersService = new OpenSRPService(PRACTITIONER, baseURL);

  // initialize values for creating a practitioner
  let requestType: 'update' | 'create' = 'create';
  // inherits id, names, and username of tied keycloak user
  let practitionerValues: Practitioner = {
    active: true,
    identifier: v4(),
    name: `${values.firstName} ${values.lastName}`,
    userId: values.id,
    username: values.username,
  };
  let successMessage: string = langObj.PRACTITIONER_CREATED_SUCCESSFULLY;

  // if practitioner exists re-initialize as update practitioner
  // use keycloak values - to update practitioner when base user values change
  if (values.practitioner) {
    requestType = 'update';
    practitionerValues = {
      // if the base keycloak user is disabled, also disable the tied opensrp practitioner
      // otherwise follow the practitioner's activation field
      active: (values.enabled as boolean) === false ? false : (values.active as boolean),
      identifier: values.practitioner.identifier,
      name: `${values.firstName} ${values.lastName}`,
      userId: values.id,
      username: values.username,
    };
    successMessage = langObj.PRACTITIONER_UPDATED_SUCCESSFULLY;
  }

  // update or create new practitioner
  await practitionersService[requestType](practitionerValues)
    .catch((_: Error) => sendErrorNotification(langObj.ERROR_OCCURED))
    .finally(() => sendSuccessNotification(successMessage));

  if (!values.practitioner) history.push(`${URL_USER_CREDENTIALS}/${values.id}`);
};

/**
 * Handle form submission
 *
 * @param values - form values
 * @param keycloakBaseURL - keycloak API base URL
 * @param opensrpBaseURL - opensrp api base url
 * @param userGroups - Array of Usergroups to get data from when sending payload of user groups
 * @param previousUserGroupIds - An array of previously selected user group ids
 * @param langObj - the translations object lookup
 */
export const submitForm = async (
  values: FormFields,
  keycloakBaseURL: string,
  opensrpBaseURL: string,
  userGroups: UserGroup[],
  previousUserGroupIds: string[] | undefined,
  langObj: Lang = lang
): Promise<void> => {
  // isolate keycloak user values (includes attributes if available)
  const { active, userGroup, practitioner, ...keycloakValues } = values;

  // if keycloak user has id, user exists
  if (keycloakValues.id) {
    const serve = new KeycloakService(`${KEYCLOAK_URL_USERS}/${values.id}`, keycloakBaseURL);

    // update keycloak user and practitioner
    Promise.all([
      serve.update(keycloakValues),
      createOrEditPractitioners(opensrpBaseURL, values),
    ]).catch((err) => {
      throw err;
    });
  } else {
    // create new keycloak user
    const serve = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
    const response: Response | undefined = await serve.create({
      ...keycloakValues,
    });

    // get user Id for newly created keycloak user from response headers
    if (response) {
      const UUID = getUserId(response);
      values = { ...values, id: UUID };
    }

    await createOrEditPractitioners(opensrpBaseURL, values);
  }

  // Assign User Group to user
  const promises: Promise<void>[] = [];
  if (values.userGroup) {
    values.userGroup.forEach((groupId) => {
      const userGroupValue = userGroups.find((group) => group.id === groupId) as UserGroup;
      const serve = new KeycloakService(
        `${KEYCLOAK_URL_USERS}/${values.id}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`,
        keycloakBaseURL
      );
      const promise = serve.update(userGroupValue);
      promises.push(promise);
    });
  }

  if (previousUserGroupIds) {
    previousUserGroupIds.forEach((groupId) => {
      if (!values.userGroup?.includes(groupId)) {
        const serve = new KeycloakService(
          `${KEYCLOAK_URL_USERS}/${values.id}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`,
          keycloakBaseURL
        );
        const promise = serve.delete();
        promises.push(promise);
      }
    });
  }

  await Promise.allSettled(promises)
    .catch((_: Error) => sendErrorNotification(langObj.ERROR_OCCURED))
    .finally(() => {
      sendSuccessNotification(langObj.MESSAGE_USER_GROUP_EDITED);
      sendSuccessNotification(langObj.MESSAGE_USER_EDITED);
    });
  if (keycloakValues.id) {
    history.push(URL_USER);
  }
};
