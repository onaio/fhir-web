/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Dictionary } from '@onaio/utils';
import { parseISO } from 'date-fns';
import { findKey, pick } from 'lodash';
import moment from 'moment';
import { FormEvent } from 'react';
import { planActivities } from './activitiesLookup';
import {
  goalPriorities,
  PlanActionCodes,
  taskGenerationStatuses,
  GoalUnit,
  InterventionType,
  PlanStatus,
} from './constants/enumsAndCodeConstants';
import { defaultEnvConfig, FIClassifications } from './settings';
import {
  DAYS,
  BCC_ACTIVITY_CODE,
  BEDNET_DISTRIBUTION_ACTIVITY_CODE,
  BLOOD_SCREENING_ACTIVITY_CODE,
  CASE_CONFIRMATION_ACTIVITY_CODE,
  FAMILY_REGISTRATION_ACTIVITY_CODE,
  LARVAL_DIPPING_ACTIVITY_CODE,
  MOSQUITO_COLLECTION_ACTIVITY_CODE,
  IRS_ACTIVITY_CODE,
  MDA_POINT_ADVERSE_EFFECTS_ACTIVITY_CODE,
  MDA_POINT_DISPENSE_ACTIVITY_CODE,
  DYNAMIC_BCC_ACTIVITY_CODE,
  DYNAMIC_BEDNET_DISTRIBUTION_ACTIVITY_CODE,
  DYNAMIC_BLOOD_SCREENING_ACTIVITY_CODE,
  DYNAMIC_FAMILY_REGISTRATION_ACTIVITY_CODE,
  DYNAMIC_LARVAL_DIPPING_ACTIVITY_CODE,
  DYNAMIC_MOSQUITO_COLLECTION_ACTIVITY_CODE,
  DYNAMIC_MDA_COMMUNITY_ADHERENCE_ACTIVITY_CODE,
  DYNAMIC_MDA_COMMUNITY_DISPENSE_ACTIVITY_CODE,
  DYNAMIC_IRS_ACTIVITY_CODE,
  CONDITION,
  TRIGGER,
  APPLICABILITY_CONDITION_KIND,
  NAMED_EVENT_TRIGGER_TYPE,
  INTERVENTION_TYPE_CODE,
  FI_STATUS_CODE,
  FI_REASON_CODE,
  CASE_NUMBER_CODE,
  OPENSRP_EVENT_ID_CODE,
  TASK_GENERATION_STATUS_CODE,
  TEAM_ASSIGNMENT_STATUS_CODE,
  PRODUCT_CHECK_ACTIVITY_CODE,
  RECORD_GPS_ACTIVITY_CODE,
  SERVICE_POINT_CHECK_ACTIVITY_CODE,
  LOOKS_GOOD_ACTIVITY_CODE,
  COMPLETE_FLAG_PROBLEM_ACTIVITY_CODE,
  COMPLETE_FIX_PROBLEM_ACTIVITY_CODE,
  COMPLETE_RECORD_GPS_ACTIVITY_CODE,
  COMPLETE_SERVICE_CHECK_ACTIVITY_CODE,
} from './constants/stringConstants';
import {
  FIStatusType,
  PlanActivity,
  PlanActivityFormFields,
  PlanActivityExpression,
  PlanActivityTrigger,
  PlanActivityTitlesType,
  PlanDefinition,
  PlanActionCodesType,
  PlanActionCondition,
  PlanActionTrigger,
  PlanAction,
  PlanGoal,
  ActionReasonType,
  PlanGoalDetailQuantity,
  PlanGoalDetail,
  PlanGoalTarget,
  GoalPriorityType,
  PlanFormFields,
  taskGenerationStatusType,
  UseContext,
  FIReasonType,
  EnvConfig,
  SubjectCodableConceptType,
  PlanActivityDynamicValue,
} from './types';
import { v5 as uuidv5 } from 'uuid';

