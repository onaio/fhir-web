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
const reducer = reducerFactory<LocationTag>(
  reducerName,
  customfetchedActionType,
  customRemoveActionType,
  customSetTotalRecordsActionType
);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchLocationTags = fetchActionCreatorFactory<LocationTag>(reducerName, 'id');
export const removeLocationTags = removeActionCreatorFactory(reducerName);
export const setTotalLocationtags = setTotalRecordsFactory(reducerName);

// selectors
export const getLocationTagsById = getItemsByIdFactory<LocationTag>(reducerName);
export const getLocationTagById = getItemByIdFactory<LocationTag>(reducerName);
export const getLocationTagsArray = getItemsArrayFactory<LocationTag>(reducerName);
export const getTotalLocationTags = getTotalRecordsFactory(reducerName);

export default reducer;
