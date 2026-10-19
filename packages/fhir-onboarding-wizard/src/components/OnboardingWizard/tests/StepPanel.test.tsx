import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepPanel } from '../StepPanel';
import { StepKey } from '../../../types';
import type { StepConfig } from '../../../types';
import { message } from 'antd';

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: { error: jest.fn() },
}));

const FakeForm = ({ onSubmit }: { onSubmit: (values: unknown) => void }) => (
  <button onClick={() => onSubmit({ name: 'Org A' })}>fake-submit</button>
);

// shows what the panel told the form, so tests can see whether the draft was accepted
const ReportingForm = ({ onSubmit }: { onSubmit: (values: unknown) => boolean | void }) => {
  const [accepted, setAccepted] = React.useState('');
  return (
    <div>
      <button onClick={() => setAccepted(String(onSubmit({ name: 'Org A' })))}>fake-submit</button>
      <span data-testid="accepted">{accepted}</span>
    </div>
  );
};

const stepConfig: StepConfig = {
  key: StepKey.ORGANIZATION,
  title: 'Organization',
  component: FakeForm,
  requiredPermissions: [],
};

const reportingStep = (findDuplicate?: StepConfig['findDuplicate']): StepConfig => ({
  ...stepConfig,
  component: ReportingForm,
  findDuplicate,
});

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
  const { asFragment } = render(<StepPanel {...props} />);
  return { ...props, asFragment };
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

  it('disables Back on the first step', () => {
    setup({ isFirstStep: true });
    expect(button('Back').disabled).toBe(true);
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

  it('matches the snapshot on first render', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('StepPanel duplicate check', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('adds the draft and tells the form it was accepted when nothing clashes', () => {
    setup({ stepConfig: reportingStep(() => undefined) });
    fireEvent.click(screen.getByText('fake-submit'));
    expect(screen.getByTestId('accepted').textContent).toBe('true');
    expect(screen.queryByText('Org A')).not.toBeNull();
  });

  it('rejects the draft and tells the form to keep its values when the step reports a clash', () => {
    setup({ stepConfig: reportingStep(() => 'Org A is already in the drafts.') });
    fireEvent.click(screen.getByText('fake-submit'));
    expect(screen.getByTestId('accepted').textContent).toBe('false');
    expect(screen.queryByText('Org A')).toBeNull();
    expect(button('Next').disabled).toBe(true);
  });

  it('rejects the draft and tells the form to keep its values when the step reports a clash', () => {
    setup({ stepConfig: reportingStep(() => 'Org A is already in the drafts.') });
    fireEvent.click(screen.getByText('fake-submit'));
    expect(screen.getByTestId('accepted').textContent).toBe('false');
    expect(message.error).toHaveBeenCalledWith('Org A is already in the drafts.');
    expect(screen.queryByText('Org A')).toBeNull();
    expect(button('Next').disabled).toBe(true);
  });

  it("gives the check the new values, this step's drafts and no edit index", () => {
    const findDuplicate = jest.fn(() => undefined);
    setup({ stepConfig: reportingStep(findDuplicate) });
    fireEvent.click(screen.getByText('fake-submit'));
    expect(findDuplicate).toHaveBeenCalledWith({ name: 'Org A' }, [], undefined);
  });
});
