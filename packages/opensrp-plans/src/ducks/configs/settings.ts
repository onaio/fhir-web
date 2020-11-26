import {
  BCC_CODE,
  BEDNET_DISTRIBUTION_CODE,
  BLOOD_SCREENING_CODE,
  CASE_CONFIRMATION_CODE,
  CASE_NUMBER_CODE,
  FIX_PRODUCT_PROBLEMS,
  FI_REASON_CODE,
  FI_STATUS_CODE,
  HIGH_PRIORITIY,
  INTERVENTION_TYPE_CODE,
  INVESTIGATION,
  IRS_CODE,
  LARVAL_DIPPING_CODE,
  LOW_PRIORITY,
  MDA_ADHERENCE_CODE,
  MDA_POINT_ADVERSE_EFFECTS_CODE,
  MDA_POINT_DISPENSE_CODE,
  MEDIUM_PRIORITY,
  MOSQUITO_COLLECTION_CODE,
  OPENSRP_EVENT_ID_CODE,
  PRODUCT_CHECK,
  RACD_REGISTER_FAMILY_CODE,
  RECORD_GPS,
  ROUTINE,
  SERVICE_POINT_CHECK,
  TASK_GENERATION_STATUS_CODE,
  TEAM_ASSIGNMENT_STATUS_CODE,
} from '../../constants';
/** Allowed action Reason values */
/* tslint:disable-next-line no-useless-cast */
export const actionReasons = [INVESTIGATION, ROUTINE] as const;

/** Allowed goal priority values */
/* tslint:disable-next-line no-useless-cast */
export const goalPriorities = [LOW_PRIORITY, MEDIUM_PRIORITY, HIGH_PRIORITIY] as const;

/** Allowed useContext Code values */
/* tslint:disable-next-line no-useless-cast */
export const useContextCodes = [
  INTERVENTION_TYPE_CODE,
  FI_STATUS_CODE,
  FI_REASON_CODE,
  OPENSRP_EVENT_ID_CODE,
  CASE_NUMBER_CODE,
  TASK_GENERATION_STATUS_CODE,
  TEAM_ASSIGNMENT_STATUS_CODE,
] as const;

/** Plan activity code values */
/* tslint:disable-next-line no-useless-cast */
export const PlanActionCodes = [
  BCC_CODE,
  IRS_CODE,
  BEDNET_DISTRIBUTION_CODE,
  BLOOD_SCREENING_CODE,
  CASE_CONFIRMATION_CODE,
  RACD_REGISTER_FAMILY_CODE,
  LARVAL_DIPPING_CODE,
  MOSQUITO_COLLECTION_CODE,
  MDA_ADHERENCE_CODE,
  MDA_POINT_DISPENSE_CODE,
  MDA_POINT_ADVERSE_EFFECTS_CODE,
  PRODUCT_CHECK,
  FIX_PRODUCT_PROBLEMS,
  RECORD_GPS,
  SERVICE_POINT_CHECK,
] as const;

//types
/** Action reason type */
export type ActionReasonType = typeof actionReasons[number];

/** Goal priority type */
export type GoalPriorityType = typeof goalPriorities[number];

/** Use context codes type */
export type UseContextCodesType = typeof useContextCodes[number];

/** Plan action codes type */
export type PlanActionCodesType = typeof PlanActionCodes[number];

/** Plan Action Timing Period */
export interface PlanActionTimingPeriod {
  end: string;
  start: string;
}
/** Plan Action subjectCodableConcept */
export interface PlanActionsubjectCodableConcept {
  text: 'Family' | 'Person' | 'Location' | 'Jurisdiction';
}

/** Plan Expression */
export interface PlanExpression {
  description?: string;
  expression: string;
  name?: string;
  reference?: string;
  subjectCodableConcept?: PlanActionsubjectCodableConcept;
}

/** Plan Action Condition */
export interface PlanActionCondition {
  expression: PlanExpression;
  kind: Readonly<'applicability'>;
}

/** Plan Action Trigger */
export interface PlanActionTrigger {
  expression?: PlanExpression;
  name: string;
  type: Readonly<'named-event'>;
}

/** Plan Action */
export interface PlanAction {
  code: PlanActionCodesType;
  condition?: PlanActionCondition[];
  definitionUri?: string;
  description: string;
  goalId: string;
  identifier: string;
  prefix: number;
  reason: ActionReasonType;
  subjectCodableConcept: PlanActionsubjectCodableConcept;
  taskTemplate?: string;
  timingPeriod: PlanActionTimingPeriod;
  title: string;
  trigger?: PlanActionTrigger[];
  type?: string;
}

/** Enum representing the possible goal unitss */
export enum GoalUnit {
  ACTIVITY = 'activit(y|ies)',
  CASE = 'case(s)',
  PERCENT = 'Percent',
  PERSON = 'Person(s)',
  UNKNOWN = 'unknown',
}

export interface PlanGoaldetailQuantity {
  comparator: '>=' | '<=';
  unit: GoalUnit;
  value: number;
}

/** Plan Goal Detail */
export interface PlanGoalDetail {
  detailQuantity: PlanGoaldetailQuantity;
}

/** Plan Goal Target */
export interface PlanGoalTarget {
  due: string;
  detail: PlanGoalDetail;
  measure: string;
}

/** Plan Goal */
export interface PlanGoal {
  description: string;
  id: string;
  priority: GoalPriorityType;
  target: PlanGoalTarget[];
}

/** UseContext - interface for PlanPayload.useContext[] items */
export interface UseContext {
  code: UseContextCodesType;
  valueCodableConcept: string;
}

export interface PlanDefinition {
  action: PlanAction[];
  date: string;
  effectivePeriod: {
    end: string;
    start: string;
  };
  experimental?: Readonly<false>;
  goal: PlanGoal[];
  identifier: string;
  jurisdiction: Array<{
    code: string;
  }>;
  name: string;
  serverVersion?: number;
  status: string;
  title: string;
  useContext: UseContext[];
  version: string;
}
