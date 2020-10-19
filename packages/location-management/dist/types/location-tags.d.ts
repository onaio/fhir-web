/** interface for location group **/
export interface LocationTag {
    id: string;
    active: boolean;
    name: string;
    description: string;
}
/** reducer name for the Item module */
export declare const reducerName = "location-tags";
/** Item Reducer */
declare const reducer: (state: import("@opensrp/reducer-factory/dist/types").ImmutableObjectState<LocationTag> | undefined, action: import("@opensrp/reducer-factory/dist/types").ItemsActionTypes<LocationTag>) => import("@opensrp/reducer-factory/dist/types").ImmutableObjectState<LocationTag>;
/** actionCreator returns action to to add Item records to store */
export declare const fetchLocationTags: (objectsList?: LocationTag[] | undefined) => import("@opensrp/reducer-factory/dist/types").FetchAction<LocationTag>;
export declare const removeLocationTags: () => import("@opensrp/reducer-factory/dist/types").RemoveAction;
export declare const setTotalLocationtags: (totalCount: number) => import("@opensrp/reducer-factory/dist/types").SetTotalRecordsAction;
export declare const getLocationTagsById: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => import("@onaio/utils/dist/types/types").Dictionary<LocationTag>;
export declare const getLocationTagById: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>, id: string) => LocationTag | null;
export declare const getLocationTagsArray: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => LocationTag[];
export declare const getTotalLocationTags: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => number;
export default reducer;
