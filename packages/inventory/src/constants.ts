// opensrp api strings
export const OPENSRP_API_BASE_URL = 'https://mg-eusm-staging.smartregister.org/opensrp/rest/';
export const OPENSRP_UPLOAD_STOCK_ENDPOINT = 'stockresource/inventory/validate';
export const OPENSRP_IMPORT_STOCK_ENDPOINT = 'stockresource/import/inventory';
export const LOCATIONS_GET_ALL_SYNC_ENDPOINT = 'location/getAll';

// router routes
export const INVENTORY_SERVICE_POINT_LIST_VIEW = '/inventory/list';
export const INVENTORY_SERVICE_POINT_PROFILE_VIEW = '/inventory/profile';
export const INVENTORY_BULK_UPLOAD_URL = '/inventory/upload';

// other constants
/** namespace for the keys attached to the columns */
export const TableColumnsNamespace = 'inventory';
export const errorsTableColumnsNameSpace = 'inventoryBulkUploadError';

// magic figures
export const SEARCH_QUERY_PARAM = 'querySearch';
export const BULK_UPLOAD_PARAM = 'bulkStep';
export const TABLE_PAGE_SIZE = 5;
export const TABLE_PAGE_SIZE_OPTIONS = ['5', '10', '20', '50', '100'];
export const tablePaginationOptions = {
  showQuickJumper: true,
  showSizeChanger: true,
  defaultPageSize: TABLE_PAGE_SIZE,
  pageSizeOptions: TABLE_PAGE_SIZE_OPTIONS,
};

//endpoints
export const GET_INVENTORY_BY_SERVICE_POINT = 'stockresource/servicePointId/';
export const LOCATION = 'location';

//payload
export const inventory1 = {
  stockId: '5dfcaecd-430a-4284-972f-9acf87775a9b1',
  productName: 'Scale1',
  unicefSection: 'Health1',
  quantity: 4,
  deliveryDate: '2020-02-01',
  accountabilityEndDate: '2020-10-10',
  donor: 'ADB',
  servicePointId: '903971',
  poNumber: 1111,
  serialNumber: '1234serial2',
  providerId: 'providerId',
};

export const inventory2 = {
  stockId: '5dfcaecd-430a-4284-972f-9acf87775a9b2',
  productName: 'Scale2',
  unicefSection: 'Health2',
  quantity: 4,
  deliveryDate: '2020-02-01',
  accountabilityEndDate: '2020-10-10',
  donor: 'ADB',
  servicePointId: '903972',
  poNumber: 1112,
  serialNumber: '1234serial2',
  providerId: 'providerId',
};

// Geographic levels
export const REGION = 1;
export const DISTRICT = 2;
export const COMMUNE = 3;
export const CSV_FILE_TYPE = '.csv';
