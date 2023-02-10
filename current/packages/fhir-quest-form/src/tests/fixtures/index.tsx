export const openChoiceQuest = {
  date: '2020-04-11T22:01:37.262Z',
  version: '1',
  status: 'draft',
  experimental: true,
  url: 'http://example.org/healthcareworkerstaffingpathway',
  name: 'HealthcareWorkerStaffingPathway',
  title: 'Healthcare Worker Staffing Pathway',
  resourceType: 'Questionnaire',
  item: [
    {
      type: 'choice',
      code: [
        {
          code: 'Q4',
          display: 'What pizza toppings would you like?',
          system: 'Custom',
        },
      ],
      required: true,
      linkId: '/G1/Q4',
      text: 'What pizza toppings would you like?',
      prefix: '4',
      repeats: true,
      answerOption: [
        {
          valueString: 'Cheese',
        },
        {
          valueString: 'Ham',
        },
        {
          valueString: 'Mushrooms',
        },
      ],
      item: [
        {
          text: 'Favorite toppings',
          type: 'display',
          linkId: '/G1/Q4-help',
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
              valueCodeableConcept: {
                text: 'Help-Button',
                coding: [
                  {
                    code: 'help',
                    display: 'Help-Button',
                    system: 'http://hl7.org/fhir/questionnaire-item-control',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};

export const openChoiceQuestRes = {
  resourceType: 'QuestionnaireResponse',
  status: 'in-progress',
  questionnaire: 'Questionnaire/123',
  id: '321',
  item: [
    {
      linkId: '/G1/Q4',
      text: 'What pizza toppings would you like?',
      answer: [
        {
          item: [{ linkId: '/G1/Q4-help', text: 'Favorite toppings' }],
          valueCoding: { code: 'Ham', display: 'Ham' },
        },
      ],
    },
  ],
};
