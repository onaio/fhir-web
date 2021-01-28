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
export const fetchInventories = fetchActionCreatorFactory<Inventory>(
  inventoryReducerName,
  'servicePointId'
);
export const removeInventories = removeActionCreatorFactory(inventoryReducerName);
export const setTotalInventories = setTotalRecordsFactory(inventoryReducerName);

// selectors
export const getInventoriesArray = getItemsArrayFactory<Inventory>(inventoryReducerName);
export const getTotalInventories = getTotalRecordsFactory(inventoryReducerName);

export const getStore = (store: Partial<Store>) => {
  return (store as Dictionary)[inventoryReducerName].objectsById as Dictionary<Inventory>;
};

interface Filters {
  servicePointIds?: string[];
  servicePointId?: string;
}

const getIds = (store: Partial<Store>, props: Filters) => props.servicePointIds;
const getId = (store: Partial<Store>, props: Filters) => props.servicePointId;

export const getInventoryById = createSelector(getStore, getId, (inventory, id) => {
  if (id) {
    return inventory[id];
  }
  return inventory;
});

export const getInventoriesByIds = createSelector(getStore, getIds, (inventoriesByIds, ids) => {
  if (ids) {
    const inventoriesOfInterest: Inventory[] = [];
    ids.forEach((id) => {
      inventoriesOfInterest.push(inventoriesByIds[id]);
    });
    return inventoriesOfInterest;
  }
  return values(inventoriesByIds);
});
