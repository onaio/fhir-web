import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  reducerFactory,
  getItemsArrayFactory,
  getTotalRecordsFactory,
} from '@opensrp/reducer-factory';
import { values } from 'lodash';
import { Store } from 'redux';
import { createSelector } from 'reselect';
import { Dictionary } from '@onaio/utils';

/** interface inventory */
export interface Inventory {
  deliveryDate: string;
  donor: string;
  poNumber: number;
  productName: string;
  providerId: string;
  quantity: number;
  serialNumber: string;
  servicePointId: string;
  stockId: string;
  unicefSection: string;
}

/** reducer name */
export const inventoryReducerName = 'inventory';

/** Item Reducer */
export const inventoryReducer = reducerFactory<Inventory>(inventoryReducerName);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchInventoriesByStockId = fetchActionCreatorFactory<Inventory>(
  inventoryReducerName,
  'stockId'
);
export const fetchInventoriesByServicePointId = fetchActionCreatorFactory<Inventory>(
  inventoryReducerName,
  'servicePointId'
);

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
  stockIds?: string[];
}

/** gets all trees key'd by the rootNodes id
 *
 * @param store - the store
 * @param props - the filterProps
 */
const getIds = (store: Partial<Store>, props: Filters) => props.stockIds;

/** factory that returns a selector to retrieve the inventories using stockId or servicePointId ids */
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
