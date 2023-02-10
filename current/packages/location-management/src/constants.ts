export const baseURL = 'https://opensrp-stage.smartregister.org/opensrp/rest/';
export const ACTIVE = 'Active';
export const SETTINGS_CONFIGURATION_TYPE = 'SettingConfiguration';

//
// Location Unit
export const LOCATION_UNIT_TYPE = 'Feature';
export const LOCATION_UNIT_ALL = 'location/sync';
export const LOCATION_UNIT_ENDPOINT = 'location';
export const LOCATION_UNIT_POST_PUT = 'location?is_jurisdiction=true';
export const LOCATION_UNIT_EXTRA_FIELDS = 'v2/settings/?serverVersion=0';
export const LOCATION_UNIT_FIND_BY_PROPERTIES = 'location/findByProperties';
export const LOCATION_UNIT_EXTRA_FIELDS_IDENTIFIER = 'location_settings';
export const OPENSRP_V2_SETTINGS = 'v2/settings';
export const SERVICE_TYPES_SETTINGS_ID = 'service_point_types';

// Url
export const URL_ADMIN = '/admin';
export const URL_LOCATION_UNIT = `${URL_ADMIN}/location/unit`;
export const URL_LOCATION_UNIT_ADD = `${URL_LOCATION_UNIT}/add`;
export const URL_LOCATION_UNIT_EDIT = `${URL_LOCATION_UNIT}/edit`;

//
// Location Tag
//
export const LOCATION_UNIT_GROUP_ALL = 'location-tag';
export const LOCATION_UNIT_GROUP_GET = 'location-tag/';
export const LOCATION_UNIT_GROUP_DELETE = 'location-tag/delete/';
// Url
export const URL_LOCATION_UNIT_GROUP = `${URL_ADMIN}/location/group`;
export const URL_LOCATION_UNIT_GROUP_ADD = `${URL_LOCATION_UNIT_GROUP}/add`;
export const URL_LOCATION_UNIT_GROUP_EDIT = `${URL_LOCATION_UNIT_GROUP}/edit`;

//
// Location HIERARCHY
//
export const LOCATION_HIERARCHY = 'location/hierarchy';
