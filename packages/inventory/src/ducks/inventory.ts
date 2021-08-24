import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  reducerFactory,
  getItemsArrayFactory,
  getTotalRecordsFactory,
} from '@opensrp-web/reducer-factory';
import { values } from 'lodash';
import { Store } from 'redux';
import { createSelector } from 'reselect';
import { Dictionary } from '@onaio/utils';
import { ProductCatalogue } from '@opensrp-web/product-catalogue';

/** interface custom properties for inventory */
export interface CustomProperties {
  'PO Number': string;
  'UNICEF section': string;
}

/** interface post inventory */
export interface InventoryPost {
  deliveryDate: string;
  accountabilityEndDate: string;
  donor: string;
  poNumber: number;
  productName: string;
  providerId?: string;
  quantity?: number;
  serialNumber?: string;
  servicePointId: string;
  stockId?: string;
  unicefSection: string;
}

/** interface inventory */
export interface Inventory {
  type: string;
  serverVersion: number;
  identifier: string;
  providerid: string;
  value: number;
  version: number;
  deliveryDate: string;
  accountabilityEndDate: string;
  donor: string;
  serialNumber: string;
  locationId: string;
  customProperties: CustomProperties;
  product?: ProductCatalogue;
  _id: string;
  _rev: string;
  transaction_type: string;
}

/** reducer name */
export const inventoryReducerName = 'inventory';

/** Item Reducer */
export const inventoryReducer = reducerFactory<Inventory>(inventoryReducerName);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchInventories = fetchActionCreatorFactory<Inventory>(inventoryReducerName, '_id');

export const removeInventories = removeActionCreatorFactory(inventoryReducerName);
export const setTotalInventories = setTotalRecordsFactory(inventoryReducerName);

// selectors
export const getInventoriesArray = getItemsArrayFactory<Inventory>(inventoryReducerName);
export const getTotalInventories = getTotalRecordsFactory(inventoryReducerName);

/** gets all trees key'd by the rootNodes id
 *
 * @param store - the store
 */
export const getInventoriesByIds = (store: Partial<Store>) => {
  return (store as Dictionary)[inventoryReducerName].objectsById as Dictionary<Inventory>;
};

/** prop filters to customize selector queries */
interface Filters {
  ids?: string[];
  servicePointIds?: string[];
  expired?: boolean;
}

/** gets all trees key'd by the rootNodes id
 *
 * @param store - the store
 * @param props - the filterProps
 */
const getIds = (store: Partial<Store>, props: Filters) => props.ids;
const getServicePointIds = (store: Partial<Store>, props: Filters) => props.servicePointIds;
const getServicePointsByExpiry = (store: Partial<Store>, props: Filters) => props.expired;

/** factory that returns a selector to retrieve the inventories using stock ids */
export const getInventoriesByIdsFactory = createSelector(
  getInventoriesByIds,
  getIds,
  (inventoriesByIds, ids) => {
    if (ids) {
      const inventoriesOfInterest: Inventory[] = [];
      ids.forEach((id) => {
        inventoriesOfInterest.push(inventoriesByIds[id]);
      });
      return inventoriesOfInterest;
    }
    return values(inventoriesByIds);
  }
);

/** factory that returns a selector to retrieve the inventories using servicePoint ids */
export const getInventoriesByServicePointsIdsFactory = createSelector(
  getInventoriesByIds,
  getServicePointIds,
  (inventoriesByIds, ids) => {
    if (ids) {
      const inventoriesOfInterest: Inventory[] = [];
      ids.forEach((id) => {
        Object.values(inventoriesByIds).forEach((inventory) => {
          if (id === inventory.locationId) {
            inventoriesOfInterest.push(inventory);
          }
        });
      });
      return inventoriesOfInterest;
    }
    return values(inventoriesByIds);
  }
);

/** factory that returns a selector to retrieve the inventories by their expiry */
export const getInventoriesByExpiry = createSelector(
  getInventoriesByServicePointsIdsFactory,
  getServicePointsByExpiry,
  (inventories, returnExpired) => {
    const inventoriesOfInterest: Inventory[] = [];
    if (returnExpired === undefined) {
      return inventories;
    } else if (!returnExpired) {
      inventories.forEach((inventory) => {
        if (new Date(inventory.deliveryDate) < new Date(inventory.accountabilityEndDate)) {
          inventoriesOfInterest.push(inventory);
        }
      });
      return inventoriesOfInterest;
    } else {
      inventories.forEach((inventory) => {
        if (new Date(inventory.deliveryDate) > new Date(inventory.accountabilityEndDate)) {
          inventoriesOfInterest.push(inventory);
        }
      });
      return inventoriesOfInterest;
    }
  }
);
