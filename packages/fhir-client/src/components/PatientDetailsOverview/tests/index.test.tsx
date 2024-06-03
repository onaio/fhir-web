import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { PatientDetailsOverview } from '..';
import nock from 'nock';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe('PatientDetailsOverview', () => {
  beforeEach(() => {
    queryClient.clear();
    nock.cleanAll();
  });

  const renderComponent = (patientId) => {
    const searchParams = new URLSearchParams();
    if (patientId) {
      searchParams.set('viewDetails', patientId);
    }

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientDetailsOverview fhirBaseURL="https://example.com/fhir" />
        </MemoryRouter>
      </QueryClientProvider>,
      {
        wrapper: ({ children }) => (
          <div data-query-params={searchParams.toString()}>{children}</div>
        ),
      }
    );
  };

  it('renders loading state when fetching patient data', async () => {
    renderComponent('123');
    expect(screen.getByText(/Fetching Patient details/i)).toBeInTheDocument();
  });

  it('renders error state when an error occurs', async () => {
    nock('https://example.com').get('/fhir/Patient/123').replyWithError('Error fetching data');

    renderComponent('123');

    await waitFor(() => {
      expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument();
    });
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

    nock('https://example.com').get('/fhir/Patient/1').reply(200, mockPatientData);

    renderComponent('1');

    await waitFor(() => {
      expect(screen.getByText(/123456/i)).toBeInTheDocument(); // patient ID
      expect(screen.getByText(/Male/i)).toBeInTheDocument(); // gender
      expect(screen.getByText(/1234567890/i)).toBeInTheDocument(); // phone number
      expect(screen.getByText(/123 Street/i)).toBeInTheDocument(); // address
      expect(screen.getByText(/1990-01-01/i)).toBeInTheDocument(); // date of birth
      expect(screen.getByText(/View full details/i)).toBeInTheDocument(); // link to full details
    });
  });

  it('renders "BrokenPage" when patient is not found', async () => {
    nock('https://example.com').get('/fhir/Patient/999').reply(404);

    renderComponent('999');

    await waitFor(() => {
      expect(screen.getByText(/patient not found/i)).toBeInTheDocument();
      expect(
        screen.getByText(/The patient you are looking for does not exist/i)
      ).toBeInTheDocument();
    });
  });

  it('clicking close button calls removeParam function', async () => {
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

    nock('https://example.com').get('/fhir/Patient/1').reply(200, mockPatientData);

    renderComponent('1');

    await waitFor(() => screen.getByText(/View full details/i));

    userEvent.click(screen.getByTestId('cancel'));
    expect(window.location.search).not.toContain('viewDetails');
  });
});
