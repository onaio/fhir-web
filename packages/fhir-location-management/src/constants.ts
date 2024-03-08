// resource type  constants
export const locationHierarchyResourceType = 'LocationHierarchy';
export const locationResourceType = 'Location';

// Url
export const URL_ADMIN = '/admin';
export const URL_LOCATION_UNIT = `${URL_ADMIN}/location/unit`;
export const URL_LOCATION_UNIT_ADD = `${URL_LOCATION_UNIT}/add`;
export const URL_LOCATION_UNIT_EDIT = `${URL_LOCATION_UNIT}/edit`;


// magic strings
export const serviceType = 'serviceType' as const;
export const geometry = 'geometry' as const;
export const latitude = 'latitude' as const;
export const longitude = 'longitude' as const;
export const externalId = 'externalId' as const;
export const isJurisdiction = "isJurisdiction" as const;

// Fhir extensions
export const locationGeoJsonExtensionUrl = "http://build.fhir.org/extension-location-boundary-geojson.html"
