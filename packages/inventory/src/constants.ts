// opensrp api strings
export const OPENSRP_API_BASE_URL = 'https://mg-eusm-staging.smartregister.org/opensrp/rest/';

// router routes
export const INVENTORY_SERVICE_POINT_LIST_VIEW = '/inventory/list';
export const INVENTORY_SERVICE_POINT_PROFILE_VIEW = '/inventory/list';
export const INVENTORY_ADD_SERVICE_POINT = '/inventory/servicePoint/add';
export const INVENTORY_EDIT_SERVICE_POINT = '/inventory/servicePoint/edit';

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
