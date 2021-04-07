/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Dictionary } from '@onaio/utils';
import moment from 'moment';
import { FormEvent } from 'react';
import { PlanActivityFormFields, PlanFormFields } from '../types';
import { GoalUnit, InterventionType, PlanStatus } from '../constants/enumsAndCodeConstants';
import { PlanActivity } from '../types';
import { parseISO } from 'date-fns';
import { planActivities as planActivitiesFromConfig } from '../activitiesLookup';
import { defaultEnvConfig } from '../settings';

const DEFAULT_ACTIVITY_DURATION_DAYS = defaultEnvConfig.defaultActivityDurationDays;

const goalDue = moment().add(DEFAULT_ACTIVITY_DURATION_DAYS, 'days').toDate();
goalDue.setMilliseconds(0);

const timingPeriodEnd = moment().add(DEFAULT_ACTIVITY_DURATION_DAYS, 'days').toDate();
timingPeriodEnd.setMilliseconds(0);

const timingPeriodStart = moment().toDate();
timingPeriodStart.setMilliseconds(0);

export const activities: PlanActivityFormFields[] = [
  {
    actionCode: 'Case Confirmation',
    actionDescription: 'Confirm the index case',
    actionIdentifier: '',
    actionReason: 'Investigation',
    actionTitle: 'Case Confirmation',
    goalDescription: 'Confirm the index case',
    goalDue: parseISO('2019-08-16T08:39:42.773Z'),
    goalPriority: 'medium-priority',
    goalValue: 1,
    timingPeriodEnd: parseISO('2019-08-16T08:39:42.773Z'),
    timingPeriodStart: parseISO('2019-08-09T08:39:42.773Z'),
  },
  {
    actionCode: 'RACD Register Family',
    actionDescription:
      'Register all families & family members in all residential structures enumerated (100%) within the operational area',
    actionIdentifier: '',
    actionReason: 'Investigation',
    actionTitle: 'Family Registration',
    goalDescription:
      'Register all families & family members in all residential structures enumerated (100%) within the operational area',
    goalDue: parseISO('2019-08-16T08:39:42.773Z'),
    goalPriority: 'medium-priority',
    goalValue: 100,
    timingPeriodEnd: parseISO('2019-08-16T08:39:42.773Z'),
    timingPeriodStart: parseISO('2019-08-09T08:39:42.774Z'),
  },
  {
    actionCode: 'Blood Screening',
    actionDescription:
      'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
    actionIdentifier: '',
    actionReason: 'Investigation',
    actionTitle: 'Blood screening',
    goalDescription:
      'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
    goalDue: parseISO('2019-08-16T08:39:42.774Z'),
    goalPriority: 'medium-priority',
    goalValue: 100,
    timingPeriodEnd: parseISO('2019-08-16T08:39:42.775Z'),
    timingPeriodStart: parseISO('2019-08-09T08:39:42.775Z'),
  },
  {
    actionCode: 'Bednet Distribution',
    actionDescription:
      'Visit 100% of residential structures in the operational area and provide nets',
    actionIdentifier: '',
    actionReason: 'Investigation',
    actionTitle: 'Bednet Distribution',
    goalDescription:
      'Visit 100% of residential structures in the operational area and provide nets',
    goalDue: parseISO('2019-08-16T08:39:42.775Z'),
    goalPriority: 'medium-priority',
    goalValue: 100,
    timingPeriodEnd: parseISO('2019-08-16T08:39:42.775Z'),
    timingPeriodStart: parseISO('2019-08-09T08:39:42.775Z'),
  },
  {
    actionCode: 'Larval Dipping',
    actionDescription:
      'Perform a minimum of three larval dipping activities in the operational area',
    actionIdentifier: '',
    actionReason: 'Investigation',
    actionTitle: 'Larval Dipping',
    goalDescription: 'Perform a minimum of three larval dipping activities in the operational area',
    goalDue: parseISO('2019-08-16T08:39:42.775Z'),
    goalPriority: 'medium-priority',
    goalValue: 3,
    timingPeriodEnd: parseISO('2019-08-16T08:39:42.776Z'),
    timingPeriodStart: parseISO('2019-08-09T08:39:42.776Z'),
  },
  {
    actionCode: 'Mosquito Collection',
    actionDescription:
      'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
    actionIdentifier: '',
    actionReason: 'Investigation',
    actionTitle: 'Mosquito Collection',
    goalDescription:
      'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
    goalDue: parseISO('2019-08-16T08:39:42.776Z'),
    goalPriority: 'medium-priority',
    goalValue: 3,
    timingPeriodEnd: parseISO('2019-08-16T08:39:42.776Z'),
    timingPeriodStart: parseISO('2019-08-09T08:39:42.776Z'),
  },
  {
    actionCode: 'BCC',
    actionDescription: 'Conduct BCC activity',
    actionIdentifier: '',
    actionReason: 'Investigation',
    actionTitle: 'Behaviour Change Communication',
    goalDescription: 'Complete at least 1 BCC activity for the operational area',
    goalDue: parseISO('2019-08-16T08:39:42.778Z'),
    goalPriority: 'medium-priority',
    goalValue: 1,
    timingPeriodEnd: parseISO('2019-08-16T08:39:42.778Z'),
    timingPeriodStart: parseISO('2019-08-09T08:39:42.778Z'),
  },
];

