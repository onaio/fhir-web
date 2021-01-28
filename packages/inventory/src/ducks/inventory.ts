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
import { getItemByIdFactory } from 'opensrp-reducer-factory';

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
export const getInventoryById = getItemByIdFactory<Inventory>(inventoryReducerName);
export const getInventoriesArray = getItemsArrayFactory<Inventory>(inventoryReducerName);
export const getTotalInventories = getTotalRecordsFactory(inventoryReducerName);

export const getInventoriesByIds = (store: Partial<Store>) => {
  return (store as Dictionary)[inventoryReducerName] as Dictionary<Inventory>;
};

interface Filters {
  servicePointIds?: string[];
}

const getId = (store: Partial<Store>, props: Filters) => props.servicePointIds;

export const getInventoryByIdFactory = () =>
  createSelector(getInventoriesByIds, getId, (inventoriesByIds, ids) => {
    if (ids === undefined) {
      return values(inventoriesByIds);
    }
    const inventoriesOfInterest: Inventory[] = [];
    ids.forEach((id) => {
      inventoriesOfInterest.push(inventoriesByIds[id]);
    });
    return inventoriesOfInterest;
  });
