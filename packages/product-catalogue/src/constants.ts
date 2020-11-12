// opensrp api strings
export const OPENSRP_PRODUCT_CATALOGUE = 'rest/product-catalogue';

// router routes
export const CATALOGUE_LIST_VIEW_URL = '/product-catalogue';
export const CATALOGUE_EDIT_VIEW_URL = '/product-catalogue/edit';
export const CATALOGUE_CREATE_VIEW_URL = 'product-catalogue/new';
export const HOME_URL = '/';

// other constants
/** namespace for the keys attached to the columns */
export const TableColumnsNamespace = 'product-catalogue';

/** route params for product-catalogue pages */
export interface RouteParams {
  productId?: string;
}
