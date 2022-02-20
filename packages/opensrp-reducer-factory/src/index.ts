import { get, keyBy, values } from 'lodash';
import { Dictionary } from '@onaio/utils';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';

/** creates a union types that correctly matches against keys belonging to Obj whose value is of type keyType */
export type KeysWhoseValuesAreType<Obj, KeyType> = {
  [K in keyof Obj]: Obj[K] extends KeyType ? K : never;
}[keyof Obj];
export type ItemsIdFieldType<T> = KeysWhoseValuesAreType<T, string | number>;

// actions

/** FETCHED action type */
export let FETCHED = 'opensrp/reducer/objects/FETCHED';
/** REMOVE action type */
export let REMOVE = 'opensrp/reducer/objects/REMOVE';
/** SET_TOTAL_RECORDS action type */
export let SET_TOTAL_RECORDS = 'opensrp/reducer/objects/SET_TOTAL_RECORDS';

/**
 * interface for authorize action
 *  generic type - object type being handled by this function
 */
export interface FetchAction<ObjectType> extends AnyAction {
  objectsById: Dictionary<ObjectType>;
  type: typeof FETCHED;
  reducerName: string;
}

/** Interface for removeAction */
export interface RemoveAction extends AnyAction {
  objectsById: Record<string, unknown>;
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

/**
 * creates the action creator
 * ObjectType - generic type - object type being handled by this function
 *
 * @param {string} reducerName - generic name of reducer
 * @param {object} idField - key value whose value is more like an id for the objects,
 * this needs to be unique
 * @returns {function()} - the action creator
 */
export function fetchActionCreatorFactory<ObjectType>(
  reducerName: string,
  idField: ItemsIdFieldType<ObjectType>
) {
  /**
   * Fetch action
   *
   * @param {object []} objectsList - objects array to add to store
   * @returns {Function} - an action to add objects to redux store
   */
  return (objectsList: ObjectType[] = []): FetchAction<ObjectType> => ({
    /** HACK: casting object[field] to unknown since i don't know how to better handle this */
    objectsById: keyBy<ObjectType>(
      objectsList,
      (object: ObjectType) => object[idField] as unknown as string
    ),
    type: FETCHED,
    reducerName,
  });
}

/**
 * removeAction action ; action creator factory
 *
 * @param {string} reducerName - name of reducer
 * @returns {function()} - the action creator
 */
export const removeActionCreatorFactory = (reducerName: string) => (): RemoveAction => ({
  objectsById: {},
  type: REMOVE,
  reducerName,
});

/**
 * creates actions to set total records
 *
 * @param {string} reducerName - generic name of the reducer
 * @returns {function()} - the action creator
 */
export function setTotalRecordsFactory(reducerName: string) {
  /**
   * setTotalRecords action
   *
   * @param {number} totalCount -  the number of records got form api
   * @returns {function()} - the action creator
   */
  return (totalCount: number): SetTotalRecordsAction => ({
    totalRecords: totalCount,
    type: SET_TOTAL_RECORDS,
    reducerName,
  });
}

// The reducer

/**
 * interface for object state in redux store
 * ObjectType - generic type - objects type being handled by this function
 */
interface ObjectState<ObjectType> {
  objectsById: { [key: string]: ObjectType };
  totalRecords: number;
}

/**
 * Create an immutable object state
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

/**
 * ObjectType - generic type - object type being handled by this function
 */

/**
 * factory function to create reducer
 *
 * @param {string} reducerName - generic reducer name
 * @param {string} fetchedActionType - custom value for action type FETCHED
 * @param {string} removeActionType - custom value for action type REMOVE
 * @param {string} setTotalRecordsActionType - custom value for action type SET_TOTAL_RECORDS
 * @returns {object} - the state
 */
export const reducerFactory = <ObjectType>(
  reducerName: string,
  fetchedActionType: string = FETCHED,
  removeActionType: string = REMOVE,
  setTotalRecordsActionType: string = SET_TOTAL_RECORDS
) =>
  /** the objects reducer function */
  function reducer(
    state: ImmutableObjectState<ObjectType> = initialState,
    action: ItemsActionTypes<ObjectType>
  ): ImmutableObjectState<ObjectType> {
    const actionReducerName = action.reducerName;
    if (reducerName !== actionReducerName) {
      return state;
    }
    FETCHED = fetchedActionType;
    REMOVE = removeActionType;
    SET_TOTAL_RECORDS = setTotalRecordsActionType;

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

/**
 * factory function that creates selector
 *  ObjectType - generic type - object type being handled by this function
 *
 *  @param {string} reducerName - the reducerName
 *  @returns {function()} - function that returns the state
 */
export const getItemsByIdFactory = <ObjectType>(
  reducerName: string
): ((state: Partial<Store>) => Dictionary<ObjectType>) => {
  /**
   * returns all objects in the store as values whose keys are their respective ids
   *
   * @param {object} state - the redux store
   * @returns {object} - an object whose keys are the ids
   */
  return function (state: Partial<Store>): Dictionary<ObjectType> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (state as any)[reducerName].objectsById;
  };
};

/**
 * factory function that creates selector
 *
 * @param {string} reducerName - name of the reducer
 * @returns {function()} - an array of object type being handled by this function
 */
export const getItemsArrayFactory = <ObjectType>(reducerName: string) =>
  /**
   * gets an array of objects
   *
   * @param {Dictionary} state - the redux store
   * @returns {object[]} - an array of objs
   */
  function (state: Partial<Store>): ObjectType[] {
    const getItemsById = getItemsByIdFactory<ObjectType>(reducerName);
    return values<ObjectType>(getItemsById(state));
  };

/**
 * factory function that creates selector
 *
 * @param {string} reducerName -  name of reducer
 * @returns {function()} - object type being handled by this function
 */
export const getItemByIdFactory = <ObjectType>(reducerName: string) =>
  /**
   * get a specific object by their id
   *
   * @param {Dictionary} state - the redux store
   * @returns {Dictionary | null} a obj if the id is found else null
   */
  function (state: Partial<Store>, id: string): ObjectType | null {
    return get(getItemsByIdFactory<ObjectType>(reducerName)(state), id)
      ? get(getItemsByIdFactory<ObjectType>(reducerName)(state), id)
      : null;
  };

/**
 * factory function that creates selector
 *
 * @param {string} reducerName -  name of reducer
 * @returns {function()} - function that returns the total number of records
 */
export const getTotalRecordsFactory = (reducerName: string) =>
  /**
   * returns the count of all records present in server
   *
   * @param {Dictionary} state - the redux store
   * @returns { number } - total records value from the store
   */
  function (state: Partial<Store>): number {
    return (state as Dictionary)[reducerName].totalRecords;
  };
