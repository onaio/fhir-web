/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AddEditOrganization } from '..';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import nock from 'nock';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import {
  organizationResourceType,
  practitionerResourceType,
  practitionerRoleResourceType,
} from '../../../constants';
import { allPractitioners, org105 } from '../tests/fixtures';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/add" element={<AddEditOrganization {...props} />} />
          <Route path="/add/:id" element={<AddEditOrganization {...props} />} />
        </Routes>
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

test('renders correctly for new organizations', async () => {
  nock(props.fhirBaseURL).get(`/${practitionerResourceType}/_search`).reply(200, allPractitioners);

  render(
    <Router initialEntries={['/add']}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // some small but incoclusive proof that the form rendered
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/alias/i)).toMatchSnapshot('alias field');
});

test('renders correctly for edit locations', async () => {
  nock(props.fhirBaseURL)
    .get(`/${practitionerResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${practitionerResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, allPractitioners);

  nock(props.fhirBaseURL).get(`/${organizationResourceType}/${org105.id}`).reply(200, org105);

  nock(props.fhirBaseURL)
    .get(`/${practitionerRoleResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, { total: 1000 })
    .get(`/${practitionerRoleResourceType}/_search`)
    .query({ _count: 1000 })
    .reply(200, allPractitioners);
  
  console.log(`${org105.id}`)

  render(
    <Router initialEntries={[`/add/${org105.id}`]}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(nock.pendingMocks()).toEqual([]);

  await waitFor(() => {
    expect(screen.getByText('Edit team | OpenSRP web Test Organisation')).toBeInTheDocument();
  });

  // some small but incoclusive proof that the form rendered and has some initial values
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/alias/i)).toMatchSnapshot('alias field');
});

test('data loading problem', async () => {
  nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/${org105.id}`)
    .replyWithError('something aweful happened');

  render(
    <Router initialEntries={[`/add/${org105.id}`]}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText(/something aweful happened/)).toBeInTheDocument();
});
