import { parseISO } from 'date-fns';
import { PlanDefinition } from '../types';

export const mission1 = {
  identifier: '335ef7a3-7f35-58aa-8263-4419464946d8',
  version: '1',
  name: 'EUSM Mission 2020-11-17',
  title: 'EUSM Mission 2020-11-17',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse egestas lorem non nunc tincidunt fermentum. Praesent vitae commodo est. Phasellus.',
  status: 'active',
  date: '2020-11-17',
  effectivePeriod: {
    start: '2020-11-17',
    end: '2021-12-24',
  },
  useContext: [
    {
      code: 'taskGenerationStatus',
      valueCodableConcept: 'internal',
    },
  ],
  jurisdiction: [
    {
      code: 'ad56bb3b-66c5-4a29-8003-0a60582540a6',
    },
  ],
  goal: [
    {
      id: 'product_check',
      description: 'Check for all products (100%) within the jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of products checked',
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
        },
      ],
    },
    {
      id: 'looks_good',
      description: 'Check for all products (100%) within the jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of products in good condition',
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
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
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
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
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
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
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
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
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
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
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
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
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
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
          detail: {
            detailQuantity: {
              value: 100,
              comparator: '>',
              unit: 'Percent',
            },
          },
          due: '2020-12-24',
        },
      ],
    },
  ],
  action: [
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 1,
      title: 'Product Check',
      description: 'Check for all products (100%) within the jurisdiction',
      code: 'product_check',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'product_check',
      subjectCodableConcept: {
        text: 'Device',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'plan-activation',
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.Bundle)',
          },
        },
      ],
      definitionUri: 'product_check.json',
      type: 'create',
    },
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 2,
      title: 'Fix Problem',
      description: 'Fix problem for all products (100%) within the jurisdiction',
      code: 'fix_problem',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'fix_problem',
      subjectCodableConcept: {
        text: 'Device',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Flag Problem event is submitted',
            expression: "questionnaire = 'flag_problem'",
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
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 3,
      title: 'Record GPS',
      description: 'Record GPS for all service points (100%) without GPS within the jurisdiction',
      code: 'record_gps',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'record_gps',
      subjectCodableConcept: {
        text: 'Location',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'plan-activation',
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'Service point does not have geometry',
            expression: "$this.identifier.where(system='hasGeometry').value='false'",
          },
        },
      ],
      definitionUri: 'record_gps.json',
      type: 'create',
    },
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 3,
      title: 'Service Point Check',
      description: 'Conduct check for all service points (100%) within the jurisdiction',
      code: 'service_point_check',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'service_point_check',
      subjectCodableConcept: {
        text: 'Location',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'plan-activation',
        },
      ],
      condition: [
        {
          kind: 'applicability',
          expression: {
            description: 'All service points',
            expression: '$this.is(FHIR.Location)',
          },
        },
      ],
      definitionUri: 'service_point_check.json',
      type: 'create',
    },
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 3,
      title: 'Complete Looks Good',
      description: 'Complete full check for product',
      code: 'looks_good',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'looks_good',
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Looks Good event is submitted',
            expression: "questionnaire = 'looks_good'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'Visited'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
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
      type: 'update',
    },
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 3,
      title: 'Complete Record GPS',
      description: 'Completes Record GPS activity for structure',
      code: 'record_gps',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'complete_record_gps',
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Record Gps event is submitted',
            expression: "questionnaire = 'record_gps'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'Visited'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
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
      type: 'update',
    },
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 3,
      title: 'Complete Service Point Check',
      description: 'Completes Service Point Check',
      code: 'service_point_check',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'complete_service_point_check',
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Service Point Check event is submitted',
            expression: "questionnaire = 'service_point_check'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'Visited'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
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
      type: 'update',
    },
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 3,
      title: 'Complete Flag Problem',
      description: 'Completes Flag problem task',
      code: 'flag_problem',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'complete_flag_problem',
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Flag Problem event is submitted',
            expression: "questionnaire = 'flag_problem'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'has_problem'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
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
      type: 'update',
    },
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 3,
      title: 'Complete Fix problem task',
      description: 'Completes Fix problem task',
      code: 'fix_problem',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'complete_fix_problem',
      subjectCodableConcept: {
        text: 'Task',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Fix Problem event is submitted',
            expression: "questionnaire = 'fix_problem'",
          },
        },
      ],
      dynamicValue: [
        {
          path: 'businessStatus',
          expression: {
            expression: "'Visited'",
          },
        },
        {
          path: 'status',
          expression: {
            expression: "'Completed'",
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
      type: 'update',
    },
  ],
  experimental: false,
} as PlanDefinition;

