import {
  ConnectedCreateEditUser as BaseCreateEditUser,
  CreateEditPropTypes,
  URL_USER_CREDENTIALS,
  FormFields,
  PRACTITIONER_USER_TYPE_CODE,
  SUPERVISOR_USER_TYPE_CODE,
} from '@opensrp/user-management';
import {
  practitionerResourceType,
  groupResourceType,
  practitionerRoleResourceType,
} from '../../constants';
import {
  FHIRServiceClass,
  getObjLike,
  getResourcesFromBundle,
  IdentifierUseCodes,
  parseFhirHumanName,
} from '@opensrp/react-utils';
import React from 'react';
import { v4 } from 'uuid';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { history } from '@onaio/connected-reducer-registry';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { TFunction } from 'i18n/dist/types';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { HumanName } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/humanName';
import { HumanNameUseCodes } from '@opensrp/fhir-team-management';

export const getPractitioner = (baseUrl: string, userId: string) => {
  const serve = new FHIRServiceClass<IBundle>(baseUrl, practitionerResourceType);
  return serve
    .list({ identifier: userId })
    .then((res: IBundle) => getResourcesFromBundle<IPractitioner>(res)[0]);
};

export const getGroup = (baseUrl: string, userId: string) => {
  const serve = new FHIRServiceClass<IBundle>(baseUrl, groupResourceType);
  return serve
    .list({ identifier: userId })
    .then((res: IBundle) => getResourcesFromBundle<IGroup>(res)[0]);
};

export const getPractitionerRole = (baseUrl: string, userId: string) => {
  const serve = new FHIRServiceClass<IBundle>(baseUrl, practitionerRoleResourceType);
  return serve
    .list({ identifier: userId })
    .then((res: IBundle) => getResourcesFromBundle<IPractitionerRole>(res)[0]);
};

export const createEditGroupResource = (
  keycloakUserEnabled: boolean,
  keycloakID: string,
  keycloakUserName: string,
  practitionerID: string,
  baseUrl: string,
  existingGroupID?: string
) => {
  const newGroupResourceID = v4();

  const payload: IGroup = {
    resourceType: groupResourceType,
    id: existingGroupID ?? newGroupResourceID,
    identifier: [
      { use: IdentifierUseCodes.OFFICIAL, value: existingGroupID ?? newGroupResourceID },
      { use: IdentifierUseCodes.SECONDARY, value: keycloakID },
    ],
    active: keycloakUserEnabled,
    type: 'practitioner',
    actual: true,
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: PRACTITIONER_USER_TYPE_CODE,
          display: 'Assigned practitioner',
        },
      ],
    },
    name: keycloakUserName,
    member: [
      {
        entity: {
          reference: `Practitioner/${practitionerID}`,
        },
      },
    ],
  };

  const serve = new FHIRServiceClass<IGroup>(baseUrl, groupResourceType);
  return (
    serve
      // use update (PUT) for both creating and updating group resource
      // because create (POST) does not honour a supplied resource id
      // and overrides with a server provided one instead
      .update(payload)
  );
};

export const createEditPractitionerRoleResource = (
  userType: FormFields['userType'],
  keycloakID: string,
  keycloakUserEnabled: boolean,
  practitionerID: string,
  practitionerName: HumanName[],
  baseUrl: string,
  existingPractitionerRoleID?: string
) => {
  const newPractitionerRoleResourceID = v4();

  let practitionerRoleResourceCode: IPractitionerRole['code'] = [
    {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: PRACTITIONER_USER_TYPE_CODE,
          display: 'Assigned practitioner',
        },
      ],
    },
  ];

  if (userType === 'supervisor') {
    practitionerRoleResourceCode = [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: SUPERVISOR_USER_TYPE_CODE,
            display: 'Supervisor (occupation)',
          },
        ],
      },
    ];
  }

  const practitionerDisplayName = getObjLike(
    practitionerName,
    'use',
    HumanNameUseCodes.OFFICIAL,
    true
  )[0];

  const payload: IPractitionerRole = {
    resourceType: practitionerRoleResourceType,
    id: existingPractitionerRoleID ?? newPractitionerRoleResourceID,
    identifier: [
      {
        use: IdentifierUseCodes.OFFICIAL,
        value: existingPractitionerRoleID ?? newPractitionerRoleResourceID,
      },
      { use: IdentifierUseCodes.SECONDARY, value: keycloakID },
    ],
    active: keycloakUserEnabled,
    practitioner: {
      reference: `Practitioner/${practitionerID}`,
      display: parseFhirHumanName(practitionerDisplayName),
    },
    code: practitionerRoleResourceCode,
  };

  const serve = new FHIRServiceClass<IPractitionerRole>(baseUrl, practitionerRoleResourceType);
  return (
    serve
      // use update (PUT) for both creating and updating practitioner resource
      // because create (POST) does not honour a supplied resource id
      // and overrides with a server provided one instead
      .update(payload)
  );
};

