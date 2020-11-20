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
import { Geometry } from 'geojson';
import { Dictionary, values } from 'lodash';
import { Store } from 'redux';

/** Enum representing the possible location unit status types */
export enum LocationUnitStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
}

export enum LocationUnitSyncStatus {
  SYNCED = 'Synced',
  NOTSYNCED = 'NotSynced',
}

/** interface for LocationUnit.properties */
export interface Properties extends Dictionary<string | number | LocationUnitStatus | undefined> {
  name: string;
  parentId: string;
  status: LocationUnitStatus;
  geographicLevel?: number;
  username?: string;
  version?: number;
  name_en?: string;
  externalId?: string;
}

/** location unit tag interface */
export interface LocationUnitTag {
  id: number;
  name: string;
}

/** location interface */
export interface LocationUnit {
  id: string | number;
  properties: Properties;
  syncStatus: LocationUnitSyncStatus;
  type: string;
  locationTags?: LocationUnitTag[];
  geometry?: Geometry;
}

/** interface for the POST payload */
export interface LocationUnitPayloadPOST {
  properties: Properties;
  syncStatus?: LocationUnitSyncStatus;
  type: string;
  locationTags?: LocationUnitTag[];
  geometry?: Geometry;
  // we will remove this id as it should be auto generated on server
  id: string | number;
}

/** interface for the PUT payload */
export interface LocationUnitPayloadPUT extends LocationUnitPayloadPOST {
  id: string | number;
}

/** reducer name for the Item module */
export const reducerName = 'location-units';

/** Action types */
const customfetchedActionType = 'location-units/LOCATION_UNITS_FETCHED';
const customRemoveActionType = 'location-units/REMOVE_LOCATION_UNITS';
const customSetTotalRecordsActionType = 'location-units/SET_TOTAL_LOCATION_UNITS';

/** Item Reducer */
const reducer = reducerFactory<LocationUnit>(
  reducerName,
  customfetchedActionType,
  customRemoveActionType,
  customSetTotalRecordsActionType
);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchLocationUnits = fetchActionCreatorFactory<LocationUnit>(reducerName, 'id');
export const removeLocationUnits = removeActionCreatorFactory(reducerName);
export const setTotalLocationUnits = setTotalRecordsFactory(reducerName);

// selectors
export const getLocationUnitsById = getItemsByIdFactory<LocationUnit>(reducerName);
export const getLocationUnitById = getItemByIdFactory<LocationUnit>(reducerName);
export const getLocationUnitsArray = getItemsArrayFactory<LocationUnit>(reducerName);
export const getTotalLocationUnits = getTotalRecordsFactory(reducerName);

export const LocationUnitsArray = (state: Partial<Store>): LocationUnit[] =>
  values(getLocationUnitsById(state) || {});

export default reducer;
