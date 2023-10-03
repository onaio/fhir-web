import { AffiliationList } from '..';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import nock from 'nock';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import { locationResourceType } from '@opensrp/fhir-location-management';
import { allAffiliations, allOrgs, createdAffiliation1, createdAffiliation2 } from './fixures';
import { organizationAffiliationResourceType, organizationResourceType } from '../../../constants';
import userEvent from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';
import { locationSData } from '@opensrp/fhir-location-management/src/ducks/tests/fixtures';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const mockV4 = '75482e89-40ce-4512-a74a-ccc30aeae073';

jest.mock('uuid', () => {
  const v4 = () => mockV4;
  return {
    _esModule: true,
    ...Object.assign({}, jest.requireActual('uuid')),
    v4,
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const props = {
  fhirBaseURL: 'http://test.server.org',
  fhirRootLocationIdentifier: '2252',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = ({ children }: any) => {
  return (
    <Provider store={store}>
      <RoleContext.Provider value={superUserRole}>
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route exact path="/assignments">
              {children}
            </Route>
          </Switch>
        </QueryClientProvider>
      </RoleContext.Provider>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  nock.cleanAll();
});

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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

test('Edits organization affiliation correctly', async () => {
  // - Simulates conditions where we edit 2 organizationAffiliation like so:
  // - one organization affiliation is modified - starts with mapping an organization to several locations
  // - one organization affiliation is deleted - organization is no longer assigned to any location.

  const successMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => {
      return;
    });
  const history = createMemoryHistory();
  history.push('/assignments');

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 });

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, locationSData)
    .persist();

  nock(props.fhirBaseURL)
    .get(`/${organizationAffiliationResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${organizationAffiliationResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, allAffiliations);

  nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${organizationResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, allOrgs);

  const { unmount } = render(
    <Router history={history}>
      <AppWrapper>
        <AffiliationList {...props} />
      </AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  // now wait for table spinner
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

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

  // open modal to start editing organizations
  // Edit btns could be many but I know for this page the table has only one row with an edit
  const editBtn = screen.getByText('Edit');
  expect(editBtn).toMatchInlineSnapshot(`
    <span>
      Edit
    </span>
  `);
  userEvent.click(editBtn);

  // look for Modal with select
  const selectInModal = screen.getByTestId('affiliation-select');
  selectInModal.querySelectorAll('.ant-select-selection-item-content').forEach((item) => {
    expect(item).toMatchSnapshot('default selected item');
  });

  // should have some options as default
  const input = selectInModal.querySelector('input');
  fireEvent.mouseDown(input);

  // see what org options are listed as available for selection
  const beforeFilterOptions = [...document.querySelectorAll('.ant-select-item-option')].map(
    (element) => {
      return element.textContent;
    }
  );
  expect(beforeFilterOptions).toEqual([
    'Test Team 3',
    'Test Team 4',
    'Test Team 5',
    'Test Team 5',
    'Voidsingers',
  ]);

  // try and filter
  await userEvent.type(input, 'void');
  // see what org options are listed as available for selection
  const afterFilterOptions = [...document.querySelectorAll('.ant-select-item-option')].map(
    (element) => {
      return element.textContent;
    }
  );
  expect(afterFilterOptions).toEqual(['Voidsingers']);

  // util to help remove selected options using the display value
  const removeSelectedOptionWithText = (textContent) => {
    //remove one of the selection test Team 3
    const testTeam3Span = screen.getByTitle((content, element) => {
      return content.includes(textContent) && element.tagName === 'SPAN';
    });
    const removeIcon = testTeam3Span.querySelector('.ant-select-selection-item-remove') as Element;
    fireEvent.click(removeIcon);
  };
  // remove all selected options for ona office sub location
  removeSelectedOptionWithText('Test Team 3');
  removeSelectedOptionWithText('Test Team 4');

  // select Voidsingers
  fireEvent.click(screen.getByTitle(/Voidsingers/));

  // only voidSingers is selected
  const selectedOptions = [...document.querySelectorAll('.ant-select-item-option-selected')].map(
    (option) => option.textContent
  );
  expect(selectedOptions).toEqual(['Voidsingers']);

  // then try and submit

  // nock queries at this point
  nock(props.fhirBaseURL)
    .put(`/${organizationAffiliationResourceType}/75482e89-40ce-4512-a74a-ccc30aeae073`, {
      ...createdAffiliation1,
      id: '75482e89-40ce-4512-a74a-ccc30aeae073',
    })
    .reply(201, {})
    .put(`/${organizationAffiliationResourceType}/${createdAffiliation2.id}`, createdAffiliation2)
    .reply(201, {})
    .delete(`/${organizationAffiliationResourceType}/1575`)
    .reply(200, {});

  // now submit
  const submitBtn = screen.getByTestId('submit-affiliations');
  fireEvent.click(submitBtn);

  await waitFor(() => {
    expect(successMock).toHaveBeenCalledWith('Team assignments updated successfully');
    expect(screen.queryByText(/Assign\/Unassign Teams/i)).not.toBeInTheDocument();
  });

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

  expect(nock.pendingMocks()).toEqual([]);
  expect(nock.isDone()).toBeTruthy();

  await waitFor(() => {
    expect(successMock).toHaveBeenCalledWith('Team assignments updated successfully');
  });

  unmount();
});

test('api error response', async () => {
  const history = createMemoryHistory();
  history.push('/assignments');

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _summary: 'count' })
    .replyWithError('Something awful happened');

  render(
    <Router history={history}>
      <AppWrapper>
        <AffiliationList {...props} />
      </AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // error page
  expect(screen.getByText(/Something awful happened/)).toBeInTheDocument();
});

test('api undefined response', async () => {
  const history = createMemoryHistory();
  history.push('/assignments');

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 });

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, [])
    .persist();

  render(
    <Router history={history}>
      <AppWrapper>
        <AffiliationList {...props} />
      </AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // error page
  expect(
    screen.getByText(/Sorry, the resource you requested for, does not exist/)
  ).toBeInTheDocument();
});
