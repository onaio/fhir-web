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

/** interface for location group **/
export interface LocationTag {
  id: string;
  active: boolean;
  name: string;
  description: string;
}

/** reducer name for the Item module */
export const reducerName = 'location-tags';

/** Item Reducer */
const reducer = reducerFactory<LocationTag>(reducerName);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchItem = fetchActionCreatorFactory<LocationTag>(reducerName, 'id');
export const removeItemAction = removeActionCreatorFactory(reducerName);
export const setTotalItemRecords = setTotalRecordsFactory(reducerName);

// selectors
export const getAllItemById = getItemsByIdFactory<LocationTag>(reducerName);
export const getItemById = getItemByIdFactory<LocationTag>(reducerName);
export const getAllItemArray = getItemsArrayFactory<LocationTag>(reducerName);
export const getTotalItemRecords = getTotalRecordsFactory(reducerName);

export default reducer;
