import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PatientsList } from '..';
import * as reactUtils from '@opensrp/react-utils';
import { useTranslation } from '../../../mls';
import { useSearchParams } from '@opensrp/react-utils';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { serverSideSortedColumns, parsePatient } from '../../PatientDetails/ResourceSchema/Patient';

// Mock the dependencies
jest.mock('@opensrp/react-utils', () => ({
  useSimpleTabularView: jest.fn(),
  useSearchParams: jest.fn(),
  BrokenPage: jest.fn(),
  TableLayout: jest.fn(),
}));

jest.mock('../../mls', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../PatientDetails/ResourceSchema/Patient', () => ({
  serverSideSortedColumns: jest.fn(),
  parsePatient: jest.fn(),
}));

describe('PatientsList', () => {
  const mockFhirBaseURL = 'https://fhir.server';

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      addParams: jest.fn(),
    });

    (serverSideSortedColumns as jest.Mock).mockReturnValue([
      { title: 'Name', dataIndex: 'name', key: 'name' },
    ]);

    (parsePatient as jest.Mock).mockReturnValue({
      id: 'patient-1',
      name: 'John Doe',
    });
  });

  test('renders without crashing', () => {
    (reactUtils.useSimpleTabularView as jest.Mock).mockReturnValue({
      searchFormProps: {},
      tablePaginationProps: {},
      queryValues: {
        data: { records: [] },
        isFetching: false,
        isLoading: false,
        error: null,
      },
    });

    render(<PatientsList fhirBaseURL={mockFhirBaseURL} />);

    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    (reactUtils.useSimpleTabularView as jest.Mock).mockReturnValue({
      searchFormProps: {},
      tablePaginationProps: {},
      queryValues: {
        data: { records: [] },
        isFetching: true,
        isLoading: true,
        error: null,
      },
    });

    render(<PatientsList fhirBaseURL={mockFhirBaseURL} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('handles error state', () => {
    const errorMessage = 'Error fetching patients';
    (reactUtils.useSimpleTabularView as jest.Mock).mockReturnValue({
      searchFormProps: {},
      tablePaginationProps: {},
      queryValues: {
        data: null,
        isFetching: false,
        isLoading: false,
        error: new Error(errorMessage),
      },
    });

    render(<PatientsList fhirBaseURL={mockFhirBaseURL} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('renders table with data', async () => {
    const patientData: IPatient[] = [{ id: 'patient-1', name: 'John Doe' } as unknown as IPatient];
    (reactUtils.useSimpleTabularView as jest.Mock).mockReturnValue({
      searchFormProps: {},
      tablePaginationProps: {},
      queryValues: {
        data: { records: patientData },
        isFetching: false,
        isLoading: false,
        error: null,
      },
    });

    render(<PatientsList fhirBaseURL={mockFhirBaseURL} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
