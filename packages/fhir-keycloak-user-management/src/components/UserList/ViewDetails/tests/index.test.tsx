import { ViewDetails } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, render, screen } from '@testing-library/react';
import fetch from 'jest-fetch-mock';

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

  expect(fetch.mock.calls.map((x) => x[0])).toEqual(['http://test-keycloak.server.org/users/405']);

  expect(screen.getByText(/coughid/)).toBeInTheDocument();

  expect(nock.isDone()).toBeTruthy();
});
