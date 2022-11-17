import { ViewDetails } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import { KeycloakUser } from '@opensrp/user-management';
import { practitionerRoleResourceType } from '../../../../constants';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
  },
});

const props = {
  fhirBaseUrl: 'http://test.server.org',
  keycloakBaseUrl: 'http://test-keycloak.server.org',
  resourceId: 405,
};

const keycloakUser = {
  id: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
  username: 'allay_allan',
} as KeycloakUser;

const practitionerRoleBundle = {
  resourceType: 'Bundle',
  entry: [
    {
      resource: {
        resourceType: 'PractitionerRole',
        id: '38f12000-a066-45ef-8668-65d10e295279',
        code: [
          {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '405623001',
                display: 'Assigned practitioner',
              },
            ],
          },
        ],
      },
    },
  ],
};

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

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

afterAll(() => {
  nock.enableNetConnect();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ViewDetails {...props} />
      </QueryClientProvider>
    </Provider>
  );
};

test('responds as expected to errors', async () => {
  const errorMessage = 'coughid';
  fetch.mockReject(new Error(errorMessage));
  render(<AppWrapper {...props}></AppWrapper>);

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(fetch.mock.calls.map((x) => x[0])).toEqual([
    'http://test-keycloak.server.org/users/405',
    'http://test-keycloak.server.org/users/405/groups',
  ]);

  expect(screen.getByText(/coughid/)).toBeInTheDocument();

  expect(nock.isDone()).toBeTruthy();
});

test('shows user type in details', async () => {
  fetch.mockOnce(JSON.stringify(keycloakUser));
  fetch.mockResponseOnce(JSON.stringify([]));

  nock(props.fhirBaseUrl)
    .get(`/${practitionerRoleResourceType}/_search`)
    .query({
      identifier: props.resourceId,
    })
    .reply(200, practitionerRoleBundle);

  const { getByText, getByTestId } = render(<AppWrapper {...props}></AppWrapper>);

  expect(getByTestId('custom-spinner')).toBeInTheDocument();

  await waitFor(() => {
    expect(getByText(/Fetching linked practitionerRole/)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(getByText(/User Type/)).toBeInTheDocument();
    expect(getByTestId('user-type')).toBeInTheDocument();
  });
});