export const DynamicFIPlan = {
  identifier: '7c48f3f1-79c6-5b76-8432-43d04bd67c32',
  version: '1',
  name: 'Dynamic-FI-2020-09-16',
  title: 'Test Plan by QA 2020-09-16',
  status: 'active',
  date: '2020-09-16',
  effectivePeriod: { start: '2020-09-16', end: '2020-10-06' },
  useContext: [
    { code: 'interventionType', valueCodableConcept: 'Dynamic-FI' },
    { code: 'fiStatus', valueCodableConcept: 'A1' },
    { code: 'fiReason', valueCodableConcept: 'Routine' },
    { code: 'taskGenerationStatus', valueCodableConcept: 'True' },
    { code: 'teamAssignmentStatus', valueCodableConcept: 'False' },
  ],
  jurisdiction: [{ code: '45abb6b7-b3ca-4b82-851b-856a4da0335b' }],
  serverVersion: 1600346630940,
  goal: [
    {
      id: 'RACD_register_families',
      description: 'ลงทะเบียนครัวเรือนและสมาชิกในครัวเรือน (100%) ภายในพื้นที่ปฏิบัติงาน',
      priority: 'medium-priority',
      target: [
        {
          measure: 'ร้อยละของบ้าน/สิ่งปลูกสร้างที่ได้ลงทะเบียนข้อมูลครัวเรือน',
          detail: {
            detailQuantity: {
              value: 100.0,
              comparator: '\u0026amp;amp;gt;\u003d',
              unit: 'Percent',
            },
          },
          due: '2020-09-23',
        },
      ],
    },
    {
      id: 'RACD_Blood_Screening',
      description: 'เจาะเลือดรอบบ้านผู้ป่วยในรัศมี 1 กิโลเมตร (100%)',
      priority: 'medium-priority',
      target: [
        {
          measure: 'จำนวนผู้ที่ได้รับการเจาะโลหิต',
          detail: {
            detailQuantity: {
              value: 100.0,
              comparator: '\u0026amp;amp;gt;\u003d',
              unit: 'Person(s)',
            },
          },
          due: '2020-09-23',
        },
      ],
    },
    {
      id: 'RACD_bednet_distribution',
      description: 'แจกมุ้งทุกหลังคาเรือนในพื้นที่ปฏิบัติงาน (100%)',
      priority: 'medium-priority',
      target: [
        {
          measure: 'จำนวนบ้าน/สิ่งปลูกสร้างที่ได้รับมุ้ง',
          detail: {
            detailQuantity: {
              value: 100.0,
              comparator: '\u0026amp;amp;gt;\u003d',
              unit: 'Percent',
            },
          },
          due: '2020-09-23',
        },
      ],
    },
    {
      id: 'Larval_Dipping',
      description: 'ดำเนินกิจกรรมจับลูกน้ำอย่างน้อย 3 แห่งในพื้นที่ปฏิบัติงาน',
      priority: 'medium-priority',
      target: [
        {
          measure: 'จำนวนกิจกรรมการตักลูกน้ำ',
          detail: {
            detailQuantity: {
              value: 3.0,
              comparator: '\u0026amp;amp;gt;\u003d',
              unit: 'activit(y|ies)',
            },
          },
          due: '2020-09-23',
        },
      ],
    },
    {
      id: 'Mosquito_Collection',
      description: 'กิจกรรมจับยุงกำหนดไว้อย่างน้อย 3 แห่ง',
      priority: 'medium-priority',
      target: [
        {
          measure: 'จำนวนกิจกรรมการจับยุง',
          detail: {
            detailQuantity: {
              value: 3.0,
              comparator: '\u0026amp;amp;gt;\u003d',
              unit: 'activit(y|ies)',
            },
          },
          due: '2020-09-23',
        },
      ],
    },
    {
      id: 'BCC_Focus',
      description: 'ให้สุขศึกษาในพื้นที่ปฏิบัติงานอย่างน้อย 1 ครั้ง',
      priority: 'medium-priority',
      target: [
        {
          measure: 'จำนวนกิจกรรมการให้สุขศึกษา',
          detail: {
            detailQuantity: {
              value: 1.0,
              comparator: '\u0026amp;amp;gt;\u003d',
              unit: 'activit(y|ies)',
            },
          },
          due: '2020-09-23',
        },
      ],
    },
  ],
  action: [
    {
      identifier: '574dfa8f-5b9c-5230-8839-d3b9b45dbc83',
      prefix: 1,
      title: 'ลงทะเบียนครัวเรือน',
      description: 'ลงทะเบียนครัวเรือนและสมาชิกในครัวเรือน (100%) ภายในพื้นที่ปฏิบัติงาน',
      code: 'RACD Register Family',
      timingPeriod: { start: '2020-09-16', end: '2020-09-23' },
      reason: 'Routine',
      goalId: 'RACD_register_families',
      subjectCodableConcept: { text: 'Location' },
      trigger: [
        { type: 'named-event', name: 'plan-activation' },
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Register_Structure event is submitted',
            expression: 'questionnaire \u003d \u0027Register_Structure\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Structure is residential or type does not exist',
            expression:
              '$this.is(FHIR.QuestionnaireResponse) or (($this.type.where(id\u003d\u0027locationType\u0027).exists().not() or $this.type.where(id\u003d\u0027locationType\u0027).text \u003d \u0027Residential Structure\u0027) and $this.contained.exists().not())',
            subjectCodableConcept: { text: 'Family' },
          },
        },
        {
          kind: 'applicability',
          expression: {
            description: 'Apply to residential structures in Register_Structure questionnaires',
            expression:
              '$this.is(FHIR.Location) or (questionnaire \u003d \u0027Register_Structure\u0027 and $this.item.where(linkId\u003d\u0027structureType\u0027).answer.value \u003d\u0027Residential Structure\u0027)',
          },
        },
      ],
      definitionUri: 'family_register.json',
      type: 'create',
    },
    {
      identifier: '52e355e7-2cec-5fb9-bb4f-036ee96243f9',
      prefix: 2,
      title: 'กิจกรรมการเจาะโลหิต',
      description: 'เจาะเลือดรอบบ้านผู้ป่วยในรัศมี 1 กิโลเมตร (100%)',
      code: 'Blood Screening',
      timingPeriod: { start: '2020-09-16', end: '2020-09-23' },
      reason: 'Investigation',
      goalId: 'RACD_Blood_Screening',
      subjectCodableConcept: { text: 'Person' },
      trigger: [
        { type: 'named-event', name: 'plan-activation' },
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description:
              'Trigger when a Family Registration or Family Member Registration event is submitted',
            expression:
              'questionnaire \u003d \u0027Family_Registration\u0027 or questionnaire \u003d \u0027Family_Member_Registration\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description:
              'Person is older than 5 years or person associated with questionnaire response if older than 5 years',
            expression:
              '($this.is(FHIR.Patient) and $this.birthDate \u0026amp;amp;lt;\u003d today() - 5 \u0027years\u0027) or ($this.contained.where(Patient.birthDate \u0026amp;amp;lt;\u003d today() - 5 \u0027years\u0027).exists())',
          },
        },
      ],
      definitionUri: 'blood_screening.json',
      type: 'create',
    },
    {
      identifier: '7350fd5e-2c0f-551e-9561-369c9f3f1f52',
      prefix: 3,
      title: 'กิจกรรมสำรวจ/ชุบ/แจกมุ้ง',
      description: 'แจกมุ้งทุกหลังคาเรือนในพื้นที่ปฏิบัติงาน (100%)',
      code: 'Bednet Distribution',
      timingPeriod: { start: '2020-09-16', end: '2020-09-23' },
      reason: 'Routine',
      goalId: 'RACD_bednet_distribution',
      subjectCodableConcept: { text: 'Location' },
      trigger: [
        { type: 'named-event', name: 'plan-activation' },
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Family Registration event is submitted',
            expression: 'questionnaire \u003d \u0027Family_Registration\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Structure is residential or type does not exist',
            expression:
              '$this.is(FHIR.QuestionnaireResponse) or (($this.type.where(id\u003d\u0027locationType\u0027).exists().not() or $this.type.where(id\u003d\u0027locationType\u0027).text \u003d \u0027Residential Structure\u0027) and $this.contained.exists())',
            subjectCodableConcept: { text: 'Family' },
          },
        },
      ],
      definitionUri: 'bednet_distribution.json',
      type: 'create',
    },
    {
      identifier: 'e9f18b1a-59c6-5d3a-b42a-18dcb9012c59',
      prefix: 4,
      title: 'กิจกรรมการตักลูกน้ำ',
      description: 'ดำเนินกิจกรรมจับลูกน้ำอย่างน้อย 3 แห่งในพื้นที่ปฏิบัติงาน',
      code: 'Larval Dipping',
      timingPeriod: { start: '2020-09-16', end: '2020-09-23' },
      reason: 'Investigation',
      goalId: 'Larval_Dipping',
      subjectCodableConcept: { text: 'Location' },
      trigger: [
        { type: 'named-event', name: 'plan-activation' },
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Register_Structure event is submitted',
            expression: 'questionnaire \u003d \u0027Register_Structure\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Structure is a larval breeding site',
            expression:
              '$this.is(FHIR.QuestionnaireResponse) or $this.type.where(id\u003d\u0027locationType\u0027).text \u003d \u0027Larval Breeding Site\u0027',
          },
        },
        {
          kind: 'applicability',
          expression: {
            description: 'Apply to larval breeding sites in Register_Structure questionnaires',
            expression:
              '$this.is(FHIR.Location) or (questionnaire \u003d \u0027Register_Structure\u0027 and $this.item.where(linkId\u003d\u0027structureType\u0027).answer.value \u003d\u0027Larval Breeding Site\u0027)',
          },
        },
      ],
      definitionUri: 'larval_dipping_form.json',
      type: 'create',
    },
    {
      identifier: 'd9d1cd1c-ff6d-5ec8-bb49-106ab9a01416',
      prefix: 5,
      title: 'กิจกรรมการจับยุง',
      description: 'กิจกรรมจับยุงกำหนดไว้อย่างน้อย 3 แห่ง',
      code: 'Mosquito Collection',
      timingPeriod: { start: '2020-09-16', end: '2020-09-23' },
      reason: 'Investigation',
      goalId: 'Mosquito_Collection',
      subjectCodableConcept: { text: 'Location' },
      trigger: [
        { type: 'named-event', name: 'plan-activation' },
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Register_Structure event is submitted',
            expression: 'questionnaire \u003d \u0027Register_Structure\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Structure is a mosquito collection point',
            expression:
              '$this.is(FHIR.QuestionnaireResponse) or $this.type.where(id\u003d\u0027locationType\u0027).text \u003d \u0027Mosquito Collection Point\u0027',
          },
        },
        {
          kind: 'applicability',
          expression: {
            description: 'Apply to mosquito collection point in Register_Structure questionnaires',
            expression:
              '$this.is(FHIR.Location) or (questionnaire \u003d \u0027Register_Structure\u0027 and $this.item.where(linkId\u003d\u0027structureType\u0027).answer.value \u003d\u0027Mosquito Collection Point\u0027)',
          },
        },
      ],
      definitionUri: 'mosquito_collection_form.json',
      type: 'create',
    },
    {
      identifier: 'f1604872-d055-58d2-91e9-861d74d08509',
      prefix: 6,
      title: 'กิจกรรมการให้สุขศึกษา',
      description: 'ดำเนินกิจกรรมให้สุขศึกษา',
      code: 'BCC',
      timingPeriod: { start: '2020-09-16', end: '2020-09-23' },
      reason: 'Routine',
      goalId: 'BCC_Focus',
      subjectCodableConcept: { text: 'Jurisdiction' },
      trigger: [{ type: 'named-event', name: 'plan-activation' }],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Jurisdiction type location',
            expression: 'Location.physicalType.text \u003d \u0027jdn\u0027',
          },
        },
      ],
      definitionUri: 'behaviour_change_communication.json',
      type: 'create',
    },
  ],
  experimental: false,
};

export const event: FormEvent = {
  bubbles: false,
  cancelable: false,
  currentTarget: {} as EventTarget & Element,
  defaultPrevented: false,
  eventPhase: 0,
  isDefaultPrevented: () => false,
  isPropagationStopped: () => false,
  isTrusted: true,
  nativeEvent: {} as Event,
  persist: () => null,
  preventDefault: () => null,
  stopPropagation: () => null,
  target: {
    addEventListener: () => false,
    dispatchEvent: () => false,
    name: 'interventionType',
    removeEventListener: () => false,
    value: 'FI',
  } as EventTarget,
  timeStamp: 0,
  type: '',
};

export const event2: FormEvent = {
  bubbles: false,
  cancelable: false,
  currentTarget: {} as EventTarget & Element,
  defaultPrevented: false,
  eventPhase: 0,
  isDefaultPrevented: () => false,
  isPropagationStopped: () => false,
  isTrusted: true,
  nativeEvent: {} as Event,
  persist: () => null,
  preventDefault: () => null,
  stopPropagation: () => null,
  target: {
    addEventListener: () => false,
    dispatchEvent: () => false,
    name: 'interventionType',
    removeEventListener: () => false,
    value: 'IRS',
  } as EventTarget,
  timeStamp: 0,
  type: '',
};

export const event3: FormEvent = {
  bubbles: false,
  cancelable: false,
  currentTarget: {} as EventTarget & Element,
  defaultPrevented: false,
  eventPhase: 0,
  isDefaultPrevented: () => false,
  isPropagationStopped: () => false,
  isTrusted: true,
  nativeEvent: {} as Event,
  persist: () => null,
  preventDefault: () => null,
  stopPropagation: () => null,
  target: {
    addEventListener: () => null,
    dispatchEvent: () => false,
    removeEventListener: () => null,
  } as EventTarget,
  timeStamp: 0,
  type: '',
};

export const expectedActivity: Dictionary = {};
export const planActivityWithEmptyFields: Dictionary = {};

const processActivity = (activityObj: PlanActivity) => {
  return {
    ...(activityObj.action.condition && {
      condition: activityObj.action.condition.map((item) => {
        return {
          description: item.expression.description || '',
          expression: item.expression.expression || '',
          subjectCodableConceptText: item.expression.subjectCodableConcept?.text || '',
        };
      }),
    }),
    ...(activityObj.action.trigger && {
      trigger: activityObj.action.trigger.map((item) => {
        return {
          ...(item.expression && {
            description: item.expression.description || '',
            expression: item.expression.expression,
          }),
          name: item.name,
        };
      }),
    }),
    ...(activityObj.action.dynamicValue && {
      dynamicValue: activityObj.action.dynamicValue.map((item) => {
        return {
          path: item.path,
          expression: item.expression.expression,
        };
      }),
    }),
    actionCode: activityObj.action.code,
    actionDefinitionUri: activityObj.action.definitionUri || '',
    actionDescription: activityObj.action.description || '',
    actionIdentifier: activityObj.action.identifier || '',
    actionReason: activityObj.action.reason || '',
    actionTitle: activityObj.action.title || '',
    goalDescription: activityObj.goal.description || '',
    goalDue,
    goalPriority: 'medium-priority',
    goalValue: activityObj.goal.target[0].detail.detailQuantity.value,
    timingPeriodEnd,
    timingPeriodStart,
  };
};

for (const [key, activityObj] of Object.entries(planActivitiesFromConfig)) {
  // build expectedActivity
  expectedActivity[key] = processActivity(activityObj);

  // build planActivityWithEmptyFields
  planActivityWithEmptyFields[key] = {
    ...activityObj,
    action: {
      ...activityObj.action,
      description: '',
      identifier: '',
    },
    goal: {
      ...activityObj.goal,
      description: '',
    },
  };
}

export const expectedActivityEmptyField: Dictionary = {};
for (const [key, activityObj] of Object.entries(expectedActivity)) {
  expectedActivityEmptyField[key] = {
    ...activityObj,
    actionDescription: '',
    actionIdentifier: '',
    goalDescription: '',
  };
}

export const extractedActivitiesFromForms = Object.values(planActivitiesFromConfig)
  .sort((a, b) => a.action.prefix - b.action.prefix)
  .map((e) => {
    return processActivity(e);
  });

export const planActivities: Dictionary = {};
for (const [key, activityObj] of Object.entries(planActivitiesFromConfig)) {
  planActivities[key] = {
    ...activityObj,
    action: {
      ...activityObj.action,
      timingPeriod: {
        end: timingPeriodEnd.toISOString(),
        start: timingPeriodStart.toISOString(),
      },
    },
    goal: {
      ...activityObj.goal,
      target: activityObj.goal.target.map((e) => {
        return {
          ...e,
          due: goalDue.toISOString(),
        };
      }),
    },
  };
}

