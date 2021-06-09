// opensrp api strings
export const OPENSRP_API_BASE_URL = 'https://mg-eusm-staging.smartregister.org/opensrp/rest/';
export const OPENSRP_UPLOAD_STOCK_ENDPOINT = 'stockresource/inventory/validate';
export const OPENSRP_IMPORT_STOCK_ENDPOINT = 'stockresource/import/inventory';
export const LOCATIONS_GET_ALL_SYNC_ENDPOINT = 'location/getAll';
export const OPENSRP_ENDPOINT_SETTINGS = 'v2/settings';
export const OPENSRP_ENDPOINT_STOCK_RESOURCE = 'stockresource/';
export const LOCATIONS_COUNT_ALL_ENDPOINT = 'location/countAll';
export const OPENSRP_ENDPOINT_GET_INVENTORIES = 'stockresource/servicePointId';
export const OPENSRP_ENDPOINT_LOCATION = 'location';
export const OPENSRP_PRODUCT_CATALOGUE = 'product-catalogue';

// router routes
export const INVENTORY_SERVICE_POINT_LIST_VIEW = '/inventory';
export const INVENTORY_SERVICE_POINT_PROFILE_VIEW = '/inventory/profile';
export const INVENTORY_BULK_UPLOAD_URL = '/inventory/upload';
export const INVENTORY_ADD_SERVICE_POINT = '/inventory/servicePoint/add';
export const INVENTORY_EDIT_SERVICE_POINT = '/inventory/servicePoint/edit';
export const INVENTORY_SERVICE_POINT_PROFILE_PARAM = 'servicePointId';
export const URL_INVENTORY_ADD = '/item/add';
export const URL_INVENTORY_EDIT = '/item/edit';

// other constants
/** namespace for the keys attached to the columns */
export const TableColumnsNamespace = 'inventory';
export const errorsTableColumnsNameSpace = 'inventoryBulkUploadError';
export const INVENTORY_DONORS = 'inventory_donors';
export const INVENTORY_UNICEF_SECTIONS = 'inventory_unicef_sections';

// magic figures
export const SEARCH_QUERY_PARAM = 'querySearch';
export const BULK_UPLOAD_PARAM = 'bulkStep';

export const GEOJSON_TYPE_STRING = 'Feature';

//endpoints
export const GET_INVENTORY_BY_SERVICE_POINT = 'stockresource/servicePointId/';
export const LOCATION = 'location';

// Geographic levels
export const GEOGRAPHIC_LEVEL = { REGION: 1, DISTRICT: 2, COMMUNE: 3 };
export const CSV_FILE_TYPE = '.csv';
export const COMMUNE_GEOGRAPHIC_LEVEL = 3;

// Route params
export const ROUTE_PARAM_SERVICE_POINT_ID = 'servicePointId';
export const ROUTE_PARAM_INVENTORY_ID = 'inventoryId';
