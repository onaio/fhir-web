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
  uuid: string; // received by the response thought we dont really use it
  settingsId: string; // received by the response thought we dont really use it
  settingIdentifier: string; // received by the response thought we dont really use it
  settingMetadataId: string; // received by the response thought we dont really use it
  v1Settings: boolean; // received by the response thought we dont really use it
  resolveSettings: boolean; // received by the response thought we dont really use it
  documentId: string; // received by the response thought we dont really use it
  serverVersion: number; // received by the response thought we dont really use it
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

export interface ServiceType {
  name: string;
}

/** interface for LocationUnit.properties */
export interface Properties
  extends Dictionary<
    string | number | LocationUnitStatus | ServiceType[] | undefined | string[] | number[]
  > {
  name: string;
  parentId: string;
  status: LocationUnitStatus;
  geographicLevel?: number;
  username?: string;
  version?: number;
  name_en?: string;
  externalId?: string;
  serviceTypes?: ServiceType[];
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
  geometry?: Geometry; // todo : need to implement the functionality
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
export const locationUnitsReducerName = 'location-units';

/** Item Reducer */
export const locationUnitsReducer = reducerFactory<LocationUnit>(locationUnitsReducerName);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchLocationUnits = fetchActionCreatorFactory<LocationUnit>(
  locationUnitsReducerName,
  'id'
);
export const removeLocationUnits = removeActionCreatorFactory(locationUnitsReducerName);
export const setTotalLocationUnits = setTotalRecordsFactory(locationUnitsReducerName);

// selectors
export const getLocationUnitsById = getItemsByIdFactory<LocationUnit>(locationUnitsReducerName);
export const getLocationUnitById = getItemByIdFactory<LocationUnit>(locationUnitsReducerName);
export const getLocationUnitsArray = getItemsArrayFactory<LocationUnit>(locationUnitsReducerName);
export const getTotalLocationUnits = getTotalRecordsFactory(locationUnitsReducerName);
