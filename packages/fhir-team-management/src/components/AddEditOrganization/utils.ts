import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import {
  HumanNameUseCodes,
  organizationResourceType,
  organizationTypeValueSetUrl,
  OrganizationTypeVS,
  practitionerResourceType,
} from '../../constants';
import { getObjLike, parseFhirHumanName, IdentifierUseCodes } from '@opensrp/react-utils';
import { flatten, groupBy } from 'lodash';
import { Rule } from 'rc-field-form/lib/interface';
import { v4 } from 'uuid';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import type { TFunction } from '@opensrp/i18n';
import { PractToOrgAssignmentStrategy } from '@opensrp/pkg-config';
import { IOrganizationAffiliation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganizationAffiliation';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';

export interface OrganizationFormFields {
  id?: string;
  identifier?: string;
  active?: boolean;
  name?: string;
  alias?: string;
  type?: string;
  members?: string[];
}

/**
 * factory for validation rules for OrganizationForm component
 *
 * @param t - translator functioin
 */
export const validationRulesFactory = (t: TFunction) => ({
  id: [{ type: 'string' }] as Rule[],
  identifier: [{ type: 'string' }] as Rule[],
  name: [
    { type: 'string', message: t('Must be a valid string') },
    { required: true, message: t('Required') },
  ] as Rule[],
  alias: [{ type: 'string', message: t('Must be a valid string') }, { required: false }] as Rule[],
  status: [{ type: 'boolean' }, { required: true, message: t('Required') }] as Rule[],
  type: [
    {
      type: 'string',
    },
    {
      required: false,
    },
  ] as Rule[],
  members: [{ type: 'array' }, { required: false }] as Rule[],
});

/**
 * Converts organization resource to initial values
 *
 * @param org - the organization resource
 * @param assignedPractitioners - practitioner roles for assigned practitioners
 */
export const getOrgFormFields = (
  org?: IOrganization,
  assignedPractitioners: IPractitionerRole[] = []
): OrganizationFormFields => {
  if (!org) {
    return { type: 'team', active: true };
  }
  const { id, name, alias, active, identifier, type } = org;

  // collect all codings in codeableconcepts for organization.type
  const allTypeCodings = flatten(
    (type ?? []).map((codeConcept) => Object.values(codeConcept.coding ?? {}))
  );

  // collect just codings fo the organizationTypeValueSet system
  const valueSetCodings = getObjLike(
    allTypeCodings,
    'system',
    organizationTypeValueSetUrl,
    true
  ) as Coding[];

  const identifierObj = getObjLike(identifier, 'use', IdentifierUseCodes.OFFICIAL) as Identifier[];
  const formFields = {
    id,
    identifier: identifierObj[0]?.value,
    active,
    name,
    alias: alias?.[0],
    type: valueSetCodings[0]?.code,
    members: assignedPractitioners.map((pract) => pract.practitioner?.reference as string),
  };
  return formFields;
};

/**
 * Regenerates org payload from form values
 *
 * @param values - form values
 */
export const generateOrgPayload = (values: OrganizationFormFields): IOrganization => {
  const { id, identifier: rawIdentifier, active, name, alias: rawAlias, type } = values;
  const payload: IOrganization = {
    resourceType: organizationResourceType,
    active: !!active,
    name,
    id,
  };

  let identifier = rawIdentifier;
  if (!rawIdentifier) {
    identifier = v4();
  }
  payload.identifier = [
    {
      value: identifier,
      use: IdentifierUseCodes.OFFICIAL,
    },
  ];

  if (rawAlias) {
    payload.alias = [rawAlias];
  }

  if (type) {
    payload.type = [
      {
        coding: [
          {
            code: type,
            system: OrganizationTypeVS.system,
          },
        ],
      },
    ];
  }

  if (id === undefined) {
    payload.id = v4();
  }

  return payload;
};

/** create organization's type select options */
export const getOrgTypeSelectOptions = () => {
  const { system, codings } = OrganizationTypeVS;
  return codings.map((coding) => {
    return {
      label: coding.display,
      value: coding.code,
      system,
    };
  });
};

/**
 * map practitioner roles to select options
 *
 * @param roles - practitioner roles representing assigned practitioners
 */
export const getAssignedPractsOptions = (roles: IPractitionerRole[]) => {
  return roles.map((role) => {
    const { practitioner } = role;
    return {
      label: practitioner?.display,
      value: practitioner?.reference as string,
    };
  });
};

/**
 * map practitioner to select options
 *
 * @param practitioners - map of practitioners
 * @param existingPractitionerRoles - practitioner Roles that reference organizatio, [] when creating an organization
 * @param allPractitionerRoles - all practitioner roles resources
 * @param assignmentStrategy - strategy to use when generating options to assign
 */
export const getPractitionerOptions = (
  practitioners: IPractitioner[],
  existingPractitionerRoles: IPractitionerRole[],
  allPractitionerRoles: IPractitionerRole[],
  assignmentStrategy?: PractToOrgAssignmentStrategy
) => {
  let allowedPractitioners = practitioners;
  const rolesWithOrganizations = allPractitionerRoles.filter(
    (practRole) => practRole.organization?.reference
  );
  // group allPractitionerRoles by practitioner references
  const rolesByPractReference = groupBy(rolesWithOrganizations, 'practitioner.reference');

  if (assignmentStrategy && assignmentStrategy === PractToOrgAssignmentStrategy.ONE_TO_ONE) {
    allowedPractitioners = allowedPractitioners.filter((pract) => {
      const practReference = `${pract.resourceType}/${pract.id}`;
      return !rolesByPractReference[practReference] as boolean;
    });
  }
  const newPractitionerOptions = allowedPractitioners.map((pract) => {
    const nameObj = getObjLike(pract.name, 'use', HumanNameUseCodes.OFFICIAL)[0];
    const value = `${practitionerResourceType}/${pract.id}`;
    const label = parseFhirHumanName(nameObj);
    return {
      value,
      label: label ?? value,
    };
  });
  const existingPractitionerOptions = existingPractitionerRoles.map((role) => {
    const value = role.practitioner?.reference as string;
    const label = role.practitioner?.display;
    return {
      value,
      label: label ?? value,
    };
  });
  return [...newPractitionerOptions, ...existingPractitionerOptions];
};

/**
 * Find locations assigned to a particular organization
 *
 * @param orgAffiliations - Affiliations
 * @param id - Id of the affiliated organization
 */
export const FindAssignedLocations = (
  orgAffiliations: IOrganizationAffiliation[],
  id: string | undefined
) => {
  const locations: Reference[] = [];

  orgAffiliations.forEach((affiliation) => {
    const { organization, location } = affiliation;
    const orgReference = organization?.reference;

    if (!orgReference) {
      return;
    }

    if (`${organizationResourceType}/${id}` === orgReference) {
      location?.forEach((loc) => {
        locations.push(loc);
      });
    }
  });
  return locations;
};
