import { parseISO } from 'date-fns';
import { PlanDefinition } from '../../formHelpers/types';

export const mission1 = ({
  identifier: '2acf6908-911e-5969-b492-6d37c39c8e70',
  description: 'structure id is included in product-check action',
  version: '1',
  name: 'Peters product check structure id test',
  title: 'Peters product check structure id test',
  status: 'draft',
  date: '2021-02-23',
  effectivePeriod: { start: '2021-02-23', end: '2021-02-28' },
  useContext: [
    { code: 'interventionType', valueCodableConcept: 'SM' },
    { code: 'taskGenerationStatus', valueCodableConcept: 'internal' },
  ],
  jurisdiction: [],
  serverVersion: 149,
  goal: [
    {
      id: 'product_check',
      description: 'Check for all products (100%) within the jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of products checked',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
    {
      id: 'looks_good',
      description: 'Check for all products (100%) within jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of products in good condition',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
    {
      id: 'complete_fix_problem',
      description: 'Completes Fix problem for a product (100%) within the jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of products problems fixed',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
    {
      id: 'complete_flag_problem',
      description: 'Completes Flag problem form for a product within the jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of products problems found',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
    {
      id: 'fix_problem',
      description: 'Fix problems for all products (100%) within the jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of products problems fixed',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
    {
      id: 'record_gps',
      description: 'Record GPS for all service points without GPS within the jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of GPS recorded',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
    {
      id: 'complete_record_gps',
      description: 'Complete Record GPS for a particular service point',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of GPS recorded',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
    {
      id: 'service_point_check',
      description: 'Conduct checks for all service point (100%) within the Jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
    {
      id: 'complete_service_point_check',
      description: 'Complete check for a particular service point (100%) within the Jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { value: 100.0, comparator: '\u0026gt;', unit: 'Percent' } },
          due: '2021-03-02',
        },
      ],
    },
  ],
  action: [
    {
      identifier: 'f8ffa1fb-373f-51ef-b1ab-e2ea0005339d',
      prefix: 1,
      title: 'Product Check',
      description: 'Check for all products (100%) within the jurisdiction',
      code: 'product_check',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'product_check',
      subjectCodableConcept: { text: 'Device' },
      trigger: [{ type: 'named-event', name: 'plan-activation' }],
      condition: [
        {
          kind: 'applicability',
          expression: { description: 'Product exists', expression: '$this.is(FHIR.Bundle)' },
        },
      ],
      definitionUri: 'product_check.json',
      dynamicValue: [
        {
          path: 'structureId',
          expression: {
            expression: '$this.entry.resource.as(Device).location.reference.substring(9)',
          },
        },
      ],
      type: 'create',
    },
    {
      identifier: '994fa767-d06e-5362-970b-a5b9befd24dd',
      prefix: 2,
      title: 'Complete Looks Good',
      description: 'Complete full check for product',
      code: 'looks_good',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'looks_good',
      subjectCodableConcept: { text: 'Task' },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Looks Good event is submitted',
            expression: 'questionnaire \u003d \u0027looks_good\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'looks_good.json',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: '\u0027Visited\u0027' } },
        { path: 'status', expression: { expression: '\u0027Completed\u0027' } },
      ],
      type: 'update',
    },
    {
      identifier: 'bcac75ac-a719-52c9-95ed-e7b5f4ddd8d1',
      prefix: 3,
      title: 'Complete Fix problem task',
      description: 'Completes Fix problem task',
      code: 'complete_fix_problem',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'complete_fix_problem',
      subjectCodableConcept: { text: 'Task' },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Fix Problem event is submitted',
            expression: 'questionnaire \u003d \u0027fix_problem\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Problem Fixed',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'fix_problem.json',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: '\u0027Visited\u0027' } },
        { path: 'status', expression: { expression: '\u0027Completed\u0027' } },
      ],
      type: 'update',
    },
    {
      identifier: '3dea021a-aabd-5f08-b41e-a26dc9b2adca',
      prefix: 4,
      title: 'Complete Flag Problem',
      description: 'Completes Flag problem task',
      code: 'complete_flag_problem',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'complete_flag_problem',
      subjectCodableConcept: { text: 'Task' },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Flag Problem event is submitted',
            expression: 'questionnaire \u003d \u0027flag_problem\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Problem Flagged',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'flag_problem.json',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: '\u0027has_problem\u0027' } },
        { path: 'status', expression: { expression: '\u0027Completed\u0027' } },
      ],
      type: 'update',
    },
    {
      identifier: '2c05848d-9968-536f-896e-0deba30a7c07',
      prefix: 5,
      title: 'Fix Problem',
      description: 'Fix problems for all products (100%) within the jurisdiction',
      code: 'fix_problem',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'fix_problem',
      subjectCodableConcept: { text: 'Device' },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Fix Product event is submitted',
            expression: 'questionnaire \u003d \u0027flag_problem\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'fix_problem.json',
      type: 'create',
    },
    {
      identifier: '243b02b6-303c-5582-a715-a50973cd2418',
      prefix: 6,
      title: 'Record GPS',
      description: 'Record GPS for all service points (100%) without GPS within the jurisdiction',
      code: 'record_gps',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'record_gps',
      subjectCodableConcept: { text: 'Location' },
      trigger: [{ type: 'named-event', name: 'plan-activation' }],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Service point does not have geometry',
            expression:
              '$this.identifier.where(system\u003d\u0027hasGeometry\u0027).value\u003d\u0027false\u0027',
          },
        },
      ],
      dynamicValue: [
        {
          expression: {
            expression: '$this.id',
          },
          path: 'structureId',
        },
      ],

      definitionUri: 'record_gps.json',
      type: 'create',
    },
    {
      identifier: '9545c558-f99c-5e14-a191-3dffaf3075e8',
      prefix: 7,
      title: 'Complete Record GPS',
      description: 'Completes Record GPS activity for structure',
      code: 'complete_record_gps',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'complete_record_gps',
      subjectCodableConcept: { text: 'Task' },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Record Gps event is submitted',
            expression: 'questionnaire \u003d \u0027record_gps\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'GPS recorded',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'record_gps.json',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: '\u0027Visited\u0027' } },
        { path: 'status', expression: { expression: '\u0027Completed\u0027' } },
      ],
      type: 'update',
    },
    {
      identifier: 'a67e35b7-a34f-5845-9c8a-22afd24531fe',
      prefix: 8,
      title: 'Service Point Check',
      description: 'Conduct checks for all service point (100%) within the Jurisdiction',
      code: 'service_point_check',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'service_point_check',
      subjectCodableConcept: { text: 'Location' },
      trigger: [{ type: 'named-event', name: 'plan-activation' }],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'All service points',
            expression: '$this.is(FHIR.Location)',
          },
        },
      ],
      dynamicValue: [
        {
          expression: {
            expression: '$this.id',
          },
          path: 'structureId',
        },
      ],
      definitionUri: 'service_point_check.json',
      type: 'create',
    },
    {
      identifier: 'aa45bcb8-61d3-5f7e-9455-238914bd3e74',
      prefix: 9,
      title: 'Complete Service Point Check',
      description: 'Completes Service Point Check',
      code: 'complete_service_point_check',
      timingPeriod: { start: '2021-02-23', end: '2021-03-02' },
      reason: 'Routine',
      goalId: 'complete_service_point_check',
      subjectCodableConcept: { text: 'Task' },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Service Point Check event is submitted',
            expression: 'questionnaire \u003d \u0027service_point_check\u0027',
          },
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Service Point Checked',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
        },
      ],
      definitionUri: 'service_point_check.json',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: '\u0027Visited\u0027' } },
        { path: 'status', expression: { expression: '\u0027Completed\u0027' } },
      ],
      type: 'update',
    },
  ],
  experimental: false,
} as unknown) as PlanDefinition;

