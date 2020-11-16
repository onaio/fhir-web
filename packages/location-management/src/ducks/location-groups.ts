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
export interface LocationGroup {
  id: number;
  active: boolean;
  name: string;
  description: string;
}

/** reducer name for the Item module */
export const reducerName = 'location-tags';

/** Action types */
const customfetchedActionType = 'location-tags/LOCATION_TAGS_FETCHED';
const customRemoveActionType = 'location-tags/REMOVE_LOCATION_TAGS';
const customSetTotalRecordsActionType = 'location-tags/SET_TOTAL_LOCATION_TAGS';

/** Item Reducer */
const reducer = reducerFactory<LocationGroup>(
  reducerName,
  customfetchedActionType,
  customRemoveActionType,
  customSetTotalRecordsActionType
);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchLocationGroups = fetchActionCreatorFactory<LocationGroup>(reducerName, 'id');
export const removeLocationGroups = removeActionCreatorFactory(reducerName);
export const setTotalLocationGroups = setTotalRecordsFactory(reducerName);

// selectors
export const getLocationGroupsById = getItemsByIdFactory<LocationGroup>(reducerName);
export const getLocationGroupById = getItemByIdFactory<LocationGroup>(reducerName);
export const getLocationGroupsArray = getItemsArrayFactory<LocationGroup>(reducerName);
export const getTotalLocationGroups = getTotalRecordsFactory(reducerName);

export default reducer;