const planActivityWithoutTargets: Dictionary = {};
for (const [key, activity] of Object.entries(planActivitiesFromConfig)) {
  planActivityWithoutTargets[key] = {
    ...activity,
    goal: {
      description: activity.goal.description,
      id: activity.goal.id,
      priority: activity.goal.priority,
    },
  };
}
export { planActivityWithoutTargets };

export const expectedExtractActivityFromPlanformResult = {
  action: [
    {
      code: 'Case Confirmation',
      description: 'Confirm the index case',
      goalId: 'Case_Confirmation',
      identifier: '5728cbf8-0e95-5b1b-863a-d03769a785c9',
      prefix: 1,
      reason: 'Investigation',
      subjectCodableConcept: {
        text: 'Jurisdiction',
      },
      taskTemplate: 'Case_Confirmation',
      timingPeriod: {
        end: '2019-08-16',
        start: '2019-08-09',
      },
      title: 'Case Confirmation',
    },
    {
      code: 'RACD Register Family',
      description:
        'Register all families & family members in all residential structures enumerated (100%) within the operational area',
      goalId: 'RACD_register_families',
      identifier: '541258e7-4bd0-5699-89ba-7e832e5452b3',
      prefix: 2,
      reason: 'Investigation',
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'RACD_register_families',
      timingPeriod: {
        end: '2019-08-16',
        start: '2019-08-09',
      },
      title: 'Family Registration',
    },
    {
      code: 'Blood Screening',
      description:
        'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
      goalId: 'RACD_Blood_Screening',
      identifier: 'a73a487d-b93a-5a06-84eb-19ccf9785045',
      prefix: 3,
      reason: 'Investigation',
      subjectCodableConcept: {
        text: 'Person',
      },
      taskTemplate: 'RACD_Blood_Screening',
      timingPeriod: {
        end: '2019-08-16',
        start: '2019-08-09',
      },
      title: 'Blood screening',
    },
    {
      code: 'Bednet Distribution',
      description: 'Visit 100% of residential structures in the operational area and provide nets',
      goalId: 'RACD_bednet_distribution',
      identifier: '2439129c-3d1f-5d16-99b0-a0f02db4dd83',
      prefix: 4,
      reason: 'Investigation',
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'Bednet_Distribution',
      timingPeriod: {
        end: '2019-08-16',
        start: '2019-08-09',
      },
      title: 'Bednet Distribution',
    },
    {
      code: 'Larval Dipping',
      description: 'Perform a minimum of three larval dipping activities in the operational area',
      goalId: 'Larval_Dipping',
      identifier: 'c1054dec-2c11-5cf8-83fe-c31b1f5de660',
      prefix: 5,
      reason: 'Investigation',
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'Larval_Dipping',
      timingPeriod: {
        end: '2019-08-16',
        start: '2019-08-09',
      },
      title: 'Larval Dipping',
    },
    {
      code: 'Mosquito Collection',
      description:
        'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
      goalId: 'Mosquito_Collection',
      identifier: '28633053-4c6a-5332-8f6e-fa26d5ccb2f6',
      prefix: 6,
      reason: 'Investigation',
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'Mosquito_Collection_Point',
      timingPeriod: {
        end: '2019-08-16',
        start: '2019-08-09',
      },
      title: 'Mosquito Collection',
    },
    {
      code: 'BCC',
      description: 'Conduct BCC activity',
      goalId: 'BCC_Focus',
      identifier: '089522a3-bd02-5de3-b2d5-95234b1a5d01',
      prefix: 7,
      reason: 'Investigation',
      subjectCodableConcept: {
        text: 'Jurisdiction',
      },
      taskTemplate: 'BCC_Focus',
      timingPeriod: {
        end: '2019-08-16',
        start: '2019-08-09',
      },
      title: 'Behaviour Change Communication',
    },
  ],
  goal: [
    {
      description: 'Confirm the index case',
      id: 'Case_Confirmation',
      priority: 'medium-priority',
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.CASE,
              value: 1,
            },
          },
          due: '2019-08-16',
          measure: 'Number of cases confirmed',
        },
      ],
    },
    {
      description:
        'Register all families & family members in all residential structures enumerated (100%) within the operational area',
      id: 'RACD_register_families',
      priority: 'medium-priority',
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '2019-08-16',
          measure: 'Percent of residential structures with full family registration',
        },
      ],
    },
    {
      description:
        'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
      id: 'RACD_Blood_Screening',
      priority: 'medium-priority',
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERSON,
              value: 100,
            },
          },
          due: '2019-08-16',
          measure: 'Number of registered people tested',
        },
      ],
    },
    {
      description: 'Visit 100% of residential structures in the operational area and provide nets',
      id: 'RACD_bednet_distribution',
      priority: 'medium-priority',
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 100,
            },
          },
          due: '2019-08-16',
          measure: 'Percent of residential structures received nets',
        },
      ],
    },
    {
      description: 'Perform a minimum of three larval dipping activities in the operational area',
      id: 'Larval_Dipping',
      priority: 'medium-priority',
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 3,
            },
          },
          due: '2019-08-16',
          measure: 'Number of larval dipping activities completed',
        },
      ],
    },
    {
      description:
        'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
      id: 'Mosquito_Collection',
      priority: 'medium-priority',
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 3,
            },
          },
          due: '2019-08-16',
          measure: 'Number of mosquito collection activities completed',
        },
      ],
    },
    {
      description: 'Complete at least 1 BCC activity for the operational area',
      id: 'BCC_Focus',
      priority: 'medium-priority',
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.ACTIVITY,
              value: 1,
            },
          },
          due: '2019-08-16',
          measure: 'BCC Activities Completed',
        },
      ],
    },
  ],
};

export const expectedPlanDefinition = {
  action: [
    {
      code: 'IRS',
      description: 'Visit each structure in the operational area and attempt to spray',
      goalId: 'IRS',
      identifier: 'f3ef25d3-c417-5f87-b876-f05bc2b0d093',
      prefix: 1,
      reason: 'Routine',
      subjectCodableConcept: {
        text: 'Location',
      },
      taskTemplate: 'Spray_Structures',
      timingPeriod: {
        end: '2019-08-16',
        start: '2019-08-09',
      },
      title: 'Spray Structures',
    },
  ],
  date: '2019-08-09',
  effectivePeriod: {
    end: '2019-08-29',
    start: '2019-08-09',
  },
  description: '',
  experimental: false,
  goal: [
    {
      description: 'Spray structures in the operational area',
      id: 'IRS',
      priority: 'medium-priority',
      target: [
        {
          detail: {
            detailQuantity: {
              comparator: '>=',
              unit: GoalUnit.PERCENT,
              value: 90,
            },
          },
          due: '2019-08-16',
          measure: 'Percent of structures sprayed',
        },
      ],
    },
  ],
  identifier: '8f507b70-1f50-5616-805d-db5b8ae4280e',
  jurisdiction: [
    {
      code: '3952',
    },
  ],
  name: 'IRS-2019-08-09',
  status: 'draft',
  title: 'IRS 2019-08-09',
  useContext: [
    {
      code: 'interventionType',
      valueCodableConcept: 'IRS',
    },
    {
      code: 'taskGenerationStatus',
      valueCodableConcept: 'False',
    },
  ],
  version: '1',
};

export const fiReasonTestPlan = {
  action: [
    {
      code: 'Case Confirmation',
      description: 'Confirm the index case',
      goalId: 'Case_Confirmation',
      identifier: '38cd9c29-b583-5405-80af-a362a219b353',
      prefix: 1,
      reason: 'Investigation',
      subjectCodableConcept: { text: 'Jurisdiction' },
      taskTemplate: 'Case_Confirmation',
      timingPeriod: { end: '2020-09-24', start: '2020-09-17' },
      title: 'Case Confirmation',
    },
    {
      code: 'RACD Register Family',
      description:
        'Register all families & family members in all residential structures enumerated (100%) within the operational area',
      goalId: 'RACD_register_families',
      identifier: '082be289-cf66-5312-8717-1218b1ac055d',
      prefix: 2,
      reason: 'Investigation',
      subjectCodableConcept: { text: 'Location' },
      taskTemplate: 'RACD_register_families',
      timingPeriod: { end: '2020-09-24', start: '2020-09-17' },
      title: 'Family Registration',
    },
    {
      code: 'Blood Screening',
      description:
        'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
      goalId: 'RACD_Blood_Screening',
      identifier: '26a0d7f9-d69b-5870-a189-21f17b22d9cf',
      prefix: 3,
      reason: 'Investigation',
      subjectCodableConcept: { text: 'Person' },
      taskTemplate: 'RACD_Blood_Screening',
      timingPeriod: { end: '2020-09-24', start: '2020-09-17' },
      title: 'Blood Screening',
    },
    {
      code: 'Bednet Distribution',
      description: 'Visit 100% of residential structures in the operational area and provide nets',
      goalId: 'RACD_bednet_distribution',
      identifier: 'bf4d8bfc-fff2-57a9-be96-c06c9beb4656',
      prefix: 4,
      reason: 'Investigation',
      subjectCodableConcept: { text: 'Location' },
      taskTemplate: 'Bednet_Distribution',
      timingPeriod: { end: '2020-09-24', start: '2020-09-17' },
      title: 'Bednet Distribution',
    },
    {
      code: 'Larval Dipping',
      description: 'Perform a minimum of three larval dipping activities in the operational area',
      goalId: 'Larval_Dipping',
      identifier: 'fd0e920b-70f3-5ef4-afa5-d8b8a66bb543',
      prefix: 5,
      reason: 'Investigation',
      subjectCodableConcept: { text: 'Location' },
      taskTemplate: 'Larval_Dipping',
      timingPeriod: { end: '2020-09-24', start: '2020-09-17' },
      title: 'Larval Dipping',
    },
    {
      code: 'Mosquito Collection',
      description:
        'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
      goalId: 'Mosquito_Collection',
      identifier: '62e2b828-3c44-5e01-9cb9-32a7e09e3c22',
      prefix: 6,
      reason: 'Investigation',
      subjectCodableConcept: { text: 'Location' },
      taskTemplate: 'Mosquito_Collection_Point',
      timingPeriod: { end: '2020-09-24', start: '2020-09-17' },
      title: 'Mosquito Collection',
    },
    {
      code: 'BCC',
      description: 'Conduct BCC activity',
      goalId: 'BCC_Focus',
      identifier: '4d9f9a8c-32c9-589b-a0f0-29e65e7ac1f9',
      prefix: 7,
      reason: 'Investigation',
      subjectCodableConcept: { text: 'Jurisdiction' },
      taskTemplate: 'BCC_Focus',
      timingPeriod: { end: '2020-09-24', start: '2020-09-17' },
      title: 'Behaviour Change Communication',
    },
  ],
  goal: [
    {
      description: 'Confirm the index case',
      id: 'Case_Confirmation',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>=', unit: 'case(s)', value: 1 } },
          due: '2020-09-24',
          measure: 'Number of cases confirmed',
        },
      ],
    },
    {
      description:
        'Register all families & family members in all residential structures enumerated (100%) within the operational area',
      id: 'RACD_register_families',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>=', unit: 'Percent', value: 100 } },
          due: '2020-09-24',
          measure: 'Percent of residential structures with full family registration',
        },
      ],
    },
    {
      description:
        'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
      id: 'RACD_Blood_Screening',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>=', unit: 'Person(s)', value: 100 } },
          due: '2020-09-24',
          measure: 'Number of registered people tested',
        },
      ],
    },
    {
      description: 'Visit 100% of residential structures in the operational area and provide nets',
      id: 'RACD_bednet_distribution',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>=', unit: 'Percent', value: 100 } },
          due: '2020-09-24',
          measure: 'Percent of residential structures received nets',
        },
      ],
    },
    {
      description: 'Perform a minimum of three larval dipping activities in the operational area',
      id: 'Larval_Dipping',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>=', unit: 'activit(y|ies)', value: 3 } },
          due: '2020-09-24',
          measure: 'Number of larval dipping activities completed',
        },
      ],
    },
    {
      description:
        'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
      id: 'Mosquito_Collection',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>=', unit: 'activit(y|ies)', value: 3 } },
          due: '2020-09-24',
          measure: 'Number of mosquito collection activities completed',
        },
      ],
    },
    {
      description: 'Complete at least 1 BCC activity for the operational area',
      id: 'BCC_Focus',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>=', unit: 'activit(y|ies)', value: 1 } },
          due: '2020-09-24',
          measure: 'BCC Activities Completed',
        },
      ],
    },
  ],
  // tslint:disable: object-literal-sort-keys
  date: '2020-09-17',
  effectivePeriod: { end: '2020-10-07', start: '2020-09-17' },
  experimental: false,
  identifier: '311d4728-8e88-575d-8189-e88d9a4ae3b6',
  jurisdiction: [{ code: '40aee4db-1c05-4fdf-a984-612829d6900b' }],
  name: 'A1-Test OA-2020-09-17',
  status: 'draft',
  title: 'A1 Test OA 2020-09-17 FI Reason Test',
  useContext: [
    { code: 'interventionType', valueCodableConcept: 'FI' },
    { code: 'fiStatus', valueCodableConcept: 'A1' },
    { code: 'taskGenerationStatus', valueCodableConcept: 'False' },
  ],
  version: '1',
};

