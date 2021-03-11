import {
  actionReasons,
  PlanActionCodes,
  goalPriorities,
  InterventionType,
  taskGenerationStatuses,
  PlanActivityFormFields,
  PlanStatus,
  PlanFormFields as BasePlanFormFields,
  getPlanFormValues as getBasePlanFormValues,
  generatePlanDefinition as generateBasePlanDefinition,
  PlanDefinition,
} from '@opensrp/plan-form-core';
import { Rule } from 'rc-field-form/lib/interface';
import moment, { Moment } from 'moment';
import { PlanFormFields } from './types';
import { Dictionary } from '@onaio/utils';
import { cloneDeep } from 'lodash';
import lang, { Lang } from '../lang';

export const validationRulesFactory = (langObj: Lang = lang) => ({
  activities: {
    actionCode: [{ type: 'enum', enum: PlanActionCodes.map((e) => e) }] as Rule[],
    actionDefinitionUri: [{ type: 'string' }] as Rule[],
    actionDescription: [{ type: 'string', required: true }] as Rule[],
    actionIdentifier: [{ type: 'string' }] as Rule[],
    actionReason: [{ type: 'enum', required: true, enum: Object.values(actionReasons) }] as Rule[],
    actionTitle: [{ type: 'string', required: true }] as Rule[],
    goalDescription: [{ type: 'string', required: true }] as Rule[],
    goalDue: [{ required: true, type: 'date' }] as Rule[],
    goalPriority: [{ type: 'enum', enum: Object.values(goalPriorities), required: true }] as Rule[],
    goalValue: [{ type: 'number', required: true, min: 1 }] as Rule[],
    timingPeriodEnd: [{ required: true, type: 'date' }] as Rule[],
    timingPeriodStart: [{ required: true, type: 'date' }] as Rule[],
  },
  caseNum: [{ type: 'string' }] as Rule[],
  date: [{ required: true, type: 'date' }] as Rule[],
  dateRange: [{ required: true }] as Rule[],
  identifier: [{ type: 'string' }] as Rule[],
  interventionType: [
    { type: 'enum', enum: Object.values(InterventionType), required: true },
  ] as Rule[],
  jurisdictions: {
    id: [{ type: 'string' }] as Rule[],
    name: [{ type: 'string' }] as Rule[],
  },
  name: [{ type: 'string', required: true }] as Rule[],
  taskGenerationStatus: [
    {
      type: 'enum',
      enum: Object.values(taskGenerationStatuses),
    },
  ] as Rule[],
  teamAssignmentStatus: [{ type: 'string' }] as Rule[],
  title: [
    { type: 'string', required: true },
    () => ({
      validator(_, value) {
        if (value.includes('/')) {
          return Promise.reject(langObj.PLAN_NAME_CANNOT_CONTAIN_SLASHES);
        }
        return Promise.resolve();
      },
    }),
  ] as Rule[],
  version: [{ type: 'string' }] as Rule[],
  status: [
    {
      type: 'string',
      enum: Object.values(PlanStatus),
      required: true,
    },
  ] as Rule[],
  description: [{ type: 'string', required: true }] as Rule[],
});

/** util that changes date fields in activities to use moment
 *
 * @param {PlanActivityFormFields[]} planActivities -  the plan activities
 * @returns {PlanActivityFormFields[]} -
 */
export const processActivitiesDates = (planActivities: PlanActivityFormFields[]) => {
  const values = cloneDeep(planActivities);
  planActivities.forEach((activity, ind) => {
    values[ind].timingPeriodStart = moment(activity.timingPeriodStart);
    values[ind].timingPeriodEnd = moment(activity.timingPeriodEnd);
  });
  return values;
};

/** Takes our form values and transforms that to a form value object that plan-form-core can parse
 *
 * @param {PlanFormFields} formValues - formValues straight from the form
 * @returns {BasePlanFormFields} formValues as described in form-core
 */
export const processToBasePlanForm = (formValues: PlanFormFields): BasePlanFormFields => {
  const baseFormValues = {
    ...formValues,
    start: (formValues.dateRange[0] as Moment).toDate(),
    end: (formValues.dateRange[1] as Moment).toDate(),
    date: (formValues.date as Moment).toDate(),
  };
  delete (baseFormValues as Dictionary).dateRange;
  return baseFormValues;
};

/** Takes formValues as created by form-core and changes the dates structures to use moment
 *
 * @param {BasePlanFormFields} baseFormValues - formValues as parsed by form-core utils
 * @returns {PlanFormFields} formValues that can has a Moment as date type
 */
export const parseBasePlanFormValues = (baseFormValues: BasePlanFormFields): PlanFormFields => {
  const formValues = {
    ...baseFormValues,
    date: moment(baseFormValues.date),
    dateRange: [moment(baseFormValues.start), moment(baseFormValues.end)],
  };
  delete (formValues as Dictionary).start;
  delete (formValues as Dictionary).end;

  return formValues;
};

/** a wrapper around form-core that generates formValues from a plan definition,
 *
 * @param {PlanDefinition} plan - the plan object
 * @returns {PlanFormFields} - the form values
 */
export const getPlanFormValues = (plan: PlanDefinition) => {
  const basePlanFormValues = getBasePlanFormValues(plan);
  const planFormValues = parseBasePlanFormValues(basePlanFormValues);
  const finalFormValues = {
    ...planFormValues,
    activities: processActivitiesDates(planFormValues.activities),
  };
  return finalFormValues;
};

/** A wrapper around form-core plan generation, generates a plan definition object
 * from form values
 *
 * @param {PlanFormFields} planFormValues - the form values
 * @returns {PlanDefinition} a plan definition
 */
export const generatePlanDefinition = (planFormValues: PlanFormFields) => {
  const basePlanFormValues = processToBasePlanForm(planFormValues);
  return generateBasePlanDefinition(basePlanFormValues);
};
