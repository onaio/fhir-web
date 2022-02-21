import { Dictionary } from '@onaio/utils';
import intersect from 'fast_array_intersect';
import { get, keyBy, values } from 'lodash';
import { AnyAction, Store } from 'redux';
import { createSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';
import { InterventionType, PlanDefinition } from '@opensrp/plan-form-core';
import { descendingOrderSort, isPlanDefinitionOfType } from '../../helpers/utils';

/** the reducer name */
export const plansReducerName = 'PlanDefinition';

// actions

/** PLAN_DEFINITION_FETCHED action type */
export const PLAN_DEFINITIONS_FETCHED =
  'reveal/reducer/opensrp/PlanDefinition/PLAN_DEFINITIONS_FETCHED';

/** PLAN_DEFINITION_FETCHED action type */
export const REMOVE_PLAN_DEFINITIONS =
  'reveal/reducer/opensrp/PlanDefinition/REMOVE_PLAN_DEFINITIONS';

/** PLAN_DEFINITION_FETCHED action type */
export const ADD_PLAN_DEFINITION = 'reveal/reducer/opensrp/PlanDefinition/ADD_PLAN_DEFINITION';

/** interface for fetch PlanDefinitions action */
export interface FetchPlanDefinitionsAction extends AnyAction {
  planDefinitionsById: { [key: string]: PlanDefinition };
  type: typeof PLAN_DEFINITIONS_FETCHED;
}

/** interface for removing PlanDefinitions action */
export interface RemovePlanDefinitionsAction extends AnyAction {
  planDefinitionsById: { [key: string]: PlanDefinition };
  type: typeof REMOVE_PLAN_DEFINITIONS;
}

/** interface for adding a single PlanDefinitions action */
export interface AddPlanDefinitionAction extends AnyAction {
  planObj: PlanDefinition;
  type: typeof ADD_PLAN_DEFINITION;
}

/** Create type for PlanDefinition reducer actions */
export type PlanDefinitionActionTypes =
  | FetchPlanDefinitionsAction
  | RemovePlanDefinitionsAction
  | AddPlanDefinitionAction
  | AnyAction;

// action creators

/**Fetch Plan Definitions action creator
 *
 * @param  planList - list of plan definition objects
 * @returns - returns fetch planDefinition action
 */
export const fetchPlanDefinitions = (
  planList: PlanDefinition[] = []
): FetchPlanDefinitionsAction => ({
  planDefinitionsById: keyBy(planList, 'identifier'),
  type: PLAN_DEFINITIONS_FETCHED,
});

/**
 * Reset plan definitions state action creator
 *
 * @returns -returns the reset plan definitions
 */
export const removePlanDefinitions = () => ({
  planDefinitionsById: {},
  type: REMOVE_PLAN_DEFINITIONS,
});

/**Add one Plan Definition action creator
 *
 * @param planObj - the plan definition object
 * @returns returns add planDefinition action
 */
export const addPlanDefinition = (planObj: PlanDefinition): AddPlanDefinitionAction => ({
  planObj,
  type: ADD_PLAN_DEFINITION,
});

// the reducer

/** interface for PlanDefinition state */
interface PlanDefinitionState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  planDefinitionsById: { [key: string]: PlanDefinition } | Record<string, any>;
}

/** immutable PlanDefinition state */
export type ImmutablePlanDefinitionState = PlanDefinitionState &
  SeamlessImmutable.ImmutableObject<PlanDefinitionState>;

/** initial PlanDefinition state */
const initialState: ImmutablePlanDefinitionState = SeamlessImmutable({
  planDefinitionsById: {},
});

/**
 * the plans reducer function
 *
 * @param state - plans states
 * @param action - plans actions
 * @returns - the updated states
 */
