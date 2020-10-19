/** Enum representing the possible location unit status types */
export declare enum LocationUnitStatus {
    ACTIVE = "Active",
    INACTIVE = "InActive"
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
export declare const reducerName = "location-units";
/** Item Reducer */
declare const reducer: (state: import("@opensrp/reducer-factory/dist/types").ImmutableObjectState<LocationUnit> | undefined, action: import("@opensrp/reducer-factory/dist/types").ItemsActionTypes<LocationUnit>) => import("@opensrp/reducer-factory/dist/types").ImmutableObjectState<LocationUnit>;
/** actionCreator returns action to to add Item records to store */
export declare const fetchLocationUnits: (objectsList?: LocationUnit[] | undefined) => import("@opensrp/reducer-factory/dist/types").FetchAction<LocationUnit>;
export declare const removeLocationUnits: () => import("@opensrp/reducer-factory/dist/types").RemoveAction;
export declare const setTotalLocationUnits: (totalCount: number) => import("@opensrp/reducer-factory/dist/types").SetTotalRecordsAction;
export declare const getLocationsUnitsById: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => import("@onaio/utils/dist/types/types").Dictionary<LocationUnit>;
export declare const getLocationUnitById: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>, id: string) => LocationUnit | null;
export declare const getLocationUnitsArray: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => LocationUnit[];
export declare const getTotalLocationUnits: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => number;
export default reducer;
