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
import { Geometry } from '@turf/turf';

/** Enum representing the possible location unit status types */
export enum LocationUnitStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
}

/** interface for LocationUnit.properties */
export interface Properties {
  geographicLevel: number;
  name: string;
  parentId: string;
  status: LocationUnitStatus;
  username: string;
  version: number;
  name_en: string;
  externalId: string;
  OpenMRS_Id: string;
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
  syncStatus: string;
  type: string;
  locationTags: LocationUnitTag[];
  geometry: Geometry;
}

/** interface for the PUT payload */
export interface LocationUnitPayloadPUT {
  id: string;
  type: string;
  syncStatus: string;
  serverVersion: string;
  properties: Properties;
  locationTags: LocationUnitTag[];
  geometry: Geometry;
}

/** interface for POST payload */
export interface LocationUnitPayloadPOST {
  type: string;
  syncStatus: string;
  properties: Properties;
  locationTags: LocationUnitTag[];
  geometry: Geometry;
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

export default reducer;
