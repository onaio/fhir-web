import React, { useContext } from 'react';
import { ErrorReporterContext, ErrorReporterProvider } from '..';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('can report errors from a child component in a tree', () => {
  const FallbackComponent = () => {
    return (
      <div>
        <p>Fallback component</p>
      </div>
    );
  };

  const err = new Error('coughid');

  const ChildComponent = () => {
    const { reporter } = useContext(ErrorReporterContext);
    return (
      <button
        onClick={() => {
          reporter(err);
        }}
      >
        initiate pandemic
      </button>
    );
  };

  const mockReporter = jest.fn();

  render(
    <ErrorReporterProvider fallbackComponent={FallbackComponent} reporter={mockReporter}>
      <ChildComponent />
    </ErrorReporterProvider>
  );

  expect(screen.getByText(/initiate pandemic/)).toBeInTheDocument();
  userEvent.click(screen.getByRole('button'));
  expect(mockReporter).toHaveBeenCalledWith(err);
});
