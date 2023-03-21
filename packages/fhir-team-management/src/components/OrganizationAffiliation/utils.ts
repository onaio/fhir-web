import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IOrganizationAffiliation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganizationAffiliation';
import { locationResourceType } from '@opensrp/fhir-location-management';
import { keyBy, transform } from 'lodash';
import { organizationAffiliationResourceType, organizationResourceType } from '../../constants';
import { FHIRServiceClass, IdentifierUseCodes } from '@opensrp/react-utils';
import { v4 } from 'uuid';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';

export interface OrgSelectOptions {
  value: string;
  label?: string;
  affiliation?: IOrganizationAffiliation;
}
export interface AffiliationsByLocationId {
  [key: string]: IOrganizationAffiliation[];
}

export const reformatOrganizationByLocation = (orgAffiliations: IOrganizationAffiliation[]) => {
  const orgsByLocations: AffiliationsByLocationId = {};

  orgAffiliations.forEach((affiliation) => {
    const { organization, location } = affiliation;
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
      orgsByLocations[locRef].push(affiliation);
    });
  });

  return orgsByLocations;
};

export const getOrgSelectOptions = (orgs: IOrganization[] = []): OrgSelectOptions[] => {
  return orgs.map((org) => {
    return {
      value: `${organizationResourceType}/${org.id}` as string,
      label: org.name,
    };
  });
};

/**
 * filter practitioners select on search
 *
 * @param inputValue search term
 * @param option select option to filter against
 */
export const orgsFilterFunction = (inputValue: string, option?: OrgSelectOptions) => {
  return !!option?.label?.toLowerCase().includes(inputValue.toLowerCase());
};

export const getOrgOptionsFromAffiliations = (
  affiliatedOrgs: IOrganizationAffiliation[] = []
): OrgSelectOptions[] => {
  return affiliatedOrgs.map((obj) => {
    return {
      value: obj.organization?.reference as string,
      label: obj.organization?.display,
      affiliation: obj,
    };
  });
};

/**
 * key affiliations by orgId and then locationID
 *
 * @param affiliations - affiliation
 */
export const keyAffiliationsByOrgLocIds = (affiliations: IOrganizationAffiliation[]) => {
  const affiliationsByOrgLocIds = transform(
    affiliations,
    (acc, value) => {
      const orgReference = value.organization?.reference as string;
      if (!(acc[orgReference] as Reference | undefined)) {
        acc[orgReference] = {};
      }
      const { location } = value;
      location?.forEach((location) => {
        const locReference = location.reference as string;
        acc[orgReference][locReference] = value;
      });
    },
    {} as Record<string, Record<string, IOrganizationAffiliation>>
  );
  return affiliationsByOrgLocIds;
};

/**
 * @param baseUrl - fhir base url
 * @param currentOptions - affiliations after user selection
 * @param initialOptions - affiliations before user selection
 * @param location - location object
 * @param allAffiliations - all existing affiliation resource objects
 */
export const postPutAffiliations = (
  baseUrl: string,
  currentOptions: OrgSelectOptions[],
  initialOptions: OrgSelectOptions[],
  location: ILocation,
  allAffiliations: IOrganizationAffiliation[]
) => {
  // separate values that were removed and those that need to be created
  const toAdd: OrgSelectOptions[] = [];
  const toRemove: OrgSelectOptions[] = [];

  const currentOptionsById = keyBy(currentOptions, 'value');
  const initialOptionsById = keyBy(initialOptions, 'value');
  const affsByOrgLoc = keyAffiliationsByOrgLocIds(allAffiliations);

  // know which orgIds to add
  currentOptions.forEach((option: OrgSelectOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!initialOptionsById[option.value]) {
      toAdd.push(option);
    }
  });

  initialOptions.forEach((option: OrgSelectOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!currentOptionsById[option.value]) {
      toRemove.push(option);
    }
  });

  const serve = new FHIRServiceClass<IOrganizationAffiliation>(
    baseUrl,
    organizationAffiliationResourceType
  );
  const promises: (() => Promise<unknown>)[] = [];
  // remove affiliations
  toRemove.forEach((option: OrgSelectOptions) => {
    // check if a mapping for this org-location exists in one of the current affiliations
    const existingAffiliation = affsByOrgLoc[option.value][
      `${locationResourceType}/${location.id}`
    ] as IOrganizationAffiliation | undefined;
    if (existingAffiliation) {
      const locations = existingAffiliation.location ?? [];
      const remainingLocations = locations.filter((loc) => {
        return loc.reference !== `${locationResourceType}/${location.id}`;
      });
      if (remainingLocations.length === 0) {
        // no locations mapped to this org, so remove the affiliation
        promises.push(() => serve.delete(existingAffiliation.id as string));
      } else if (remainingLocations.length !== locations.length) {
        // means that we are merely updating the existingAffiliation
        existingAffiliation.location = remainingLocations;
        promises.push(() => serve.update(existingAffiliation));
      }
    } else {
      // invariant: we are removing an affiliation, so one has to exist
    }
  });

  // adding new entries
  toAdd.forEach((option: OrgSelectOptions) => {
    const affiliationPayload = getNewAffiliationPayload(option, affsByOrgLoc, location);
    promises.push(() => serve.update(affiliationPayload));
  });

  return Promise.all(promises.map((p) => p()));
};

/**
 * Helps create an organizationAffiliation payload when making new organization assignments to locations.
 *
 * @param option -  added option
 * @param affiliationsByOrgLocation - A map lookup of all affiliations keyed by the organization and then by location
 * @param location - location that is the target of the assignment.
 */
function getNewAffiliationPayload(
  option: OrgSelectOptions,
  affiliationsByOrgLocation: Record<string, Record<string, IOrganizationAffiliation>>,
  location: ILocation
) {
  const orgReference = option.value;
  const affiliationByLocation =
    (affiliationsByOrgLocation[orgReference] as
      | Record<string, IOrganizationAffiliation>
      | undefined) ?? {};

  // check if any affiliations already exist for this organization.
  const existingAffiliations: IOrganizationAffiliation[] = Object.values(affiliationByLocation);
  if (existingAffiliations.length > 0) {
    // pick any/first affiliation, we will add the location there.
    const anyAffiliation = existingAffiliations[0];
    // update affiliation with location information.
    const updatedAffiliation = {
      ...anyAffiliation,
      location: [
        ...(anyAffiliation.location ?? []),
        {
          reference: `${locationResourceType}/${location.id}`,
          display: location.name,
        },
      ],
    };
    return updatedAffiliation;
  } else {
    const affiliationPayload: IOrganizationAffiliation = {
      resourceType: organizationAffiliationResourceType,
      id: v4(),
      identifier: [
        {
          use: IdentifierUseCodes.OFFICIAL,
          value: v4(),
        },
      ],
      active: true,
      organization: {
        reference: option.value,
        display: option.label,
      },
      location: [
        {
          reference: `${locationResourceType}/${location.id}`,
          display: location.name,
        },
      ],
    };
    return affiliationPayload;
  }
}
