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

/** interface for location Group **/
export interface LocationGroup {
  id: number;
  active: boolean;
  name: string;
  description: string;
}

export interface LocationGroupPayloadPOST {
  active: boolean;
  name: string;
  description: string;
}

export interface LocationGroupPayloadPUT extends LocationGroupPayloadPOST {
  id: string;
}

/** reducer name for the Item module */
export const reducerName = 'location-groups';

/** Action types */
const customfetchedActionType = 'location-groups/LOCATION_GROUPS_FETCHED';
const customRemoveActionType = 'location-groups/REMOVE_LOCATION_GROUPS';
const customSetTotalRecordsActionType = 'location-groups/SET_TOTAL_LOCATION_GROUPS';

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
export const setTotalLocationgroups = setTotalRecordsFactory(reducerName);

// selectors
export const getLocationGroupsById = getItemsByIdFactory<LocationGroup>(reducerName);
export const getLocationGroupById = getItemByIdFactory<LocationGroup>(reducerName);
export const getLocationGroupsArray = getItemsArrayFactory<LocationGroup>(reducerName);
export const getTotalLocationGroups = getTotalRecordsFactory(reducerName);

export default reducer;
