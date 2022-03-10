import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IOrganizationAffiliation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganizationAffiliation';
import { locationResourceType } from '@opensrp/fhir-location-management';
import { keyBy } from 'lodash';
import {
  IdentifierUseCodes,
  organizationAffiliationResourceType,
  organizationResourceType,
} from '../../constants';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { v4 } from 'uuid';

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
      label: org.name, // TODO - alias
    };
  });
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
  const affiliationsByOrgId = keyBy(allAffiliations, 'organization.reference');

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
  const promises: Promise<unknown>[] = [];
  // remove affiliations
  toRemove.forEach((option: OrgSelectOptions) => {
    // check if a mapping for this org-location exists in one of the current affiliations
    const existingAffiliation = affiliationsByOrgId[option.value] as
      | IOrganizationAffiliation
      | undefined;
    if (existingAffiliation) {
      const locations = existingAffiliation.location ?? [];
      const remainingLocations = locations.filter((loc) => {
        return loc.reference !== `${locationResourceType}/${location.id}`;
      });
      if (remainingLocations.length === 0) {
        // no locations mapped to this org, so remove the affiliation
        promises.push(serve.delete(existingAffiliation.id as string));
      }
      if (remainingLocations.length !== locations.length) {
        // means that we are merely updating the existingAffiliation
        existingAffiliation.location = remainingLocations;
        promises.push(serve.update(existingAffiliation));
      }
    } else {
      // invariant: we are removing an affiliation, so one has to exist
    }
  });

  // adding new entries
  toAdd.forEach((option: OrgSelectOptions) => {
    // check if a mapping for this org-location exists in one of the current affiliations
    const existingAffiliation = affiliationsByOrgId[option.value] as
      | IOrganizationAffiliation
      | undefined;
    if (existingAffiliation) {
      // if there is an affiliation that exists for this organization, then we edit that.
      const locations = existingAffiliation.location ?? [];
      existingAffiliation.location = [
        ...locations,
        {
          reference: `${locationResourceType}/${location.id}`,
          display: location.name,
        },
      ];
      promises.push(serve.update(existingAffiliation));
    } else {
      // we create a new affiliation
      const affiliationPayload: IOrganizationAffiliation = {
        resourceType: organizationAffiliationResourceType,
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
      promises.push(serve.create(affiliationPayload));
    }
  });

  console.log('===>', { toAdd, toRemove: toRemove[0].affiliation, promises });
  return Promise.all(promises);
};
