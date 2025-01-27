import React from 'react';
import { cleanup, fireEvent, render, screen, act, waitFor } from '@testing-library/react';
import { CloseFlagForm } from '..';
import { flag } from '../../Utils/tests/fixtures';
import { QueryClient, QueryClientProvider } from 'react-query';
import userEvents from '@testing-library/user-event';
import { status } from '../../../constants';
import { ContextProvider } from '@opensrp/react-utils';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const commonProps = {
  initialValues: { status: 'active' as const },
  flag: flag,
};

describe('CloseFlagForm component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders form fields correctly and submits', () => {
    const mutationMock = jest.fn().mockImplementation(async () => {
      return;
    });

    const props = {
      ...commonProps,
      initialValues: {
        ...commonProps.initialValues,
        locationName: 'One Padmore',
      },
      mutationEffect: mutationMock,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ContextProvider>
          <CloseFlagForm {...props} />
        </ContextProvider>
      </QueryClientProvider>
    );

    // Check if form fields are rendered
    expect(screen.getByLabelText('Service Point')).toBeInTheDocument();
    expect(screen.getByLabelText('Product')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Comments')).toBeInTheDocument();

    // You can add more specific assertions as needed
    const commentField = screen.getByLabelText('Comments');
    userEvents.type(commentField, 'Some comments here');

    const statusSelectField = document.querySelector(`input#${status}`) as HTMLElement;
    fireEvent.mouseDown(statusSelectField);

    fireEvent.click(document.querySelector(`[title="Inactive"]`) as HTMLElement);

    const submitBtn = screen.getByRole('button', {
      name: /Save/i,
    });

    act(() => {
      fireEvent.click(submitBtn);
    });
  });

  test('form validates', async () => {
    const mockMutationEffect = jest.fn();
    const props = {
      ...commonProps,
      mutationEffect: mockMutationEffect,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ContextProvider>
          <CloseFlagForm {...props} />
        </ContextProvider>
      </QueryClientProvider>
    );

    const submitBtn = screen.getByRole('button', {
      name: /Save/i,
    });

    act(() => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      const requireMessages = [...document.querySelectorAll('.ant-form-item-required')];
      expect(requireMessages.length).toBeGreaterThan(0);
    });

    const requireMessages = [...document.querySelectorAll('.ant-form-item-required')];
    const requireMessagesTexts = requireMessages.map((element) => element.textContent);
    expect(requireMessagesTexts).toEqual(['Service Point', 'Status', 'Comments']);
  });
});
