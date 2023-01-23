import {
  FHIRServiceClass,
  getObjLike,
  parseFhirHumanName,
  loadAllResources,
  getResourcesFromBundle,
  IdentifierUseCodes,
} from '@opensrp/react-utils';
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
import { PRACTITIONER_USER_TYPE_CODE } from '@opensrp/user-management';

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
export const updatePractitionerRoles = async (
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

  const practitionerRolesModifyPromises = [];

  if (toAdd.length > 0) {
    const organizationPayload = {
      reference: `${organizationResourceType}/${orgId}`,
      display: organization.name,
    };

    // get practitioner roles for all new practitioners to be added to organization
    const existingPractitionerRoles = (await loadAllResources(
      baseUrl,
      practitionerRoleResourceType,
      {
        practitioner: toAdd.join(),
      }
    ).then((resp) => getResourcesFromBundle(resp))) as IPractitionerRole[];

    const existingPractitionerRolesPromises = existingPractitionerRoles
      .map((practitionerRole) => ({
        ...practitionerRole,
        organization: organizationPayload,
      }))
      .map((practitionerRole) => {
        return () => serve.update(practitionerRole);
      });

    practitionerRolesModifyPromises.push(...existingPractitionerRolesPromises);

    // create roles if they don't exist
    const arrayOfExistingPractitionerRolesPractitioners = existingPractitionerRoles.map(
      (existingPractitionerRole) => existingPractitionerRole.practitioner?.reference
    );

    const nonExistentPractitionerRoles = toAdd.filter(
      (practitionerId) => !arrayOfExistingPractitionerRolesPractitioners.includes(practitionerId)
    );

    for (const practitionerID of nonExistentPractitionerRoles) {
      const newPractitionerRoleResourceID = v4();
      const practitioner = practitionersById[practitionerID];
      // get secondary identifier (keycloak uuid) from practitioner
      const practitionerSecondaryIdentifier = practitioner.identifier?.find(
        (identifier) => identifier.use === 'secondary'
      );
      const practitionerDisplayName = getObjLike(
        practitioner.name,
        'use',
        HumanNameUseCodes.OFFICIAL,
        true
      )[0];

      const practitionerRole: IPractitionerRole = {
        resourceType: practitionerRoleResourceType,
        id: newPractitionerRoleResourceID,
        identifier: [
          {
            use: IdentifierUseCodes.OFFICIAL,
            value: newPractitionerRoleResourceID,
          },
          ...(practitionerSecondaryIdentifier ? [practitionerSecondaryIdentifier] : []),
        ],
        active: true,
        practitioner: {
          reference: practitionerID,
          display: parseFhirHumanName(practitionerDisplayName),
        },
        organization: organizationPayload,
        code: [
          {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: PRACTITIONER_USER_TYPE_CODE,
                display: 'Assigned practitioner',
              },
            ],
          },
        ],
      };

      practitionerRolesModifyPromises.push(() => serve.update(practitionerRole));
    }
  }

  return Promise.all([...removePromises, ...practitionerRolesModifyPromises].map((p) => p()));
};
