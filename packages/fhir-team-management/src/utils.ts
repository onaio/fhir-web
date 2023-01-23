import { FHIRServiceClass, getObjLike, parseFhirHumanName } from '@opensrp/react-utils';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { keyBy, transform } from 'lodash';
import {
  HumanNameUseCodes,
  organizationResourceType,
  practitionerResourceType,
  practitionerRoleResourceType,
} from './constants';
import { v4 } from 'uuid';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { OrganizationFormFields } from './components/AddEditOrganization/utils';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';

/**
 * either posts or puts an organization payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the organization payload
 */
export const postPutOrganization = (baseUrl: string, payload: IOrganization) => {
  const serve = new FHIRServiceClass<IOrganization>(baseUrl, organizationResourceType);
  return serve.update(payload);
};

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * filter practitioners select on search
 *
 * @param inputValue search term
 * @param option select option to filter against
 */
export const practitionersFilterFunction = (inputValue: string, option?: SelectOption) => {
  return !!option?.label.toLowerCase().includes(inputValue.toLowerCase());
};

const arrKeyBy = (arr: string[]) =>
  transform(
    arr,
    (acc, value) => {
      acc[value] = value;
    },
    {} as Record<string, string>
  );

/**
 * Updates practitioner roles after organization creation
 *
 * @param baseUrl - the server base url
 * @param values - form field values
 * @param initialValues - initial form field values
 * @param organization -  all organizations
 * @param practitioners - all practitioners
 * @param existingRoles - all existing practitioner assignments to organizations
 */
export const updatePractitionerRoles = (
  baseUrl: string,
  values: OrganizationFormFields,
  initialValues: OrganizationFormFields,
  organization: IOrganization,
  practitioners: IPractitioner[],
  existingRoles: IPractitionerRole[]
) => {
  // send delete operations for entries no longer in values but were in initial
  // create wholly new practitioner entries in values that were not in initial

  const { id: orgId } = organization;
  const members = values.members ?? [];
  const initialMembers = initialValues.members ?? [];
  const membersById = arrKeyBy(members);
  const initialMembersById = arrKeyBy(initialMembers);
  const practitionersById = keyBy(
    practitioners,
    (practitioner) => `${practitionerResourceType}/${practitioner.id}`
  );

  const toAdd: string[] = [];
  const toRemove: string[] = [];

  members.forEach((id) => {
    if (!initialMembersById[id]) {
      toAdd.push(id);
    }
  });

  initialMembers.forEach((id) => {
    if (!membersById[id]) {
      toRemove.push(id);
    }
  });

  const existingRolesByOrgPractIds = transform(
    existingRoles,
    (acc, value) => {
      const orgReference = value.organization?.reference as string;
      if (!(acc[orgReference] as Reference | undefined)) {
        acc[orgReference] = {};
      }
      acc[orgReference][value.practitioner?.reference as string] = value;
    },
    {} as Record<string, Record<string, IPractitionerRole>>
  );

  const serve = new FHIRServiceClass<IPractitionerRole>(baseUrl, practitionerRoleResourceType);

  const removePromises = toRemove.map((practId) => {
    const organizationId = orgId as string;
    const role =
      existingRolesByOrgPractIds[`${organizationResourceType}/${organizationId}`][practId];
    // remove organization assignment from role
    const { organization, ...rest } = role;
    return () => serve.update(rest);
  });

  // TODO - possibility of posting this as a bundle in a single api call
  const additionPromises = toAdd
    .map((practId) => {
      const practitioner = practitionersById[practId];
      const name = getObjLike(practitioner.name, 'use', HumanNameUseCodes.OFFICIAL, true)[0];
      const practitionerRole: IPractitionerRole = {
        resourceType: practitionerRoleResourceType,
        active: true,
        id: v4(),
        organization: {
          reference: `${organizationResourceType}/${orgId}`,
          display: organization.name,
        },
        practitioner: {
          reference: practId,
          display: parseFhirHumanName(name),
        },
        identifier: [
          {
            use: 'official',
            value: v4(),
          },
        ],
      };
      return practitionerRole;
    })
    .map((practRole) => {
      return () => serve.update(practRole);
    });

  return Promise.all([...removePromises, ...additionPromises].map((p) => p()));
};
