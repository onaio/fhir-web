/** describes an ANC client object */
export interface ANCClientType {
<<<<<<< HEAD
  type: 'Client';
  dateCreated: string | number;
  serverVersion: number;
  clientApplicationVersion: number;
  clientDatabaseVersion: number;
  baseEntityId: string;
  identifiers: {
    [key: string]: string | null;
  };
}
/** reducer name for the ANC module */
export declare const reducerName = 'opensrp-web/client-type/ANC';
/** ANC Reducer */
declare const reducer: (
  state: import('..').ImmutableObjectState<ANCClientType> | undefined,
  action: import('..').ItemsActionTypes<ANCClientType>
) => import('..').ImmutableObjectState<ANCClientType>;
/** actionCreator returns action to to add anc records to store */
export declare const fetchANC: (
  objectsList?: ANCClientType[]
) => import('..').FetchAction<ANCClientType>;
export declare const removeANCAction: () => import('..').RemoveAction;
export declare const setTotalANCRecords: (totalCount: number) => import('..').SetTotalRecordsAction;
export declare const getAllANCById: (
  state: Partial<import('redux').Store<any, import('redux').AnyAction>>
) => import('@onaio/utils/dist/types/types').Dictionary<ANCClientType>;
export declare const getANCById: (
  state: Partial<import('redux').Store<any, import('redux').AnyAction>>,
  id: string
) => ANCClientType | null;
export declare const getAllANCArray: (
  state: Partial<import('redux').Store<any, import('redux').AnyAction>>
) => ANCClientType[];
export declare const getTotalANCRecords: (
  state: Partial<import('redux').Store<any, import('redux').AnyAction>>
) => number;
=======
    type: 'Client';
    dateCreated: string | number;
    serverVersion: number;
    clientApplicationVersion: number;
    clientDatabaseVersion: number;
    baseEntityId: string;
    identifiers: {
        [key: string]: string | null;
    };
}
/** reducer name for the ANC module */
export declare const reducerName = "opensrp-web/client-type/ANC";
/** ANC Reducer */
declare const reducer: (state: import("..").ImmutableObjectState<ANCClientType> | undefined, action: import("..").ItemsActionTypes<ANCClientType>) => import("..").ImmutableObjectState<ANCClientType>;
/** actionCreator returns action to to add anc records to store */
export declare const fetchANC: (objectsList?: ANCClientType[]) => import("..").FetchAction<ANCClientType>;
export declare const removeANCAction: () => import("..").RemoveAction;
export declare const setTotalANCRecords: (totalCount: number) => import("..").SetTotalRecordsAction;
export declare const getAllANCById: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => import("@onaio/utils/dist/types/types").Dictionary<ANCClientType>;
export declare const getANCById: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>, id: string) => ANCClientType | null;
export declare const getAllANCArray: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => ANCClientType[];
export declare const getTotalANCRecords: (state: Partial<import("redux").Store<any, import("redux").AnyAction>>) => number;
>>>>>>> master
export default reducer;
export declare const ANCClient1: ANCClientType;
export declare const ANCClient2: ANCClientType;
export declare const client1: ANCClientType;
export declare const client2: ANCClientType;
