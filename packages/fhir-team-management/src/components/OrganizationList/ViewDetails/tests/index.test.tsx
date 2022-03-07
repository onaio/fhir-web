import { ViewDetails } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, render, screen } from '@testing-library/react';
import { organizationResourceType, ORGANIZATION_LIST_URL } from '../../../../constants';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

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
  resourceId: 345,
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

afterAll(() => {
  nock.cleanAll();
  cleanup();
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
  const history = createMemoryHistory();
  history.push(ORGANIZATION_LIST_URL);

  nock(props.fhirBaseURL).get(`/${organizationResourceType}/345`).replyWithError('coughid');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/coughid/)).toBeInTheDocument();
});
