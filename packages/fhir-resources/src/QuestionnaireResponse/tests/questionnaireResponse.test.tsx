import { parseQuestionnaireResponse } from '../questionResponse';
import { openChoiceQuestRes } from './fixtures';

test('parse Resource is ok', () => {
  expect(parseQuestionnaireResponse(openChoiceQuestRes)).toEqual({
    author: undefined,
    authoredDateTime: undefined,
    basedOn: undefined,
    id: '321',
    partOf: undefined,
    questionnaire: 'Questionnaire/123',
    questionnaireVersion: undefined,
    rootItems: [
      {
        answer: [
          {
            item: [
              {
                linkId: '/G1/Q4-help',
                text: 'Favorite toppings',
              },
            ],
            valueCoding: {
              code: 'Ham',
              display: 'Ham',
            },
          },
        ],
        linkId: '/G1/Q4',
        text: 'What pizza toppings would you like?',
      },
    ],
    source: undefined,
    subject: undefined,
  });

  const qVersionTest = { ...openChoiceQuestRes, questionnaire: 'Questionnaire/3440/_history/20' };
  const qUndefVersionTest = { ...openChoiceQuestRes, questionnaire: undefined };
  expect(parseQuestionnaireResponse(qVersionTest).questionnaireVersion).toEqual('20');
  expect(parseQuestionnaireResponse(qUndefVersionTest).questionnaireVersion).toEqual(undefined);
});
