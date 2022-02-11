import React from 'react';
import { store } from '@opensrp/store';
import { LocationUnitList } from '..';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import {
  render,
  cleanup,
  waitForElementToBeRemoved,
  screen,
  within,
  fireEvent,
} from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { fhirHierarchy, onaOfficeSubLocation } from '../../../ducks/tests/fixtures';
import { Provider } from 'react-redux';
import { locationHierarchyResourceType } from '../../../constants';

const history = createBrowserHistory();

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const props = {
  fhirRootLocationIdentifier: 'eff94f33-c356-4634-8795-d52340706ba9',
  fhirBaseURL: 'http://test.server.org',
};

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

nock.disableNetConnect();

describe('location-management/src/components/LocationUnitList', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // react-query will retry failed request, this can cause some weird
        // behavior when testing a rejected request
        retry: false,
      },
    },
  });

  const AppWrapper = (props) => {
    return (
      <Provider store={store}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <LocationUnitList {...props} />
          </QueryClientProvider>
        </Router>
      </Provider>
    );
  };

  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  nock.cleanAll();
  afterEach(() => {
    cleanup();
  });

  it('shows broken page', async () => {
    nock(props.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: props.fhirRootLocationIdentifier })
      .replyWithError({
        message: 'something awful happened',
        code: 'AWFUL_ERROR',
      });

    nock(props.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: 'missing' })
      .reply(200, {});

    const { rerender } = render(<AppWrapper {...props} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/reason: something awful happened/)).toBeInTheDocument();

    rerender(<AppWrapper {...{ ...props, fhirRootLocationIdentifier: 'missing' }} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, the resource you requested for, does not exist/)
    ).toBeInTheDocument();
  });

  it('works correctly', async () => {
    nock(props.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: props.fhirRootLocationIdentifier })
      .reply(200, fhirHierarchy);

    nock(props.fhirBaseURL).get('/Location/303').reply(200, onaOfficeSubLocation);

    render(<AppWrapper {...props} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/Location Unit Management/)).toBeInTheDocument();

    // initially show single user defined root location
    const treeSection = document.querySelector('.ant-tree') as HTMLElement;
    const firstRootLoc = within(treeSection).getByTitle(/Ona Office Sub Location/);
    expect(firstRootLoc).toMatchSnapshot('user defined root location');

    // table row should be one containing information
    const table = document.querySelector('table');
    // how many body rows - should be 1
    expect(table.querySelectorAll('tbody tr')).toHaveLength(1);
    const firstRowTd = table.querySelectorAll('tbody tr:nth-child(1) td');
    firstRowTd.forEach((td) => {
      expect(td).toMatchSnapshot('first row containing ona office loc details');
    });

    // view details
    const hamburger = document.querySelector('.more-options');
    fireEvent.click(hamburger);
    // should see the popup with view details
    expect(document.querySelector('.view-details')).toBeInTheDocument();
    fireEvent.click(document.querySelector('.view-details'));

    // should load single location
    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    // see location details in view details
    const viewDetailsSection = document.querySelector('[data-testid="view-details"]');
    viewDetailsSection.querySelectorAll('[data-testid="single-key-value"]').forEach((keyValue) => {
      expect(keyValue).toMatchSnapshot('key value');
    });

    // close view details section
    fireEvent.click(viewDetailsSection.querySelector('button.float-right'));
    expect(document.querySelector('[data-testid="view-details"]')).not.toBeInTheDocument();
  });
});
