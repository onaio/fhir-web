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
import { Dictionary } from '@onaio/utils';
import { Geometry } from 'geojson';

/** interface for extra fields in location properties **/

export interface ExtraField {
  key: string; // key with which the the payload will be sent to server
  value?: string | number; // default value of the field
  label?: string; // label of the field
  description?: string; // default placeholder of the field
  type: 'email' | 'number' | 'password' | 'text' | 'time' | 'url'; // type of the field
}

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
  type: string;
  locationTags?: LocationUnitTag[];
  geometry?: Geometry; // todo : need to impliment the functionality
  syncStatus?: LocationUnitSyncStatus;
  parentId?: string;
  serverVersion?: number; // received by the response thought we dont really use it
}

/** interface for the POST payload */
export interface LocationUnitPayloadPOST {
  id: string | number; // todo : we will remove this later as it should be auto generated on server
  properties: Properties;
  type: string;
  locationTags?: LocationUnitTag[];
  geometry?: Geometry; // todo : need to impliment its functionality
  syncStatus: LocationUnitSyncStatus;
  textEntry?: string[];
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

export default reducer;
