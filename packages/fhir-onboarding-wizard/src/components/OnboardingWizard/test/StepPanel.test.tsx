import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepPanel } from '../StepPanel';
import { StepKey } from '../../../types';
import type { StepConfig } from '../../../types';

const FakeForm = ({ onSubmit }: { onSubmit: (values: unknown) => void }) => (
  <button onClick={() => onSubmit({ name: 'Org A' })}>fake-submit</button>
);

const stepConfig: StepConfig = {
  key: StepKey.ORGANIZATION,
  title: 'Organization',
  component: FakeForm,
  requiredPermissions: [],
};

const setup = (overrides: Partial<React.ComponentProps<typeof StepPanel>> = {}) => {
  const props = {
    stepConfig,
    commonProps: {},
    onNext: jest.fn(),
    onBack: jest.fn(),
    isFirstStep: false,
    isLastStep: false,
    submitting: false,
    ...overrides,
  };
  render(<StepPanel {...props} />);
  return props;
};

const button = (name: string) => screen.getByRole('button', { name }) as HTMLButtonElement;

describe('StepPanel', () => {
  beforeEach(() => sessionStorage.clear());

  it('keeps Next disabled until the step has a draft', () => {
    setup();
    expect(button('Next').disabled).toBe(true);
    fireEvent.click(screen.getByText('fake-submit'));
    expect(button('Next').disabled).toBe(false);
  });

  it('lists the drafted entry under the form', () => {
    setup();
    expect(screen.queryByText('Org A')).toBeNull();
    fireEvent.click(screen.getByText('fake-submit'));
    expect(screen.queryByText('Org A')).not.toBeNull();
  });

  it('passes the drafts to onNext', () => {
    const { onNext } = setup();
    fireEvent.click(screen.getByText('fake-submit'));
    fireEvent.click(button('Next'));
    expect(onNext).toHaveBeenCalledWith([expect.objectContaining({ name: 'Org A' })]);
  });

  it('shows Finish on the last step', () => {
    setup({ isLastStep: true });
    expect(screen.queryByRole('button', { name: 'Finish' })).not.toBeNull();
  });

  it('disables Back on the first step and calls onBack on the others', () => {
    const first = setup({ isFirstStep: true });
    expect(button('Back').disabled).toBe(true);
    expect(first.onBack).not.toHaveBeenCalled();
  });

  it('calls onBack when Back is clicked', () => {
    const { onBack } = setup();
    fireEvent.click(button('Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('does not show drafts that belong to another step', () => {
    sessionStorage.setItem('wizard-draft:careTeam', JSON.stringify([{ name: 'Team X' }]));
    setup();
    expect(screen.queryByText('Team X')).toBeNull();
  });
});