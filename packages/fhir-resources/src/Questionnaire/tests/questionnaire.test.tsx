import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { parseQuestionnaireResource, Questionnaire } from '../Questionnaire';
import { openChoiceQuest, healthWorker } from './fixture';

test('Questionnaire profile view renders correctly', () => {
  const { getByText, queryByText } = render(<Questionnaire resource={healthWorker} />);

  // we check details section
  document.querySelectorAll('div.keyValueGrid-pair').forEach((pair) => {
    expect(pair).toMatchSnapshot('questionnaire details keyValue pairs');
  });

  // questionnaire item preview
  expect(queryByText(/Summary Census #ID/)).not.toBeInTheDocument();
  fireEvent.click(getByText(/Preview items/));

  expect(getByText(/Summary Census #ID/)).toBeInTheDocument();

  document.querySelectorAll('li.questionnaireItemsList-title').forEach((li) => {
    expect(li).toMatchSnapshot('questionnaire single item preview');
  });
});

test('view details show when available', () => {
  const { getByText, queryByText } = render(<Questionnaire resource={openChoiceQuest} />);

  // we check details section
  expect(getByText(/Food questions/)).toBeInTheDocument();
  document.querySelectorAll('div.keyValueGrid-pair').forEach((pair) => {
    expect(pair).toMatchSnapshot('questionnaire details keyValue pairs');
  });

  // questionnaire item preview
  expect(queryByText(/What pizza toppings would you like?/)).not.toBeInTheDocument();
  fireEvent.click(getByText(/Preview items/));

  expect(getByText(/What pizza toppings would you like?/)).toBeInTheDocument();

  expect(document.querySelector('.questionnaireItemsList')).toMatchSnapshot(
    'questionnaire items preview'
  );
});

test('no items edge case', () => {
  const noItemsHealthQuest = JSON.parse(JSON.stringify(healthWorker));
  delete noItemsHealthQuest.item;
  const { getByText } = render(<Questionnaire resource={noItemsHealthQuest} />);
  expect(
    getByText(
      (content, element) =>
        content.includes('Healthcare Worker Staffing Pathway') && element.tagName === 'H4'
    )
  ).toBeInTheDocument();
  fireEvent.click(getByText(/Preview items/));

  document
    .querySelectorAll('.resourceDetails-info__key-value .keyValueGrid-pair')
    .forEach((pair) => expect(pair).toMatchSnapshot('questionnaire meta'));

  expect(document.querySelector('.questionnaireItemsList__questions-list')).not.toBeInTheDocument();
  expect(document.querySelector('.questionnaireItemsList')).not.toBeInTheDocument();

  noItemsHealthQuest.item = [
    {
      type: 'string',
      code: [
        {
          code: 'Q1',
          display: 'Facility ID',
          system: 'Custom',
        },
      ],
      required: true,
      linkId: '/G1/Q1',
      text: 'Facility ID',
      prefix: '1',
    },
  ];
  cleanup();

  render(<Questionnaire resource={noItemsHealthQuest} />);
  fireEvent.click(getByText(/Preview items/));
  expect(document.querySelector('.questionnaireItemsList__questions-list')).not.toBeInTheDocument();
  expect(document.querySelector('.questionnaireItemsList')).toBeInTheDocument();
});

test('questionnaireParsing - narrative preview extraction and missing title', () => {
  const questClone = JSON.parse(JSON.stringify(openChoiceQuest));
  delete questClone.title;
  questClone.id = '12345';
  const sampleNarrative = {
    text: {
      status: 'generated',
      div:
        '<div xmlns="http://www.w3.org/1999/xhtml">\n      <pre>\n            1.Comorbidity?\n              1.1 Cardial Comorbidity\n                1.1.1 Angina?\n                1.1.2 MI?\n              1.2 Vascular Comorbidity?\n              ...\n            Histopathology\n              Abdominal\n                pT category?\n              ...\n          </pre>\n    </div>',
    },
  };
  questClone.text = sampleNarrative.text;
  const got = parseQuestionnaireResource(questClone);

  expect(got.title).toEqual('12345');
  expect(got.narrativePreview).toBeDefined();
});
