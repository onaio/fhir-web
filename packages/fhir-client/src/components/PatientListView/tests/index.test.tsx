import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { PatientListView } from '..';

describe('PatientListView', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('renders loading state when patientId is provided', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientListView fhirBaseURL="https://example.com/fhir" />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => screen.getByText(/inactive/i)); // wait for the status to render
  });

  it('renders error state when error occurs during data fetch', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress console errors
    const errorMessage = 'Error fetching data';
    queryClient.useQuery = jest
      .fn()
      .mockReturnValue({ data: undefined, error: new Error(errorMessage) });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientListView fhirBaseURL="https://example.com/fhir" />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('renders patient details when data is fetched successfully', async () => {
    const mockPatientData = {
      id: '1',
      gender: 'Male',
      birthDate: '1990-01-01',
      address: [{ line: ['123 Street'], country: 'Country' }],
      telecom: [{ value: '1234567890' }],
      identifier: [{ value: '123456' }],
      deceasedBoolean: false,
      active: true,
    };
    queryClient.useQuery = jest.fn().mockReturnValue({ data: mockPatientData, error: null });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientListView fhirBaseURL="https://example.com/fhir" />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText(/inactive/i)).toBeInTheDocument()); // wait for the status to render

    expect(screen.getByText(/123456/i)).toBeInTheDocument(); // check if patient ID is rendered
    expect(screen.getByText(/male/i)).toBeInTheDocument(); // check if gender is rendered
    expect(screen.getByText(/1234567890/i)).toBeInTheDocument(); // check if phone number is rendered
    expect(screen.getByText(/123 Street/i)).toBeInTheDocument(); // check if address is rendered
    expect(screen.getByText(/1990-01-01/i)).toBeInTheDocument(); // check if date of birth is rendered
    expect(screen.getByText(/view full details/i)).toBeInTheDocument(); // check if link to full details is rendered
  });

  it('clicking close button calls removeParam function', async () => {
    const removeParamMock = jest.fn();
    queryClient.useQuery = jest.fn().mockReturnValue({ data: null, error: null });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientListView fhirBaseURL="https://example.com/fhir" />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument()); // wait for loading to complete

    userEvent.click(screen.getByTestId('cancel'));
    expect(removeParamMock).toHaveBeenCalled();
  });
});