/**
 * Generate a namespaced uuid using uuidv5
 *
 * @param {string} seedString - the string to be used to generate the uuid. It should
 * be unique per namespace
 * @param {string} namespace - the namespace
 * @returns {string} - the uuid
 */
export function generateNameSpacedUUID(seedString: string, namespace: string) {
  return uuidv5(seedString, namespace);
}

/** Array of FI Statuses */
export const fiStatusCodes = Object.values(FIClassifications).map((e) => e.code as FIStatusType);

export const isFIOrDynamicFI = (interventionType: InterventionType): boolean => {
  return [InterventionType.DynamicFI, InterventionType.FI].includes(interventionType);
};

/**
 * Convert a plan activity object to an object that can be used in the PlanForm
 * activities section
 *
 * @param {PlanActivity} activityObj - the plan activity object
 * @param {EnvConfig} envConfig - env configuration variables
 * @returns {PlanActivityFormFields} -
 */
export function extractActivityForForm(
  activityObj: PlanActivity,
  envConfig?: Partial<EnvConfig>
): PlanActivityFormFields {
  const configs = {
    ...defaultEnvConfig,
    ...envConfig,
  };
  const planActivityKey: string =
    findKey(planActivities, (a: PlanActivity) => a.action.code === activityObj.action.code) ?? '';

  const condition: PlanActivityExpression[] = [];
  if (activityObj.action.condition) {
    for (const iterator of activityObj.action.condition) {
      condition.push({
        description: iterator.expression.description || '',
        expression: iterator.expression.expression || '',
        subjectCodableConceptText: (iterator.expression.subjectCodableConcept?.text ||
          '') as SubjectCodableConceptType,
      });
    }
  }

  const trigger: PlanActivityTrigger[] = [];
  if (activityObj.action.trigger) {
    for (const iterator of activityObj.action.trigger) {
      trigger.push({
        ...(iterator.expression && {
          description: iterator.expression.description || '',
          expression: iterator.expression.expression,
        }),
        name: iterator.name,
      });
    }
  }

  const dynamicValue: PlanActivityDynamicValue[] = [];
  if (activityObj.action?.dynamicValue) {
    for (const iterator of activityObj.action.dynamicValue) {
      dynamicValue.push({
        path: iterator.path,
        expression: iterator.expression.expression,
      });
    }
  }

  return {
    ...(condition.length > 0 && { condition }),
    ...(trigger.length > 0 && { trigger }),
    ...(dynamicValue.length > 0 && { dynamicValue }),
    actionCode: activityObj.action.code,
    actionDefinitionUri: activityObj.action.definitionUri || '',
    actionDescription: activityObj.action.description || '',
    actionIdentifier: activityObj.action.identifier || '',
    actionReason: activityObj.action.reason || '',
    actionTitle: activityObj.action.title || '',
    goalDescription: activityObj.goal.description || '',
    goalDue: activityObj.goal.target?.[0]?.due
      ? parseISO(`${activityObj.goal.target[0].due}`)
      : moment().add(configs.defaultActivityDurationDays, DAYS).toDate(),
    goalPriority: activityObj.goal.priority || goalPriorities[1],
    goalValue:
      activityObj.goal.target?.[0]?.detail.detailQuantity.value ||
      planActivities?.[planActivityKey as PlanActivityTitlesType]?.goal.target[0].detail
        .detailQuantity.value ||
      1,
    timingPeriodEnd: activityObj.action.timingPeriod?.end
      ? parseISO(`${activityObj.action.timingPeriod.end}`)
      : moment().add(configs.defaultActivityDurationDays, DAYS).toDate(),
    timingPeriodStart: activityObj.action.timingPeriod?.start
      ? parseISO(`${activityObj.action.timingPeriod.start}`)
      : moment().toDate(),
  };
}

