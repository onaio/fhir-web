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
      code: 'Product Check',
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
      code: 'Fix Product Problems',
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
      code: 'Record GPS',
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
      code: 'Service Point Check',
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
};