export const planFormValues = {
  activities: [
    {
      actionCode: 'IRS',
      actionDescription: 'Visit each structure in the operational area and attempt to spray',
      actionIdentifier: 'ce6f39db-505a-5d44-b70d-c92a73be6c15',
      actionReason: 'Routine',
      actionTitle: 'Spray Structures',
      goalDescription: 'Spray structures in the operational area',
      goalDue: parseISO(`2019-08-16`),
      goalPriority: 'medium-priority',
      goalValue: 90,
      timingPeriodEnd: parseISO(`2019-08-16`),
      timingPeriodStart: parseISO(`2019-08-09`),
    },
  ],
  caseNum: '',
  date: parseISO(`2019-08-09`),
  end: parseISO(`2019-08-29`),
  fiReason: undefined,
  fiStatus: undefined,
  identifier: 'afbfc83d-c7a2-5293-9db5-081781235c60',
  interventionType: 'IRS',
  jurisdictions: [
    {
      id: '3952',
      name: 'Akros_2',
    },
  ],
  name: 'IRS-2019-08-09',
  opensrpEventId: undefined,
  start: parseISO(`2019-08-09`),
  status: 'draft',
  taskGenerationStatus: 'False',
  teamAssignmentStatus: '',
  title: 'IRS 2019-08-09',
  version: '1',
  description: '',
};