/** group plan activities */
export const FIActivities = pick(planActivities, [
  BCC_ACTIVITY_CODE,
  BEDNET_DISTRIBUTION_ACTIVITY_CODE,
  BLOOD_SCREENING_ACTIVITY_CODE,
  CASE_CONFIRMATION_ACTIVITY_CODE,
  FAMILY_REGISTRATION_ACTIVITY_CODE,
  LARVAL_DIPPING_ACTIVITY_CODE,
  MOSQUITO_COLLECTION_ACTIVITY_CODE,
]);
export const IRSActivities = pick(planActivities, [IRS_ACTIVITY_CODE]);
export const MDAActivities = pick(planActivities, [CASE_CONFIRMATION_ACTIVITY_CODE]);
export const MDAPointActivities = pick(planActivities, [
  MDA_POINT_ADVERSE_EFFECTS_ACTIVITY_CODE,
  MDA_POINT_DISPENSE_ACTIVITY_CODE,
]);
export const DynamicFIActivities = pick(planActivities, [
  DYNAMIC_BCC_ACTIVITY_CODE,
  DYNAMIC_BEDNET_DISTRIBUTION_ACTIVITY_CODE,
  DYNAMIC_BLOOD_SCREENING_ACTIVITY_CODE,
  DYNAMIC_FAMILY_REGISTRATION_ACTIVITY_CODE,
  DYNAMIC_LARVAL_DIPPING_ACTIVITY_CODE,
  DYNAMIC_MOSQUITO_COLLECTION_ACTIVITY_CODE,
]);
export const DynamicMDAActivities = pick(planActivities, [
  DYNAMIC_MDA_COMMUNITY_ADHERENCE_ACTIVITY_CODE,
  DYNAMIC_MDA_COMMUNITY_DISPENSE_ACTIVITY_CODE,
  DYNAMIC_FAMILY_REGISTRATION_ACTIVITY_CODE,
]);
export const DynamicIRSActivities = pick(planActivities, [DYNAMIC_IRS_ACTIVITY_CODE]);
export const SMActivities = pick(planActivities, [
  PRODUCT_CHECK_ACTIVITY_CODE,
  RECORD_GPS_ACTIVITY_CODE,
  SERVICE_POINT_CHECK_ACTIVITY_CODE,
  LOOKS_GOOD_ACTIVITY_CODE,
  COMPLETE_FLAG_PROBLEM_ACTIVITY_CODE,
  COMPLETE_FIX_PROBLEM_ACTIVITY_CODE,
  COMPLETE_SERVICE_CHECK_ACTIVITY_CODE,
  COMPLETE_RECORD_GPS_ACTIVITY_CODE,
]);

export type FormActivity =
  | typeof FIActivities
  | typeof IRSActivities
  | typeof MDAPointActivities
  | typeof DynamicFIActivities
  | typeof DynamicIRSActivities
  | typeof DynamicMDAActivities
  | typeof SMActivities;

/**
 * Converts a plan activities objects to a list of activities for use on PlanForm
 *
 * @param {object} items - plan activities
 * @param {EnvConfig} configs - environment configs
 * @returns {PlanActivityFormFields[]} -
 */
export function getFormActivities(items: FormActivity, configs?: EnvConfig) {
  return Object.values(items)
    .sort((a, b) => a.action.prefix - b.action.prefix)
    .map((e) => extractActivityForForm(e, configs));
}
/** returns a lookup object for activities per interventionType
 *
 * @param {EnvConfig} configs - configurations
 * @returns {object} -
 */
export const getPlanActivitiesMap = (configs?: EnvConfig) => {
  const planActivitiesMap: Dictionary<PlanActivityFormFields[]> = {};
  planActivitiesMap[InterventionType.IRS] = getFormActivities(IRSActivities, configs);
  planActivitiesMap[InterventionType.FI] = getFormActivities(FIActivities, configs);
  planActivitiesMap[InterventionType.MDAPoint] = getFormActivities(MDAPointActivities, configs);
  planActivitiesMap[InterventionType.DynamicFI] = getFormActivities(DynamicFIActivities, configs);
  planActivitiesMap[InterventionType.DynamicIRS] = getFormActivities(DynamicIRSActivities, configs);
  planActivitiesMap[InterventionType.DynamicMDA] = getFormActivities(DynamicMDAActivities, configs);
  planActivitiesMap[InterventionType.SM] = getFormActivities(SMActivities, configs);
  return planActivitiesMap;
};

