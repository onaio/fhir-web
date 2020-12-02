import { FormInstance } from 'antd/lib/form/hooks/useForm';
import {
  PlanFormFields,
  isFIOrDynamicFI,
  actionReasons,
  PlanActionCodes,
  goalPriorities,
  InterventionType,
  FIReasons,
  PlanStatus,
  taskGenerationStatuses,
  fiStatusCodes,
} from '@opensrp/planform-core';
import { Rule } from 'rc-field-form/lib/interface';

export const formIsFIOrDynamicFI = (
  form: FormInstance<PlanFormFields>,
  interventionFieldName = 'interventionType'
): boolean => {
  const interventionType = form.getFieldValue([interventionFieldName]);
  return isFIOrDynamicFI(interventionType);
};

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
  fiStatus: [{ type: 'enum', enum: fiStatusCodes }] as Rule[],
  identifier: [{ type: 'string' }] as Rule[],
  interventionType: [
    { type: 'enum', enum: Object.values(InterventionType), required: true },
  ] as Rule[],
  jurisdictions: {
    id: [{ type: 'string'}] as Rule[],
    name: [{ type: 'string' }] as Rule[],
  },
  fiReason: [
    (form: FormInstance) => {
      if (formIsFIOrDynamicFI(form)) {
        return {
          type: 'enum',
          enum: FIReasons.map((e) => e),
          required: true,
        };
      }
      return { type: 'string' };
    },
  ] as Rule[],
  name: [{ type: 'string', required: true }] as Rule[],
  opensrpEventId: [{ type: 'string' }] as Rule[],
  start: [{ type: 'date', required: true }] as Rule[],
  status: [
    {
      type: 'string',
      enum: Object.values(PlanStatus),
      required: true,
    },
  ] as Rule[],
  taskGenerationStatus: [
    {
      type: 'enum',
      enum: Object.values(taskGenerationStatuses),
    },
  ] as Rule[],
  teamAssignmentStatus: [{ type: 'string', required: true }] as Rule[],
  title: [{ type: 'string', required: true }] as Rule[],
  version: [{ type: 'string' }] as Rule[],
};
