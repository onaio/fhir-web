import { PlanDefinition } from '@opensrp/plan-form-core';

export const mission1 = {
  identifier: '335ef7a3-7f35-58aa-8263-4419464946d8',
  version: '1',
  name: 'EUSM Mission 2020-11-17',
  title: 'EUSM Mission 2020-11-17',
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
      code: '8a26a7ea-b820-4c9a-9811-07b1c38b51fa',
    },
  ],
  serverVersion: 1599112764477,
  goal: [
    {
      id: 'Product_Check',
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
      id: 'Fix_Product_Problem',
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
      id: 'Record_GPS',
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
      id: 'Service_Point_Check',
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
      goalId: 'Product_Check',
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
            expression: '$this.is(FHIR.Device)',
          },
        },
      ],
      definitionUri: 'product_check.json',
      type: 'create',
    },
    {
      identifier: 'bd90510c-e769-5176-ad18-5a256822822a',
      prefix: 2,
      title: 'Fix Product Problem',
      description: 'Fix problems for all products (100%) within the jurisdiction',
      code: 'fix_product_problems',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'Fix_Product_Problem',
      subjectCodableConcept: {
        text: 'Device',
      },
      trigger: [
        {
          type: 'named-event',
          name: 'event-submission',
          expression: {
            description: 'Trigger when a Fix Product event is submitted',
            expression: "questionnaire = 'Fix_Product_Problem'",
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
      goalId: 'Record_GPS',
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
            expression: "$this.identifier.where(id='hasGeometry').value='false'",
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
      description: 'Conduct checkfor all service points (100%) within the jurisdiction',
      code: 'service_point_check',
      timingPeriod: {
        start: '2020-11-17',
        end: '2020-12-24',
      },
      reason: 'Routine',
      goalId: 'Service_Point_Check',
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
  ],
  experimental: false,
} as PlanDefinition;

export const newPayload1 = {
  action: [
    {
      identifier: '7d5a9652-0d1c-583d-9d98-ab2f9e9979ca',
      prefix: 1,
      description: 'Check for all products (100%) within the jurisdiction',
      code: 'product_check',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'Product_Check',
      subjectCodableConcept: { text: 'Device' },
      condition: [
        {
          expression: { description: 'Product exists', expression: '$this.is(FHIR.Bundle)' },
          kind: 'applicability',
        },
      ],
      definitionUri: 'product_check.json',
      title: 'Product Check',
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      type: 'create',
    },
    {
      identifier: '936d4dbc-d803-56c9-888d-280810d1aa36',
      prefix: 2,
      description: 'Fix problems for all products (100%) within the jurisdiction',
      code: 'fix_product_problems',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'Fix_Product_Problem',
      subjectCodableConcept: { text: 'Device' },
      condition: [
        {
          expression: {
            description: 'Product exists',
            expression: '$this.is(FHIR.QuestionnaireResponse)',
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'product_check.json',
      title: 'Fix Product Problem',
      trigger: [
        {
          expression: {
            description: 'Trigger when a Fix Product event is submitted',
            expression: "questionnaire = 'flag_problem'",
          },
          name: 'event-submission',
          type: 'named-event',
        },
      ],
      type: 'create',
    },
    {
      identifier: 'b920b277-6927-5d75-9862-b87e1968a0c4',
      prefix: 3,
      description: 'Record GPS for all service points (100%) without GPS within the jurisdiction',
      code: 'record_gps',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'Record_GPS',
      subjectCodableConcept: { text: 'Location' },
      condition: [
        {
          expression: {
            description: 'Service point does not have geometry',
            expression: "$this.identifier.where(id='hasGeometry').value='false'",
          },
          kind: 'applicability',
        },
      ],
      definitionUri: 'record_gps.json',
      title: 'Record GPS',
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      type: 'create',
    },
    {
      identifier: '527c9afd-ca37-56bc-a035-7be8a3da79f4',
      prefix: 4,
      description: 'Conduct checks for all service point (100%) within the Jurisdiction',
      code: 'service_point_check',
      timingPeriod: { end: '2017-07-20', start: '2017-07-13' },
      reason: 'Routine',
      goalId: 'Service_Point_Check',
      subjectCodableConcept: { text: 'Location' },
      condition: [
        {
          expression: { description: 'All service points', expression: '$this.is(FHIR.Location)' },
          kind: 'applicability',
        },
      ],
      definitionUri: 'service_point_check.json',
      title: 'Service Point Check',
      trigger: [{ name: 'plan-activation', type: 'named-event' }],
      type: 'create',
    },
  ],
  goal: [
    {
      description: 'Check for all products (100%) within the jurisdiction',
      id: 'Product_Check',
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
      description: 'Fix problems for all products (100%) within the jurisdiction',
      id: 'Fix_Product_Problem',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
          measure: 'Percent of products problems fixed',
        },
      ],
    },
    {
      description: 'Record GPS for all service points (100%) without GPS within the jurisdiction',
      id: 'Record_GPS',
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
      id: 'Service_Point_Check',
      priority: 'medium-priority',
      target: [
        {
          detail: { detailQuantity: { comparator: '>', unit: 'Percent', value: 100 } },
          due: '2017-07-20',
          measure: 'Percent of service points checked',
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