/**
 * Get a plan activity from a plan definition object
 *
 * @param {PlanDefinition} planObj - the plan definition
 * @param {PlanActionCodesType} actionCode - the action code
 * @returns {PlanActivity | null} - the plan activity or null
 */
export function getActivityFromPlan(
  planObj: PlanDefinition,
  actionCode: PlanActionCodesType
): PlanActivity | null {
  const actions = planObj.action.filter((e) => e.code === actionCode);
  if (actions.length > 0) {
    const goals = planObj.goal.filter((e) => e.id === actions[0].goalId);
    if (goals.length > 0) {
      return {
        action: actions[0],
        goal: goals[0],
      };
    }
  }

  return null;
}

/**
 * Get plan activity object using an action code
 *
 * @param {PlanActionCodesType} actionCode - the action code
 * @param {boolean} isDynamic - whether we are looking for dynamic activities
 * @returns {PlanActivity | null } -
 */
export function getPlanActivityFromActionCode(
  actionCode: PlanActionCodesType,
  isDynamic = false
): PlanActivity | null {
  const search = Object.values(planActivities).filter((item) => {
    if (isDynamic) {
      return (
        item.action.code === actionCode &&
        (Object.keys(item.action).includes(CONDITION) || Object.keys(item.action).includes(TRIGGER))
      );
    } else {
      return (
        item.action.code === actionCode &&
        !Object.keys(item.action).includes(CONDITION) &&
        !Object.keys(item.action).includes(TRIGGER)
      );
    }
  });
  if (search.length > 0) {
    return search[0];
  }

  return null;
}

/**
 * Get the plan definition conditions from form field values
 *
 * @param {PlanActivityFormFields} element - form field values for one plan activity
 * @returns {PlanActionCondition[] | undefined } -
 */
export const getConditionFromFormField = (
  element: PlanActivityFormFields
): PlanActionCondition[] | undefined => {
  return element?.condition?.map((item) => {
    const subjectCodableConcept = {
      text: item.subjectCodableConceptText,
    };
    return {
      expression: {
        ...(item.description && { description: item.description }),
        ...(item.subjectCodableConceptText && { subjectCodableConcept }),
        expression: item.expression,
      },
      kind: APPLICABILITY_CONDITION_KIND,
    };
  });
};

/**
 * Get the plan definition triggers from form field values
 *
 * @param {PlanActivityFormFields} element - form field values for one plan activity
 * @returns {PlanActionTrigger[] | undefined} -
 */
const getTriggerFromFormField = (
  element: PlanActivityFormFields
): PlanActionTrigger[] | undefined => {
  return element?.trigger?.map((item) => {
    return {
      ...((item.description || item.expression) && {
        expression: {
          ...(item.description && { description: item.description }),
          ...(item.expression && { expression: item.expression }),
        },
      }),
      name: item.name,
      type: NAMED_EVENT_TRIGGER_TYPE,
    } as PlanActionTrigger;
  });
};

/**
 * Get the plan definition dynamic values from form field values
 *
 * @param element - form field values for one plan activity
 * @returns - dynamic values for activity
 */
const getDynamicValuesFromFormField = (element: PlanActivityFormFields) => {
  return element.dynamicValue?.map((item) => ({
    path: item.path,
    expression: {
      expression: item.expression,
    },
  }));
};

/**
 * Get action and plans from PlanForm activities
 *
 * @param {PlanActivityFormFields[]} activities - this of activities from PlanForm
 * @param {string} planIdentifier - this plan identifier
 * @param {PlanDefinition | null} planObj - a plan object
 * @param {EnvConfig} envConfigs - environment config variables
 * @returns {PlanActivity} -
 */