export function plansReducer(
  state = initialState,
  action: PlanDefinitionActionTypes
): ImmutablePlanDefinitionState {
  switch (action.type) {
    case PLAN_DEFINITIONS_FETCHED:
      return SeamlessImmutable({
        ...state,
        planDefinitionsById: { ...state.planDefinitionsById, ...action.planDefinitionsById },
      });
    case ADD_PLAN_DEFINITION:
      return SeamlessImmutable({
        ...state,
        planDefinitionsById: {
          ...state.planDefinitionsById,
          [action.planObj.identifier as string]: action.planObj,
        },
      });
    case REMOVE_PLAN_DEFINITIONS:
      return SeamlessImmutable({
        ...state,
        planDefinitionsById: action.planDefinitionsById,
      });
    default:
      return state;
  }
}

// selectors

/**
 * get PlanDefinitions by id
 *
 * @param state - the redux store
 * @param interventionType - the PlanDefinition intervention Type
 * @returns  PlanDefinitions by id
 */
export function getPlanDefinitionsById(
  state: Partial<Store>,
  interventionType: InterventionType | null = null
): { [key: string]: PlanDefinition } {
  if (interventionType) {
    return keyBy(getPlanDefinitionsArray(state, interventionType), 'identifier');
  }
  return (state as Dictionary)[plansReducerName].planDefinitionsById;
}

/**
 * get one PlanDefinition using its id
 *
 * @param state - the redux store
 * @param id - the PlanDefinition id
 * @returns a PlanDefinition object or null
 */
export function getPlanDefinitionById(state: Partial<Store>, id: string): PlanDefinition | null {
  return get((state as Dictionary)[plansReducerName].planDefinitionsById, id, null);
}

/**
 * get an array of PlanDefinition objects
 *
 * @param state - the redux store
 * @param interventionType - the PlanDefinition intervention Type
 * @param sortField - field to sort by
 * @returns an array of PlanDefinition objects
 */
export function getPlanDefinitionsArray(
  state: Partial<Store>,
  interventionType: InterventionType | null = null,
  sortField?: string
): PlanDefinition[] {
  const result = values((state as Dictionary)[plansReducerName].planDefinitionsById);
  if (interventionType) {
    return result.filter((e: PlanDefinition) => isPlanDefinitionOfType(e, interventionType));
  }
  if (sortField) {
    return descendingOrderSort(result, sortField);
  }
  return result;
}

/** RESELECT USAGE STARTS HERE */

/** This interface represents the structure of plan definition filter options/params */
export interface PlanDefinitionFilters {
  title?: string /** plan object title */;
  planIds?: string[] | null /** return only plans whose id appear here */;
  status?: string;
}

export interface PlanDefinitionGetters extends PlanDefinitionFilters {
  sortField?: string;
}

/**
 * planDefinitionsByIdBaseSelector selects store slice object with of all plans
 *
 * @param planKey get plans by id
 * @returns - plan definition by base selector
 */
export const planDefinitionsByIdBaseSelector =
  (planKey?: string) =>
  (state: Partial<Store>): Dictionary<PlanDefinition> =>
    (state as Dictionary)[plansReducerName][planKey ? planKey : 'planDefinitionsById'];

/**
 * planDefinitionsArrayBaseSelector select an array of all plans
 *
 * @param planKey get plans by id
 * @returns - plan definitions in an array
 */
export const planDefinitionsArrayBaseSelector =
  (planKey?: string) =>
  (state: Partial<Store>): PlanDefinition[] =>
    values((state as Dictionary)[plansReducerName][planKey ? planKey : 'planDefinitionsById']);

/**
 * Gets title from PlanFilters
 *
 * @param _ - the redux store
 * @param props - the plan filters object
 * @returns return title
 */
export const getTitle = (_: Partial<Store>, props: PlanDefinitionFilters) => props.title;

/**
 * Gets status from PlanFilters
 *
 * @param _ - the redux store
 * @param props - the plan filters object
 * @returns return status
 */
export const getStatus = (_: Partial<Store>, props: PlanDefinitionFilters) => props.status;

/**
 * sortField Getter
 *
 * @param _ - the redux store
 * @param props - the plan object
 * @returns return sort field
 */
export const getSortField = (_: Partial<Store>, props: PlanDefinitionGetters) => props.sortField;

/**
 * Gets planIds from PlanFilters
 *
 * @param _ - the redux store
 * @param props - the plan filters object
 * @returns return title
 */
