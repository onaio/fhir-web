import { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';

<<<<<<< HEAD
export const openChoiceQuestRes = ({
=======
export const openChoiceQuestRes = {
>>>>>>> 870-quest-questR-resources
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
<<<<<<< HEAD
} as unknown) as IQuestionnaireResponse;
=======
} as unknown as IQuestionnaireResponse;
>>>>>>> 870-quest-questR-resources
