import { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';

export const openChoiceQuestRes = ({
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
} as unknown) as IQuestionnaireResponse;