export function extractActivitiesFromPlanForm(
  activities: PlanActivityFormFields[],
  planIdentifier = '',
  planObj: PlanDefinition | null = null,
  envConfigs?: Partial<EnvConfig>
) {
  const configs = {
    ...defaultEnvConfig,
    ...envConfigs,
  };

  const actions: PlanAction[] = [];
  const goals: PlanGoal[] = [];

  activities.forEach((element, index) => {
    const prefix = index + 1;
    if (PlanActionCodes.includes(element.actionCode as PlanActionCodesType)) {
      const planActionGoal = (planObj &&
        getActivityFromPlan(planObj, element.actionCode as PlanActionCodesType)) || {
        action: {},
        goal: {},
      };

      // we must declare them with some value. BCC chosen randomly here
      let thisAction: PlanAction = planActivities.BCC.action;
      let thisGoal: PlanGoal = planActivities.BCC.goal;

      // lets figure out if this is a dynamic activity
      const isDynamic =
        Object.keys(element).includes(CONDITION) || Object.keys(element).includes(TRIGGER);
      const planActivity = getPlanActivityFromActionCode(
        element.actionCode as PlanActionCodesType,
        isDynamic
      );

      if (planActivity) {
        thisAction = {
          ...planActivity.action,
          ...planActionGoal.action,
        };
        thisGoal = {
          ...planActivity.goal,
          ...planActionGoal.goal,
        };
      }

      const condition = getConditionFromFormField(element);
      const trigger = getTriggerFromFormField(element);
      const dynamicValue = getDynamicValuesFromFormField(element);

      const thisActionIdentifier =
        !element.actionIdentifier || element.actionIdentifier === ''
          ? planIdentifier === ''
            ? generateNameSpacedUUID(
                `${moment().toString()}-${thisAction.goalId}`,
                configs.actionUuidNamespace
              )
            : generateNameSpacedUUID(
                `${moment().toString()}-${planIdentifier}-${thisAction.goalId}`,
                configs.actionUuidNamespace
              )
          : element.actionIdentifier;

      // next put in values from the form
      const actionFields: Partial<PlanAction> = {
        ...(condition && { condition }),
        ...(trigger && { trigger }),
        ...(dynamicValue && { dynamicValue }),
        description: element.actionDescription,
        identifier: thisActionIdentifier,
        prefix,
        reason: element.actionReason as ActionReasonType,
        timingPeriod: {
          end: moment(element.timingPeriodEnd).format(configs.dateFormat.toUpperCase()),
          start: moment(element.timingPeriodStart).format(configs.dateFormat.toUpperCase()),
        },
        title: element.actionTitle,
      };

      thisAction = Object.assign(thisAction, actionFields);

      if (thisGoal.target[0]) {
        const goalDetailQty: Partial<PlanGoalDetailQuantity> = {
          value: element.goalValue,
        };

        const goalDetail: Partial<PlanGoalDetail> = {
          detailQuantity: Object.assign(thisGoal.target[0].detail.detailQuantity, goalDetailQty),
        };

        const goalTarget: PlanGoalTarget = Object.assign(thisGoal.target[0], {
          detail: goalDetail,
          due: moment(element.goalDue).format(configs.dateFormat.toUpperCase()),
        });

        const goalFields: Partial<PlanGoal> = {
          description: element.goalDescription,
          priority: element.goalPriority as GoalPriorityType,
          target: [goalTarget],
        };

        thisGoal = Object.assign(thisGoal, goalFields);
      }

      actions.push(thisAction);
      goals.push(thisGoal);
    }
  });

  return {
    action: actions,
    goal: goals,
  };
}

/**
 * Get the plan name and title
 *
 * @param {FormEvent} event - the event object
 * @param {PlanFormFields} formValues - the form values
 * @param {envConfigs} envConfigs - configuration from the env
 * @returns {[string, string]} - the plan name and title
 */
