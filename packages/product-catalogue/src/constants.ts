// opensrp api strings
export const OPENSRP_PRODUCT_CATALOGUE = 'rest/product-catalogue';

// router routes
export const CATALOGUE_LIST_VIEW_URL = '/product-catalogue';
export const CATALOGUE_EDIT_VIEW_URL = '/product-catalogue/edit';
export const CATALOGUE_CREATE_VIEW_URL = 'product-catalogue/new';
export const HOME_URL = '/';

// magic strings
export const PRODUCT_NAME = 'Product name';
export const UNIQUE_ID = 'Unique ID';
export const MATERIAL_NUMBER = 'Material number';
export const CREATED = 'Created';
export const LAST_UPDATED = 'Last Updated';
export const SERVER_VERSION = 'Server version';

// other constants
/** namespace for the keys attached to the columns */
export const TableColumnsNamespace = 'product-catalogue';

/** route params for product-catalogue pages */
export interface RouteParams {
  productId?: string;
}
