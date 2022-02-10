import { NewEditLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { locationHierarchyResourceType } from '../../../constants';
import { fhirHierarchy } from '../../../ducks/tests/fixtures';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createdLocation1 } from '../../LocationForm/tests/fixtures';
import { render, screen } from '@testing-library/react';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

nock.disableNetConnect();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
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
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/add">
            <NewEditLocationUnit {...props} />
          </Route>
          <Route exact path="/add/:id">
            <NewEditLocationUnit {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

test('renders correctly for new locations', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ identifier: props.fhirRootLocationIdentifier })
    .reply(200, fhirHierarchy);

  nock(props.fhirBaseURL).get('/Location/someId').reply(200, createdLocation1);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(document.querySelector('title')).toMatchInlineSnapshot(`
    <title>
      Add Location Unit
    </title>
  `);

  // some small but incoclusive proof that the form rendered
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
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(document.querySelector('title')).toMatchInlineSnapshot(`
    <title>
      Edit &gt; area51
    </title>
  `);

  // some small but incoclusive proof that the form rendered and has some initial values
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/alias/i)).toMatchSnapshot('alias field');
});
