import { Geometry } from 'geojson';
/** Enum representing the possible location unit status types */
export declare enum LocationUnitStatus {
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
export declare const reducerName = 'location-units';
/** Item Reducer */
declare const reducer: (
  state:
    | import('@opensrp/reducer-factory/dist/types').ImmutableObjectState<LocationUnit>
    | undefined,
  action: import('@opensrp/reducer-factory/dist/types').ItemsActionTypes<LocationUnit>
) => import('@opensrp/reducer-factory/dist/types').ImmutableObjectState<LocationUnit>;
/** actionCreator returns action to to add Item records to store */
export declare const fetchLocationUnits: (
  objectsList?: LocationUnit[] | undefined
) => import('@opensrp/reducer-factory/dist/types').FetchAction<LocationUnit>;
export declare const removeLocationUnits: () => import('@opensrp/reducer-factory/dist/types').RemoveAction;
export declare const setTotalLocationUnits: (
  totalCount: number
) => import('@opensrp/reducer-factory/dist/types').SetTotalRecordsAction;
export declare const getLocationUnitsById: (
  state: Partial<import('redux').Store<any, import('redux').AnyAction>>
) => import('@onaio/utils/dist/types/types').Dictionary<LocationUnit>;
export declare const getLocationUnitById: (
  state: Partial<import('redux').Store<any, import('redux').AnyAction>>,
  id: string
) => LocationUnit | null;
export declare const getLocationUnitsArray: (
  state: Partial<import('redux').Store<any, import('redux').AnyAction>>
) => LocationUnit[];
export declare const getTotalLocationUnits: (
  state: Partial<import('redux').Store<any, import('redux').AnyAction>>
) => number;
export default reducer;
