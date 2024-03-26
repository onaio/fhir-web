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
  waitFor,
} from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { fhirHierarchy, onaOfficeSubLocation } from '../../../ducks/tests/fixtures';
import { Provider } from 'react-redux';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';
import { locationHierarchyResourceType } from '../../../constants';
import { locationResourceType } from '../../../constants';
import userEvent from '@testing-library/user-event';
import { rootlocationFixture } from '../../RootLocationWizard/tests/fixtures';
import * as notifications from '@opensrp/notifications';

const history = createBrowserHistory();

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const props = {
  fhirRootLocationId: 'eff94f33-c356-4634-8795-d52340706ba9',
  fhirBaseURL: 'http://test.server.org',
};

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.setTimeout(10000);

nock.disableNetConnect();

describe('location-management/src/components/LocationUnitList', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // react-query will retry failed request, this can cause some weird
        // behavior when testing a rejected request
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
              <LocationUnitList {...props} />
            </QueryClientProvider>
          </Router>
        </RoleContext.Provider>
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    nock.cleanAll();
    cleanup();
  });

  it('shows broken page', async () => {
    nock(props.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ _id: props.fhirRootLocationId })
      .replyWithError({
        message: 'something awful happened',
        code: 'AWFUL_ERROR',
      });

    nock(props.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ _id: 'missing' })
      .reply(200, {});

    const { rerender } = render(<AppWrapper {...props} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/reason: something awful happened/)).toBeInTheDocument();

    rerender(<AppWrapper {...{ ...props, fhirRootLocationId: 'missing' }} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, the resource you requested for, does not exist/)
    ).toBeInTheDocument();
  });

  it('works correctly', async () => {
    nock(props.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ _id: props.fhirRootLocationId })
      .reply(200, fhirHierarchy)
      .persist();

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
    screen.getByText('View details');

    // lets expand on tree search and select a node
    const antTree = document.querySelector('.ant-tree-list');
    const firstDownCaret = antTree.querySelector('.anticon-caret-down');
    fireEvent.click(firstDownCaret);

    // tree title visible now - represents nested nodes that are now visible
    document.querySelectorAll('.ant-tree-title').forEach((nodeTitle) => {
      expect(nodeTitle).toMatchSnapshot('visible nodes on expand');
    });

    const lastTextNode = screen.getByText('Part Of Sub Location');
    fireEvent.click(lastTextNode);

    // tree title visible now - represents nested nodes that are now visible
    document.querySelectorAll('.ant-tree-title').forEach((nodeTitle) => {
      expect(nodeTitle).toMatchSnapshot('visible nodes on expanding part of sub location');
    });

    // table change
    expect(document.querySelectorAll('table tbody tr')).toHaveLength(5);

    // deselect node
    fireEvent.click(screen.getByTitle('Part Of Sub Location'));

    // table change- node deselect
    expect(document.querySelectorAll('table tbody tr')).toHaveLength(1);

    // invalidate queries to initiate a refetch of locationhierarchy
    queryClient.invalidateQueries([locationHierarchyResourceType]).catch((err) => {
      throw err;
    });

    await waitFor(() => {
      expect(screen.getByText(/Refreshing data/i)).toBeInTheDocument();
    });
    await waitForElementToBeRemoved(screen.getByText(/Refreshing data/i));
  });

  it('Passes selected node as the parent location when adding location clicked', async () => {
    nock(props.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ _id: props.fhirRootLocationId })
      .reply(200, fhirHierarchy)
      .persist();

    render(<AppWrapper {...props} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/Location Unit Management/)).toBeInTheDocument();

    // initially show single user defined root location
    const treeSection = document.querySelector('.ant-tree') as HTMLElement;
    const firstRootLoc = within(treeSection).getByTitle(/Ona Office Sub Location/);
    expect(firstRootLoc).toMatchSnapshot('user defined root location');

    // click/select this first root location
    userEvent.click(firstRootLoc);

    // then click add location
    const addLocationBtn = screen.getByText(/Add Location Unit/);
    userEvent.click(addLocationBtn);

    // check where we redirected to
    expect(history.location.search).toEqual('?parentId=Location%2F303');
  });

  it('Root location wizard works correclty', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');

    nock(props.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ _id: props.fhirRootLocationId })
      .reply(404, {
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: 'error',
            code: 'processing',
            diagnostics: `HAPI-2001: Resource Location/${props.fhirRootLocationId} is not known`,
          },
        ],
      });

    nock(props.fhirBaseURL)
      .get(`/${locationResourceType}/_search`)
      .query({ _summary: 'count' })
      .reply(200, { total: 0 })
      .persist();

    nock(props.fhirBaseURL)
      .put(`/Location/${rootlocationFixture.id}`, rootlocationFixture)
      .reply(201, {})
      .persist();

    render(<AppWrapper {...props} />);

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/Location Unit Management/)).toBeInTheDocument();
    expect(screen.getByText(/Root location was not found/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/No locations have been uploaded yet./)).toBeInTheDocument();
    });

    const locationCreate = screen.getByRole('button', { name: 'Create root location.' });

    fireEvent.click(locationCreate);

    expect(screen.getByText(/This action will create a new location with id/)).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', { name: 'Proceed' });

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(notificationSuccessMock).toHaveBeenCalledWith('Root location uploaded to the server.');
    });
  });
});