export const planFormValues4 = {
  activities: [
    {
      actionCode: 'IRS',
      actionDefinitionUri: '',
      actionDescription: 'Visit each structure in the operational area and attempt to spray',
      actionIdentifier: '',
      actionReason: 'Routine',
      actionTitle: 'Spray Structures',
      goalDescription: 'Spray structures in the operational area',
      goalDue: parseISO('2019-08-16T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 90,
      timingPeriodEnd: parseISO('2000-02-06T00:00:00.000Z'),
      timingPeriodStart: parseISO('2000-01-30T00:00:00.000Z'),
    },
  ],
  caseNum: '',
  description: '',
  date: parseISO(`2019-08-09`),
  end: parseISO(`2019-08-29`),
  fiReason: undefined,
  fiStatus: undefined,
  identifier: '8f507b70-1f50-5616-805d-db5b8ae4280e',
  interventionType: 'IRS',
  jurisdictions: [
    {
      id: '3952',
      name: '3952',
    },
  ],
  name: 'IRS-2019-08-09',
  opensrpEventId: undefined,
  start: parseISO(`2019-08-09`),
  status: 'draft',
  taskGenerationStatus: 'False',
  teamAssignmentStatus: '',
  title: 'IRS 2019-08-09',
  version: '1',
};

export const planFormValues2 = {
  activities: [
    {
      actionCode: 'Case Confirmation',
      actionDefinitionUri: '',
      actionDescription: 'Confirm the index case',
      actionIdentifier: 'c711ae51-6432-4b68-84c3-d2b5b1fd1948',
      actionReason: 'Investigation',
      actionTitle: 'Case Confirmation',
      goalDescription: 'Confirm the index case',
      goalDue: moment('2019-05-21T00:00:00.000Z').toDate(),
      goalPriority: 'medium-priority',
      goalValue: 1,
      timingPeriodEnd: moment('2019-05-24T00:00:00.000Z').toDate(),
      timingPeriodStart: moment('2019-05-21T00:00:00.000Z').toDate(),
    },
    {
      actionCode: 'RACD Register Family',
      actionDefinitionUri: '',
      actionDescription:
        'Register all families & famiy members in all residential structures enumerated (100%) within the operational area',
      actionIdentifier: '402b8c13-6774-4515-929f-48e71a61a379',
      actionReason: 'Investigation',
      actionTitle: 'Family Registration',
      goalDescription:
        'Register all families and family members in all residential structures enumerated or added (100%) within operational area',
      goalDue: moment('2019-08-30T00:00:00.000Z').toDate(),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: moment('2019-08-30T00:00:00.000Z').toDate(),
      timingPeriodStart: moment('2019-05-21T00:00:00.000Z').toDate(),
    },
    {
      actionCode: 'Bednet Distribution',
      actionDefinitionUri: '',
      actionDescription:
        'Visit 100% of residential structures in the operational area and provide nets',
      actionIdentifier: '1bd830ea-50e3-44dc-b855-9d5e9339e2be',
      actionReason: 'Routine',
      actionTitle: 'Bednet Distribution',
      goalDescription:
        'Visit 100% of residential structures in the operational area and provide nets',
      goalDue: moment('2019-08-30T00:00:00.000Z').toDate(),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: moment('2019-08-30T00:00:00.000Z').toDate(),
      timingPeriodStart: moment('2019-05-21T00:00:00.000Z').toDate(),
    },
    {
      actionCode: 'Blood Screening',
      actionDefinitionUri: '',
      actionDescription:
        'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
      actionIdentifier: '2303a70e-4e3f-4fb9-a430-f0476010bfb5',
      actionReason: 'Investigation',
      actionTitle: 'RACD Blood screening',
      goalDescription:
        'Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person',
      goalDue: moment('2019-05-28T00:00:00.000Z').toDate(),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: moment('2019-05-28T00:00:00.000Z').toDate(),
      timingPeriodStart: moment('2019-05-21T00:00:00.000Z').toDate(),
    },
    {
      actionCode: 'Larval Dipping',
      actionDefinitionUri: '',
      actionDescription:
        'Perform a minimum of three larval dipping activities in the operational area',
      actionIdentifier: '2482dfd7-8284-43c6-bea1-a03dcda71ff4',
      actionReason: 'Investigation',
      actionTitle: 'Larval Dipping',
      goalDescription:
        'Perform a minimum of three larval dipping activities in the operational area',
      goalDue: moment('2019-05-28T00:00:00.000Z').toDate(),
      goalPriority: 'medium-priority',
      goalValue: 3,
      timingPeriodEnd: moment('2019-05-28T00:00:00.000Z').toDate(),
      timingPeriodStart: moment('2019-05-21T00:00:00.000Z').toDate(),
    },
    {
      actionCode: 'Mosquito Collection',
      actionDefinitionUri: '',
      actionDescription:
        'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
      actionIdentifier: '423f6665-5367-40be-855e-7c5e6941a0c3',
      actionReason: 'Investigation',
      actionTitle: 'Mosquito Collection',
      goalDescription:
        'Set a minimum of three mosquito collection traps and complete the mosquito collection process',
      goalDue: moment('2019-05-28T00:00:00.000Z').toDate(),
      goalPriority: 'medium-priority',
      goalValue: 3,
      timingPeriodEnd: moment('2019-05-28T00:00:00.000Z').toDate(),
      timingPeriodStart: moment('2019-05-21T00:00:00.000Z').toDate(),
    },
    {
      actionCode: 'BCC',
      actionDefinitionUri: '',
      actionDescription: 'Conduct BCC activity',
      actionIdentifier: 'c8fc89a9-cdd2-4746-8272-650883ae380e',
      actionReason: 'Investigation',
      actionTitle: 'Behaviour Change Communication',
      goalDescription: 'Complete at least 1 BCC activity for the operational area',
      goalDue: moment('2019-06-21T00:00:00.000Z').toDate(),
      goalPriority: 'medium-priority',
      goalValue: 1,
      timingPeriodEnd: moment('2019-06-21T00:00:00.000Z').toDate(),
      timingPeriodStart: moment('2019-05-21T00:00:00.000Z').toDate(),
    },
  ],
  caseNum: '',
  date: moment('2019-05-19T00:00:00.000Z').toDate(),
  end: moment('2019-08-30T00:00:00.000Z').toDate(),
  fiReason: 'Routine',
  fiStatus: 'A2',
  identifier: '356b6b84-fc36-4389-a44a-2b038ed2f38d',
  interventionType: 'FI',
  jurisdictions: [{ id: '3952', name: '3952' }],
  name: 'A2-Lusaka_Akros_Focus_2',
  opensrpEventId: undefined,
  start: moment('2019-05-20T00:00:00.000Z').toDate(),
  status: 'active',
  taskGenerationStatus: 'False',
  teamAssignmentStatus: '',
  title: 'A2-Lusaka Akros Test Focus 2',
  version: '1',
};

export const planFormValues3 = {
  activities: [
    {
      actionCode: 'IRS',
      actionDescription: 'Visit each structure in the operational area and attempt to spray',
      actionIdentifier: 'b646cfe1-7180-4494-80b5-ee20579dc343',
      actionReason: 'Routine',
      actionTitle: 'Spray Structures',
      condition: [
        {
          description: 'Structure is residential',
          expression:
            "$this.is(FHIR.QuestionnaireResponse) or $this.type.where(id='locationType').text = 'Residential Structure'",
        },
        {
          description: 'Register structure Event submitted for a residential structure',
          expression:
            "$this.is(FHIR.Location) or (questionnaire = 'Register_Structure' and item.where(linkId='structureType').answer.value ='Residential Structure')",
        },
      ],
      goalDescription: 'Spray structures in the operational area',
      goalDue: moment('2020-12-31T00:00:00.000Z').toDate(),
      goalPriority: 'medium-priority',
      goalValue: 90,
      timingPeriodEnd: moment('2020-12-31T00:00:00.000Z').toDate(),
      timingPeriodStart: moment('2020-06-24T00:00:00.000Z').toDate(),
      trigger: [
        { name: 'plan-activation' },
        {
          description: '',
          expression: "questionnaire = 'Register_Structure'",
          name: 'event-submission',
        },
      ],
    },
  ],
  caseNum: '',
  date: moment('2020-06-24T00:00:00.000Z').toDate(),
  end: moment('2020-12-31T00:00:00.000Z').toDate(),
  fiReason: undefined,
  fiStatus: undefined,
  identifier: '043fc8cb-0459-4b39-b71c-abc15f13a5dd',
  interventionType: InterventionType.DynamicIRS,
  jurisdictions: [
    { id: '6fffaf7f-f16f-4713-a1ac-0cf6e2fe7f2a', name: '6fffaf7f-f16f-4713-a1ac-0cf6e2fe7f2a' },
  ],
  name: 'IRS-2020-06-24-Dynamic-Task-Test-Plan',
  opensrpEventId: undefined,
  start: moment('2020-06-24T00:00:00.000Z').toDate(),
  status: PlanStatus.ACTIVE,
  taskGenerationStatus: 'Disabled',
  title: 'IRS 2020-06-24 Dynamic Task Test Plan',
  version: '1',
};

export const values: PlanFormFields = {
  activities: [
    {
      actionCode: 'IRS',
      actionDescription: 'Visit each structure in the operational area and attempt to spray',
      actionIdentifier: '',
      actionReason: 'Routine',
      actionTitle: 'Spray Structures',
      goalDescription: 'Spray structures in the operational area',
      goalDue: parseISO('2019-08-16T11:33:50.997Z'),
      goalPriority: 'medium-priority',
      goalValue: 90,
      timingPeriodEnd: parseISO('2019-08-16T11:33:50.997Z'),
      timingPeriodStart: parseISO('2019-08-09T11:33:50.997Z'),
    },
  ],
  caseNum: '',
  date: parseISO('2019-08-09T11:33:20.156Z'),
  end: parseISO('2019-08-29T11:33:20.156Z'),
  fiStatus: 'A1',
  identifier: '',
  interventionType: InterventionType.IRS,
  jurisdictions: [
    {
      id: '',
      name: '',
    },
  ],
  name: 'IRS-2019-08-09',
  start: parseISO('2019-08-09T11:33:20.156Z'),
  status: PlanStatus.DRAFT,
  taskGenerationStatus: 'True',
  title: 'IRS 2019-08-09',
  version: '1',
};

export const valuesWithJurisdiction: PlanFormFields = {
  activities: [
    {
      actionCode: 'IRS',
      actionDescription: 'Visit each structure in the operational area and attempt to spray',
      actionIdentifier: '',
      actionReason: 'Routine',
      actionTitle: 'Spray Structures',
      goalDescription: 'Spray structures in the operational area',
      goalDue: parseISO('2019-08-16T11:33:50.997Z'),
      goalPriority: 'medium-priority',
      goalValue: 90,
      timingPeriodEnd: parseISO('2019-08-16T11:33:50.997Z'),
      timingPeriodStart: parseISO('2019-08-09T11:33:50.997Z'),
    },
  ],
  caseNum: '',
  date: parseISO('2019-08-09T11:33:20.156Z'),
  end: parseISO('2019-08-29T11:33:20.156Z'),
  fiStatus: 'A1',
  identifier: '',
  interventionType: InterventionType.IRS,
  jurisdictions: [
    {
      id: 'd6396aeb-436d-4b78-91bd-7387ec2e8d5c',
      name: 'TLv2_01',
    },
  ],
  name: 'IRS-2019-08-09',
  start: parseISO('2019-08-09T11:33:20.156Z'),
  status: PlanStatus.DRAFT,
  taskGenerationStatus: 'False',
  title: 'IRS 2019-08-09',
  version: '1',
};

export const values2: PlanFormFields = {
  activities: [
    {
      actionCode: 'IRS',
      actionDescription: 'Visit each structure in the operational area and attempt to spray',
      actionIdentifier: '',
      actionReason: 'Routine',
      actionTitle: 'Spray Structures',
      goalDescription: 'Spray structures in the operational area',
      goalDue: parseISO(`2019-08-16`),
      goalPriority: 'medium-priority',
      goalValue: 90,
      timingPeriodEnd: parseISO(`2019-08-16`),
      timingPeriodStart: parseISO(`2019-08-09`),
    },
  ],
  caseNum: '',
  date: parseISO(`2019-08-09`),
  end: parseISO(`2019-08-29`),
  identifier: '',
  interventionType: InterventionType.IRS,
  jurisdictions: [
    {
      id: '3952',
      name: 'Akros_2',
    },
  ],
  name: 'IRS-2019-08-09',
  start: parseISO(`2019-08-09`),
  status: PlanStatus.DRAFT,
  taskGenerationStatus: 'False',
  title: 'IRS 2019-08-09',
  version: '1',
};

export const plansJSON = `[{"identifier":"356b6b84-fc36-4389-a44a-2b038ed2f38d","version":"1","name":"A2-Lusaka_Akros_Focus_2","title":"A2-Lusaka Akros Test Focus 2","status":"active","date":"2019-05-19","effectivePeriod":{"start":"2019-05-20","end":"2019-08-30"},"useContext":[{"code":"interventionType","valueCodableConcept":"FI"},{"code":"fiStatus","valueCodableConcept":"A2"},{"code":"fiReason","valueCodableConcept":"Routine"}],"jurisdiction":[{"code":"3952"}],"serverVersion":1563303150422,"goal":[{"id":"Case_Confirmation","description":"Confirm the index case","priority":"medium-priority","target":[{"measure":"Number of case confirmation forms complete","detail":{"detailQuantity":{"value":1,"comparator":">=","unit":"form(s)"}},"due":"2019-05-21"}]},{"id":"RACD_register_all_families","description":"Register all families and family members in all residential structures enumerated or added (100%) within operational area","priority":"medium-priority","target":[{"measure":"Percent of residential structures with full family registration","detail":{"detailQuantity":{"value":100,"comparator":">=","unit":"Percent"}},"due":"2019-08-30"}]},{"id":"RACD_bednet_dist_1km_radius","description":"Visit 100% of residential structures in the operational area and provide nets","priority":"medium-priority","target":[{"measure":"Percent of residential structures received nets","detail":{"detailQuantity":{"value":100,"comparator":">=","unit":"Percent"}},"due":"2019-08-30"}]},{"id":"RACD_blood_screening_1km_radius","description":"Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person","priority":"medium-priority","target":[{"measure":"Percent of registered people tested","detail":{"detailQuantity":{"value":100,"comparator":">=","unit":"Percent"}},"due":"2019-05-28"}]},{"id":"Larval_Dipping_Min_3_Sites","description":"Perform a minimum of three larval dipping activities in the operational area","priority":"medium-priority","target":[{"measure":"Number of larval dipping forms submitted","detail":{"detailQuantity":{"value":3,"comparator":">=","unit":"form(s)"}},"due":"2019-05-28"}]},{"id":"Mosquito_Collection_Min_3_Traps","description":"Set a minimum of three mosquito collection traps and complete the mosquito collection process","priority":"medium-priority","target":[{"measure":"Number of mosquito collection forms submitted","detail":{"detailQuantity":{"value":3,"comparator":">=","unit":"form(s)"}},"due":"2019-05-28"}]},{"id":"BCC_Focus","description":"Complete at least 1 BCC activity for the operational area","priority":"medium-priority","target":[{"measure":"Number of BCC forms submitted","detail":{"detailQuantity":{"value":1,"comparator":">=","unit":"form(s)"}},"due":"2019-06-21"}]}],"action":[{"identifier":"c711ae51-6432-4b68-84c3-d2b5b1fd1948","prefix":1,"title":"Case Confirmation","description":"Confirm the index case","code":"Case Confirmation","timingPeriod":{"start":"2019-05-21","end":"2019-05-24"},"reason":"Investigation","goalId":"Case_Confirmation","subjectCodableConcept":{"text":"Person"},"taskTemplate":"Case_Confirmation"},{"identifier":"402b8c13-6774-4515-929f-48e71a61a379","prefix":2,"title":"Family Registration","description":"Register all families & famiy members in all residential structures enumerated (100%) within the operational area","code":"RACD Register Family","timingPeriod":{"start":"2019-05-21","end":"2019-08-30"},"reason":"Investigation","goalId":"RACD_register_all_families","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"RACD_register_families"},{"identifier":"1bd830ea-50e3-44dc-b855-9d5e9339e2be","prefix":3,"title":"Bednet Distribution","description":"Visit 100% of residential structures in the operational area and provide nets","code":"Bednet Distribution","timingPeriod":{"start":"2019-05-21","end":"2019-08-30"},"reason":"Routine","goalId":"RACD_bednet_dist_1km_radius","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"ITN_Visit_Structures"},{"identifier":"2303a70e-4e3f-4fb9-a430-f0476010bfb5","prefix":4,"title":"RACD Blood screening","description":"Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person","code":"Blood Screening","timingPeriod":{"start":"2019-05-21","end":"2019-05-28"},"reason":"Investigation","goalId":"RACD_blood_screening_1km_radius","subjectCodableConcept":{"text":"Person"},"taskTemplate":"RACD_Blood_Screening"},{"identifier":"2482dfd7-8284-43c6-bea1-a03dcda71ff4","prefix":5,"title":"Larval Dipping","description":"Perform a minimum of three larval dipping activities in the operational area","code":"Larval Dipping","timingPeriod":{"start":"2019-05-21","end":"2019-05-28"},"reason":"Investigation","goalId":"Larval_Dipping_Min_3_Sites","subjectCodableConcept":{"text":"Breeding_Site"},"taskTemplate":"Larval_Dipping"},{"identifier":"423f6665-5367-40be-855e-7c5e6941a0c3","prefix":6,"title":"Mosquito Collection","description":"Set a minimum of three mosquito collection traps and complete the mosquito collection process","code":"Mosquito Collection","timingPeriod":{"start":"2019-05-21","end":"2019-05-28"},"reason":"Investigation","goalId":"Mosquito_Collection_Min_3_Traps","subjectCodableConcept":{"text":"Mosquito_Collection_Point"},"taskTemplate":"Mosquito_Collection_Point"},{"identifier":"c8fc89a9-cdd2-4746-8272-650883ae380e","prefix":7,"title":"Behaviour Change Communication","description":"Conduct BCC activity","code":"BCC","timingPeriod":{"start":"2019-05-21","end":"2019-06-21"},"reason":"Investigation","goalId":"BCC_Focus","subjectCodableConcept":{"text":"Operational_Area"},"taskTemplate":"BCC_Focus"}]},{"identifier":"8fa7eb32-99d7-4b49-8332-9ecedd6d51ae","version":"1","name":"TwoTwoOne_01_IRS_2019-07-10","title":"TwoTwoOne_01 IRS 2019-07-10","status":"active","date":"2019-07-10","effectivePeriod":{"start":"2019-07-10","end":"2019-07-30"},"useContext":[{"code":"interventionType","valueCodableConcept":"IRS"}],"jurisdiction":[{"code":"35968df5-f335-44ae-8ae5-25804caa2d86"},{"code":"3952"},{"code":"ac7ba751-35e8-4b46-9e53-3cbaad193697"}],"serverVersion":1563303151426,"goal":[{"id":"BCC_complete","description":"Complete BCC for the operational area","priority":"medium-priority","target":[{"measure":"Number of BCC communication activities that happened","detail":{"detailQuantity":{"value":1,"comparator":">=","unit":"each"}},"due":"2019-07-10"}]},{"id":"90_percent_of_structures_sprayed","description":"Spray 90 % of structures in the operational area","priority":"medium-priority","target":[{"measure":"Percent of structures sprayed","detail":{"detailQuantity":{"value":90,"comparator":">=","unit":"percent"}},"due":"2019-07-30"}]}],"action":[{"identifier":"3f2eef38-38fe-4108-abb3-4e896b880302","prefix":1,"title":"Perform BCC","description":"Perform BCC for the operational area","code":"BCC","timingPeriod":{"start":"2019-07-10","end":"2019-07-30"},"reason":"Routine","goalId":"BCC_complete","subjectCodableConcept":{"text":"Operational_Area"},"taskTemplate":"Action1_Perform_BCC"},{"identifier":"95a5a00f-a411-4fe5-bd9c-460a856239c9","prefix":2,"title":"Spray Structures","description":"Visit each structure in the operational area and attempt to spray","code":"IRS","timingPeriod":{"start":"2019-07-10","end":"2019-07-30"},"reason":"Routine","goalId":"90_percent_of_structures_sprayed","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"Action2_Spray_Structures"}]},{"identifier":"f0558ad1-396d-4d97-9fff-c46cf92b6ce6","version":"1","name":"A1-TwoTwoTwo_03-2019-07-18","title":"A1 - TwoTwoTwo_03 - 2019-07-18","status":"active","date":"2019-07-18","effectivePeriod":{"start":"2019-07-18","end":"2019-08-07"},"useContext":[{"code":"interventionType","valueCodableConcept":"FI"},{"code":"fiStatus","valueCodableConcept":"A1"},{"code":"fiReason","valueCodableConcept":"Case Triggered"},{"code":"caseNum","valueCodableConcept":"1"},{"code":"opensrpEventId","valueCodableConcept":"1"},{"code":"taskGenerationStatus","valueCodableConcept":"True"}],"jurisdiction":[{"code":"ac7ba751-35e8-4b46-9e53-3cbaad193697"}],"serverVersion":1563494230144,"goal":[{"id":"Case_Confirmation","description":"Confirm the index case","priority":"medium-priority","target":[{"measure":"Number of case confirmation forms complete","detail":{"detailQuantity":{"value":1,"comparator":"u003eu003d","unit":"form(s)"}},"due":"2019-07-28"}]},{"id":"RACD_register_all_families","description":"Register all families and family members in all residential structures enumerated or added (100%) within operational area","priority":"medium-priority","target":[{"measure":"Percent of residential structures with full family registration","detail":{"detailQuantity":{"value":100,"comparator":"u003eu003d","unit":"Percent"}},"due":"2019-08-07"}]},{"id":"RACD_blood_screening_1km_radius","description":"Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person","priority":"medium-priority","target":[{"measure":"Number of registered people tested","detail":{"detailQuantity":{"value":50,"comparator":"u003eu003d","unit":"person(s)"}},"due":"2019-08-07"}]},{"id":"RACD_bednet_dist_1km_radius","description":"Visit 100% of residential structures in the operational area and provide nets","priority":"medium-priority","target":[{"measure":"Percent of residential structures received nets","detail":{"detailQuantity":{"value":90,"comparator":"u003eu003d","unit":"Percent"}},"due":"2019-08-07"}]},{"id":"Larval_Dipping_Min_3_Sites","description":"Perform a minimum of three larval dipping activities in the operational area","priority":"medium-priority","target":[{"measure":"Number of larval dipping forms submitted","detail":{"detailQuantity":{"value":3,"comparator":"u003eu003d","unit":"form(s)"}},"due":"2019-08-07"}]},{"id":"Mosquito_Collection_Min_3_Traps","description":"Set a minimum of three mosquito collection traps and complete the mosquito collection process","priority":"medium-priority","target":[{"measure":"Number of mosquito collection forms submitted","detail":{"detailQuantity":{"value":3,"comparator":"u003eu003d","unit":"form(s)"}},"due":"2019-08-07"}]},{"id":"BCC_Focus","description":"Complete at least 1 BCC activity for the operational area","priority":"medium-priority","target":[{"measure":"Number of BCC forms submitted","detail":{"detailQuantity":{"value":1,"comparator":"u003eu003d","unit":"form(s)"}},"due":"2019-08-07"}]}],"action":[{"identifier":"031f3d7f-e222-459e-9fcc-da63d04dba4b","prefix":1,"title":"Case Confirmation","description":"Confirm the index case","code":"Case Confirmation","timingPeriod":{"start":"2019-07-18","end":"2019-07-28"},"reason":"Investigation","goalId":"Case_Confirmation","subjectCodableConcept":{"text":"Operational Area"},"taskTemplate":"Case_Confirmation"},{"identifier":"6729612a-9e83-4d72-a8c6-da518e530190","prefix":2,"title":"Family Registration","description":"Register all families u0026 family members in all residential structures enumerated (100%) within the operational area","code":"RACD Register Family","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"RACD_register_all_families","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"RACD_register_families"},{"identifier":"6c3637dd-b36d-4137-8df2-1efc6d8d858f","prefix":3,"title":"Blood screening","description":"Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person","code":"Blood Screening","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"RACD_blood_screening_1km_radius","subjectCodableConcept":{"text":"Person"},"taskTemplate":"RACD_Blood_Screening"},{"identifier":"eb85377d-9333-407c-88de-155410fbfd88","prefix":4,"title":"Bednet Distribution","description":"Visit 100% of residential structures in the operational area and provide nets","code":"Bednet Distribution","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Routine","goalId":"RACD_bednet_dist_1km_radius","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"ITN_Visit_Structures"},{"identifier":"01369e56-7e72-4b2e-9f4e-9e3c2beda706","prefix":5,"title":"Larval Dipping","description":"Perform a minimum of three larval dipping activities in the operational area","code":"Larval Dipping","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"Larval_Dipping_Min_3_Sites","subjectCodableConcept":{"text":"Breeding_Site"},"taskTemplate":"Larval_Dipping"},{"identifier":"6bd72f5b-1043-4905-bcf2-ef62c34f606f","prefix":6,"title":"Mosquito Collection","description":"Set a minimum of three mosquito collection traps and complete the mosquito collection process","code":"Mosquito Collection","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"Mosquito_Collection_Min_3_Traps","subjectCodableConcept":{"text":"Mosquito_Collection_Point"},"taskTemplate":"Mosquito_Collection_Point"},{"identifier":"40b046a5-18bd-4f26-b3aa-87a0d3787377","prefix":7,"title":"Behaviour Change Communication","description":"Conduct BCC activity","code":"BCC","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"BCC_Focus","subjectCodableConcept":{"text":"Operational_Area"},"taskTemplate":"BCC_Focus"}]},{"identifier":"0e85c238-39c1-4cea-a926-3d89f0c98429","name":"mosh-test","title":"A Test By Mosh","status":"draft","date":"2019-05-19","effectivePeriod":{"start":"2019-05-20","end":"2019-08-30"},"useContext":[{"code":"interventionType","valueCodableConcept":"FI"},{"code":"fiStatus","valueCodableConcept":"A2"},{"code":"fiReason","valueCodableConcept":"Routine"}],"jurisdiction":[{"code":"3952"}],"serverVersion":1563807467576,"goal":[],"action":[]},{"identifier":"f3da140c-2d2c-4bf7-8189-c2349f143a72","version":"1","name":"Macepa-MDA-Campaign-2019-10-18","title":"Macepa MDA Campaign","status":"active","date":"2019-10-18","effectivePeriod":{"start":"2019-10-18","end":"2019-12-31"},"useContext":[{"code":"interventionType","valueCodableConcept":"MDA"},{"code":"taskGenerationStatus","valueCodableConcept":"True"}],"jurisdiction":[{"code":"3951"},{"code":"3952"}],"serverVersion":1571406689603,"goal":[{"id":"RACD_register_all_families","description":"Register all families and family members in all residential structures enumerated or added (100%) within operational area","priority":"medium-priority","target":[{"measure":"Percent of residential structures with full family registration","detail":{"detailQuantity":{"value":100.0,"comparator":"\u003e\u003d","unit":"Percent"}},"due":"2019-12-31"}]},{"id":"MDA_Dispense","description":"Visit all residential structures (100%) dispense prophylaxis to each registered person","priority":"medium-priority","target":[{"measure":"Percent of Registered person(s)","detail":{"detailQuantity":{"value":100.0,"comparator":"\u003e\u003d","unit":"percent"}},"due":"2019-12-31"}]},{"id":"MDA_Adherence","description":"Visit all residential structures (100%) and confirm adherence of each registered person","priority":"medium-priority","target":[{"measure":"Percent of dispense recipients","detail":{"detailQuantity":{"value":100.0,"comparator":"\u003e\u003d","unit":"percent"}},"due":"2019-12-31"}]}],"action":[{"identifier":"2df855c3-3179-41f1-b8d8-7f84de7fa684","prefix":1,"title":"Family Registration","description":"Register all families \u0026 family members in all residential structures enumerated (100%) within the operational area","code":"RACD Register Family","timingPeriod":{"start":"2019-10-18","end":"2019-12-31"},"reason":"Investigation","goalId":"RACD_register_all_families","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"RACD_register_families"},{"identifier":"da253449-8a89-46ea-8cdf-d4159240edae","prefix":2,"title":"MDA Round 1 Dispense","description":"Visit all residential structures (100%) and dispense prophylaxis to each registered person","code":"MDA Dispense","timingPeriod":{"start":"2019-10-18","end":"2019-12-31"},"reason":"Routine","goalId":"MDA_Dispense","subjectCodableConcept":{"text":"Person"},"taskTemplate":"MDA_Dispense"},{"identifier":"1c688154-e025-4a40-91fd-9baed25a0ba4","prefix":3,"title":"MDA Round 1 Adherence","description":"Visit all residential structures (100%) and confirm adherence of each registered person","code":"MDA Adherence","timingPeriod":{"start":"2019-10-18","end":"2019-12-31"},"reason":"Routine","goalId":"MDA_Dispense","subjectCodableConcept":{"text":"Person"},"taskTemplate":"MDA_Adherence"}]},{"identifier":"043fc8cb-0459-4b39-b71c-abc15f13a5dd","version":"1","name":"IRS-2020-06-24-Dynamic-Task-Test-Plan","title":"IRS 2020-06-24 Dynamic Task Test Plan","status":"active","date":"2020-06-24","effectivePeriod":{"start":"2020-06-24","end":"2020-12-31"},"useContext":[{"code":"interventionType","valueCodableConcept":"Dynamic-IRS"}],"jurisdiction":[{"code":"6fffaf7f-f16f-4713-a1ac-0cf6e2fe7f2a"}],"serverVersion":1593688422154,"goal":[{"id":"IRS","description":"Spray structures in the operational area","priority":"medium-priority","target":[{"measure":"Percent of structures sprayed","detail":{"detailQuantity":{"value":90,"comparator":">=","unit":"Percent"}},"due":"2020-12-31"}]}],"action":[{"identifier":"b646cfe1-7180-4494-80b5-ee20579dc343","prefix":1,"title":"Spray Structures","description":"Visit each structure in the operational area and attempt to spray","code":"IRS","timingPeriod":{"start":"2020-06-24","end":"2020-12-31"},"reason":"Routine","goalId":"IRS","subjectCodableConcept":{"text":"Location"},"trigger":[{"type":"named-event","name":"plan-activation"},{"type":"named-event","name":"event-submission","expression":{"expression":"questionnaire = 'Register_Structure'"}}],"condition":[{"kind":"applicability","expression":{"description":"Structure is residential","expression":"$this.is(FHIR.QuestionnaireResponse) or $this.type.where(id='locationType').text = 'Residential Structure'"}},{"kind":"applicability","expression":{"description":"Register structure Event submitted for a residential structure","expression":"$this.is(FHIR.Location) or (questionnaire = 'Register_Structure' and item.where(linkId='structureType').answer.value ='Residential Structure')"}}],"definitionUri":"spray_form.json"}],"experimental":false}]`;

export const irsPplansJSON = `[{"identifier":"356b6b84-fc36-4389-a44a-2b038ed2f38d","version":"1","name":"A2-Lusaka_Akros_Focus_2","title":"A2-Lusaka Akros Test Focus 2","status":"active","date":"2019-05-19","effectivePeriod":{"start":"2019-05-20","end":"2019-08-30"},"useContext":[{"code":"interventionType","valueCodableConcept":"IRS"},{"code":"irsStatus","valueCodableConcept":"A2"},{"code":"fiReason","valueCodableConcept":"Routine"}],"jurisdiction":[{"code":"3952"}],"serverVersion":1563303150422,"goal":[{"id":"Case_Confirmation","description":"Confirm the index case","priority":"medium-priority","target":[{"measure":"Number of case confirmation forms complete","detail":{"detailQuantity":{"value":1,"comparator":">=","unit":"form(s)"}},"due":"2019-05-21"}]},{"id":"RACD_register_all_families","description":"Register all families and family members in all residential structures enumerated or added (100%) within operational area","priority":"medium-priority","target":[{"measure":"Percent of residential structures with full family registration","detail":{"detailQuantity":{"value":100,"comparator":">=","unit":"Percent"}},"due":"2019-08-30"}]},{"id":"RACD_bednet_dist_1km_radius","description":"Visit 100% of residential structures in the operational area and provide nets","priority":"medium-priority","target":[{"measure":"Percent of residential structures received nets","detail":{"detailQuantity":{"value":100,"comparator":">=","unit":"Percent"}},"due":"2019-08-30"}]},{"id":"RACD_blood_screening_1km_radius","description":"Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person","priority":"medium-priority","target":[{"measure":"Percent of registered people tested","detail":{"detailQuantity":{"value":100,"comparator":">=","unit":"Percent"}},"due":"2019-05-28"}]},{"id":"Larval_Dipping_Min_3_Sites","description":"Perform a minimum of three larval dipping activities in the operational area","priority":"medium-priority","target":[{"measure":"Number of larval dipping forms submitted","detail":{"detailQuantity":{"value":3,"comparator":">=","unit":"form(s)"}},"due":"2019-05-28"}]},{"id":"Mosquito_Collection_Min_3_Traps","description":"Set a minimum of three mosquito collection traps and complete the mosquito collection process","priority":"medium-priority","target":[{"measure":"Number of mosquito collection forms submitted","detail":{"detailQuantity":{"value":3,"comparator":">=","unit":"form(s)"}},"due":"2019-05-28"}]},{"id":"BCC_Focus","description":"Complete at least 1 BCC activity for the operational area","priority":"medium-priority","target":[{"measure":"Number of BCC forms submitted","detail":{"detailQuantity":{"value":1,"comparator":">=","unit":"form(s)"}},"due":"2019-06-21"}]}],"action":[{"identifier":"c711ae51-6432-4b68-84c3-d2b5b1fd1948","prefix":1,"title":"Case Confirmation","description":"Confirm the index case","code":"Case Confirmation","timingPeriod":{"start":"2019-05-21","end":"2019-05-24"},"reason":"Investigation","goalId":"Case_Confirmation","subjectCodableConcept":{"text":"Person"},"taskTemplate":"Case_Confirmation"},{"identifier":"402b8c13-6774-4515-929f-48e71a61a379","prefix":2,"title":"Family Registration","description":"Register all families & famiy members in all residential structures enumerated (100%) within the operational area","code":"RACD Register Family","timingPeriod":{"start":"2019-05-21","end":"2019-08-30"},"reason":"Investigation","goalId":"RACD_register_all_families","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"RACD_register_families"},{"identifier":"1bd830ea-50e3-44dc-b855-9d5e9339e2be","prefix":3,"title":"Bednet Distribution","description":"Visit 100% of residential structures in the operational area and provide nets","code":"Bednet Distribution","timingPeriod":{"start":"2019-05-21","end":"2019-08-30"},"reason":"Routine","goalId":"RACD_bednet_dist_1km_radius","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"ITN_Visit_Structures"},{"identifier":"2303a70e-4e3f-4fb9-a430-f0476010bfb5","prefix":4,"title":"RACD Blood screening","description":"Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person","code":"Blood Screening","timingPeriod":{"start":"2019-05-21","end":"2019-05-28"},"reason":"Investigation","goalId":"RACD_blood_screening_1km_radius","subjectCodableConcept":{"text":"Person"},"taskTemplate":"RACD_Blood_Screening"},{"identifier":"2482dfd7-8284-43c6-bea1-a03dcda71ff4","prefix":5,"title":"Larval Dipping","description":"Perform a minimum of three larval dipping activities in the operational area","code":"Larval Dipping","timingPeriod":{"start":"2019-05-21","end":"2019-05-28"},"reason":"Investigation","goalId":"Larval_Dipping_Min_3_Sites","subjectCodableConcept":{"text":"Breeding_Site"},"taskTemplate":"Larval_Dipping"},{"identifier":"423f6665-5367-40be-855e-7c5e6941a0c3","prefix":6,"title":"Mosquito Collection","description":"Set a minimum of three mosquito collection traps and complete the mosquito collection process","code":"Mosquito Collection","timingPeriod":{"start":"2019-05-21","end":"2019-05-28"},"reason":"Investigation","goalId":"Mosquito_Collection_Min_3_Traps","subjectCodableConcept":{"text":"Mosquito_Collection_Point"},"taskTemplate":"Mosquito_Collection_Point"},{"identifier":"c8fc89a9-cdd2-4746-8272-650883ae380e","prefix":7,"title":"Behaviour Change Communication","description":"Conduct BCC activity","code":"BCC","timingPeriod":{"start":"2019-05-21","end":"2019-06-21"},"reason":"Investigation","goalId":"BCC_Focus","subjectCodableConcept":{"text":"Operational_Area"},"taskTemplate":"BCC_Focus"}]},{"identifier":"8fa7eb32-99d7-4b49-8332-9ecedd6d51ae","version":"1","name":"TwoTwoOne_01_IRS_2019-07-10","title":"TwoTwoOne_01 IRS 2019-07-10","status":"active","date":"2019-07-10","effectivePeriod":{"start":"2019-07-10","end":"2019-07-30"},"useContext":[{"code":"interventionType","valueCodableConcept":"IRS"}],"jurisdiction":[{"code":"35968df5-f335-44ae-8ae5-25804caa2d86"},{"code":"3952"},{"code":"ac7ba751-35e8-4b46-9e53-3cbaad193697"}],"serverVersion":1563303151426,"goal":[{"id":"BCC_complete","description":"Complete BCC for the operational area","priority":"medium-priority","target":[{"measure":"Number of BCC communication activities that happened","detail":{"detailQuantity":{"value":1,"comparator":">=","unit":"each"}},"due":"2019-07-10"}]},{"id":"90_percent_of_structures_sprayed","description":"Spray 90 % of structures in the operational area","priority":"medium-priority","target":[{"measure":"Percent of structures sprayed","detail":{"detailQuantity":{"value":90,"comparator":">=","unit":"percent"}},"due":"2019-07-30"}]}],"action":[{"identifier":"3f2eef38-38fe-4108-abb3-4e896b880302","prefix":1,"title":"Perform BCC","description":"Perform BCC for the operational area","code":"BCC","timingPeriod":{"start":"2019-07-10","end":"2019-07-30"},"reason":"Routine","goalId":"BCC_complete","subjectCodableConcept":{"text":"Operational_Area"},"taskTemplate":"Action1_Perform_BCC"},{"identifier":"95a5a00f-a411-4fe5-bd9c-460a856239c9","prefix":2,"title":"Spray Structures","description":"Visit each structure in the operational area and attempt to spray","code":"IRS","timingPeriod":{"start":"2019-07-10","end":"2019-07-30"},"reason":"Routine","goalId":"90_percent_of_structures_sprayed","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"Action2_Spray_Structures"}]},{"identifier":"f0558ad1-396d-4d97-9fff-c46cf92b6ce6","version":"1","name":"A1-TwoTwoTwo_03-2019-07-18","title":"A1 - TwoTwoTwo_03 - 2019-07-18","status":"active","date":"2019-07-18","effectivePeriod":{"start":"2019-07-18","end":"2019-08-07"},"useContext":[{"code":"interventionType","valueCodableConcept":"IRS"},{"code":"irsStatus","valueCodableConcept":"A1"},{"code":"fiReason","valueCodableConcept":"Case Triggered"},{"code":"caseNum","valueCodableConcept":"1"},{"code":"opensrpEventId","valueCodableConcept":"1"},{"code":"taskGenerationStatus","valueCodableConcept":"True"}],"jurisdiction":[{"code":"ac7ba751-35e8-4b46-9e53-3cbaad193697"}],"serverVersion":1563494230144,"goal":[{"id":"Case_Confirmation","description":"Confirm the index case","priority":"medium-priority","target":[{"measure":"Number of case confirmation forms complete","detail":{"detailQuantity":{"value":1,"comparator":"u003eu003d","unit":"form(s)"}},"due":"2019-07-28"}]},{"id":"RACD_register_all_families","description":"Register all families and family members in all residential structures enumerated or added (100%) within operational area","priority":"medium-priority","target":[{"measure":"Percent of residential structures with full family registration","detail":{"detailQuantity":{"value":100,"comparator":"u003eu003d","unit":"Percent"}},"due":"2019-08-07"}]},{"id":"RACD_blood_screening_1km_radius","description":"Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person","priority":"medium-priority","target":[{"measure":"Number of registered people tested","detail":{"detailQuantity":{"value":50,"comparator":"u003eu003d","unit":"person(s)"}},"due":"2019-08-07"}]},{"id":"RACD_bednet_dist_1km_radius","description":"Visit 100% of residential structures in the operational area and provide nets","priority":"medium-priority","target":[{"measure":"Percent of residential structures received nets","detail":{"detailQuantity":{"value":90,"comparator":"u003eu003d","unit":"Percent"}},"due":"2019-08-07"}]},{"id":"Larval_Dipping_Min_3_Sites","description":"Perform a minimum of three larval dipping activities in the operational area","priority":"medium-priority","target":[{"measure":"Number of larval dipping forms submitted","detail":{"detailQuantity":{"value":3,"comparator":"u003eu003d","unit":"form(s)"}},"due":"2019-08-07"}]},{"id":"Mosquito_Collection_Min_3_Traps","description":"Set a minimum of three mosquito collection traps and complete the mosquito collection process","priority":"medium-priority","target":[{"measure":"Number of mosquito collection forms submitted","detail":{"detailQuantity":{"value":3,"comparator":"u003eu003d","unit":"form(s)"}},"due":"2019-08-07"}]},{"id":"BCC_Focus","description":"Complete at least 1 BCC activity for the operational area","priority":"medium-priority","target":[{"measure":"Number of BCC forms submitted","detail":{"detailQuantity":{"value":1,"comparator":"u003eu003d","unit":"form(s)"}},"due":"2019-08-07"}]}],"action":[{"identifier":"031f3d7f-e222-459e-9fcc-da63d04dba4b","prefix":1,"title":"Case Confirmation","description":"Confirm the index case","code":"Case Confirmation","timingPeriod":{"start":"2019-07-18","end":"2019-07-28"},"reason":"Investigation","goalId":"Case_Confirmation","subjectCodableConcept":{"text":"Operational Area"},"taskTemplate":"Case_Confirmation"},{"identifier":"6729612a-9e83-4d72-a8c6-da518e530190","prefix":2,"title":"Family Registration","description":"Register all families u0026 family members in all residential structures enumerated (100%) within the operational area","code":"RACD Register Family","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"RACD_register_all_families","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"RACD_register_families"},{"identifier":"6c3637dd-b36d-4137-8df2-1efc6d8d858f","prefix":3,"title":"Blood screening","description":"Visit all residential structures (100%) within a 1 km radius of a confirmed index case and test each registered person","code":"Blood Screening","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"RACD_blood_screening_1km_radius","subjectCodableConcept":{"text":"Person"},"taskTemplate":"RACD_Blood_Screening"},{"identifier":"eb85377d-9333-407c-88de-155410fbfd88","prefix":4,"title":"Bednet Distribution","description":"Visit 100% of residential structures in the operational area and provide nets","code":"Bednet Distribution","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Routine","goalId":"RACD_bednet_dist_1km_radius","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"ITN_Visit_Structures"},{"identifier":"01369e56-7e72-4b2e-9f4e-9e3c2beda706","prefix":5,"title":"Larval Dipping","description":"Perform a minimum of three larval dipping activities in the operational area","code":"Larval Dipping","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"Larval_Dipping_Min_3_Sites","subjectCodableConcept":{"text":"Breeding_Site"},"taskTemplate":"Larval_Dipping"},{"identifier":"6bd72f5b-1043-4905-bcf2-ef62c34f606f","prefix":6,"title":"Mosquito Collection","description":"Set a minimum of three mosquito collection traps and complete the mosquito collection process","code":"Mosquito Collection","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"Mosquito_Collection_Min_3_Traps","subjectCodableConcept":{"text":"Mosquito_Collection_Point"},"taskTemplate":"Mosquito_Collection_Point"},{"identifier":"40b046a5-18bd-4f26-b3aa-87a0d3787377","prefix":7,"title":"Behaviour Change Communication","description":"Conduct BCC activity","code":"BCC","timingPeriod":{"start":"2019-07-18","end":"2019-08-07"},"reason":"Investigation","goalId":"BCC_Focus","subjectCodableConcept":{"text":"Operational_Area"},"taskTemplate":"BCC_Focus"}]},{"identifier":"0e85c238-39c1-4cea-a926-3d89f0c98429","name":"mosh-test","title":"A Test By Mosh","status":"draft","date":"2019-05-19","effectivePeriod":{"start":"2019-05-20","end":"2019-08-30"},"useContext":[{"code":"interventionType","valueCodableConcept":"IRS"},{"code":"irsStatus","valueCodableConcept":"A2"},{"code":"fiReason","valueCodableConcept":"Routine"}],"jurisdiction":[{"code":"3952"}],"serverVersion":1563807467576,"goal":[],"action":[]},{"identifier":"f3da140c-2d2c-4bf7-8189-c2349f143a72","version":"1","name":"Macepa-MDA-Campaign-2019-10-18","title":"Macepa MDA Campaign","status":"active","date":"2019-10-18","effectivePeriod":{"start":"2019-10-18","end":"2019-12-31"},"useContext":[{"code":"interventionType","valueCodableConcept":"MDA"},{"code":"taskGenerationStatus","valueCodableConcept":"True"}],"jurisdiction":[{"code":"3951"},{"code":"3952"}],"serverVersion":1571406689603,"goal":[{"id":"RACD_register_all_families","description":"Register all families and family members in all residential structures enumerated or added (100%) within operational area","priority":"medium-priority","target":[{"measure":"Percent of residential structures with full family registration","detail":{"detailQuantity":{"value":100.0,"comparator":"\u003e\u003d","unit":"Percent"}},"due":"2019-12-31"}]},{"id":"MDA_Dispense","description":"Visit all residential structures (100%) dispense prophylaxis to each registered person","priority":"medium-priority","target":[{"measure":"Percent of Registered person(s)","detail":{"detailQuantity":{"value":100.0,"comparator":"\u003e\u003d","unit":"percent"}},"due":"2019-12-31"}]},{"id":"MDA_Adherence","description":"Visit all residential structures (100%) and confirm adherence of each registered person","priority":"medium-priority","target":[{"measure":"Percent of dispense recipients","detail":{"detailQuantity":{"value":100.0,"comparator":"\u003e\u003d","unit":"percent"}},"due":"2019-12-31"}]}],"action":[{"identifier":"2df855c3-3179-41f1-b8d8-7f84de7fa684","prefix":1,"title":"Family Registration","description":"Register all families \u0026 family members in all residential structures enumerated (100%) within the operational area","code":"RACD Register Family","timingPeriod":{"start":"2019-10-18","end":"2019-12-31"},"reason":"Investigation","goalId":"RACD_register_all_families","subjectCodableConcept":{"text":"Residential_Structure"},"taskTemplate":"RACD_register_families"},{"identifier":"da253449-8a89-46ea-8cdf-d4159240edae","prefix":2,"title":"MDA Round 1 Dispense","description":"Visit all residential structures (100%) and dispense prophylaxis to each registered person","code":"MDA Dispense","timingPeriod":{"start":"2019-10-18","end":"2019-12-31"},"reason":"Routine","goalId":"MDA_Dispense","subjectCodableConcept":{"text":"Person"},"taskTemplate":"MDA_Dispense"},{"identifier":"1c688154-e025-4a40-91fd-9baed25a0ba4","prefix":3,"title":"MDA Round 1 Adherence","description":"Visit all residential structures (100%) and confirm adherence of each registered person","code":"MDA Adherence","timingPeriod":{"start":"2019-10-18","end":"2019-12-31"},"reason":"Routine","goalId":"MDA_Dispense","subjectCodableConcept":{"text":"Person"},"taskTemplate":"MDA_Adherence"}]},{"identifier":"043fc8cb-0459-4b39-b71c-abc15f13a5dd","version":"1","name":"IRS-2020-06-24-Dynamic-Task-Test-Plan","title":"IRS 2020-06-24 Dynamic Task Test Plan","status":"active","date":"2020-06-24","effectivePeriod":{"start":"2020-06-24","end":"2020-12-31"},"useContext":[{"code":"interventionType","valueCodableConcept":"Dynamic-IRS"}],"jurisdiction":[{"code":"6fffaf7f-f16f-4713-a1ac-0cf6e2fe7f2a"}],"serverVersion":1593688422154,"goal":[{"id":"IRS","description":"Spray structures in the operational area","priority":"medium-priority","target":[{"measure":"Percent of structures sprayed","detail":{"detailQuantity":{"value":90,"comparator":">=","unit":"Percent"}},"due":"2020-12-31"}]}],"action":[{"identifier":"b646cfe1-7180-4494-80b5-ee20579dc343","prefix":1,"title":"Spray Structures","description":"Visit each structure in the operational area and attempt to spray","code":"IRS","timingPeriod":{"start":"2020-06-24","end":"2020-12-31"},"reason":"Routine","goalId":"IRS","subjectCodableConcept":{"text":"Location"},"trigger":[{"type":"named-event","name":"plan-activation"},{"type":"named-event","name":"event-submission","expression":{"expression":"questionnaire = 'Register_Structure'"}}],"condition":[{"kind":"applicability","expression":{"description":"Structure is residential","expression":"$this.is(FHIR.QuestionnaireResponse) or $this.type.where(id='locationType').text = 'Residential Structure'"}},{"kind":"applicability","expression":{"description":"Register structure Event submitted for a residential structure","expression":"$this.is(FHIR.Location) or (questionnaire = 'Register_Structure' and item.where(linkId='structureType').answer.value ='Residential Structure')"}}],"definitionUri":"spray_form.json"}],"experimental":false}]`;

export const plans = JSON.parse(plansJSON);

export const irsPlans = JSON.parse(irsPplansJSON);
