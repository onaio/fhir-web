import { AllLocationListFlat } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClientProvider, QueryClient } from 'react-query';
import nock from 'nock';
import { render, cleanup, waitForElementToBeRemoved, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { flatLocations } from '../../../ducks/tests/fixtures';
import { Provider } from 'react-redux';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';
import { locationResourceType } from '../../../constants';

const history = createBrowserHistory();

const props = {
  fhirBaseURL: 'http://test.server.org',
};

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.setTimeout(10000);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const AppWrapper = (props) => {
  return (
    <Provider store={store}>
      <RoleContext.Provider value={superUserRole}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>
            <AllLocationListFlat {...props} />
          </QueryClientProvider>
        </Router>
      </RoleContext.Provider>
    </Provider>
  );
};

describe('location-management/src/components/AllLocationListFlat', () => {
  beforeAll(() => {
    nock.disableNetConnect();
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    nock.cleanAll();
    cleanup();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  it('shows broken page', async () => {
    // __summary: 'count'
    nock(props.fhirBaseURL)
      .get(`/${locationResourceType}/_search`)
      .query({
        _total: 'accurate',
        _include: 'Location:partof',
        _getpagesoffset: 0,
        _count: 20,
      })
      .replyWithError({
        message: 'something awful happened',
        code: 'AWFUL_ERROR',
      });

    render(<AppWrapper {...props} />);
    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
    expect(screen.getByText(/failed, reason: something awful happened/)).toBeInTheDocument();
  });

  it('shows no data page', async () => {
    // __summary: 'count'
    nock(props.fhirBaseURL)
      .get(`/${locationResourceType}/_search`)
      .query({
        _total: 'accurate',
        _include: 'Location:partof',
        _getpagesoffset: 0,
        _count: 20,
      })
      .reply(200, { total: 0 });

    render(<AppWrapper {...props} />);
    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
    expect(screen.getByText(/All Locations/)).toBeInTheDocument();
    expect(screen.getByTitle(/Empty raw svg icon/)).toBeInTheDocument();
    expect(
      screen.getByText(/No data available to display, you can start adding data now/)
    ).toBeInTheDocument();
  });

  it('Show data as expected', async () => {
    // __summary: 'count'
    nock(props.fhirBaseURL)
      .get(`/${locationResourceType}/_search`)
      .query({
        _total: 'accurate',
        _include: 'Location:partof',
        _getpagesoffset: 0,
        _count: 20,
      })
      .reply(200, flatLocations);

    render(<AppWrapper {...props} />);
    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
    expect(screen.getByText(/All Locations/)).toBeInTheDocument();

    // check table contnets
    const table = document.querySelector('table');
    // check table headers
    expect(table?.querySelectorAll('thead tr')).toHaveLength(1);
    const header = table?.querySelectorAll('thead tr');
    header?.forEach((td) => {
      expect(td.textContent).toMatchSnapshot('table header');
    });
    // check table body
    expect(table?.querySelectorAll('tbody tr')).toHaveLength(1);
    const firstRowTd = table?.querySelectorAll('tbody tr:nth-child(1) td');
    firstRowTd?.forEach((td) => {
      expect(td.textContent).toMatchSnapshot('table data');
    });
  });
});
