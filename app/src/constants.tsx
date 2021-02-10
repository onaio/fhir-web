import { ROUTE_PARAM_SERVICE_POINT_ID, ROUTE_PARAM_INVENTORY_ITEM_ID } from '@opensrp/inventory';

export const LOGOUT_REDIRECTION_DELAY = 1000;
export const REACT_CALLBACK_PATH = '/oauth/callback/:id';
export const BACKEND_CALLBACK_PATH = '/fe/oauth/callback/:id';

// URLs
export const URL_ADMIN = '/admin';
export const URL_MISSIONS = '/missions';
export const URL_EXPRESS_LOGIN = '/login';
export const URL_REACT_LOGIN = '/login';
export const URL_LOGOUT = '/logout';
export const URL_HOME = '/';

export const URL_USER = `${URL_ADMIN}/users/list`;
export const URL_USER_EDIT = `${URL_ADMIN}/users/edit`;
export const URL_TEAMS = `${URL_ADMIN}/teams`;
export const URL_TEAM_ADD = `${URL_ADMIN}/teams/add`;
export const URL_TEAM_EDIT = `${URL_ADMIN}/teams/edit/:id`;

export const URL_BACKEND_LOGIN = '/fe/login';
export const URL_BACKEND_CALLBACK = '/fe/oauth/callback/opensrp';
export const URL_LOCATION_UNIT = `${URL_ADMIN}/location/unit`;
export const URL_LOCATION_UNIT_ADD = `${URL_ADMIN}/location/unit/add`;
export const URL_LOCATION_UNIT_EDIT = `${URL_ADMIN}/location/unit/edit/:id`;
export const URL_LOCATION_UNIT_GROUP = `${URL_ADMIN}/location/group`;
export const URL_LOCATION_UNIT_GROUP_ADD = `${URL_ADMIN}/location/group/add`;
export const URL_LOCATION_UNIT_GROUP_EDIT = `${URL_ADMIN}/location/group/edit/:id`;
export const URL_UPLOAD_JSON_VALIDATOR = `${URL_ADMIN}/form-config/json-validators/upload`;
export const URL_JSON_VALIDATOR_LIST = `${URL_ADMIN}/form-config/json-validators`;
export const URL_DRAFT_FILE_LIST = `${URL_ADMIN}/form-config/drafts`;
export const URL_UPLOAD_DRAFT_FILE = `${URL_ADMIN}/form-config/drafts/upload`;
export const URL_MANIFEST_RELEASE_LIST = `${URL_ADMIN}/form-config/releases`;
export const URL_DOWNLOAD_CLIENT_DATA = '/card-support/download-client-data';
export const URL_INVENTORY_ITEM_ADD = `/service-point/:${ROUTE_PARAM_SERVICE_POINT_ID}/inventory-item/add`;
export const URL_INVENTORY_ITEM_EDIT = `/service-point/:${ROUTE_PARAM_SERVICE_POINT_ID}/inventory-item/edit/:${ROUTE_PARAM_INVENTORY_ITEM_ID}`;
