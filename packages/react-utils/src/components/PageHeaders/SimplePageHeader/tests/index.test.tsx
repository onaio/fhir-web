import React from 'react';
import { SimplePageHeader } from '..';
import { render, cleanup, screen } from '@testing-library/react';

afterAll(() => {
  cleanup();
});

it('Renders as expected', async () => {
  const title = 'Test Page';
  render(<SimplePageHeader title={title} />);

  expect(screen.getByText(title)).toBeInTheDocument();
});
