// FHIR API strings
export const organizationAffiliationResourceType = 'OrganizationAffiliation';
export const FlagResourceType = 'Flag';
export const GroupResourceType = 'Group';
export const ListResourceType = 'List';
export const EncounterResourceType = 'Encounter';
export const ObservationResourceType = 'Observation';
export const PractitionerResourceType = 'Practitioner';

// urls
export const URL_ADMIN = '/admin';
export const URL_CLOSE_FLAGS = `${URL_ADMIN}/close-flags`;

// // magic strings

export const thatiMinutes = 30 * 60 * 1000;

// form fields
export const locationName = "locationName" as const
export const productName = "productName" as const
export const status = "status" as const
export const comments = "comments" as const