export const getNameTitle = (
  event: FormEvent,
  formValues: PlanFormFields,
  envConfigs?: Partial<EnvConfig>
): [string, string] => {
  const configs = {
    ...defaultEnvConfig,
    ...envConfigs,
  };
  const target = event.target as HTMLInputElement;
  const currentInterventionType =
    target.name === INTERVENTION_TYPE_CODE ? target.value : formValues.interventionType;
  const currentFiStatus = target.name === FI_STATUS_CODE ? target.value : formValues.fiStatus;

  let currentJurisdiction = '';
  if (formValues.jurisdictions.length > 0) {
    currentJurisdiction = formValues.jurisdictions[0].name;
  }

  let name = currentInterventionType;
  let title;

  const currentDate = target.name === 'date' ? target.value : formValues.date;
  if (isFIOrDynamicFI(currentInterventionType as InterventionType)) {
    const result = [
      currentFiStatus,
      currentJurisdiction,
      moment(currentDate).format(configs.dateFormat.toUpperCase()),
    ].map((e) => {
      if (e) {
        return e;
      }
      return undefined;
    });
    name = result.join('-');
    title = result.join(' ');
  } else {
    const result = [name, moment(currentDate).format(configs.dateFormat.toUpperCase())].map((e) => {
      if (e) {
        return e;
      }
      return undefined;
    });
    name = result.join('-');
    title = result.join(' ');
  }

  return [name, title];
};

/**
 * Check if the plan is a dynamic plan
 *
 * @param {object} planObject - the plan
 * @returns {boolean} -
 */
export const isDynamicPlan = <T extends Pick<PlanDefinition, 'action'> = PlanDefinition>(
  planObject: T
) =>
  planObject.action
    .map((action) => {
      return Object.keys(action).includes(CONDITION) || Object.keys(action).includes(TRIGGER);
    })
    .includes(true);

/**
 * try to deduce the task generation status value from envs, if cant get a proper valid value
 * return undefined
 *
 * @param {string | undefined} configuredEnv -  env of what the task generation status value should be
 * @param {object}planActions - planDefinition actions , to help deduce if plan is dynamic
 * @returns {taskGenerationStatusType} -
 */
export const getTaskGenerationValue = (
  configuredEnv: string | undefined,
  planActions: Pick<PlanDefinition, 'action'>
) => {
  const isDynamic = isDynamicPlan(planActions);
  /** we should probably add a validation check for the envs higher at point of entry */
  const taskGenerationStatusValue: taskGenerationStatusType | undefined =
    isDynamic &&
    configuredEnv &&
    Object.values(taskGenerationStatuses).includes(configuredEnv as taskGenerationStatusType)
      ? (configuredEnv as taskGenerationStatusType)
      : undefined;
  return taskGenerationStatusValue;
};

/**
 * Generate an OpenSRP plan definition object from the PlanForm
 *
 * @param {PlanFormFields} formValue - the value gotten from the PlanForm
 * @param {PlanDefinition | null}planObj -  the plan object
 * @param {boolean} isEditMode - creating or editing plan?
 * @param {EnvConfig} envConfigs - the env configuration vars
 * @returns {PlanDefinition} - the plan definition object
 */
