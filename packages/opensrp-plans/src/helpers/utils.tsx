import { Dictionary } from '@onaio/utils';
import { InterventionType } from '../ducks';
import { PlanDefinition, UseContext } from '../plan-global-types';

/**
 * helper to retrieve the plan Type from a plan definition object
 *
 * @param {PlanDefinition} aPlan plan definition object
 * @returns {string} plans intervention type eg FI
 */
export const getPlanType = (aPlan: PlanDefinition) => {
  return aPlan.useContext
    .filter((f: UseContext) => f.code === 'interventionType')
    .map((context) => context.valueCodableConcept)[0];
};

/**
 * Sorts plans in descending order based on field provided
 *
 * @param {PlanDefinition[]} arr plan definition array
 * @param {string} sortField Field to sort by
 * @returns {PlanDefinition[]}  sorted plans
 */
export function descendingOrderSort<T extends object>(arr: T[], sortField: string) {
  const mutableArray = ([] as T[]).concat(arr);
  // check if the provided field exists in the plans else return plansArray
  if (arr.every((plan: Dictionary) => Object.keys(plan).includes(sortField))) {
    return mutableArray.sort((firstEl: Dictionary, secondEl: Dictionary): number => {
      return Date.parse(secondEl[sortField]) - Date.parse(firstEl[sortField]);
    }) as PlanDefinition[];
  }
  return arr;
}

/** a util to check if plan of type PlanDefinition is of the specified intervention type(s)
 *
 * @param {PlanDefinition} plan - the plan of interest
 * @param {InterventionType} interventionType if plan is of specified intervention type we return true
 * @returns {boolean} Returns true if plan is of specified intervention type else returns false
 */
export const isPlanDefinitionOfType = (
  plan: PlanDefinition,
  interventionType: InterventionType | InterventionType[]
) => {
  // if plan intervention is in intervention Types
  const allowedTypes = Array.isArray(interventionType) ? interventionType : [interventionType];
  const plansType = getPlanType(plan);
  return allowedTypes.includes(plansType as InterventionType);
};
