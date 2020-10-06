import { get, keyBy, values, Dictionary } from 'lodash';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';

/** creates a union types that correctly matches against keys belonging to Obj whose value is of type keyType */
export type KeysWhoseValuesAreType<Obj, KeyType> = { [K in keyof Obj]: Obj[K] extends KeyType ? K : never }[keyof Obj];
export type ItemsIdFieldType<T> = KeysWhoseValuesAreType<T, string | number>;

// actions

/** FETCHED action type */
export const FETCHED = 'opensrp/reducer/objects/FETCHED';
/** REMOVE action type */
export const REMOVE = 'opensrp/reducer/objects/REMOVE';
/** SET_TOTAL_RECORDS action type */
export const SET_TOTAL_RECORDS = 'opensrp/reducer/objects/SET_TOTAL_RECORDS';

/** Interface for an object that is allowed to have any property */
export interface FlexObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/** interface for authorize action
 *  generic type - object type being handled by this function
 */
export interface FetchAction<ObjectType> extends AnyAction {
    objectsById: Dictionary<ObjectType>;
    type: typeof FETCHED;
    reducerName: string;
}

/** Interface for removeAction */
export interface RemoveAction extends AnyAction {
    objectsById: {};
    type: typeof REMOVE;
    reducerName: string;
}

/** Interface for setTotalRecordsAction */
export interface SetTotalRecordsAction extends AnyAction {
    totalRecords: number;
    type: typeof SET_TOTAL_RECORDS;
    reducerName: string;
}

/** Create type for objects reducer actions */
export type ItemsActionTypes<ObjectType> = FetchAction<ObjectType> | RemoveAction | AnyAction;

// factory methods for action creators

/** creates the action creator
 * ObjectType - generic type - object type being handled by this function
 * @param {string} reducerName - generic name of reducer
 * @param {ItemsIdFieldType<>} idField - key value whose value is more like an id for the objects,
 * this needs to be unique
 * @returns {(objectsList: ObjectType[] = []): FetchAction<ObjectType>} - the action creator
 */
export function fetchActionCreatorFactory<ObjectType>(reducerName: string, idField: ItemsIdFieldType<ObjectType>) {
    /** Fetch action creator
     * @param {object []} objectsList - objects array to add to store
     * @return {FetchAction} - an action to add objects to redux store
     */
    return (objectsList: ObjectType[] = []): FetchAction<ObjectType> => ({
        /** HACK: casting object[field] to unknown since i don't know how to better handle this */
        objectsById: keyBy<ObjectType>(objectsList, (object: ObjectType) => (object[idField] as unknown) as string),
        type: FETCHED,
        reducerName,
    });
}

/** removeAction action ; action creator factory
 * @param {string} reducerName - name of reducer
 * @returns {(): RemoveAction} - the action creator
 */
export const removeActionCreatorFactory = (reducerName: string) => (): RemoveAction => ({
    objectsById: {},
    type: REMOVE,
    reducerName,
});

/** creates actions to set total records */
export function setTotalRecordsFactory(reducerName: string) {
    /** setTotalRecords action
     * @param {number} totalCount -  the number of records got form api
     */
    return (totalCount: number): SetTotalRecordsAction => ({
        totalRecords: totalCount,
        type: SET_TOTAL_RECORDS,
        reducerName,
    });
}

// The reducer

/** interface for object state in redux store
 * ObjectType - generic type - objects type being handled by this function
 */
interface ObjectState<ObjectType> {
    objectsById: { [key: string]: ObjectType };
    totalRecords: number;
}

/** Create an immutable object state
 * ObjectType - generic type - object type being handled by this function
 */
export type ImmutableObjectState<ObjectType> = ObjectState<ObjectType> &
    SeamlessImmutable.ImmutableObject<ObjectState<ObjectType>>;

/** initial state */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: ImmutableObjectState<any> = SeamlessImmutable({
    objectsById: {},
    totalRecords: 0,
});

/** factory function to create reducer
 * ObjectType - generic type - object type being handled by this function
 */
export const reducerFactory = <ObjectType>(reducerName: string) =>
    /** the objects reducer function */
    function reducer(
        state: ImmutableObjectState<ObjectType> = initialState,
        action: ItemsActionTypes<ObjectType>,
    ): ImmutableObjectState<ObjectType> {
        const actionReducerName = action.reducerName;
        if (reducerName !== actionReducerName) {
            return state;
        }
        switch (action.type) {
            case FETCHED:
                return SeamlessImmutable({
                    ...state,
                    objectsById: { ...state.objectsById, ...action.objectsById },
                });
            case REMOVE:
                return SeamlessImmutable({
                    ...state,
                    objectsById: action.objectsById,
                });
            case SET_TOTAL_RECORDS:
                return SeamlessImmutable({
                    ...state,
                    totalRecords: action.totalRecords,
                });
            default:
                return state;
        }
    };

// Selectors

/** factory function that creates selector
 * ObjectType - generic type - object type being handled by this function
 *  @param {string} reducerName - the reducerName
 *  @returns {((state: Partial<Store>) => Dictionary<ObjectType>)}
 */
export const getItemsByIdFactory = <ObjectType>(
    reducerName: string,
): ((state: Partial<Store>) => Dictionary<ObjectType>) => {
    /** returns all objects in the store as values whose keys are their respective ids
     * @param {Partial<Store>} state - the redux store
     */
    return function(state: Partial<Store>): Dictionary<ObjectType> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (state as any)[reducerName].objectsById;
    };
};

/** factory function that creates selector
 * ObjectType - generic type - object type being handled by this function
 * @param {string} reducerName - name of the reducer
 * @returns {(state: Partial<Store>): ObjectType[]}
 */
export const getItemsArrayFactory = <ObjectType>(reducerName: string) =>
    /** gets an array of objects
     * @param {Partial<Store>} state - the redux store
     * @return {Item[]} - an array of objs
     */
    function(state: Partial<Store>): ObjectType[] {
        const getItemsById = getItemsByIdFactory<ObjectType>(reducerName);
        return values<ObjectType>(getItemsById(state));
    };

/** factory function that creates selector
 * ObjectType - generic type - object type being handled by this function
 * @param {string} - reducerName -  name of reducer
 * @returns {(state: Partial<Store>, id: string): ObjectType | null}
 */
export const getItemByIdFactory = <ObjectType>(reducerName: string) =>
    /** get a specific object by their id
     * @param {Partial<Store>} state - the redux store
     * @return {Item | null} a obj if the id is found else null
     */
    function(state: Partial<Store>, id: string): ObjectType | null {
        return get(getItemsByIdFactory<ObjectType>(reducerName)(state), id) || null;
    };

/** factory function that creates selector
 * ObjectType - generic type - object type being handled by this function
 * @param {string} reducerName -  name of reducer
 * @returns {(state: Partial<Store<any, AnyAction>>) => number}
 */
export const getTotalRecordsFactory = (reducerName: string) =>
    /** returns the count of all records present in server
     * @param {Partial<Store>} state - the redux store
     * @return { number } - total records value from the store
     */
    function(state: Partial<Store>): number {
        return (state as FlexObject)[reducerName].totalRecords;
    };