export function generatePlanDefinition(
  formValue: PlanFormFields,
  planObj: PlanDefinition | null = null,
  isEditMode = false,
  envConfigs?: Partial<EnvConfig>
): PlanDefinition {
  const configs = {
    ...defaultEnvConfig,
    ...envConfigs,
  };
  const planIdentifier = formValue?.identifier // is this an existing plan?
    ? formValue.identifier
    : generateNameSpacedUUID(moment().toString(), configs.planUuidNamespace);

  const planVersion = formValue?.identifier // is this an existing plan?
    ? isNaN(parseInt(formValue.version, 10)) // is the existing version valid?
      ? parseInt(configs.defaultPlanVersion, 10) + 1
      : parseInt(formValue.version, 10) + 1
    : formValue.version;

  const actionAndGoals = extractActivitiesFromPlanForm(
    formValue.activities,
    planObj ? planObj.identifier : '',
    planObj,
    envConfigs
  );

  const taskGenerationStatusValue =
    getTaskGenerationValue(configs.taskGenerationStatus, actionAndGoals) ??
    formValue.taskGenerationStatus;

  const useContext: UseContext[] = [
    {
      code: INTERVENTION_TYPE_CODE,
      valueCodableConcept: formValue.interventionType,
    },
  ];

  if (formValue.fiStatus) {
    useContext.push({ code: FI_STATUS_CODE, valueCodableConcept: formValue.fiStatus });
  }

  if (formValue.fiReason) {
    useContext.push({ code: FI_REASON_CODE, valueCodableConcept: formValue.fiReason });
  }

  if (formValue.caseNum) {
    useContext.push({ code: CASE_NUMBER_CODE, valueCodableConcept: formValue.caseNum });
  }

  if (formValue.opensrpEventId) {
    useContext.push({ code: OPENSRP_EVENT_ID_CODE, valueCodableConcept: formValue.opensrpEventId });
  }

  if (
    formValue.taskGenerationStatus &&
    formValue.taskGenerationStatus !== taskGenerationStatuses.ignore &&
    (taskGenerationStatusValue !== taskGenerationStatuses.ignore || isEditMode)
  ) {
    useContext.push({
      code: TASK_GENERATION_STATUS_CODE,
      valueCodableConcept: isEditMode ? formValue.taskGenerationStatus : taskGenerationStatusValue,
    });
  }

  if (formValue.teamAssignmentStatus?.trim?.() && isEditMode) {
    useContext.push({
      code: TEAM_ASSIGNMENT_STATUS_CODE,
      valueCodableConcept: formValue.teamAssignmentStatus,
    });
  }

  const description = formValue.description ?? '';

  return {
    ...actionAndGoals, // action and goal
    date: moment(formValue.date).format(configs.dateFormat.toUpperCase()),
    effectivePeriod: {
      end: moment(formValue.end).format(configs.dateFormat.toUpperCase()),
      start: moment(formValue.start).format(configs.dateFormat.toUpperCase()),
    },
    experimental: false,
    identifier: planIdentifier,
    jurisdiction: formValue.jurisdictions
      ? formValue.jurisdictions.map((e) => {
          return { code: e.id };
        })
      : [],
    name: formValue.name,
    status: formValue.status,
    title: formValue.title,
    useContext,
    version: planVersion as string,
    description,
  };
}

/**
 * Get plan form field values from plan definition object
 *
 * @param {PlanDefinition} planObject - the plan definition object
 * @param {EnvConfig} envConfigs - the environmental configurations
 * @returns {PlanFormFields} - the plan form field values
 */
