import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router';
import { screen, render, waitForElementToBeRemoved } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider } from 'react-redux';
import flushPromises from 'flush-promises';
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IList } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IList';
import { ProductFlag, ProductFlagProps } from '..';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole, FHIRServiceClass } from '@opensrp/react-utils';
import { CloseFlagForm } from '../../CloseFlagForm';
import { flag } from '../../Utils/tests/fixtures';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const mockFlag: IFlag = flag;

const mockInventoryGroup: IGroup = {
  resourceType: 'Group',
  id: 'groupId',
  member: [{ entity: { reference: 'Group/productId' } }],
};

const mockLocation: ILocation = {
  resourceType: 'Location',
  id: 'locationId',
  name: 'Test Location',
};

const mockProduct: IGroup = {
  resourceType: 'Group',
  id: 'productId',
  name: 'Test Product',
};

const mockList: IList = {
  resourceType: 'List',
  id: 'listId',
  subject: { reference: 'Location/locationId' },
};

jest.mock('@opensrp/react-utils', () => ({
  ...jest.requireActual('@opensrp/react-utils'),
  FHIRServiceClass: jest.fn().mockImplementation(() => ({
    read: jest.fn().mockImplementation((resource) => {
      switch (resource) {
        case 'Group/456':
          return Promise.resolve(mockInventoryGroup);
        case 'Group/productId':
          return Promise.resolve(mockProduct);
        case 'Location/locationId':
          return Promise.resolve(mockLocation);
      }
    }),
    list: jest.fn().mockResolvedValue({ entry: [{ resource: mockList }] }),
  })),
  BrokenPage: jest.fn(() => <div>BrokenPage Component</div>),
}));
jest.mock('../../CloseFlagForm', () => ({
  CloseFlagForm: jest.fn(() => <div>CloseFlagForm Component</div>),
}));

const AppWrapper = (props: any) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RoleContext.Provider value={superUserRole}>
        <Router history={props.history}>
          <Route exact path="/product-flag">
            <ProductFlag {...props} />
          </Route>
        </Router>
      </RoleContext.Provider>
    </QueryClientProvider>
  </Provider>
);

describe('ProductFlag component', () => {
  const history = createMemoryHistory();
  history.push('/product-flag');

  const defaultProps: ProductFlagProps = {
    fhirBaseUrl: 'http://example.com/fhir',
    flag: mockFlag,
    practitionerId: 'Practitioner/123',
    inventoryGroupReference: 'Group/456',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when data is being fetched', () => {
    const { container } = render(<AppWrapper {...defaultProps} history={history} />);

    expect(container).toMatchSnapshot('spinner');
  });

  it('renders CloseFlagForm with correct initial values when data is fetched', async () => {
    render(<AppWrapper {...defaultProps} history={history} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
    await flushPromises();

    expect(screen.getByText('CloseFlagForm Component')).toBeInTheDocument();

    const initialValues = {
      productName: mockProduct.name,
      locationName: mockLocation.name,
      listSubject: mockList.subject.reference,
      status: defaultProps.flag.status,
      practitionerId: defaultProps.practitionerId,
    };

    expect(CloseFlagForm).toHaveBeenCalledWith(
      expect.objectContaining({
        fhirBaseUrl: defaultProps.fhirBaseUrl,
        initialValues,
        flag: defaultProps.flag,
      }),
      {}
    );
  });

  it('renders broken page when product name or location name is missing', async () => {
    (FHIRServiceClass as jest.Mock).mockImplementationOnce(() => ({
      read: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null),
    }));

    render(<AppWrapper {...defaultProps} history={history} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
    await flushPromises();

    expect(screen.getByText('BrokenPage Component')).toBeInTheDocument();
  });
});
