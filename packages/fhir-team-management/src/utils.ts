import { FHIRServiceClass } from '@opensrp/react-utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { flatten, keyBy, transform } from 'lodash';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';
import {
  IdentifierUseCodes,
  organizationAffiliationResourceType,
  organizationResourceType,
  OrganizationTypeVS,
  practitionerResourceType,
  practitionerRoleResourceType,
} from './constants';
import { v4 } from 'uuid';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { Dictionary } from '@onaio/utils';
import { IOrganizationAffiliation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganizationAffiliation';
import { sendSuccessNotification } from '@opensrp/notifications';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { URLParams } from 'opensrp-server-service/dist/types';

const getObjLike = <T extends object>(
  objArr: T[] | undefined,
  key: string,
  value: unknown,
  all = false
) => {
  const arr = objArr ?? [];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const thisObj = arr[i];
    const objHasValue = (thisObj as never)[key];
    if (objHasValue === value) {
      result.push(thisObj);
    }
    if (result.length > 0 && !all) {
      return result[0];
    }
  }
  return result;
};

export const getOrgFormFields = (
  org?: IOrganization,
  assignedPractitioners: IPractitionerRole[] = []
): OrganizationFormFields => {
  const organizationTypeValueSet = 'http://terminology.hl7.org/CodeSystem/organization-type';
  if (!org) {
    return {};
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
    organizationTypeValueSet,
    true
  ) as Coding[];

  const identifierObj = getObjLike(identifier, 'use', IdentifierUseCodes.OFFICIAL) as Identifier;
  const formFields = {
    id,
    identifier: identifierObj?.value,
    active,
    name,
    alias: alias?.[0],
    type: valueSetCodings,
    members: assignedPractitioners.map((pract) => pract.practitioner?.reference as string),
  };
  return formFields;
};

export interface OrganizationFormFields {
  id?: string;
  identifier?: string;
  active?: boolean;
  name?: string;
  alias?: string;
  type?: Coding[];
  members?: string[];
}

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

export const getAssignedPractsOptions = (roles: IPractitionerRole[]) => {
  return roles.map((role) => {
    const { practitioner } = role;
    return {
      label: practitioner?.display,
      value: practitioner?.reference as string,
      roleId: role.id,
    };
  });
};

export const generateOrgPayload = (values: OrganizationFormFields): IOrganization => {
  const { id, identifier: rawIdentifier, active, name, alias: rawAlias } = values;
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

  return payload;
};

export const postPutOrganization = (baseUrl: string, payload: IOrganization) => {
  const { id } = payload;
  const isEdit = !!id;
  const serve = new FHIRServiceClass<IOrganization>(baseUrl, organizationResourceType);
  if (isEdit) {
    return serve.update(payload);
  }
  return serve.create(payload);
};

const x = (baseUrl: string, orgId: string) => {
  const serve = new FHIRServiceClass<IBundle>(baseUrl, practitionerRoleResourceType);
  const params = {
    organization: orgId,
    _include: 'PractitionerRole:practitioner',
  };
  return serve.list(params);
};

export const loadPractitionerRoles = (baseUrl: string, orgId: string) => {
  const serve = new FHIRServiceClass<IBundle>(baseUrl, practitionerRoleResourceType);
  const params = {
    organization: orgId,
    _include: 'PractitionerRole:practitioner',
  };
  return serve.list(params);
};

interface FhirApiFilters {
  page: number;
  pageSize: number;
  search?: string;
}

export const loadOrganization = (
  baseUrl: string,
  orgId: string
  // pagination: FhirApiPagination
) => {
  const serve = new FHIRServiceClass(baseUrl, organizationResourceType);
  return serve.read(orgId);
};

export const loadPractitioners = (baseUrl: string, search?: string) => {
  const filterParams: Dictionary = {};
  if (search) {
    filterParams['name:contains'] = search;
  }
  return new FHIRServiceClass<IBundle>(baseUrl, practitionerResourceType).list(filterParams);
};

/**
 * filter practitioners select on search
 *
 * @param inputValue search term
 * @param option select option to filter against
 * @returns boolean - whether select option matches condition
 */
export const practitionersFilterFunction = (inputValue: string, option?: any) => {
  return !!option?.label.toLowerCase().includes(inputValue.toLowerCase());
};

