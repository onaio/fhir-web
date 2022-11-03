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

/** interface for location Unit Group */
export interface LocationUnitGroup {
  id: number;
  active: boolean;
  name: string;
  description: string;
}

export interface LocationUnitGroupPayloadPOST {
  active: boolean;
  name: string;
  description: string;
}

export interface LocationUnitGroupPayloadPUT extends LocationUnitGroupPayloadPOST {
  id: string;
}

/** reducer name for the Item module */
export const reducerName = 'location-unit-groups';

/** Item Reducer */
export const reducer = reducerFactory<LocationUnitGroup>(reducerName);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchLocationUnitGroups = fetchActionCreatorFactory<LocationUnitGroup>(
  reducerName,
  'id'
);
export const removeLocationUnitGroups = removeActionCreatorFactory(reducerName);
export const setTotalLocationunitgroups = setTotalRecordsFactory(reducerName);

// selectors
export const getLocationUnitGroupsById = getItemsByIdFactory<LocationUnitGroup>(reducerName);
export const getLocationUnitGroupById = getItemByIdFactory<LocationUnitGroup>(reducerName);
export const getLocationUnitGroupsArray = getItemsArrayFactory<LocationUnitGroup>(reducerName);
export const getTotalLocationUnitGroups = getTotalRecordsFactory(reducerName);

export default reducer;