export const generatedMissionForm1 = {
  activities: [
    {
      actionCode: 'product_check',
      actionDefinitionUri: 'product_check.json',
      actionDescription: 'Check for all products (100%) within the jurisdiction',
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      actionReason: 'Routine',
      actionTitle: 'Product Check',
      condition: [
        {
          description: 'Product exists',
          expression: '$this.is(FHIR.Bundle)',
          subjectCodableConceptText: '',
        },
      ],
      goalDescription: 'Check for all products (100%) within the jurisdiction',
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
      trigger: [{ name: 'plan-activation' }],
    },
    {
      actionCode: 'fix_problem',
      actionDefinitionUri: 'fix_problem.json',
      actionDescription: 'Fix problem for all products (100%) within the jurisdiction',
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
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
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Flag Problem event is submitted',
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
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      actionReason: 'Routine',
      actionTitle: 'Record GPS',
      condition: [
        {
          description: 'Service point does not have geometry',
          expression: "$this.identifier.where(system='hasGeometry').value='false'",
          subjectCodableConceptText: '',
        },
      ],
      goalDescription: 'Record GPS for all service points without GPS within the jurisdiction',
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
      trigger: [{ name: 'plan-activation' }],
    },
    {
      actionCode: 'service_point_check',
      actionDefinitionUri: 'service_point_check.json',
      actionDescription: 'Conduct check for all service points (100%) within the jurisdiction',
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      actionReason: 'Routine',
      actionTitle: 'Service Point Check',
      condition: [
        {
          description: 'All service points',
          expression: '$this.is(FHIR.Location)',
          subjectCodableConceptText: '',
        },
      ],
      goalDescription: 'Conduct checks for all service point (100%) within the Jurisdiction',
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
      trigger: [{ name: 'plan-activation' }],
    },
    {
      actionCode: 'looks_good',
      actionDefinitionUri: 'looks_good.json',
      actionDescription: 'Complete full check for product',
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
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
      goalDescription: 'Check for all products (100%) within the jurisdiction',
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Looks Good event is submitted',
          expression: "questionnaire = 'looks_good'",
          name: 'event-submission',
        },
      ],
    },
    {
      actionCode: 'record_gps',
      actionDefinitionUri: 'record_gps.json',
      actionDescription: 'Completes Record GPS activity for structure',
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
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
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
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
      actionDescription: 'Completes Service Point Check',
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
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
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Service Point Check event is submitted',
          expression: "questionnaire = 'service_point_check'",
          name: 'event-submission',
        },
      ],
    },
    {
      actionCode: 'flag_problem',
      actionDefinitionUri: 'flag_problem.json',
      actionDescription: 'Completes Flag problem task',
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
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
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
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
      actionDescription: 'Completes Fix problem task',
      actionIdentifier: 'bd90510c-e769-5176-ad18-5a256822822a',
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
      goalDue: parseISO('2020-12-24T00:00:00.000Z'),
      goalPriority: 'medium-priority',
      goalValue: 100,
      timingPeriodEnd: parseISO('2020-12-24T00:00:00.000Z'),
      timingPeriodStart: parseISO('2020-11-17T00:00:00.000Z'),
      trigger: [
        {
          description: 'Trigger when a Fix Problem event is submitted',
          expression: "questionnaire = 'fix_problem'",
          name: 'event-submission',
        },
      ],
    },
  ],
  caseNum: '',
  date: parseISO('2020-11-17T00:00:00.000Z'),
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse egestas lorem non nunc tincidunt fermentum. Praesent vitae commodo est. Phasellus.',
  end: parseISO('2021-12-24T00:00:00.000Z'),
  fiReason: undefined,
  fiStatus: undefined,
  identifier: '335ef7a3-7f35-58aa-8263-4419464946d8',
  interventionType: 'FI',
  jurisdictions: [
    { id: 'ad56bb3b-66c5-4a29-8003-0a60582540a6', name: 'ad56bb3b-66c5-4a29-8003-0a60582540a6' },
  ],
  name: 'EUSM Mission 2020-11-17',
  opensrpEventId: undefined,
  start: parseISO('2020-11-17T00:00:00.000Z'),
  status: 'active',
  taskGenerationStatus: 'internal',
  teamAssignmentStatus: '',
  title: 'EUSM Mission 2020-11-17',
  version: '1',
};

