import { IHealthcareService } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IHealthcareService';
import { Rule } from 'rc-field-form/lib/interface';
import { v4 } from 'uuid';
import { getObjLike, IdentifierUseCodes, FHIRServiceClass } from '@opensrp/react-utils';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { get, keyBy } from 'lodash';
import { healthCareServiceResourceType, organizationResourceType } from '../../constants';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';

export interface HealthCareFormFields {
  id?: string;
  identifier?: string;
  active?: boolean;
  name?: string;
  comment?: string;
  extraDetails?: string;
  providedBy?: string;
}

/**
 * factory for validation rules for OrganizationForm component
 */
export const validationRulesFactory = () => ({
  id: [{ type: 'string' }] as Rule[],
  identifier: [{ type: 'string' }] as Rule[],
  name: [
    { type: 'string', message: 'Must be a valid string' },
    { required: true, message: 'Required' },
  ] as Rule[],
  active: [{ type: 'boolean' }, { required: true, message: 'Required' }] as Rule[],
  comment: [
    {
      type: 'string',
    },
    {
      required: false,
    },
  ] as Rule[],
  providedBy: [{ type: 'string' }, { required: false }] as Rule[],
});

/**
 * Converts organization resource to initial values
 *
 * @param obj - the organization resource
 */
export const getHealthCareFormFields = (obj?: IHealthcareService): HealthCareFormFields => {
  if (!obj) {
    return {};
  }
  const { id, name, active, identifier, providedBy } = obj;

  // collect just codings fo the organizationTypeValueSet system

  const identifierObj = getObjLike(identifier, 'use', IdentifierUseCodes.OFFICIAL) as Identifier[];
  const formFields = {
    id,
    identifier: get(identifierObj, '0.value'),
    active,
    name,
    providedBy: get(providedBy, 'reference', undefined),
  };
  return formFields;
};

/**
 * Regenerates health care payload from form values
 *
 * @param values - form values
 * @param orgs - the organizations
 */
export const generateHealthCarePayload = (
  values: HealthCareFormFields,
  orgs: IOrganization[]
): IHealthcareService => {
  const { id, identifier: rawIdentifier, active, name, providedBy } = values;
  const orgsById = keyBy(orgs, (org) => {
    return `${organizationResourceType}/${org.id}`;
  });
  const payload: IHealthcareService = {
    resourceType: healthCareServiceResourceType,
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

  if (providedBy) {
    payload.providedBy = {
      reference: providedBy,
      display: get(orgsById[providedBy], 'name', ''),
    };
  }

  return payload;
};

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * get select options from list of organizations
 *
 * @param orgs - an array of organizations
 */
export const getOrgSelectOptions = (orgs: IOrganization[]) => {
  return orgs.map((org) => {
    const orgId = `${organizationResourceType}/${org.id}`;
    return {
      value: orgId,
      label: org.name ?? orgId,
    };
  });
};

/**
 * filter orgs select on search
 *
 * @param inputValue search term
 * @param option select option to filter against
 */
export const orgFilterFunction = (inputValue: string, option?: SelectOption) => {
  return !!option?.label.toLowerCase().includes(inputValue.toLowerCase());
};

/**
 * either posts or puts a health care service payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the organization payload
 */
export const postPutHealthCareService = (baseUrl: string, payload: IHealthcareService) => {
  const { id } = payload;
  const isEdit = !!id;
  const serve = new FHIRServiceClass<IOrganization>(baseUrl, healthCareServiceResourceType);
  if (isEdit) {
    return serve.update(payload);
  }
  return serve.create(payload);
};
