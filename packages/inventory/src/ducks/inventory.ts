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
export const reducerName = 'inventory';

/** Action types */
const customfetchedActionType = 'inventory/INVENTORIES_FETCHED';
const customRemoveActionType = 'inventory/REMOVE_INVENTORIES';
const customSetTotalRecordsActionType = 'inventory/SET_TOTAL_INVENTORIES';

/** Item Reducer */
const reducer = reducerFactory<Inventory>(
  reducerName,
  customfetchedActionType,
  customRemoveActionType,
  customSetTotalRecordsActionType
);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchInventories = fetchActionCreatorFactory<Inventory>(reducerName, 'servicePointId');
export const removeInventories = removeActionCreatorFactory(reducerName);
export const setTotalInventories = setTotalRecordsFactory(reducerName);

// selectors
export const getInventoriesById = getItemsByIdFactory<Inventory>(reducerName);
export const getInventoryById = getItemByIdFactory<Inventory>(reducerName);
export const getInventoriesArray = getItemsArrayFactory<Inventory>(reducerName);
export const getTotalInventories = getTotalRecordsFactory(reducerName);

export default reducer;
