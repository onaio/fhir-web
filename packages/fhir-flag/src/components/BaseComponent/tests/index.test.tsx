import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router';
import { screen, render, waitForElementToBeRemoved } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider } from 'react-redux';
import { CloseFlag } from '..';
import flushPromises from 'flush-promises';
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';
import { flag } from '../../Utils/tests/fixtures';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn().mockReturnValue({ id: 'flagId' }),
}));

const mockFlag: IFlag = flag;

const mockPractitioner: IPractitioner = {
  resourceType: 'Practitioner',
  id: 'practitionerId',
};

const mockBundle: IBundle = {
  resourceType: 'Bundle',
  entry: [{ resource: mockPractitioner }],
};

const fhirBaseURL = 'http://test.server.org';

jest.mock('@opensrp/react-utils', () => ({
  ...jest.requireActual('@opensrp/react-utils'),
  FHIRServiceClass: jest.fn().mockImplementation(() => ({
    read: jest.fn().mockResolvedValue(mockFlag),
    list: jest.fn().mockResolvedValue(mockBundle),
  })),
}));

const AppWrapper = (props) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RoleContext.Provider value={superUserRole}>
        <Router history={props.history}>
          <Route exact path="/close-flag/:id">
            <CloseFlag {...props} />
          </Route>
        </Router>
      </RoleContext.Provider>
    </QueryClientProvider>
  </Provider>
);

describe('CloseFlag component', () => {
  const history = createMemoryHistory();
  history.push('/close-flag/flagId');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and fetches data', async () => {
    render(<AppWrapper fhirBaseURL={fhirBaseURL} history={history} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    await flushPromises();

    /** mocked flag is product based
     * Assertions confirm that the "Missing location" message is displayed
     * within the ProductFlag child component.
     */

    const resultTitle = screen.getByText('Invalid Flag').closest('.ant-result-title');
    const resultSubtitle = screen
      .getByText(/Missing location field/i)
      .closest('.ant-result-subtitle');

    expect(resultTitle).toBeInTheDocument();
    expect(resultSubtitle).toBeInTheDocument();
  });
});
