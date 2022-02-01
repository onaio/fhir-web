import { parseQuestionnaireResponseResource } from '../questionResponse';
import { openChoiceQuestRes } from './fixtures';

test('parse Resource is ok', () => {
  expect(parseQuestionnaireResponseResource(openChoiceQuestRes)).toEqual({
    author: undefined,
    authoredDateTime: undefined,
    basedOn: undefined,
    id: '321',
    partOf: undefined,
    questionnaire: 'Questionnaire/123',
    questionnaireVersion: 'Current',
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
  expect(parseQuestionnaireResponseResource(qVersionTest).questionnaireVersion).toEqual('20');
});
