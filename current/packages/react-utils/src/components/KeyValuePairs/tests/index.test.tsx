import { render } from '@testing-library/react';
import { KeyValueGrid, SingleKeyNestedValue } from '..';
import React from 'react';

const props = { id: 'soap', name: 'Soap Mactavish' };

test('Key value grid', () => {
  const { getByText } = render(<KeyValueGrid {...props} />);

  expect(getByText(/soap/)).toBeInTheDocument();
  expect(getByText(/Soap Mactavish/i)).toBeInTheDocument();
});

test('single Key value grid', () => {
  const { getByText, queryByText } = render(<SingleKeyNestedValue {...props} />);

  expect(getByText(/soap/)).toBeInTheDocument();
  expect(queryByText(/Soap Mactavish/i)).not.toBeInTheDocument();
});