export const generatedMissionForm1 = {
  activities: [
    {
      actionCode: 'product_check',
      actionDefinitionUri: 'product_check.json',
      actionDescription: 'Check for all products (100%) within the jurisdiction',
      actionIdentifier: 'f8ffa1fb-373f-51ef-b1ab-e2ea0005339d',
      actionReason: 'Routine',
      actionTitle: 'Product Check',
      condition: [
        {
          description: 'Product exists',
          expression: '$this.is(FHIR.Bundle)',
          subjectCodableConceptText: '',
        },
      ],
      dynamicValue: [
        {
          expression: '$this.entry.resource.as(Device).location.reference.substring(9)',
          path: 'structureId',
        },
      ],
      goalDescription: 'Check for all products (100%) within the jurisdiction',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [
        {
          name: 'plan-activation',
        },
      ],
    },

    {
      actionCode: 'looks_good',
      actionDefinitionUri: 'looks_good.json',
      actionDescription: 'Complete full check for product',
      actionIdentifier: '994fa767-d06e-5362-970b-a5b9befd24dd',
      actionReason: 'Routine',
      actionTitle: 'Complete Looks Good',
      condition: [
        {
          description: 'Product exists',
          expression: '$this.is(FHIR.QuestionnaireResponse)',
          subjectCodableConceptText: '',
        },
      ],
      dynamicValue: [
        { expression: "'Visited'", path: 'businessStatus' },
        { expression: "'Completed'", path: 'status' },
      ],
      goalDescription: 'Check for all products (100%) within jurisdiction',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Looks Good event is submitted',
          expression: "questionnaire = 'looks_good'",
          name: 'event-submission',
        },
      ],
    },
    {
      actionCode: 'complete_fix_problem',
      actionDefinitionUri: 'fix_problem.json',
      actionDescription: 'Completes Fix problem task',
      actionIdentifier: 'bcac75ac-a719-52c9-95ed-e7b5f4ddd8d1',
      actionReason: 'Routine',
      actionTitle: 'Complete Fix problem task',
      condition: [
        {
          description: 'Problem Fixed',
          expression: '$this.is(FHIR.QuestionnaireResponse)',
          subjectCodableConceptText: '',
        },
      ],
      dynamicValue: [
        { expression: "'Visited'", path: 'businessStatus' },
        { expression: "'Completed'", path: 'status' },
      ],
      goalDescription: 'Completes Fix problem for a product (100%) within the jurisdiction',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Fix Problem event is submitted',
          expression: "questionnaire = 'fix_problem'",
          name: 'event-submission',
        },
      ],
    },
    {
      actionCode: 'complete_flag_problem',
      actionDefinitionUri: 'flag_problem.json',
      actionDescription: 'Completes Flag problem task',
      actionIdentifier: '3dea021a-aabd-5f08-b41e-a26dc9b2adca',
      actionReason: 'Routine',
      actionTitle: 'Complete Flag Problem',
      condition: [
        {
          description: 'Problem Flagged',
          expression: '$this.is(FHIR.QuestionnaireResponse)',
          subjectCodableConceptText: '',
        },
      ],
      dynamicValue: [
        { expression: "'has_problem'", path: 'businessStatus' },
        { expression: "'Completed'", path: 'status' },
      ],
      goalDescription: 'Completes Flag problem form for a product within the jurisdiction',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Flag Problem event is submitted',
          expression: "questionnaire = 'flag_problem'",
          name: 'event-submission',
        },
      ],
    },
    {
      actionCode: 'fix_problem',
      actionDefinitionUri: 'fix_problem.json',
      actionDescription: 'Fix problems for all products (100%) within the jurisdiction',
      actionIdentifier: '2c05848d-9968-536f-896e-0deba30a7c07',
      actionReason: 'Routine',
      actionTitle: 'Fix Problem',
      condition: [
        {
          description: 'Product exists',
          expression: '$this.is(FHIR.QuestionnaireResponse)',
          subjectCodableConceptText: '',
        },
      ],
      goalDescription: 'Fix problems for all products (100%) within the jurisdiction',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Fix Product event is submitted',
          expression: "questionnaire = 'flag_problem'",
          name: 'event-submission',
        },
      ],
    },
    {
      actionCode: 'record_gps',
      actionDefinitionUri: 'record_gps.json',
      actionDescription:
        'Record GPS for all service points (100%) without GPS within the jurisdiction',
      actionIdentifier: '243b02b6-303c-5582-a715-a50973cd2418',
      actionReason: 'Routine',
      actionTitle: 'Record GPS',
      condition: [
        {
          description: 'Service point does not have geometry',
          expression: "$this.identifier.where(system='hasGeometry').value='false'",
          subjectCodableConceptText: '',
        },
      ],
      dynamicValue: [
        {
          expression: '$this.id',
          path: 'structureId',
        },
      ],
      goalDescription: 'Record GPS for all service points without GPS within the jurisdiction',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [{ name: 'plan-activation' }],
    },
    {
      actionCode: 'complete_record_gps',
      actionDefinitionUri: 'record_gps.json',
      actionDescription: 'Completes Record GPS activity for structure',
      actionIdentifier: '9545c558-f99c-5e14-a191-3dffaf3075e8',
      actionReason: 'Routine',
      actionTitle: 'Complete Record GPS',
      condition: [
        {
          description: 'GPS recorded',
          expression: '$this.is(FHIR.QuestionnaireResponse)',
          subjectCodableConceptText: '',
        },
      ],
      dynamicValue: [
        { expression: "'Visited'", path: 'businessStatus' },
        { expression: "'Completed'", path: 'status' },
      ],
      goalDescription: 'Complete Record GPS for a particular service point',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Record Gps event is submitted',
          expression: "questionnaire = 'record_gps'",
          name: 'event-submission',
        },
      ],
    },
    {
      actionCode: 'service_point_check',
      actionDefinitionUri: 'service_point_check.json',
      actionDescription: 'Conduct checks for all service point (100%) within the Jurisdiction',
      actionIdentifier: 'a67e35b7-a34f-5845-9c8a-22afd24531fe',
      actionReason: 'Routine',
      actionTitle: 'Service Point Check',
      condition: [
        {
          description: 'All service points',
          expression: '$this.is(FHIR.Location)',
          subjectCodableConceptText: '',
        },
      ],
      dynamicValue: [
        {
          expression: '$this.id',
          path: 'structureId',
        },
      ],
      goalDescription: 'Conduct checks for all service point (100%) within the Jurisdiction',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [{ name: 'plan-activation' }],
    },
    {
      actionCode: 'complete_service_point_check',
      actionDefinitionUri: 'service_point_check.json',
      actionDescription: 'Completes Service Point Check',
      actionIdentifier: 'aa45bcb8-61d3-5f7e-9455-238914bd3e74',
      actionReason: 'Routine',
      actionTitle: 'Complete Service Point Check',
      condition: [
        {
          description: 'Service Point Checked',
          expression: '$this.is(FHIR.QuestionnaireResponse)',
          subjectCodableConceptText: '',
        },
      ],
      dynamicValue: [
        { expression: "'Visited'", path: 'businessStatus' },
        { expression: "'Completed'", path: 'status' },
      ],
      goalDescription:
        'Complete check for a particular service point (100%) within the Jurisdiction',
      goalDue: parseISO('2021-03-02T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2021-03-02T00:00:00.000Z'),
      timingPeriodStart: parseISO('2021-02-23T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Service Point Check event is submitted',
          expression: "questionnaire = 'service_point_check'",
          name: 'event-submission',
        },
      ],
    },
  ],
  caseNum: '',
  date: parseISO('2021-02-23T00:00:00.000Z'),
  description: 'structure id is included in product-check action',
  end: parseISO('2021-02-28T00:00:00.000Z'),
  fiReason: undefined,
  fiStatus: undefined,
  identifier: '2acf6908-911e-5969-b492-6d37c39c8e70',
  interventionType: 'SM',
  jurisdictions: [],
  name: 'Peters product check structure id test',
  opensrpEventId: undefined,
  start: parseISO('2021-02-23T00:00:00.000Z'),
  status: 'draft',
  taskGenerationStatus: 'internal',
  teamAssignmentStatus: '',
  title: 'Peters product check structure id test',
  version: '1',
};
