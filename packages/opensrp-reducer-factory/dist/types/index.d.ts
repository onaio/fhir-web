import { Dictionary } from 'lodash';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';
/** creates a union types that correctly matches against keys belonging to Obj whose value is of type keyType */
export declare type KeysWhoseValuesAreType<Obj, KeyType> = {
    [K in keyof Obj]: Obj[K] extends KeyType ? K : never;
}[keyof Obj];
export declare type ItemsIdFieldType<T> = KeysWhoseValuesAreType<T, string | number>;
/** FETCHED action type */
export declare const FETCHED = "opensrp/reducer/objects/FETCHED";
/** REMOVE action type */
export declare const REMOVE = "opensrp/reducer/objects/REMOVE";
/** SET_TOTAL_RECORDS action type */
export declare const SET_TOTAL_RECORDS = "opensrp/reducer/objects/SET_TOTAL_RECORDS";
/** Interface for an object that is allowed to have any property */
export interface FlexObject {
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
export declare type ItemsActionTypes<ObjectType> = FetchAction<ObjectType> | RemoveAction | AnyAction;
/** creates the action creator
 * ObjectType - generic type - object type being handled by this function
 * @param {string} reducerName - generic name of reducer
 * @param {ItemsIdFieldType<>} idField - key value whose value is more like an id for the objects,
 * this needs to be unique
 * @returns {(objectsList: ObjectType[] = []): FetchAction<ObjectType>} - the action creator
 */
export declare function fetchActionCreatorFactory<ObjectType>(reducerName: string, idField: ItemsIdFieldType<ObjectType>): (objectsList?: ObjectType[]) => FetchAction<ObjectType>;
/** removeAction action ; action creator factory
 * @param {string} reducerName - name of reducer
 * @returns {(): RemoveAction} - the action creator
 */
export declare const removeActionCreatorFactory: (reducerName: string) => () => RemoveAction;
/** creates actions to set total records */
export declare function setTotalRecordsFactory(reducerName: string): (totalCount: number) => SetTotalRecordsAction;
/** interface for object state in redux store
 * ObjectType - generic type - objects type being handled by this function
 */
interface ObjectState<ObjectType> {
    objectsById: {
        [key: string]: ObjectType;
    };
    totalRecords: number;
}
/** Create an immutable object state
 * ObjectType - generic type - object type being handled by this function
 */
export declare type ImmutableObjectState<ObjectType> = ObjectState<ObjectType> & SeamlessImmutable.ImmutableObject<ObjectState<ObjectType>>;
/** factory function to create reducer
 * ObjectType - generic type - object type being handled by this function
 */
export declare const reducerFactory: <ObjectType>(reducerName: string) => (state: ImmutableObjectState<ObjectType> | undefined, action: ItemsActionTypes<ObjectType>) => ImmutableObjectState<ObjectType>;
/** factory function that creates selector
 * ObjectType - generic type - object type being handled by this function
 *  @param {string} reducerName - the reducerName
 *  @returns {((state: Partial<Store>) => Dictionary<ObjectType>)}
 */
export declare const getItemsByIdFactory: <ObjectType>(reducerName: string) => (state: Partial<Store<any, AnyAction>>) => Dictionary<ObjectType>;
/** factory function that creates selector
 * ObjectType - generic type - object type being handled by this function
 * @param {string} reducerName - name of the reducer
 * @returns {(state: Partial<Store>): ObjectType[]}
 */
export declare const getItemsArrayFactory: <ObjectType>(reducerName: string) => (state: Partial<Store<any, AnyAction>>) => ObjectType[];
/** factory function that creates selector
 * ObjectType - generic type - object type being handled by this function
 * @param {string} - reducerName -  name of reducer
 * @returns {(state: Partial<Store>, id: string): ObjectType | null}
 */
export declare const getItemByIdFactory: <ObjectType>(reducerName: string) => (state: Partial<Store<any, AnyAction>>, id: string) => ObjectType | null;
/** factory function that creates selector
 * ObjectType - generic type - object type being handled by this function
 * @param {string} reducerName -  name of reducer
 * @returns {(state: Partial<Store<any, AnyAction>>) => number}
 */
export declare const getTotalRecordsFactory: (reducerName: string) => (state: Partial<Store<any, AnyAction>>) => number;
export {};