export const getPlanIds = (_: Partial<Store>, props: PlanDefinitionFilters) => props.planIds;

/**
 * Gets an array of Plan objects filtered by plan title
 *
 * @param planKey - plan identifier
 * @returns returns createSelector method
 */
export const getPlanDefinitionsArrayByTitle = (planKey?: string) =>
  createSelector([planDefinitionsArrayBaseSelector(planKey), getTitle], (plans, title) =>
    title ? plans.filter((plan) => plan.title.toLowerCase().includes(title.toLowerCase())) : plans
  );
/**
 * Filter plans by status
 *
 * @param plans - plan definitions array
 * @param status - plan status
 * @returns  - plan definitions array
 */
export const filterPlansByStatus = (plans: PlanDefinition[], status?: string | undefined) =>
  status ? plans.filter((plan) => plan.status === status) : plans;

/**
 * Gets an array of Plan objects filtered by plan title
 *
 * @param planKey - plan identifier
 * @returns returns createSelector method
 */
export const getPlanDefinitionsArrayByStatus = (planKey?: string) =>
  createSelector([planDefinitionsArrayBaseSelector(planKey), getStatus], filterPlansByStatus);

/**
 * get plans for the given planIds
 *
 * @param planKey - plan identifier
 * @returns returns createSelector method
 */
export const getPlanDefinitionsArrayByPlanIds = (planKey?: string) => {
  return createSelector(
    planDefinitionsByIdBaseSelector(planKey),
    planDefinitionsArrayBaseSelector(planKey),
    getPlanIds,
    (plansByIds, allPlans, planIds) => {
      const plansOfInterest = planIds ? planIds.map((planId) => plansByIds[planId]) : allPlans;
      return plansOfInterest;
    }
  );
};

/**filters plan definitions based on intervention type
 *
 * @param plans - plans to filter
 * @param  filters - list of intervention types to filter against
 * @returns - returns plans filetred by interventiontype
 */
export const FilterPlanDefinitionsByInterventionType = (
  plans: PlanDefinition[],
  filters?: string
) => {
  if (filters) {
    return plans.filter(
      (plan) =>
        plan.useContext.filter(
          (context) =>
            context.code === 'interventionType' && filters.includes(context.valueCodableConcept)
        ).length > 0
    );
  } else {
    return plans;
  }
};

/**
 * Gets an array of Plan objects filtered by intervention type
 *
 * @param planKey - plan identifier
 * @returns returns createSelector method
 */
export const getPlanDefinitionsArrayByInterventionType = (planKey?: string) => {
  return createSelector(planDefinitionsArrayBaseSelector(planKey), (plans) =>
    FilterPlanDefinitionsByInterventionType(plans)
  );
};

/**
 * makePlanDefinitionsArraySelector
 * Returns a selector that gets an array of IRSPlan objects filtered by one or all
 * of the following:
 *    - title
 *    - planIds
 *
 * These filter params are all optional and are supplied via the prop parameter.
 *
 * This selector is meant to be a memoized replacement for getPlanDefinitionsArray.
 *
 * To use this selector, do something like:
 *    const PlanDefinitionsArraySelector = makeIRSPlansArraySelector();
 *
 * @param planKey - plan identifier
 * @param sortField - sort by field
 * @returns returns createSelector method
 */
export const makePlanDefinitionsArraySelector = (
  planKey?: keyof PlanDefinitionState,
  sortField?: keyof PlanDefinition
) => {
  return createSelector(
    [
      getPlanDefinitionsArrayByInterventionType(planKey),
      getPlanDefinitionsArrayByTitle(planKey),
      getPlanDefinitionsArrayByPlanIds(planKey),
      getPlanDefinitionsArrayByStatus(planKey),
    ],
    (plans1, plans2, plans3, plans4) => {
      let finalPlans = intersect([plans1, plans2, plans3, plans4], JSON.stringify);
      if (sortField) {
        finalPlans = descendingOrderSort(finalPlans, sortField);
      }
      return finalPlans;
    }
  );
};
