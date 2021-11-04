import { history } from '@onaio/connected-reducer-registry';
import { Dispatch, SetStateAction } from 'react';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { KeycloakUser, UserAction, UserGroup } from '../../../ducks/user';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { v4 } from 'uuid';
import {
  KEYCLOAK_URL_USERS,
  URL_USER,
  KEYCLOAK_URL_REQUIRED_USER_ACTIONS,
  URL_USER_CREDENTIALS,
  KEYCLOAK_URL_USER_GROUPS,
} from '../../../constants';
import lang, { Lang } from '../../../lang';
import { FormFields } from '.';

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
 * @param fhirBaseURL - FHIR API base url
 * @param values - form values
 * @param langObj - the language translations object
 */
export const createOrEditPractitioners = async (
  fhirBaseURL: string,
  values: FormFields & KeycloakUser,
  langObj: Lang = lang
) => {
  // initialize values for creating a practitioner
  let requestType: 'update' | 'create' = 'create';
  let successMessage: string = langObj.PRACTITIONER_CREATED_SUCCESSFULLY;
  // inherits values from tied keycloak user
  let practitionerValues: IPractitioner = {
    resourceType: 'Practitioner',
    id: undefined,
    identifier: [
      {
        use: 'official',
        value: v4(),
      },
      {
        use: 'secondary',
        value: values.id,
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

  // if practitioner exists re-initialize as update practitioner
  // use keycloak values - to update practitioner when base keycloak user values change
  if (values.practitioner) {
    requestType = 'update';
    successMessage = langObj.PRACTITIONER_UPDATED_SUCCESSFULLY;
    practitionerValues = {
      resourceType: 'Practitioner',
      id: values.practitioner.id as string,
      identifier: [
        {
          use: 'official',
          value: values.practitioner.identifier?.[0].value,
        },
        {
          use: 'secondary',
          value: values.practitioner.identifier?.[1].value,
        },
      ],
      // if the base keycloak user is disabled, also disable the tied opensrp practitioner
      // otherwise follow the practitioner's activation field
      active: (values.enabled as boolean) === false ? false : (values.active as boolean),
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
  }

  const fhirServe = new FHIRServiceClass<IPractitioner>(fhirBaseURL, 'Practitioner');
  fhirServe[requestType](practitionerValues)
    .then(() => sendSuccessNotification(successMessage))
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURED));

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
  // isolate keycloak user values (includes attributes if available)
  const { active, userGroup, practitioner, ...keycloakValues } = values;

  // if keycloak user has id, user exists
  if (keycloakValues.id) {
    const serve = new KeycloakService(`${KEYCLOAK_URL_USERS}/${values.id}`, keycloakBaseURL);
    // update keycloak user and practitioner
    Promise.all([
      serve.update(keycloakValues),
      createOrEditPractitioners(fhirBaseURL, values, langObj),
    ]).catch(() => sendErrorNotification(langObj.ERROR_OCCURED));
  } else {
    // create new keycloak user
    const serve = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
    const response: Response | undefined = await serve.create({
      ...keycloakValues,
    });
    // get user Id for newly created keycloak user from response headers
    if (response) {
      const UUID = getUserId(response);
      // inject id to values
      values = { ...values, id: UUID };
    }

    await createOrEditPractitioners(fhirBaseURL, values, langObj);
  }

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

  await Promise.allSettled(promises).catch(() => sendErrorNotification(langObj.ERROR_OCCURED));
  sendSuccessNotification(langObj.MESSAGE_USER_GROUP_EDITED);

  sendSuccessNotification(langObj.MESSAGE_USER_EDITED);
  if (keycloakValues.id) {
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
