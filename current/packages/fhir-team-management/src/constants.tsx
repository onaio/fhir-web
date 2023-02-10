// Query params
export const pageSizeQuery = 'pageSize';
export const pageQuery = 'page';
export const searchQuery = 'search';

// FHIR API strings
export const organizationAffiliationResourceType = 'OrganizationAffiliation';
export const organizationResourceType = 'Organization';
export const practitionerRoleResourceType = 'PractitionerRole';
export const practitionerResourceType = 'Practitioner';

// TODO -  temporal coupling of routes in packages and those used in app
export const URL_ADMIN = '/admin';
export const URL_ADD_ORGANIZATION = `${URL_ADMIN}/teams/add`;
export const URL_EDIT_ORGANIZATION = `${URL_ADMIN}/teams/edit`;
export const ORGANIZATION_LIST_URL = `${URL_ADMIN}/teams`;

// form fields constants
export const id = 'id' as const;
export const name = 'name' as const;
export const active = 'active' as const;
export const alias = 'alias' as const;
export const identifier = 'identifier' as const;
export const type = 'type' as const;
export const members = 'members' as const;

// fhir constants and  value sets
// fhir constants

export enum HumanNameUseCodes {
  USUAL = 'usual',
  OFFICIAL = 'official',
  TEMP = 'temp',
  NICKNAME = 'nickname',
  ANONYMOUS = 'anonymous',
  OLD = 'old',
  MAIDEN = 'maiden',
}

export const organizationTypeValueSetUrl =
  'http://terminology.hl7.org/CodeSystem/organization-type';

// fhir value sets
export const OrganizationTypeVS = {
  system: organizationTypeValueSetUrl,
  codings: [
    {
      code: 'prov',
      display: 'Healthcare Provider',
    },
    {
      code: 'team',
      display: 'Organizational team',
    },
  ],
};
