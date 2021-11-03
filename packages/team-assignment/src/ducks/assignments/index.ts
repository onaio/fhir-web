/** Assignments redux module */
import { Dictionary } from '@onaio/utils';
import { get, uniqWith } from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';
import { Store } from 'redux';
import { AnyAction } from 'redux';
import SeamlessImmutable from 'seamless-immutable';

/** The reducer name */
export const assignmentsReducerName = 'assignments';

/** the raw assignment object as received from openSRP API */
export interface RawAssignment {
  jurisdictionId: string;
  organizationId: string;
  planId: string;
  fromDate: number;
  toDate: number;
}

/** interface for a Assignment object */
export interface Assignment {
  jurisdiction: string;
  organization: string;
  plan: string;
  fromDate: string;
  toDate: string;
}

// action interfaces

/** action type for action that adds Assignments to store */
export const ASSIGNMENTS_FETCHED = 'src/store/ducks/assignments/reducer/ASSIGNMENTS_FETCHED';
/** action type for REMOVE_TEAMS action */
export const REMOVE_ASSIGNMENTS = 'src/store/ducks/assignments/reducer/REMOVE_ASSIGNMENTS';

/** interface for Assignments fetched action */
export interface FetchAssignmentsAction extends AnyAction {
  assignmentsByPlanId: { [key: string]: Assignment[] };
  overwrite: boolean;
  type: typeof ASSIGNMENTS_FETCHED;
}

/** interface for action that removes assignments from store */
export interface RemoveAssignmentsAction extends AnyAction {
  assignmentsByPlanId: { [key: string]: Assignment[] };
  type: typeof REMOVE_ASSIGNMENTS;
}

/** single type for all action types */
type AssignmentActionTypes = FetchAssignmentsAction | RemoveAssignmentsAction | AnyAction;

/** interface describing the assignmentsByPlanId Store */
interface AssignmentsByPlanId {
  [key: string]: Assignment[];
}
/** interface for Assignments state in store */
interface AssignmentsStoreState {
  assignmentsByPlanId: AssignmentsByPlanId | {};
}

// immutable assignments state in dux
export type ImmutableAssignmentsStoreState = AssignmentsStoreState &
  SeamlessImmutable.ImmutableObject<AssignmentsStoreState>;

/** initial state for Assignments records in store */
const initialAssignmentStoreState: ImmutableAssignmentsStoreState = SeamlessImmutable({
  assignmentsByPlanId: {},
});

/**
 * the Assignment reducer function
 *
 * @param state - the store
 * @param action - the action types
 * @returns the state
 */
export function assignmentsReducer(
  state = initialAssignmentStoreState,
  action: AssignmentActionTypes
) {
  switch (action.type) {
    case ASSIGNMENTS_FETCHED:
      if (!action.overwrite) {
        // so what we want to do is to ensure all action.assignmentsByPlanId arrays of the
        // same plan are merged.  But while merging we want the array elements to be
        // unique based on fromDate, jurisdiction and organization
        const currentState = state.assignmentsByPlanId.asMutable();
        // loop through each plan in the action object
        for (const [planId, assignments] of Object.entries(action.assignmentsByPlanId)) {
          // check if the plan is already in current state
          if (planId in currentState) {
            // merge the two assignment arrays
            const allAssignments = (assignments as Assignment[]).concat(
              (currentState as AssignmentsByPlanId)[planId]
            );
            // sort by whether an element was NOT in the current state i.e. elements NOT in
            // current state will be ordered first.  We do this because we want to remove elements
            // that were in current state.  We assume that they are being overwritten
            allAssignments.sort((_, b) => ((assignments as Assignment[]).includes(b) ? 1 : -1));
            // remove the elements in the current state.  This works because we had already ordered
            // the elements.  uniqWith keeps the first found item
            const filteredAssignments = (action.assignmentsByPlanId[planId] = uniqWith(
              allAssignments,
              (a, b) =>
                `${a.fromDate}${a.jurisdiction}${a.organization}` ===
                `${b.fromDate}${b.jurisdiction}${b.organization}`
            ));
            // finally, save this to the action object
            action.assignmentsByPlanId[planId] = filteredAssignments;
          }
        }
      }

      return SeamlessImmutable({
        ...state,
        assignmentsByPlanId: {
          ...state.assignmentsByPlanId,
          ...action.assignmentsByPlanId,
        },
      });
    case REMOVE_ASSIGNMENTS:
      return SeamlessImmutable({
        ...state,
        assignmentsByPlanId: action.assignmentsByPlanId,
      });
    default:
      return state;
  }
}

/** action to remove assignments form store */
export const removeAssignmentsAction: RemoveAssignmentsAction = {
  assignmentsByPlanId: {},
  type: REMOVE_ASSIGNMENTS,
};

// action creators

/** creates action to add fetched assignments to store
 *
 * @param assignmentsList - array of assignments to be added to store
 * @param overwrite - whether to overwrite assignments
 * @returns action with assignments payload that is added to store
 */
export const fetchAssignments = (
  assignmentsList: Assignment[],
  overwrite = false
): FetchAssignmentsAction => {
  const assignmentsByPlanId: Dictionary<Assignment[]> = {};
  assignmentsList.forEach((assignment) => {
    const planId = assignment.plan;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!assignmentsByPlanId[planId]) {
      assignmentsByPlanId[planId] = [];
    }
    assignmentsByPlanId[assignment.plan].push(assignment);
  });
  return {
    assignmentsByPlanId,
    overwrite,
    type: ASSIGNMENTS_FETCHED,
  };
};

/** creates action to reset plan
 *
 * @param assignmentsByPlanId object with updated assignment arrays, keyed by planId
 * @returns action to clean plan assignments dux
 */
export const resetPlanAssignments = (
  assignmentsByPlanId: AssignmentsByPlanId = {}
): FetchAssignmentsAction => {
  return {
    assignmentsByPlanId,
    overwrite: true,
    type: ASSIGNMENTS_FETCHED,
  };
};

// selectors

interface AssignmentFilters {
  planId?: string;
}

/** get assignments as an object where their ids are the keys and the objects
 * the values
 *
 * @param {object} state - Portion of the store
 *
 * @returns map of assignments key'ed by the plan ids
 */
export function getAssignmentsByPlanId(state: Partial<Store>): { [key: string]: Assignment[] } {
  return (state as Dictionary)[assignmentsReducerName].assignmentsByPlanId;
}

/** get plan id from filters
 *
 * @param _ - the store
 * @param props - the props
 * @returns the planId
 */
export const getPlanId = (_: Partial<Store>, props: AssignmentFilters) => props.planId;

/** Get all assignments as an array by id
 *
 * @returns selector that gets assignments by planId in store as an array
 */
export const getAssignmentsArrayByPlanId = () => {
  return createSelector(getAssignmentsByPlanId, getPlanId, (assignmentsMap, planId) => {
    let assignments: Assignment[] = [];
    if (planId !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      assignments = get(assignmentsMap, planId) ?? [];
    }
    // handle null and non-date entries in Assignment.toDate field
    const filteredAssignments = assignments.filter((obj) =>
      moment(obj.toDate).isValid() ? moment(obj.toDate) >= moment() : true
    );
    return filteredAssignments;
  });
};
