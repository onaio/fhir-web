import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IOrganizationAffiliation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganizationAffiliation';
import { SelectOption } from '../../utils';

export interface AffiliatedOrg {
  orgId: string;
  orgName?: string;
  affiliationId: string;
}
interface OAffiliationFormFields {
  assignedOrgs: string[];
}

export interface AffiliationsByLocationId {
  [key: string]: AffiliatedOrg[];
}

export const reformatOrganizationByLocation = (orgAffiliations: IOrganizationAffiliation[]) => {
  const orgsByLocations: AffiliationsByLocationId = {};

  orgAffiliations.forEach((affiliation) => {
    const { organization, location, id } = affiliation;
    const orgReference = organization?.reference;

    if (!orgReference) {
      return;
    }

    location?.forEach((loc) => {
      const locRef = loc.reference;

      if (!locRef) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!orgsByLocations[locRef]) {
        orgsByLocations[locRef] = [];
      }
      orgsByLocations[locRef].push({
        orgId: orgReference,
        orgName: organization.display,
        affiliationId: id as string,
      });
    });
  });

  return orgsByLocations;
};

export const getOrgSelectOptions = (orgs: IOrganization[] = []) => {
  return orgs.map((org) => {
    return {
      value: org.id,
      label: org.name, // TODO - alias
    };
  });
};

export const getOptionsFromAffiliations = (affiliatedOrgs: AffiliatedOrg[] = []) => {
  return affiliatedOrgs.map((obj) => {
    return {
      value: obj.orgId,
      label: obj.orgName,
    };
  });
};

export const postPutAffiliations = (
  baseUrl: string,
  values: OAffiliationFormFields,
  initialValues: OAffiliationFormFields,
  locationName: string,
  locationId: string
) => {
  // separate values that were removed and those that need to be created
  const toAdd: any[] = [];
  const toRemove: any[] = [];

  const currentAffiliations = values.assignedOrgs;
  const initialAffiliations = initialValues.assignedOrgs;

  // remove affiliations logic
  // know which orgIds to remove
  values.assignedTeams.forEach((option: any) => {
    if (!initialValues[option.value]) {
      toAdd.push(option);
    }
  });

  initialValues.assignedTeams.forEach((option: any) => {
    if (initialValues[option.value]) {
      toRemove.push(option);
    }
  });

  // remove promises
  const serve = new FHIRServiceClass<any>(baseUrl, organizationAffiliationResourceType);
  const removalPromises = toRemove.map((option) => {
    return serve.delete(option.affiliationId);
  });

  // creation promises
  const addPromises = toAdd.map((option) => {
    const orgPayload: IOrganizationAffiliation = {
      resourceType: organizationAffiliationResourceType,
      identifier: [
        {
          use: 'official',
          value: v4(),
        },
      ],
      active: true,
      organization: {
        reference: `Organization/${option.value}`,
        display: option.label,
      },
      location: [
        {
          reference: `Location/${locationId}`,
          display: locationName,
        },
      ],
    };
    return new Promise((re) => re(serve.create(orgPayload)));
  });

  Promise.all([...removalPromises, ...addPromises]).then(() => {
    sendSuccessNotification('Affiliations updated');
  });
};
