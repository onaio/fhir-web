/** Assignments redux module */
import { Dictionary } from '@onaio/utils/dist/types/types';
import { Store } from 'redux';
import { AnyAction } from 'redux';
import SeamlessImmutable from 'seamless-immutable';

/** The reducer name */
export const reducerName = 'assignments';

/** interface for a Assignment object */
export interface Assignment {
  fromDate: string;
  jurisdictionId: string;
  organizationId: string;
  planId: string;
  toDate: string;
}

// action interfaces

/** action type for action that adds Assignments to store */
export const ASSIGNMENTS_FETCHED = 'src/ducks/assignments/ASSIGNMENTS_FETCHED';
/** action type for REMOVE_TEAMS action */
export const REMOVE_ASSIGNMENTS = 'src/ducks/assignments/reducer/REMOVE_ASSIGNMENTS';

/** interface for Assignments fetched action */
interface FetchAssignmentsAction extends AnyAction {
  assignments: Assignment[];
  type: typeof ASSIGNMENTS_FETCHED;
}

/** interface for action that removes assignments from store */
interface RemoveAssignmentsAction extends AnyAction {
  assignments: [];
  type: typeof REMOVE_ASSIGNMENTS;
}

/** single type for all action types */
type AssignmentActionTypes = FetchAssignmentsAction | RemoveAssignmentsAction | AnyAction;

/** interface for Assignments state in store */
interface AssignmentsStoreState {
  assignments: Assignment[];
}

// immutable assignments state in dux
export type ImmutableAssignmentsStoreState = AssignmentsStoreState &
  SeamlessImmutable.ImmutableObject<AssignmentsStoreState>;

/** initial state for Assignments records in store */
const initialAssignmentStoreState: ImmutableAssignmentsStoreState | Dictionary = SeamlessImmutable({
  assignments: [],
});

/** the Assignment reducer function
 *
 * @param {object} state - assignments state
 * @param {AnyAction} action  - action that handles assignments
 * @returns {object} - returns new assignment state
 */
export default function reducer(
  state = initialAssignmentStoreState,
  action: AssignmentActionTypes
) {
  switch (action.type) {
    case ASSIGNMENTS_FETCHED:
      return SeamlessImmutable({
        ...state,
        assignments: action.assignments,
      });
    case REMOVE_ASSIGNMENTS:
      return SeamlessImmutable({
        ...state,
        assignments: [],
      });
    default:
      return state;
  }
}

/** action to remove assignments form store_**/
export const removeAssignmentsAction = (): RemoveAssignmentsAction => {
  return {
    assignments: [],
    type: REMOVE_ASSIGNMENTS,
  };
};

// action creators

/** creates action to add fetched assignments to store
 *
 * @param {Array} assignments - array of assignments to be added to store
 * @returns {FetchAssignmentsAction} - action with assignments payload that is added to store
 */
export const fetchAssignments = (assignments: Assignment[]): FetchAssignmentsAction => {
  return {
    assignments,
    type: ASSIGNMENTS_FETCHED,
  };
};

// selectors

/** get assignments as an array
 *
 * @param {object} state - Portion of the store
 * @returns {Array} - returns assignments array
 */
export function getAssignments(state: Partial<Store>): Assignment[] {
  return (state as Dictionary)[reducerName].assignments;
}
