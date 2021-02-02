// opensrp api strings
export const OPENSRP_API_BASE_URL = 'https://mg-eusm-staging.smartregister.org/opensrp/rest/';

// router routes
export const INVENTORY_SERVICE_POINT_LIST_VIEW = '/inventory/list';
export const INVENTORY_SERVICE_POINT_PROFILE_VIEW = '/inventory/list';

// other constants
/** namespace for the keys attached to the columns */
export const TableColumnsNamespace = 'inventory';

// magic strings
export const SEARCH_QUERY_PARAM = 'querySearch';
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