export const generatedMission1 = {
  action: [
    {
      code: 'product_check',
      condition: [
        {
          expression: { description: 'Product exists', expression: '$this.is(FHIR.Bundle)' },
          kind: 'applicability',
        },
      ],
      definitionUri: 'product_check.json',
      description: 'Check for all products (100%) within the jurisdiction',
      dynamicValue: [
        {
          expression: {
            expression: '$this.entry.resource.as(Device).location.reference.substring(9)',
          },
          path: 'structureId',
        },
      ],
      goalId: 'product_check',
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 1,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Device' },
      timingPeriod: { end: '2020-12-24', start: '2020-11-17' },
      title: 'Product Check',
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      type: 'create',
    },
    {
      code: 'fix_problem',
      condition: [
        {
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'fix_problem.json',
      description: 'Fix problem for all products (100%) within the jurisdiction',
      goalId: 'fix_problem',
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 2,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Device' },
      timingPeriod: { end: '2020-12-24', start: '2020-11-17' },
      title: 'Fix Problem',
      trigger: [
        {
          expression: {
            description: 'Trigger when a Flag Problem event is submitted',
            expression: "questionnaire = 'flag_problem'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      type: 'create',
    },
    {
      code: 'record_gps',
      condition: [
        {
          expression: {
            description: 'Service point does not have geometry',
            expression: "$this.identifier.where(system='hasGeometry').value='false'",
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'record_gps.json',
      description: 'Record GPS for all service points (100%) without GPS within the jurisdiction',
      goalId: 'record_gps',
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 3,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Location' },
      timingPeriod: { end: '2020-12-24', start: '2020-11-17' },
      title: 'Record GPS',
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      type: 'create',
    },
    {
      code: 'service_point_check',
      condition: [
        {
          expression: { description: 'All service points', expression: '$this.is(FHIR.Location)' },
          kind: 'applicability',
        },
      ],
      definitionUri: 'service_point_check.json',
      description: 'Conduct check for all service points (100%) within the jurisdiction',
      goalId: 'service_point_check',
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 4,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Location' },
      timingPeriod: { end: '2020-12-24', start: '2020-11-17' },
      title: 'Service Point Check',
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      type: 'create',
    },
    {
      code: 'looks_good',
      condition: [
        {
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'looks_good.json',
      description: 'Complete full check for product',
      dynamicValue: [
        { expression: { expression: "'Visited'" }, path: 'businessStatus' },
        { expression: { expression: "'Completed'" }, path: 'status' },
      ],
      goalId: 'looks_good',
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 5,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Task' },
      timingPeriod: { end: '2020-12-24', start: '2020-11-17' },
      title: 'Complete Looks Good',
      trigger: [
        {
          expression: {
            description: 'Trigger when a Looks Good event is submitted',
            expression: "questionnaire = 'looks_good'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      type: 'update',
    },
    {
      code: 'record_gps',
      condition: [
        {
          expression: {
            description: 'GPS recorded',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'record_gps.json',
      description: 'Completes Record GPS activity for structure',
      dynamicValue: [
        { expression: { expression: "'Visited'" }, path: 'businessStatus' },
        { expression: { expression: "'Completed'" }, path: 'status' },
      ],
      goalId: 'record_gps',
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 6,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Location' },
      timingPeriod: { end: '2020-12-24', start: '2020-11-17' },
      title: 'Complete Record GPS',
      trigger: [
        {
          expression: {
            description: 'Trigger when a Record Gps event is submitted',
            expression: "questionnaire = 'record_gps'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      type: 'create',
    },
    {
      code: 'service_point_check',
      condition: [
        {
          expression: {
            description: 'Service Point Checked',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'service_point_check.json',
      description: 'Completes Service Point Check',
      dynamicValue: [
        { expression: { expression: "'Visited'" }, path: 'businessStatus' },
        { expression: { expression: "'Completed'" }, path: 'status' },
      ],
      goalId: 'service_point_check',
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 7,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Location' },
      timingPeriod: { end: '2020-12-24', start: '2020-11-17' },
      title: 'Complete Service Point Check',
      trigger: [
        {
          expression: {
            description: 'Trigger when a Service Point Check event is submitted',
            expression: "questionnaire = 'service_point_check'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      type: 'create',
    },
    {
      code: 'fix_problem',
      condition: [
        {
          expression: {
            description: 'Problem Fixed',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'fix_problem.json',
      description: 'Completes Fix problem task',
      dynamicValue: [
        { expression: { expression: "'Visited'" }, path: 'businessStatus' },
        { expression: { expression: "'Completed'" }, path: 'status' },
      ],
      goalId: 'fix_problem',
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 9,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Device' },
      timingPeriod: { end: '2020-12-24', start: '2020-11-17' },
      title: 'Complete Fix problem task',
      trigger: [
        {
          expression: {
            description: 'Trigger when a Fix Problem event is submitted',
            expression: "questionnaire = 'fix_problem'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      type: 'create',
    },
  ],
  date: '2020-11-17',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse egestas lorem non nunc tincidunt fermentum. Praesent vitae commodo est. Phasellus.',
  effectivePeriod: { end: '2021-12-24', start: '2020-11-17' },
  experimental: false,
  goal: [
    {
      description: 'Check for all products (100%) within the jurisdiction',
      id: 'product_check',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2020-12-24',
          measure: 'Percent of products checked',
        },
      ],
    },
    {
      description: 'Fix problems for all products (100%) within the jurisdiction',
      id: 'fix_problem',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2020-12-24',
          measure: 'Percent of products problems fixed',
        },
      ],
    },
    {
      description: 'Record GPS for all service points without GPS within the jurisdiction',
      id: 'record_gps',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2020-12-24',
          measure: 'Percent of GPS recorded',
        },
      ],
    },
    {
      description: 'Conduct checks for all service point (100%) within the Jurisdiction',
      id: 'service_point_check',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2020-12-24',
          measure: 'Percent of service points checked',
        },
      ],
    },
    {
      description: 'Check for all products (100%) within the jurisdiction',
      id: 'looks_good',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2020-12-24',
          measure: 'Percent of products in good condition',
        },
      ],
    },
    {
      description: 'Complete Record GPS for a particular service point',
      id: 'record_gps',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2020-12-24',
          measure: 'Percent of GPS recorded',
        },
      ],
    },
    {
      description: 'Complete check for a particular service point (100%) within the Jurisdiction',
      id: 'service_point_check',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2020-12-24',
          measure: 'Percent of service points checked',
        },
      ],
    },
    {
      description: 'Completes Fix problem for a product (100%) within the jurisdiction',
      id: 'fix_problem',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2020-12-24',
          measure: 'Percent of products problems fixed',
        },
      ],
    },
  ],
  identifier: '335ef7a3-7f35-58aa-8263-4419464946d8',
  jurisdiction: [{ code: 'ad56bb3b-66c5-4a29-8003-0a60582540a6' }],
  name: 'EUSM Mission 2020-11-17',
  status: 'active',
  title: 'EUSM Mission 2020-11-17',
  useContext: [
    { code: 'interventionType', valueCodableConcept: 'FI' },
    { code: 'taskGenerationStatus', valueCodableConcept: 'internal' },
  ],
  version: 2,
};
