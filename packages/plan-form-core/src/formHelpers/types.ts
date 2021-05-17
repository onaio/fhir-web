import {
  FIStatuses,
  FIReasons,
  goalPriorities,
  actionReasons,
  useContextCodes,
  PlanActionCodes,
  taskGenerationStatuses,
  PlanActivityTitles,
  GoalUnit,
  InterventionType,
  PlanStatus,
} from './constants/enumsAndCodeConstants';
import { Moment } from 'moment';
import {
  actionCode,
  name,
  status,
  actionDefinitionUri,
  actionDescription,
  actionIdentifier,
  actionReason,
  actionTitle,
  activities,
  caseNum,
  condition,
  date,
  end,
  fiReason,
  fiStatus,
  goalDescription,
  goalDue,
  goalPriority,
  goalValue,
  identifier,
  interventionType,
  jurisdictions,
  opensrpEventId,
  start,
  taskGenerationStatus,
  teamAssignmentStatus,
  timingPeriodEnd,
  timingPeriodStart,
  title,
  trigger,
  version,
  description,
  dynamicValue,
} from './constants/stringConstants';

export type DateType = Moment | Date;

/** FI Status type */
export type FIStatusType = typeof FIStatuses[number];

/** FI Reason type */
export type FIReasonType = typeof FIReasons[number];

/** Goal priority type */
export type GoalPriorityType = typeof goalPriorities[number];

/** Action reason type */
export type ActionReasonType = typeof actionReasons[number];

/** Use context codes type */
export type UseContextCodesType = typeof useContextCodes[number];

/** Plan action codes type */
export type PlanActionCodesType = typeof PlanActionCodes[number];

/** Task generation status type */
export type taskGenerationStatusType = keyof typeof taskGenerationStatuses;

/** Plan activity title type */
export type PlanActivityTitlesType = typeof PlanActivityTitles[number];

/** Plan activities type */
export type PlanActivities = { [K in PlanActivityTitlesType]: PlanActivity };

/** Interface for Plan activity expression */
export interface PlanActivityExpression {
  description: string;
  expression: string;
  subjectCodableConceptText: SubjectCodableConceptType;
}

/** Interface for Plan activity trigger */
export interface PlanActivityTrigger {
  description?: string;
  expression?: string;
  name: string;
}

/** interface for plan Activity form fields dynamicValue */
export interface PlanActivityDynamicValue {
  path: string;
  expression: string;
}

/** Plan activity form fields interface */
export interface PlanActivityFormFields {
  [actionCode]: string;
  [actionDefinitionUri]?: string;
  [actionDescription]: string;
  [actionIdentifier]: string;
  [actionReason]: string;
  [actionTitle]: string;
  [condition]?: PlanActivityExpression[];
  [goalDescription]: string;
  [goalDue]: DateType;
  [goalPriority]: string;
  [goalValue]: number;
  [timingPeriodEnd]: DateType;
  [timingPeriodStart]: DateType;
  [trigger]?: PlanActivityTrigger[];
  [dynamicValue]?: PlanActivityDynamicValue[];
}

/** Plan jurisdictions form fields interface */
export interface PlanJurisdictionFormFields {
  id: string;
  name: string;
}

/** Plan form fields interface */
export interface PlanFormFields {
  [activities]: PlanActivityFormFields[];
  [caseNum]?: string;
  [date]: DateType;
  [end]: DateType;
  [fiReason]?: FIReasonType;
  [fiStatus]?: FIStatusType;
  [identifier]: string;
  [interventionType]: InterventionType;
  [jurisdictions]: PlanJurisdictionFormFields[];
  [name]: string;
  [opensrpEventId]?: string;
  [start]: DateType;
  [status]: PlanStatus;
  [taskGenerationStatus]: taskGenerationStatusType;
  [teamAssignmentStatus]?: string;
  [title]: string;
  [version]: string;
  [description]?: string;
}

/** UseContext - interface for PlanPayload.useContext[] items */
export interface UseContext {
  code: UseContextCodesType;
  valueCodableConcept: string;
}

/** interface that describes plan definition objects from OpenSRP */
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
  status: 'retired' | 'complete' | 'draft' | 'active';
  title: string;
  useContext: UseContext[];
  version: string;
  description?: string;
}

/** Plan Action Timing Period */
export interface PlanActionTimingPeriod {
  end: string;
  start: string;
}

export type SubjectCodableConceptType =
  | 'Family'
  | 'Person'
  | 'Location'
  | 'Jurisdiction'
  | 'Device'
  | 'Task';

/** Plan Action subjectCodableConcept */
export interface PlanActionSubjectCodableConcept {
  text: SubjectCodableConceptType;
}

/** Plan Expression */
export interface PlanExpression {
  description?: string;
  expression: string;
  name?: string;
  reference?: string;
  subjectCodableConcept?: PlanActionSubjectCodableConcept;
}

/** Plan Action Trigger */
export interface PlanActionTrigger {
  expression?: PlanExpression;
  name: string;
  type: Readonly<'named-event'>;
}

/** Plan Action Condition */
export interface PlanActionCondition {
  expression: PlanExpression;
  kind: Readonly<'applicability'>;
}

/** Plan action dynamic value */
export interface PlanActionDynamicValue {
  path: string;
  expression: {
    expression: string;
  };
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
  subjectCodableConcept: PlanActionSubjectCodableConcept;
  taskTemplate?: string;
  timingPeriod: PlanActionTimingPeriod;
  title: string;
  trigger?: PlanActionTrigger[];
  dynamicValue?: PlanActionDynamicValue[];
  type?: string;
}

/** Plan Goal detailQuantity */
export interface PlanGoalDetailQuantity {
  comparator: '>=' | '<=' | '>';
  unit: GoalUnit;
  value: number;
}

/** Plan Goal Detail */
export interface PlanGoalDetail {
  detailQuantity: PlanGoalDetailQuantity;
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

/** Plan Activity */
export interface PlanActivity {
  action: PlanAction;
  goal: PlanGoal;
}

/** Interface for a Focus Investigation Classification */
export interface Classification {
  code: string;
  name: string;
  description: string;
}

/** describes all possible configuration options */
export interface EnvConfig {
  dateFormat: string;
  defaultPlanDurationDays: number;
  defaultPlanVersion: string;
  enabledFiReasons: FIReasonType[];
  planTypesAllowedToCreate: InterventionType[];
  planTypesWithMultiJurisdictions: InterventionType[];
  actionUuidNamespace: string;
  planUuidNamespace: string;
  defaultTime: string;
  defaultActivityDurationDays: number;
  displayedPlanTypes: InterventionType[];
  taskGenerationStatus: taskGenerationStatusType;
}
