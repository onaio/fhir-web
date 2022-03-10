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
import { locationHierarchyResourceType } from '@opensrp/fhir-location-management';
import {
  allAffiliations,
  allOrgs,
  createdAffiliation1,
  createdAffiliation2,
  fhirHierarchy,
} from './fixures';
import { organizationAffiliationResourceType, organizationResourceType } from '../../../constants';
import userEvent from '@testing-library/user-event';

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
  fhirRootLocationIdentifier: 'rootLoc',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/assignments">
            <AffiliationList {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
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
  const history = createMemoryHistory();
  history.push('/assignments');

  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ identifier: props.fhirRootLocationIdentifier })
    .reply(200, fhirHierarchy);

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

  nock(props.fhirBaseURL)
    .post(`/${organizationAffiliationResourceType}`, createdAffiliation1)
    .reply(201, {})
    .put(`/${organizationAffiliationResourceType}/${createdAffiliation2.id}`, createdAffiliation2)
    .reply(201, {});

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
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
  document.querySelectorAll('.ant-select-item-option').forEach((element) => {
    expect(element).toMatchSnapshot('available options');
  });

  // remove one of the selection test Team 3
  const testTeam3Span = screen.getByTitle((content, element) => {
    return content.includes('Test Team 3') && element.tagName === 'SPAN';
  });
  const removeIcon = testTeam3Span.querySelector('.ant-select-selection-item-remove');
  fireEvent.click(removeIcon);

  expect(testTeam3Span).toMatchSnapshot('Test team 3 selected option');

  // select Voidsingers
  fireEvent.click(screen.getByTitle(/Voidsingers/));

  // then try and submit
  const submitBtn = screen.getByTestId('submit-affiliations');
  fireEvent.click(submitBtn);

  await waitFor(() => {
    expect(screen.getByText(/Team assignments updated successfully/)).toBeInTheDocument();
  });

  expect(nock.isDone()).toBeTruthy();
});
