// opensrp api strings
export const OPENSRP_API_BASE_URL = 'https://mg-eusm-staging.smartregister.org/opensrp/rest/';
export const OPENSRP_PRODUCT_CATALOGUE = 'product-catalogue';
export const PRODUCT_ID_ROUTE_PARAM = 'productId';

// router routes
export const URL_ADMIN = '/admin';
export const CATALOGUE_LIST_VIEW_URL = `${URL_ADMIN}/product-catalogue/view`;
export const CATALOGUE_EDIT_VIEW_URL = `${URL_ADMIN}/product-catalogue/edit`;
export const CATALOGUE_CREATE_VIEW_URL = `${URL_ADMIN}/product-catalogue/new`;
export const HOME_URL = '/';

// other constants
/** namespace for the keys attached to the columns */
export const TableColumnsNamespace = 'product-catalogue';

/** route params for product-catalogue pages */
export interface RouteParams {
  productId?: string;
}
