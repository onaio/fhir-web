import { NewEditLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, MemoryRouter as Router, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { locationHierarchyResourceType } from '../../../constants';
import { fhirHierarchy } from '../../../ducks/tests/fixtures';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createdLocation1 } from '../../LocationForm/tests/fixtures';
import { cleanup, prettyDOM, render, screen, waitFor } from '@testing-library/react';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    companyId: 'company-id1',
    teamId: 'team-id1',
  }),
  // useRouteMatch: () => ({ url: '/company/company-id1/team/team-id1' }),
}));

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
  fhirRootLocationIdentifier: 'someId',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    // <Provider store={store}>
      <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/add" element={<NewEditLocationUnit {...props } />} />
            <Route path="/add/:id" element={<NewEditLocationUnit {...props } />} />
          </Routes>
      </QueryClientProvider>
    // </Provider>
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

test('renders correctly for new locations', async () => {
  const cancelUrlGenerator = '/cancelled';

  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ identifier: props.fhirRootLocationIdentifier })
    .reply(200, fhirHierarchy);

  console.log({ fhirHierarchy })

  nock(props.fhirBaseURL).get('/Location/someId').reply(200, createdLocation1);
  console.log({ createdLocation1 })


  render(
    <Router initialEntries={['/add']}>
    <AppWrapper cancelUrlGenerator={cancelUrlGenerator} {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  await waitFor(() => {
    expect(screen.getByText('Add Location Unit')).toBeInTheDocument();
  });

  // some small but inconclusive proof that the form rendered
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/alias/i)).toMatchSnapshot('alias field');
});

test('renders correctly for edit locations', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${createdLocation1.partOf.identifier}?parentId=Location/303`);

  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ identifier: props.fhirRootLocationIdentifier })
    .reply(200, fhirHierarchy);

  nock(props.fhirBaseURL)
    .get(`/Location/${createdLocation1.partOf.identifier}`)
    .reply(200, createdLocation1);

  render(
    <Router initialEntries={[`/add/${createdLocation1.partOf.identifier}?parentId=Location/303`]}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // some small but inconclusive proof that the form rendered and has some initial values
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/alias/i)).toMatchSnapshot('alias field');
});

test('data loading problem', async () => {
  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ identifier: props.fhirRootLocationIdentifier })
    .replyWithError('something aweful happened');

  nock(props.fhirBaseURL).get('/Location/someId').replyWithError('Throw in the towel, as well');

  render(
    <Router initialEntries={['/add']}>
      <AppWrapper {...props} />
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText('Unable to load the location or location hierarchy')).toBeInTheDocument();
});

test('data loading but undefined', async () => {
  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ identifier: props.fhirRootLocationIdentifier })
    .reply(200, null);

  nock(props.fhirBaseURL).get('/Location/someId').reply(200, null);

  render(
    <Router initialEntries={['/add']}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText('Unable to load the location or location hierarchy')).toBeInTheDocument();
});
