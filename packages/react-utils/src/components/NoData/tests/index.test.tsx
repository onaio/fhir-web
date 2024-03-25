import { render } from '@testing-library/react';
import { NoData } from '..';
import React from 'react';

const props = { description: 'descriptive text' };

test('Component renders correctly', () => {
  const { getByText, getByTitle } = render(<NoData {...props} />);

  expect(getByTitle(/Empty raw svg icon/)).toBeInTheDocument();
  expect(getByText(/No data available/)).toBeInTheDocument();
  expect(getByText(/descriptive text/i)).toBeInTheDocument();
});

test('Component Renders with children', () => {
  const { getByText } = render(
    <NoData>
      <div>Additional children</div>
    </NoData>
  );

  expect(getByText(/No data available/)).toBeInTheDocument();
  expect(getByText(/Additional children/)).toBeInTheDocument();
});
