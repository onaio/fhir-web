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
} from './constants/enumsAndCodeConstants';

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
}

/** Interface for Plan activity trigger */
export interface PlanActivityTrigger {
  description?: string;
  expression?: string;
  name: string;
}

/** Plan activity form fields interface */
export interface PlanActivityFormFields {
  actionCode: string;
  actionDefinitionUri?: string;
  actionDescription: string;
  actionIdentifier: string;
  actionReason: string;
  actionTitle: string;
  condition?: PlanActivityExpression[];
  goalDescription: string;
  goalDue: Date;
  goalPriority: string;
  goalValue: number;
  timingPeriodEnd: Date;
  timingPeriodStart: Date;
  trigger?: PlanActivityTrigger[];
}

/** Plan jurisdictions form fields interface */
export interface PlanJurisdictionFormFields {
  id: string;
  name: string;
}

/** Plan form fields interface */
export interface PlanFormFields {
  activities: PlanActivityFormFields[];
  caseNum?: string;
  date: Date;
  end: Date;
  fiReason?: FIReasonType;
  fiStatus?: FIStatusType;
  identifier: string;
  interventionType: InterventionType;
  jurisdictions: PlanJurisdictionFormFields[];
  name: string;
  opensrpEventId?: string;
  start: Date;
  status: PlanStatus;
  taskGenerationStatus: taskGenerationStatusType;
  teamAssignmentStatus?: string;
  title: string;
  version: string;
}

/** type of function to be called with payload before submission */
export type BeforeSubmit = (payload: PlanDefinition) => boolean;

/** type of function to be called with payload before submission */
export type AfterSubmit = (payload: PlanDefinition) => void;

/** Enum representing the possible intervention types */
export enum InterventionType {
  DynamicFI = 'Dynamic-FI',
  DynamicIRS = 'Dynamic-IRS',
  DynamicMDA = 'Dynamic-MDA',
  FI = 'FI',
  IRS = 'IRS',
  IRSLite = 'IRS-Lite',
  MDA = 'MDA',
  MDAPoint = 'MDA-Point',
  SM = 'SM',
}

/** Enum representing the possible intervention types */
export enum PlanStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete',
  DRAFT = 'draft',
  RETIRED = 'retired',
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
  status: string;
  title: string;
  useContext: UseContext[];
  version: string;
}

/** Plan Action Timing Period */
export interface PlanActionTimingPeriod {
  end: string;
  start: string;
}

/** Plan Action subjectCodableConcept */
export interface PlanActionSubjectCodableConcept {
  text: 'Family' | 'Person' | 'Location' | 'Jurisdiction' | 'Device';
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

/** Interface that describes location items */
export interface LocationItem {
  identifier: string /** Should match the name of the column in data */;
  level: number /** The HDX-compliant level of the location in the hierarchy */;
  name: string /** The name of the location */;
}
