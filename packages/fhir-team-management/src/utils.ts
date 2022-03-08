import { FHIRServiceClass } from '@opensrp/react-utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { keyBy, transform } from 'lodash';
import {
  organizationResourceType,
  practitionerResourceType,
  practitionerRoleResourceType,
} from './constants';
import { v4 } from 'uuid';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { URLParams } from 'opensrp-server-service/dist/types';
import { OrganizationFormFields } from './components/AddEditOrganization/utils';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';

/**
 * retrieve object(s) from an array if it has a property with specified value
 *
 * @param objArr - array of objects
 * @param key - the accessor
 * @param value - the value the accessor should have
 * @param all - whether to return all values that are matched or just the first
 */
export const getObjLike = <T extends object>(
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
      return result;
    }
  }
  return result;
};

/**
 * either posts or puts an organization payload to fhir server
 *
 * @param baseUrl - server base url
 * @param payload - the organization payload
 */
export const postPutOrganization = (baseUrl: string, payload: IOrganization) => {
  const { id } = payload;
  const isEdit = !!id;
  const serve = new FHIRServiceClass<IOrganization>(baseUrl, organizationResourceType);
  if (isEdit) {
    return serve.update(payload);
  }
  return serve.create(payload);
};

interface SelectOption {
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

/**
 * fetch all resources for a certain endpoint
 *
 * @param baseUrl - the fhir server url
 * @param resourceType - the resource type
 * @param extraFilters - extra filters
 */
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
  const practitionersById = keyBy(practitioners, 'id');

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
      const orgReference = value.organization?.reference as string;
      if (!(acc[orgReference] as Reference | undefined)) {
        acc[orgReference] = {};
      }
      acc[orgReference][value.practitioner?.reference as string] = value;
    },
    {} as Record<string, Record<string, IPractitionerRole>>
  );

  // TODO - defensive logic
  const serve = new FHIRServiceClass<IPractitionerRole>(baseUrl, practitionerRoleResourceType);
  const removePromises = toRemove.map((practId) => {
    const sd = id as string;
    const role = existingRolesByOrgPractIds[`${organizationResourceType}/${sd}`][practId];
    return serve.delete(role.id as string);
  });

  // TODO - possibility of posting this as a bundle in a single api call
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
          // display: practitionersById[values.id].name,
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