export function getPlanFormValues(
  planObject: PlanDefinition,
  envConfigs?: Partial<EnvConfig>
): PlanFormFields {
  const configs = {
    ...defaultEnvConfig,
    ...envConfigs,
  };
  const typeUseContext = [];
  const reasonUseContext = [];
  const statusUseContext = [];
  const eventIdUseContext = [];
  const caseNumUseContext = [];
  const taskGenerationStatusContext = [];
  const teamAssignmentStatusContext = [];

  for (const context of planObject.useContext) {
    switch (context.code) {
      case INTERVENTION_TYPE_CODE:
        typeUseContext.push(context);
        break;
      case FI_REASON_CODE:
        reasonUseContext.push(context);
        break;
      case FI_STATUS_CODE:
        statusUseContext.push(context);
        break;
      case OPENSRP_EVENT_ID_CODE:
        eventIdUseContext.push(context);
        break;
      case CASE_NUMBER_CODE:
        caseNumUseContext.push(context);
        break;
      case TASK_GENERATION_STATUS_CODE:
        taskGenerationStatusContext.push(context);
        break;
      case TEAM_ASSIGNMENT_STATUS_CODE:
        teamAssignmentStatusContext.push(context);
        break;
    }
  }

  const interventionType =
    typeUseContext.length > 0
      ? (typeUseContext[0].valueCodableConcept as InterventionType)
      : InterventionType.FI;

  let activities = planObject.action.reduce(
    (accumulator: PlanActivityFormFields[], currentAction) => {
      const goalArray = planObject.goal.filter((goal) => goal.id === currentAction.goalId);

      goalArray.forEach((currentGoal) => {
        const currentActivity = extractActivityForForm(
          {
            action: currentAction,
            goal: currentGoal,
          },
          envConfigs
        );
        accumulator.push(currentActivity);
      });

      return accumulator;
    },
    []
  );

  const planActivitiesMap = getPlanActivitiesMap(configs);

  if (activities.length < 1) {
    // eslint-disable-next-line no-prototype-builtins
    if (planActivitiesMap.hasOwnProperty(interventionType)) {
      activities = planActivitiesMap[interventionType];
    }
  }

  const taskGenerationStatus: taskGenerationStatusType =
    taskGenerationStatusContext.length > 0
      ? (taskGenerationStatusContext[0].valueCodableConcept as taskGenerationStatusType)
      : isDynamicPlan(planObject)
      ? taskGenerationStatuses.ignore
      : taskGenerationStatuses.False;

  const teamAssignmentStatus: string =
    teamAssignmentStatusContext.length > 0
      ? teamAssignmentStatusContext[0].valueCodableConcept
      : '';

  return {
    activities,
    caseNum: caseNumUseContext.length > 0 ? caseNumUseContext[0].valueCodableConcept : '',
    date: parseISO(`${planObject.date}`),
    end: parseISO(`${planObject.effectivePeriod.end}`),
    fiReason:
      reasonUseContext.length > 0
        ? (reasonUseContext[0].valueCodableConcept as FIReasonType)
        : undefined,
    fiStatus:
      statusUseContext.length > 0
        ? (statusUseContext[0].valueCodableConcept as FIStatusType)
        : undefined,
    identifier: planObject.identifier,
    interventionType,
    jurisdictions: planObject.jurisdiction.map((e) => ({
      id: e.code,
      name: e.code,
    })) /** a little cheating: since we dnt have the name yet, we just use code */,
    name: planObject.name,
    opensrpEventId:
      eventIdUseContext.length > 0 ? eventIdUseContext[0].valueCodableConcept : undefined,
    start: parseISO(`${planObject.effectivePeriod.start}`),
    status: planObject.status as PlanStatus,
    taskGenerationStatus,
    teamAssignmentStatus,
    title: planObject.title,
    version: planObject.version,
    description: planObject.description,
  };
}

/**
 * Get goal unit from action code
 *
 * @param {PlanActionCodesType} actionCode - the plan action code
 * @param {boolean} isDynamic - whether we are looking for dynamic activities
 * @returns {GoalUnit} -
 */
export function getGoalUnitFromActionCode(
  actionCode: PlanActionCodesType,
  isDynamic = false
): GoalUnit {
  const planActivity = getPlanActivityFromActionCode(actionCode, isDynamic);
  if (planActivity) {
    return planActivity.goal.target[0].detail.detailQuantity.unit;
  }
  return GoalUnit.UNKNOWN;
}
/**
 * Check if a plan type should be visible
 *
 * @param {InterventionType} planType - plan type
 * @param {EnvConfig} envConfig - the environmental configurations
 * @returns {boolean} -
 */
export const isPlanTypeEnabled = (
  planType: InterventionType,
  envConfig?: Partial<EnvConfig>
): boolean => {
  const configs = {
    ...defaultEnvConfig,
    ...envConfig,
  };
  return configs.displayedPlanTypes.includes(planType);
};

/**
 * Check if plan type should be created
 *
 * @param {InterventionType} planType - plan type
 * @param {boolean} isEditMode - are we editing or creating a plan
 * @param {EnvConfig} envConfig - the environmental configurations
 * @returns {boolean} -
 */
export const displayPlanTypeOnForm = (
  planType: InterventionType,
  isEditMode: boolean,
  envConfig: Partial<EnvConfig>
): boolean => {
  const configs = {
    ...defaultEnvConfig,
    ...envConfig,
  };
  return isEditMode || configs.planTypesAllowedToCreate.includes(planType);
};
