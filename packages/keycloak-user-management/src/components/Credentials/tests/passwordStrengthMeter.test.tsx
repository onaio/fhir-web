import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordStrengthMeter } from '../passwordStrengthMeter';

const props = {
  placeholder: 'Enter your password',
};

describe('PasswordStrengthMeter', () => {
  test('renders input field and progress bar', () => {
    render(<PasswordStrengthMeter {...props} />);
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('updates progress bar when password is typed', () => {
    render(<PasswordStrengthMeter {...props} />);
    const input = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(input, { target: { value: 'password123' } });
    // confirm test id has the correct value.
    screen.getByTestId('level-good');
  });

  test('changes progress bar color based on password strength', () => {
    render(<PasswordStrengthMeter {...props} />);
    const input = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(input, { target: { value: 'weak' } });
    screen.getByTestId('level-poor');

    fireEvent.change(input, { target: { value: 'Stronger1!' } });
    screen.getByTestId('level-good');
  });

  test('calls onChange when password is entered', () => {
    const handleChange = jest.fn();
    render(<PasswordStrengthMeter {...props} onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(input, { target: { value: 'testing123' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
