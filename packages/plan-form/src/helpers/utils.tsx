import {
  actionReasons,
  PlanActionCodes,
  goalPriorities,
  InterventionType,
  taskGenerationStatuses,
  PlanActivityFormFields,
} from '@opensrp/plan-form-core';
import { Rule } from 'rc-field-form/lib/interface';
import moment from 'moment';

export const validationRules = {
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
  date: [{ required: true, type: 'string' }] as Rule[],
  end: [{ required: true, type: 'date' }] as Rule[],
  identifier: [{ type: 'string' }] as Rule[],
  interventionType: [
    { type: 'enum', enum: Object.values(InterventionType), required: true },
  ] as Rule[],
  jurisdictions: {
    id: [{ type: 'string' }] as Rule[],
    name: [{ type: 'string' }] as Rule[],
  },
  name: [{ type: 'string', required: true }] as Rule[],
  start: [{ type: 'date', required: true }] as Rule[],
  taskGenerationStatus: [
    {
      type: 'enum',
      enum: Object.values(taskGenerationStatuses),
    },
  ] as Rule[],
  teamAssignmentStatus: [{ type: 'string' }] as Rule[],
  title: [{ type: 'string', required: true }] as Rule[],
  version: [{ type: 'string' }] as Rule[],
};

export const processActivitiesDates = (planActivities: PlanActivityFormFields[]) => {
  const withProcessedDates: PlanActivityFormFields[] = planActivities.map((activity) => {
    return {
      ...activity,
      timingPeriodEnd: moment(activity.timingPeriodEnd),
      timingPeriodStart: moment(activity.timingPeriodStart),
    };
  });
  return withProcessedDates;
};
