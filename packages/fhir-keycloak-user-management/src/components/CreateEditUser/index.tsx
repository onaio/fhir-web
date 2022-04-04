import {
  ConnectedCreateEditUser as BaseCreateEditUser,
  CreateEditPropTypes,
  URL_USER_CREDENTIALS,
  FormFields,
} from '@opensrp/user-management';
import { practitionerResourceType } from '../../constants';
import {
  FHIRServiceClass,
  getObjLike,
  getResourcesFromBundle,
  IdentifierUseCodes,
} from '@opensrp/react-utils';
import React from 'react';
import { v4 } from 'uuid';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { history } from '@onaio/connected-reducer-registry';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

const getPractitioner = (baseUrl: string, userId: string) => {
  const serve = new FHIRServiceClass<IBundle>(baseUrl, practitionerResourceType);
  return serve
    .list({ identifier: userId })
    .then((res: IBundle) => getResourcesFromBundle<IPractitioner>(res)[0]);
};

const practitionerUpdater = (baseUrl: string) => (values: FormFields, userId: string) => {
  const isEditMode = !!values.practitioner;
  const successMessage = values.practitioner
    ? 'Practitioner updated successfully'
    : 'Practitioner created successfully';

  let officialIdentifier;
  let secondaryIdentifier;
  const currentIdentifiers = (values.practitioner as IPractitioner).identifier;
  if (values.practitioner) {
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

  const payload = {
    resourceType: practitionerResourceType,
    id: values.practitioner ? ((values.practitioner as IPractitioner).id as string) : undefined,
    identifier: [officialIdentifier, secondaryIdentifier],
    active: true,
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

  const serve = new FHIRServiceClass(baseUrl, practitionerResourceType);
  let promise = () => serve.create(payload);
  if (isEditMode) {
    promise = () => serve.update(payload);
  }
  return promise()
    .then(() => {
      sendSuccessNotification(successMessage);
      if (!isEditMode) history.push(`${URL_USER_CREDENTIALS}/${userId}`);
    })
    .catch(() => {
      sendErrorNotification('Failed to update practitioner');
    });
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
    practitionerUpdaterFactory: practitionerUpdater,
  };

  return <BaseCreateEditUser {...baseCompProps} />;
}
