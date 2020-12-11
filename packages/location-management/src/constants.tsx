export const API_BASE_URL = process.env.REACT_APP_OPENSRP_API_BASE_URL;

//
// Location Unit
//
export const LOCATION_UNIT_ALL = 'location/sync';
export const LOCATION_UNIT_GET = 'location';
export const LOCATION_UNIT_POST_PUT = 'location?is_jurisdiction=true';
export const LOCATION_UNIT_FINDBYPROPERTIES = 'location/findByProperties';
// Url
export const URL_LOCATION_UNIT = '/location/unit';
export const URL_LOCATION_UNIT_ADD = URL_LOCATION_UNIT + '/add';
export const URL_LOCATION_UNIT_EDIT = URL_LOCATION_UNIT + '/edit';

//
// Location Tag
//
export const LOCATION_UNIT_GROUP_ALL = 'location-tag';
export const LOCATION_UNIT_GROUP_GET = 'location-tag/';
export const LOCATION_UNIT_GROUP_DELETE = 'location-tag/delete/';
// Url
export const URL_LOCATION_UNIT_GROUP = '/location/group';
export const URL_LOCATION_UNIT_GROUP_ADD = URL_LOCATION_UNIT_GROUP + '/add';
export const URL_LOCATION_UNIT_GROUP_EDIT = URL_LOCATION_UNIT_GROUP + '/edit';

//
// Location HIERARCHY
//
export const LOCATION_HIERARCHY = 'location/hierarchy';
