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
  SUPERVISOR,
  PRACTITIONER_USER_TYPE_CODE,
  SUPERVISOR_USER_TYPE_CODE,
} from '../../../constants';
import { OpenSRPService } from '@opensrp/react-utils';
import { FormFields, PractitionerUpdaterFun, SelectOption } from './types';
import { Practitioner } from '@opensrp/team-management';
import { defaultUserFormInitialValues } from '.';
import { pickBy, some } from 'lodash';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import type { TFunction } from '@opensrp/i18n';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';

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
 * @param t - translator function
 */
export const createOrEditPractitioners = async (
  baseURL: string,
  payload: Practitioner,
  isEditMode = false,
  t: TFunction
) => {
  const practitionersService = new OpenSRPService(PRACTITIONER, baseURL);

  // initialize values for creating a practitioner
  let requestType: 'update' | 'create' = 'create';

  let successMessage: string = t('Practitioner created successfully');

  // if practitioner exists re-initialize as update practitioner
  if (isEditMode) {
    requestType = 'update';
    successMessage = t('Practitioner updated successfully');
  }

  // update or create new practitioner
  await practitionersService[requestType](payload)
    .catch((_: Error) => sendErrorNotification(t('An error occurred')))
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
 * @param t - translator function
 */
const createEditKeycloakUser = async (
  keycloakBaseURL: string,
  keycloakUserPayload: KeycloakUser,
  isEditMode: boolean,
  updateGroupsAndPractitionerCallback: (id: string) => Promise<void>,
  t: TFunction
) => {
  if (isEditMode) {
    const serve = new KeycloakService(
      `${KEYCLOAK_URL_USERS}/${keycloakUserPayload.id}`,
      keycloakBaseURL
    );
    return serve
      .update(keycloakUserPayload)
      .then(() => {
        sendSuccessNotification(t('User edited successfully'));
        updateGroupsAndPractitionerCallback(keycloakUserPayload.id).catch(() =>
          sendErrorNotification(t('An error occurred'))
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
        sendSuccessNotification(t('User created successfully'));
        const keycloakUserId = getUserId(res);
        updateGroupsAndPractitionerCallback(keycloakUserId).catch(() =>
          sendErrorNotification(t('An error occurred'))
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
 * @param allUserGroups - Array of Usergroups to get data from when sending payload of user groups
 * @param previousUserGroupIds - An array of previously selected user group ids
 * @param practitionerUpdater - async function that updates practitioner records
 * @param t - translator function
 */
export const submitForm = async (
  values: FormFields,
  keycloakBaseURL: string,
  allUserGroups: UserGroup[],
  previousUserGroupIds: string[] | undefined,
  practitionerUpdater: PractitionerUpdaterFun,
  t: TFunction
): Promise<void> => {
  const { isEditMode, keycloakUser } = getUserAndGroupsPayload(values);

  /**
   * callback to update groups and practitioners upon successfully updating keycloak user
   *
   * @param keycloakUserId - id of the keycloak user
   */
  const updateGroupsAndPractitioner = async (keycloakUserId: string) => {
    const promises: Promise<void>[] = [];

    promises.push(practitionerUpdater(values, keycloakUserId, t));

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
        sendSuccessNotification(t('User Group edited successfully'));
      });
  };

  await createEditKeycloakUser(
    keycloakBaseURL,
    keycloakUser,
    isEditMode,
    updateGroupsAndPractitioner,
    t
  ).catch(() => {
    sendErrorNotification(t('An error occurred'));
  });

  if (isEditMode) {
    history.push(URL_USER);
  }
};

// get the code of a practitioner resource type
// to be used to determine the resource type
// i.e if it's a practitioner or a supervisor resource type
export const getUserTypeCode = (role: IPractitionerRole) =>
  role.code?.find((code) => code.coding)?.coding?.find((coding) => coding.code)?.code;

// get user type from user type code
export const getUserType = (
  userTypeCode: typeof PRACTITIONER_USER_TYPE_CODE | typeof SUPERVISOR_USER_TYPE_CODE
) => {
  switch (userTypeCode) {
    case PRACTITIONER_USER_TYPE_CODE:
      return PRACTITIONER;
    case SUPERVISOR_USER_TYPE_CODE:
      return SUPERVISOR;
  }
};

/**
 * abstraction to derive formValues from keycloak user and optional associated practitioner
 *
 * @param keycloakUser - the keycloak user to be edited, undefined if creating user
 * @param practitioner - the associated practitioner
 * @param userGroups -  user groups assigned to this user
 * @param practitionerRole -  user practitioner role assigned to this user
 */
export const getFormValues = (
  keycloakUser?: KeycloakUser,
  practitioner?: Practitioner | IPractitioner,
  userGroups?: UserGroup[],
  practitionerRole?: IPractitionerRole
): FormFields => {
  if (!keycloakUser) {
    // this should mean we are in create mode
    return defaultUserFormInitialValues;
  }
  const { id, username, firstName, lastName, email, enabled } = keycloakUser;
  const { contact: contacts } = keycloakUser.attributes ?? {};
  const { active } = practitioner ?? {};

  let userType: FormFields['userType'] = 'practitioner';

  if (practitionerRole) {
    // getting the user type to default to when editing a user
    // by comparing practitioner resource user type codes
    // this is probably not the best way because these codes are constants
    // but it's the best for now
    const userTypeCode = getUserTypeCode(practitionerRole);
    if (userTypeCode) {
      userType = getUserType(userTypeCode as '405623001' | '236321002');
    }
  }

  return {
    id,
    firstName,
    lastName,
    email,
    username,
    enabled,
    contact: contacts?.[0],
    active,
    userType,
    practitioner,
    userGroups: userGroups?.map((tag) => tag.id),
    keycloakUser,
    practitionerRole,
  };
};

/**
 * convert form fields values to objects that can be sent to api
 * creates the keycloakUser, practitioner, userGroups
 *
 * @param values - the form's values
 */
export const getUserAndGroupsPayload = (values: FormFields) => {
  const isEditMode = !!values.id;
  // possibility of creating a practitioner for an existing user if one was not created before

  const { id, username, firstName, lastName, email, enabled, contact } = values;
  const preUserAttributes = {
    ...(contact ? { contact: [contact] } : {}),
  };

  const cleanedAttributes = pickBy(
    preUserAttributes,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  return {
    isEditMode,
    keycloakUser,
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

export const postPutPractitioner =
  (baseUrl: string) => (values: FormFields, userId: string, t: TFunction) => {
    const { id, username, firstName, lastName, enabled, active } = values;
    // initialize for new practitioner
    const practitionerId = v4();
    let practitioner: Practitioner = {
      active: true,
      identifier: practitionerId,
      name: `${firstName} ${lastName}`,
      userId,
      username,
    };

    // if the base keycloak user is disabled, also disable the tied opensrp practitioner
    // otherwise follow the practitioner's activation field
    const practitionerActive = enabled === false ? false : active === undefined ? false : active;
    const practObj = values.practitioner as Practitioner | undefined;
    if (practObj?.identifier) {
      practitioner = {
        ...practObj,
        active: practitionerActive,
        name: `${firstName} ${lastName}`,
        userId: id,
        username,
      };
    }

    const practitionerIsEditMode = !!values.practitioner?.identifier;

    return createOrEditPractitioners(baseUrl, practitioner, practitionerIsEditMode, t);
  };
