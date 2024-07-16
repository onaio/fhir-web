import React from 'react';
import { render } from '@testing-library/react';
import { CloseFlagForm, CloseFlagFormProps } from '..';
import { flag } from '../../Utils/tests/fixtures';

// Mock useMutation hook
jest.mock('react-query', () => ({
  useMutation: jest.fn((mutationFn) => ({
    mutate: jest.fn((values) => mutationFn(values)),
    isLoading: false,
  })),
}));

describe('CloseFlagForm component', () => {
  const mockMutationEffect = jest.fn();

  const props: CloseFlagFormProps = {
    fhirBaseUrl: 'mockBaseUrl',
    initialValues: { status: 'active' },
    flag: flag,
    mutationEffect: mockMutationEffect,
  };

  it('renders form fields correctly', () => {
    const { getByLabelText } = render(<CloseFlagForm {...props} />);

    // Check if form fields are rendered
    expect(getByLabelText('Service Point')).toBeInTheDocument();
    expect(getByLabelText('Product')).toBeInTheDocument();
    expect(getByLabelText('Status')).toBeInTheDocument();
    expect(getByLabelText('Comments')).toBeInTheDocument();

    // You can add more specific assertions as needed
  });
});
