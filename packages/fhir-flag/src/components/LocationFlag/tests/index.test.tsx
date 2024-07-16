import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router';
import { screen, render } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider } from 'react-redux';
import { LocationFlag, LocationFlagProps } from '..';
import flushPromises from 'flush-promises';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole, FHIRServiceClass } from '@opensrp/react-utils';
import { CloseFlagForm } from '../../CloseFlagForm';
import { spCheckFlag } from './fixtures';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const mockLocation: ILocation = {
  resourceType: 'Location',
  id: 'locationId',
  name: 'Test Location',
};

const mockFlag: IFlag = spCheckFlag;

const fhirBaseURL = 'http://test.server.org';

jest.mock('@opensrp/react-utils', () => ({
  ...jest.requireActual('@opensrp/react-utils'),
  FHIRServiceClass: jest.fn().mockImplementation(() => ({
    read: jest.fn().mockResolvedValue(mockLocation),
  })),
}));

jest.mock('../../CloseFlagForm', () => ({
  CloseFlagForm: jest.fn(() => <div>CloseFlagForm Component</div>),
}));

const AppWrapper = (props) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RoleContext.Provider value={superUserRole}>
        <Router history={props.history}>
          <Route exact path="/location-flag/:id">
            <LocationFlag {...props} />
          </Route>
        </Router>
      </RoleContext.Provider>
    </QueryClientProvider>
  </Provider>
);

describe('LocationFlag component', () => {
  const history = createMemoryHistory();
  history.push('/location-flag/locationId');

  const defaultProps: LocationFlagProps = {
    fhirBaseUrl: fhirBaseURL,
    locationReference: 'locationId',
    flag: mockFlag,
    practitionerId: 'practitionerId',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when data is being fetched', async () => {
    (FHIRServiceClass as jest.Mock).mockImplementationOnce(() => ({
      read: jest.fn().mockResolvedValueOnce(null),
    }));

    const { container } = render(<AppWrapper {...defaultProps} history={history} />);

    expect(container).toMatchSnapshot();
  });

  it('renders broken page when there is an error and no location data', async () => {
    const errorMessage = 'Error fetching location';
    (FHIRServiceClass as jest.Mock).mockImplementationOnce(() => ({
      read: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    }));

    render(<AppWrapper {...defaultProps} history={history} />);

    await flushPromises();

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders CloseFlagForm with correct initial values when data is fetched', async () => {
    render(<AppWrapper {...defaultProps} history={history} />);

    await flushPromises();

    expect(screen.getByText('CloseFlagForm Component')).toBeInTheDocument();

    const initialValues = {
      locationName: mockLocation.name,
      practitionerId: defaultProps.practitionerId,
      status: defaultProps.flag.status,
    };

    expect(CloseFlagForm).toHaveBeenCalledWith(
      expect.objectContaining({
        fhirBaseUrl: fhirBaseURL,
        initialValues,
        flag: mockFlag,
      }),
      {}
    );
  });
});
