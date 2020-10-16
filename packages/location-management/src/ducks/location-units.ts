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

/** location tag interface */
export interface LocationTag {
  id: string;
  name: string;
}

/** geometry interface */
export interface Geometry {
  type: string;
  coordinates: Array<Array<Array<Array<number>>>>;
}

/** location interface */
export interface LocationUnit {
  id: string;
  properties: Properties;
  syncStatus: string;
  type: string;
  locationTags: LocationTag[];
  geometry: Geometry;
}

/** interface for the payload used when creating/updating a location unit */
export interface LocationUnitPayload {
  id?: string;
  type: string;
  syncStatus: string;
  serverVersion: string;
  properties: Properties;
  locationTags: LocationTag[];
  geometry: Geometry;
}

/** reducer name for the Item module */
export const reducerName = 'locations-unit';

/** Item Reducer */
const reducer = reducerFactory<LocationUnit>(reducerName);

// action
/** actionCreator returns action to to add Item records to store */
export const fetchItem = fetchActionCreatorFactory<LocationUnit>(reducerName, 'id');
export const removeItemAction = removeActionCreatorFactory(reducerName);
export const setTotalItemRecords = setTotalRecordsFactory(reducerName);

// selectors
export const getAllItemById = getItemsByIdFactory<LocationUnit>(reducerName);
export const getItemById = getItemByIdFactory<LocationUnit>(reducerName);
export const getAllItemArray = getItemsArrayFactory<LocationUnit>(reducerName);
export const getTotalItemRecords = getTotalRecordsFactory(reducerName);

export default reducer;
