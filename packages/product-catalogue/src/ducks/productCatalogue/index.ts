/** Redux module for product-catalogue
 * initially developed for eusm-web
 */

import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
  getTotalRecordsFactory,
} from '@opensrp-web/reducer-factory';

/** interface for a single Product catalogue as received from the api **/
export interface ProductCatalogue {
  productName: string;
  materialNumber: string;
  isAttractiveItem: boolean;
  condition: string;
  appropriateUsage: string;
  accountabilityPeriod: number;
  serverVersion: number;
  uniqueId: number;
  availability: string;
  photoURL: string;
}

/** reducer name for the Item module */
export const reducerName = 'product-catalogue';

/** Item Reducer */
export const ProductCatalogueReducer = reducerFactory<ProductCatalogue>(reducerName);

// action
export const fetchProducts = fetchActionCreatorFactory<ProductCatalogue>(reducerName, 'uniqueId');
export const removeProducts = removeActionCreatorFactory(reducerName);
export const setTotalProducts = setTotalRecordsFactory(reducerName);

// selectors
export const getProductsById = getItemsByIdFactory<ProductCatalogue>(reducerName);
export const getProductById = getItemByIdFactory<ProductCatalogue>(reducerName);
export const getProductArray = getItemsArrayFactory<ProductCatalogue>(reducerName);
export const getTotalProducts = getTotalRecordsFactory(reducerName);
