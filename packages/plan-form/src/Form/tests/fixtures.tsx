import { PlanDefinition } from '@opensrp/plan-form-core';

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
      code: 'complete_record_gps',
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
      code: 'complete_service_point_check',
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
      code: 'complete_flag_problem',
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
      code: 'complete_fix_problem',
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

export const newPayload1 = {
  action: [
    {
      code: 'beneficiary_consultation',
      condition: [
        {
          expression: { description: 'All service points', expression: '$this.is(FHIR.Bundle)' },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point has stock',
            expression: 'Bundle.entry.resource.ofType(SupplyDelivery).exists()',
          },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point has active stock',
            expression:
              "Bundle.entry.resource.ofType(SupplyDelivery).identifier.where(system='isPastAccountabilityDate' and value='false').exists()",
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'beneficiary_consultation.json',
      description: 'Consult beneficiaries for all service point checks',
      dynamicValue: [{ path: 'structureId', expression: { expression: '$this.id' } }],
      goalId: 'beneficiary_consultation',
      identifier: '91b5e5a9-ae6f-5bb1-9516-878e349213e4',
      prefix: 1,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Location.Stock' },
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      title: 'Beneficiary Consultation',
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      type: 'create',
    },
    {
      identifier: '855592e3-950b-57d1-a443-760b49eb20d9',
      prefix: 2,
      title: 'Warehouse Check',
      description: 'Warehouse Check for all Service Points with type warehouse',
      code: 'warehouse_check',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'warehouse_check',
      subjectCodableConcept: { text: 'Location.Stock' },
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      condition: [
        {
          expression: { description: 'All service points', expression: '$this.is(FHIR.Bundle)' },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point has stock',
            expression: 'Bundle.entry.resource.ofType(SupplyDelivery).exists()',
          },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point has active stock',
            expression:
              "Bundle.entry.resource.ofType(SupplyDelivery).identifier.where(system='isPastAccountabilityDate' and value='false').exists()",
          },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point is a warehouse',
            expression:
              "Bundle.entry.resource.ofType(Location).type.where(id='locationType').text='Warehouse'",
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'warehouse_check.json',
      dynamicValue: [{ path: 'structureId', expression: { expression: '$this.id' } }],
      type: 'create',
    },
    {
      identifier: '8f3af396-34dd-5a61-97f7-c89df80ca273',
      prefix: 3,
      title: 'Complete Service Point Check With Problem',
      description: 'Completes Service Point Check Task With Problem',
      code: 'complete_service_point_with_flag_problem',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'complete_service_point_with_flag_problem',
      subjectCodableConcept: { text: 'Task' },
      trigger: [
        {
          expression: {
            description: 'Trigger when a Flag Problem event is submitted',
            expression: "questionnaire = 'service_point_check'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      condition: [
        {
          expression: {
            description: 'Problem Flagged',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'check consult_beneficiaries_flag field',
            expression: "$this.item.where(linkId='consult_beneficiaries_flag').answer.value ='yes'",
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'service_point_check.json',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'has_problem'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
      type: 'update',
    },
    {
      code: 'complete_beneficiary_consultation',
      condition: [
        {
          expression: {
            description: 'Service Point Checked',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'beneficiary_consultation.json',
      description: 'Complete the Consult beneficiaries for a particular service point',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'Visited'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
      goalId: 'complete_beneficiary_consultation',
      identifier: 'd6d64c71-48bf-5811-a14c-fff39d1f26ac',
      prefix: 4,
      reason: 'Routine',
      subjectCodableConcept: { text: 'Task' },
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      title: 'Complete Beneficiary Consultation',
      trigger: [
        {
          expression: {
            description: 'Trigger when a Beneficiary Consultation event is submitted',
            expression: "questionnaire = 'beneficiary_consultation'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      type: 'update',
    },
    {
      identifier: 'ba6a1d46-ac06-56f9-84d2-b6f2e9fa2041',
      prefix: 5,
      title: 'Complete Consult beneficiaries With Problem',
      description: 'Completes Service Point Check Task With Problem',
      code: 'complete_beneficiary_consultation_with_flag',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'complete_beneficiary_consultation_with_flag',
      subjectCodableConcept: { text: 'Task' },
      trigger: [
        {
          expression: {
            description: 'Trigger when a Flag Problem event is submitted',
            expression: "questionnaire = 'beneficiary_consultation'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      condition: [
        {
          expression: {
            description: 'Problem Flagged',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'check consult_beneficiaries_flag field',
            expression: "$this.item.where(linkId='consult_beneficiaries_flag').answer.value ='yes'",
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'beneficiary_consultation.json',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'has_problem'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
      type: 'update',
    },
    {
      identifier: '90d8b2f7-9a07-584a-b979-8b9fa6592579',
      prefix: 6,
      title: 'Complete Warehouse Check',
      description: 'Complete Warehouse Check for all Service Points with type warehouse',
      code: 'complete_warehouse_check',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'complete_warehouse_check',
      subjectCodableConcept: { text: 'Task' },
      trigger: [
        {
          expression: {
            description: 'Trigger when a Service Point Check event is submitted',
            expression: "questionnaire = 'warehouse_check'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      condition: [
        {
          expression: {
            description: 'Service Point Checked',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'warehouse_check.json',
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'Visited'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
      type: 'update',
    },
    {
      identifier: '0c8f5b3a-6023-5917-b944-acbfba254efe',
      prefix: 7,
      title: 'Product Check',
      description: 'Check for all products (100%) within the jurisdiction',
      code: 'product_check',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'product_check',
      subjectCodableConcept: { text: 'Device' },
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      condition: [
        {
          expression: { description: 'Product exists', expression: '$this.is(FHIR.Bundle)' },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Product is active',
            expression:
              "Bundle.entry.resource.ofType(SupplyDelivery).identifier.where(system='isPastAccountabilityDate' and value='false').exists()",
          },
          kind: 'applicability',
        },
      ],
      dynamicValue: [
        {
          path: 'structureId',
          expression: {
            expression: '$this.entry.resource.as(Device).location.reference.substring(9)',
          },
        },
      ],
      definitionUri: 'product_check.json',
      type: 'create',
    },
    {
      identifier: 'e1252828-447f-553a-ae82-960c5973d29e',
      prefix: 8,
      title: 'Complete Looks Good',
      description: 'Complete full check for product',
      code: 'looks_good',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'looks_good',
      subjectCodableConcept: { text: 'Task' },
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
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'Visited'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
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
      type: 'update',
    },
    {
      identifier: '956ba81a-57c3-5074-a112-10e945a64a82',
      prefix: 9,
      title: 'Complete Fix problem task',
      description: 'Completes Fix problem task',
      code: 'complete_fix_problem',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'complete_fix_problem',
      subjectCodableConcept: { text: 'Task' },
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
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'Visited'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
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
      type: 'update',
    },
    {
      identifier: 'b5a4fdee-8db9-5ab4-b20c-f19ae93f8a33',
      prefix: 10,
      title: 'Complete Flag Problem',
      description: 'Completes Flag problem task',
      code: 'complete_flag_problem',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'complete_flag_problem',
      subjectCodableConcept: { text: 'Task' },
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
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'has_problem'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
      condition: [
        {
          expression: {
            description: 'Problem Flagged',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'flag_problem.json',
      type: 'update',
    },
    {
      identifier: 'e5c7a70b-11b1-5c0b-80b3-6df681e27fa6',
      prefix: 11,
      title: 'Record GPS',
      description: 'Record GPS for all service points (100%) without GPS within the jurisdiction',
      code: 'record_gps',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'record_gps',
      subjectCodableConcept: { text: 'Location.Stock' },
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      condition: [
        {
          expression: {
            description: 'Service point does not have geometry',
            expression:
              "Bundle.entry.resource.ofType(Location).identifier.where(system='hasGeometry').value='false'",
          },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point has stock',
            expression: 'Bundle.entry.resource.ofType(SupplyDelivery).exists()',
          },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point has active stock',
            expression:
              "Bundle.entry.resource.ofType(SupplyDelivery).identifier.where(system='isPastAccountabilityDate' and value='false').exists()",
          },
          kind: 'applicability',
        },
      ],
      dynamicValue: [{ path: 'structureId', expression: { expression: '$this.id' } }],
      definitionUri: 'record_gps.json',
      type: 'create',
    },
    {
      identifier: 'b527bc28-71d9-596c-b03b-acbae41898e9',
      prefix: 12,
      title: 'Complete Record GPS',
      description: 'Completes Record GPS activity for structure',
      code: 'complete_record_gps',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'complete_record_gps',
      subjectCodableConcept: { text: 'Task' },
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
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'Visited'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
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
      type: 'update',
    },
    {
      identifier: '117644ec-920f-57bb-8746-4c2641c571ab',
      prefix: 13,
      description: 'Conduct checks for all service point (100%) within the Jurisdiction',
      code: 'service_point_check',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'service_point_check',
      subjectCodableConcept: { text: 'Location.Stock' },
      condition: [
        {
          expression: { description: 'All service points', expression: '$this.is(FHIR.Bundle)' },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point has stock',
            expression: 'Bundle.entry.resource.ofType(SupplyDelivery).exists()',
          },
          kind: 'applicability',
        },
        {
          expression: {
            description: 'Check if service point has active stock',
            expression:
              "Bundle.entry.resource.ofType(SupplyDelivery).identifier.where(system='isPastAccountabilityDate' and value='false').exists()",
          },
          kind: 'applicability',
        },
      ],
      dynamicValue: [{ path: 'structureId', expression: { expression: '$this.id' } }],
      definitionUri: 'service_point_check.json',
      title: 'Service Point Check',
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      type: 'create',
    },
    {
      identifier: 'f4aa75b0-77db-5f7a-9b2e-e9f4490a5611',
      prefix: 14,
      title: 'Complete Service Point Check',
      description: 'Completes Service Point Check',
      code: 'complete_service_point_check',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'complete_service_point_check',
      subjectCodableConcept: { text: 'Task' },
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
      dynamicValue: [
        { path: 'businessStatus', expression: { expression: "'Visited'" } },
        { path: 'status', expression: { expression: "'Completed'" } },
      ],
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
      type: 'update',
    },
  ],
  goal: [
    {
      id: 'beneficiary_consultation',
      description: 'Consult beneficiaries for all service point checks',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { value: 100, comparator: '>', unit: 'Percent' } },
          due: '2017-07-20',
        },
      ],
    },
    {
      id: 'warehouse_check',
      description: 'Warehouse Check for all Service Points with type warehouse',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { value: 100, comparator: '>', unit: 'Percent' } },
          due: '2017-07-20',
        },
      ],
    },
    {
      id: 'complete_service_point_with_flag_problem',
      description:
        'Complete check for a particular service point (100%) with flag problem within the Jurisdiction',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked with flag problem',
          detail: { detailQuantity: { value: 100, comparator: '>', unit: 'Percent' } },
          due: '2017-07-20',
        },
      ],
    },
    {
      id: 'complete_beneficiary_consultation',
      description: 'Complete the Consult beneficiaries for a particular service point',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { value: 100, comparator: '>', unit: 'Percent' } },
          due: '2017-07-20',
        },
      ],
    },
    {
      id: 'complete_beneficiary_consultation_with_flag',
      description:
        'Complete the Consult beneficiaries for a particular service point with a problem flag',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { value: 100, comparator: '>', unit: 'Percent' } },
          due: '2017-07-20',
        },
      ],
    },
    {
      id: 'complete_warehouse_check',
      description: 'Complete Warehouse Check for all Service Points with type warehouse',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { value: 100, comparator: '>', unit: 'Percent' } },
          due: '2017-07-20',
        },
      ],
    },
    {
      description: 'Check for all products (100%) within the jurisdiction',
      id: 'product_check',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
          measure: 'Percent of products checked',
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
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
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
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
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
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
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
          due: '2017-07-20',
          measure: 'Percent of GPS recorded',
        },
      ],
    },
    {
      description: 'Complete Record GPS for a particular service point',
      id: 'complete_record_gps',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
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
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
        },
      ],
    },
    {
      description: 'Complete check for a particular service point (100%) within the Jurisdiction',
      id: 'complete_service_point_check',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of service points checked',
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
        },
      ],
    },
  ],
  date: '2017-07-13',
  effectivePeriod: { end: '2017-08-02', start: '2017-07-13' },
  experimental: false,
  identifier: '0fdfb6c4-692d-5420-a7e7-6084a61907c9',
  jurisdiction: [],
  name: 'Plan Name',
  status: 'draft',
  title: 'Plan Name',
  useContext: [
    { code: 'interventionType', valueCodableConcept: 'SM' },
    { code: 'taskGenerationStatus', valueCodableConcept: 'internal' },
  ],
  version: '1',
  description: 'Mission plan description',
};
