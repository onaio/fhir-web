export const API_BASE_URL = 'https://opensrp-stage.smartregister.org/opensrp/rest/';

//
// Location Unit
//
export const LOCATION_UNIT_ALL = 'location/sync';
export const LOCATION_UNIT_GET = 'location';
export const LOCATION_UNIT_POST_PUT = 'location?is_jurisdiction=true';
export const LOCATION_UNIT_FINDBYPROPERTIES = 'location/findByProperties';
export const LOCATION_UNIT_EXTRAFIELDS = 'v2/settings/?serverVersion=0';
export const LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER = 'location_settings';

// Url
export const URL_LOCATION_UNIT = '/location/unit';
export const URL_LOCATION_UNIT_ADD = URL_LOCATION_UNIT + '/add';
export const URL_LOCATION_UNIT_EDIT = URL_LOCATION_UNIT + '/edit';

//
// Location Tag
//
export const LOCATION_TAG_ALL = 'location-tag';
export const LOCATION_TAG_GET = 'location-tag/';
export const LOCATION_TAG_DELETE = 'location-tag/delete/';
// Url
export const URL_LOCATION_TAG = '/location/group';
export const URL_LOCATION_TAG_ADD = URL_LOCATION_TAG + '/add';
export const URL_LOCATION_TAG_EDIT = URL_LOCATION_TAG + '/edit';

//
// Location HIERARCHY
//
export const LOCATION_HIERARCHY = 'location/hierarchy';
