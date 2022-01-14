import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Questionnaire } from '../Questionnaire';
import { openChoiceQuest } from './fixture';

test('Questionnaire profile view renders correctly', () => {
  const { getByText, queryByText } = render(<Questionnaire resource={openChoiceQuest} />);

  // we check details section
  expect(getByText(/Healthcare Worker Staffing Pathway/)).toBeInTheDocument();
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
