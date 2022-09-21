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
import { flatten } from 'lodash';
import { Rule } from 'rc-field-form/lib/interface';
import { v4 } from 'uuid';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import type { TFunction } from '@opensrp/i18n';

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
 */
export const getPractitionerOptions = (practitioners: IPractitioner[]) => {
  return practitioners.map((pract) => {
    const nameObj = getObjLike(pract.name, 'use', HumanNameUseCodes.OFFICIAL)[0];
    const value = `${practitionerResourceType}/${pract.id}`;
    const label = parseFhirHumanName(nameObj);
    return {
      value,
      label: label ?? value,
    };
  });
};