export const loadAllResources = async (
  baseUrl: string,
  resourceType: string,
  extraFilters: URLParams = {}
) => {
  // first get total
  const summaryFilters = {
    // TODO - magic strings
    _summary: 'count',
    ...extraFilters,
  };
  const summary = await new FHIRServiceClass<IBundle>(baseUrl, resourceType).list(summaryFilters);
  const { total } = summary;
  const fetchAllFilter = {
    _count: total,
    ...extraFilters,
  };
  return new FHIRServiceClass<IBundle>(baseUrl, resourceType).list(fetchAllFilter);
};

// export const postPutAffiliations = (
//   baseUrl: string,
//   values: any,
//   initialValues: any,
//   locationName: string,
//   locationId: string
// ) => {
//   // separate values that were removed and those that need to be created
//   const toAdd: any[] = [];
//   const toRemove: any[] = [];

//   const valuesById = keyBy(values.assignedTeams, 'value');
//   const initialValuesById = keyBy(initialValues.assignedTeams, 'value');

//   values.assignedTeams.forEach((option: any) => {
//     if (!initialValues[option.value]) {
//       toAdd.push(option);
//     }
//   });

//   initialValues.assignedTeams.forEach((option: any) => {
//     if (initialValues[option.value]) {
//       toRemove.push(option);
//     }
//   });

//   // remove promises
//   const serve = new FHIRServiceClass<any>(baseUrl, organizationAffiliationResourceType);
//   const removalPromises = toRemove.map((option) => {
//     return serve.delete(option.affiliationId);
//   });

//   // creation promises
//   const addPromises = toAdd.map((option) => {
//     const orgPayload: IOrganizationAffiliation = {
//       resourceType: organizationAffiliationResourceType,
//       identifier: [
//         {
//           use: 'official',
//           value: v4(),
//         },
//       ],
//       active: true,
//       organization: {
//         reference: `Organization/${option.value}`,
//         display: option.label,
//       },
//       location: [
//         {
//           reference: `Location/${locationId}`,
//           display: locationName,
//         },
//       ],
//     };
//     return new Promise((re) => re(serve.create(orgPayload)));
//   });

//   Promise.all([...removalPromises, ...addPromises]).then(() => {
//     sendSuccessNotification('Affiliations updated');
//   });
// };

export const getPractitionerOptions = (practitioners: IPractitioner[]) => {
  return practitioners.map((pract) => {
    // TODO pract.name has not robustness- better have the full name
    return {
      value: `${practitionerResourceType}/${pract.id}`,
      label: pract.name?.[0]?.given?.[0] ?? '',
    };
  });
};

const arrKeyBy = (arr: string[]) =>
  transform(
    arr,
    (acc, value) => {
      acc[value] = value;
    },
    {} as Record<string, string>
  );

export const updatePractitionerRoles = (
  baseUrl: string,
  values: OrganizationFormFields,
  initialValues: OrganizationFormFields,
  organization: IOrganization,
  practitioners: IPractitioner[],
  existingRoles: IPractitionerRole[]
) => {
  // send delete operations for entries no longer in values but were in initial
  // create wholly new roles for values not in initialValues

  const { id } = organization;
  const members = values.members ?? [];
  const initialMembers = initialValues.members ?? [];
  const membersById = arrKeyBy(members);
  const initialMembersById = arrKeyBy(initialMembers);

  const toAdd: any[] = [];
  const toRemove: any[] = [];

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
      acc[value.organization?.reference!] = {
        [value.practitioner?.reference!]: value,
      };
    },
    {} as Record<string, Record<string, IPractitionerRole>>
  );

  // TODO - defensive logic
  const serve = new FHIRServiceClass<IPractitionerRole>(baseUrl, practitionerRoleResourceType);
  const removePromises = toRemove.map((practId) => {
    const sd = id as string;
    const role =
      existingRolesByOrgPractIds[`${organizationResourceType}/${sd}`][
        `${practitionerResourceType}/${practId}`
      ];
    return serve.delete(role.id as string);
  });

  const additionPromises = toAdd
    .map((practId) => {
      const practitionerRole: IPractitionerRole = {
        resourceType: practitionerRoleResourceType,
        active: true,
        organization: {
          reference: `${organizationResourceType}/${id}`,
          display: organization.name,
        },
        practitioner: {
          reference: practId,
          display: values.name,
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
      return serve.create(practRole);
    });

  return Promise.all([...removePromises, ...additionPromises]);
};
