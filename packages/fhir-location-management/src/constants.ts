// resource type  constants
export const locationHierarchyResourceType = 'LocationHierarchy';
export const listResourceType = 'List';
export const locationResourceType = 'Location';
export const valueSetResourceType = 'ValueSet';

// Url
export const URL_ADMIN = '/admin';
export const URL_LOCATION_UNIT = `${URL_ADMIN}/location/unit`;
export const URL_LOCATION_UNIT_ADD = `${URL_LOCATION_UNIT}/add`;
export const URL_LOCATION_UNIT_EDIT = `${URL_LOCATION_UNIT}/edit`;
export const URL_LOCATION_VIEW_DETAILS = `${URL_LOCATION_UNIT}/view`;
export const URL_ALL_LOCATIONS = `${URL_ADMIN}/location/all`;
export const URL_SERVICE_POINT_ADD_EDIT = `${URL_ADMIN}/service-points/add-edit`;
export const URL_SERVICE_POINT_LIST = `${URL_ADMIN}/service-points`;
export const BACK_SEARCH_PARAM = 'back_to';

// magic strings
export const serviceType = 'serviceType' as const;
export const geometry = 'geometry' as const;
export const latitude = 'latitude' as const;
export const longitude = 'longitude' as const;
export const externalId = 'externalId' as const;
export const isJurisdiction = 'isJurisdiction' as const;

// Fhir extensions
export const locationGeoJsonExtensionUrl =
  'http://build.fhir.org/extension-location-boundary-geojson.html';

// i18n namespaces
export const namespace = 'fhir-location-management' as const;
export const servicePointNamespace = 'fhir-service-point' as const;

// Magic strings
export const MATCH_SEARCH_MODE = 'match';
export const parentIdQueryParam = 'parentId';
