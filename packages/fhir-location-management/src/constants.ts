// resource type  constants
export const locationHierarchyResourceType = 'LocationHierarchy';
export const locationResourceType = 'Location';

// Url
export const URL_ADMIN = '/admin';
export const URL_LOCATION_UNIT = `${URL_ADMIN}/location/unit`;
export const URL_LOCATION_UNIT_ADD = `${URL_LOCATION_UNIT}/add`;
export const URL_LOCATION_UNIT_EDIT = `${URL_LOCATION_UNIT}/edit`;
export const URL_ALL_LOCATIONS = `${URL_ADMIN}/location/all`;
export const URL_SERVICE_POINT_LOCATIONS = `${URL_ADMIN}/location/service-point`;

// Magic strings
export const MATCH_SEARCH_MODE = 'match';

// i18n namespaces
export const namespace = 'fhir-location-management' as const;
export const inventoryNamespace = 'fhir-inventory' as const;
