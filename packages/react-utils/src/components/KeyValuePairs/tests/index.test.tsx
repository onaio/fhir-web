import { render } from '@testing-library/react';
import {
  KeyValueGrid,
  SingleKeyNestedValue,
  KeyValuesDescriptions,
  SingleFlatKeyValue,
  ListFlatKeyValues,
} from '..';
import React from 'react';

const props = { id: 'soap', name: 'Soap Mactavish' };

test('Key value grid', () => {
  const { getByText } = render(<KeyValueGrid {...props} />);

  expect(getByText(/soap/)).toBeInTheDocument();
  expect(getByText(/Soap Mactavish/i)).toBeInTheDocument();
});

test('single Key value grid', () => {
  const { getByText, queryByText } = render(<SingleKeyNestedValue theme="light" data={props} />);

  expect(getByText(/soap/)).toBeInTheDocument();
  expect(queryByText(/Soap Mactavish/i)).not.toBeInTheDocument();

  const defaultTheme = document.querySelector('.singleKeyValue-pair__default');
  const lightTheme = document.querySelector('.singleKeyValue-pair__light');
  expect(defaultTheme).toBeNull();
  expect(lightTheme).not.toBeNull();
});

test('KeyValuesDescriptions renders okay', () => {
  const { getByText, queryByText } = render(<KeyValuesDescriptions data={props} />);

  expect(getByText(/soap/)).toBeInTheDocument();
  expect(queryByText(/Soap Mactavish/i)).toBeInTheDocument();

  const defaultTheme = document.querySelector('.singleKeyValue-pair__default');
  const lightTheme = document.querySelector('.singleKeyValue-pair__light');
  expect(defaultTheme).not.toBeNull();
  expect(lightTheme).toBeNull();
});

test('SingleFlatKeyValue renders okay ', () => {
  const { getByText, queryByText } = render(<SingleFlatKeyValue data={props} />);

  expect(getByText(/soap/)).toBeInTheDocument();
  expect(queryByText(/Soap Mactavish/i)).not.toBeInTheDocument();
});

test('ListFlatKeyValues renders okay', () => {
  const { getByText, queryByText } = render(
    <ListFlatKeyValues classnames="test-class" data={props} />
  );

  expect(getByText(/soap/)).toBeInTheDocument();
  expect(queryByText(/Soap Mactavish/i)).toBeInTheDocument();

  const testClassElement = document.querySelector('.test-class');
  expect(testClassElement).not.toBeNull();
});
