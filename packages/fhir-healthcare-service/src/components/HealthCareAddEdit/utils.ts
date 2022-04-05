import { IHealthcareService } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IHealthcareService';
import { Rule } from 'rc-field-form/lib/interface';
import { v4 } from 'uuid';
import { getObjLike, IdentifierUseCodes, FHIRServiceClass } from '@opensrp/react-utils';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import { get, keyBy } from 'lodash';
import { healthCareServiceResourceType } from '../../constants';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { organizationResourceType } from '@opensrp/fhir-team-management';

export interface HealthCareFormFields {
  id?: string;
  identifier?: string;
  active?: boolean;
  name?: string;
  comment?: string;
  extraDetails?: string;
  providedBy?: string;
  initialObject?: IHealthcareService;
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
  extraDetails: [{ type: 'string' }, { required: false }] as Rule[],
});

/**
 * Converts organization resource to initial values
 *
 * @param obj - the organization resource
 */
export const getHealthCareFormFields = (obj?: IHealthcareService) => {
  if (!obj) {
    return {};
  }
  const { id, name, active, identifier, providedBy, comment, extraDetails } = obj;

  const identifierObj = getObjLike(identifier, 'use', IdentifierUseCodes.OFFICIAL) as Identifier[];
  const formFields: HealthCareFormFields = {
    initialObject: obj,
    id,
    identifier: get(identifierObj, '0.value'),
    active,
    name,
    providedBy: get(providedBy, 'reference', undefined),
    comment,
    extraDetails,
  };
  return formFields;
};

/**
 * Regenerates health care payload from form values
 *
 * @param values - form values
 * @param orgs - the organizations
 * @param initialValues - initial form values
 */
export const generateHealthCarePayload = (
  values: HealthCareFormFields,
  orgs: IOrganization[],
  initialValues: HealthCareFormFields
): IHealthcareService => {
  const { id, identifier: rawIdentifier, active, name, providedBy, extraDetails, comment } = values;
  const { initialObject } = initialValues;
  const orgsById = keyBy(orgs, (org) => {
    return `${organizationResourceType}/${org.id}`;
  });
  let payload: IHealthcareService = {
    resourceType: healthCareServiceResourceType,
    active: !!active,
  };
  // preserve resource details that we are not interested in editing.
  if (initialObject) {
    const { meta, ...rest } = initialObject;
    payload = {
      ...rest,
      ...payload,
    };
  }

  if (name) {
    payload.name = name;
  }
  if (id) {
    payload.id = id;
  }

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
  if (extraDetails) {
    payload.extraDetails = extraDetails;
  }

  if (comment) {
    payload.comment = comment;
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
