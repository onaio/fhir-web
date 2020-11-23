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
} from '@opensrp/reducer-factory';

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
  productPhoto: string;
}

/** reducer name for the Item module */
export const reducerName = 'product-catalogue';

/** Action types */
const FETCHED_CATALOGUE_TYPE = `${reducerName}/LOCATION_GROUPS_FETCHED`;
const REMOVE_CATALOGUE_TYPE = `${reducerName}/REMOVE_LOCATION_GROUPS`;
const SET_TOTAL_RECORDS_TYPE = `${reducerName}/SET_TOTAL_LOCATION_GROUPS`;

/** Item Reducer */
export const ProductCatalogueReducer = reducerFactory<ProductCatalogue>(
  reducerName,
  FETCHED_CATALOGUE_TYPE,
  REMOVE_CATALOGUE_TYPE,
  SET_TOTAL_RECORDS_TYPE
);

// action
export const fetchProducts = fetchActionCreatorFactory<ProductCatalogue>(reducerName, 'uniqueId');
export const removeProducts = removeActionCreatorFactory(reducerName);
export const setTotalProducts = setTotalRecordsFactory(reducerName);

// selectors
export const getProductsById = getItemsByIdFactory<ProductCatalogue>(reducerName);
export const getProductById = getItemByIdFactory<ProductCatalogue>(reducerName);
export const getProductArray = getItemsArrayFactory<ProductCatalogue>(reducerName);
export const getTotalProducts = getTotalRecordsFactory(reducerName);