export const practitionerUpdater =
  (baseUrl: string) =>
  async (values: FormFields, userId: string, t: TFunction = (str) => str) => {
    const isEditMode = !!values.practitioner;

    let group: IGroup | undefined;
    if (isEditMode) {
      group = await getGroup(baseUrl, userId);
    }

    const practitionerSuccessMessage = isEditMode
      ? t('Practitioner updated successfully')
      : t('Practitioner created successfully');

    const practitionerErrorMessage = isEditMode
      ? t('Failed to update practitioner')
      : t('Failed to create practitioner');

    const groupSuccessMessage = group
      ? t('Group resource updated successfully')
      : t('Group resource created successfully');

    const groupErrorMessage = group
      ? t('Failed to update group resource')
      : t('Failed to create group resource');

    const practitionerRoleSuccessMessage = isEditMode
      ? t('PractitionerRole updated successfully')
      : t('PractitionerRole created successfully');

    const practitionerRoleErrorMessage = isEditMode
      ? t('Failed to update practitionerRole')
      : t('Failed to create practitionerRole');

    let officialIdentifier;
    let secondaryIdentifier;
    if (values.practitioner) {
      const currentIdentifiers = (values.practitioner as IPractitioner).identifier;
      officialIdentifier = getObjLike(currentIdentifiers, 'use', IdentifierUseCodes.OFFICIAL)[0];
      secondaryIdentifier = getObjLike(currentIdentifiers, 'use', IdentifierUseCodes.SECONDARY)[0];
    }

    if (!officialIdentifier) {
      officialIdentifier = {
        use: IdentifierUseCodes.OFFICIAL,
        value: v4(),
      };
    }

    if (!secondaryIdentifier) {
      secondaryIdentifier = {
        use: IdentifierUseCodes.SECONDARY,
        value: userId,
      };
    }

    const payload: IPractitioner = {
      resourceType: practitionerResourceType,
      id: officialIdentifier.value,
      identifier: [officialIdentifier, secondaryIdentifier],
      active: values.enabled ?? false,
      name: [
        {
          use: IdentifierUseCodes.OFFICIAL,
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

    const serve = new FHIRServiceClass<IPractitioner>(baseUrl, practitionerResourceType);
    return (
      serve
        // use update (PUT) for both creating and updating practitioner resource
        // because create (POST) does not honour a supplied resource id
        // and overrides with a server provided one instead
        .update(payload)
        .then((res) => {
          sendSuccessNotification(practitionerSuccessMessage);
          return res;
        })
        .then((res) => {
          const practitionerID =
            res.identifier?.find((identifier) => identifier.use === 'official')?.value ??
            payload.id;

          createEditGroupResource(
            values.enabled ?? false,
            userId,
            `${values.firstName} ${values.lastName}`,
            practitionerID ?? '',
            baseUrl,
            group?.id
          )
            .then(() => sendSuccessNotification(groupSuccessMessage))
            .catch(() => sendErrorNotification(groupErrorMessage));

          createEditPractitionerRoleResource(
            values.userType,
            userId,
            values.enabled ?? false,
            practitionerID ?? '',
            res.name ?? [],
            baseUrl,
            values.practitionerRole?.id
          )
            .then(() => sendSuccessNotification(practitionerRoleSuccessMessage))
            .catch(() => sendErrorNotification(practitionerRoleErrorMessage));
        })
        .catch(() => sendErrorNotification(practitionerErrorMessage))
        .finally(() => {
          if (!isEditMode) {
            history.push(`${URL_USER_CREDENTIALS}/${userId}/${values.username}`);
          }
        })
    );
  };

/**
 *  Create users and Fhir practitioners
 *
 * @param props - component props
 */
export function CreateEditUser(props: CreateEditPropTypes) {
  const baseCompProps = {
    ...props,
    getPractitionerFun: getPractitioner,
    getPractitionerRoleFun: getPractitionerRole,
    postPutPractitionerFactory: practitionerUpdater,
  };

  return <BaseCreateEditUser {...baseCompProps} />;
}
