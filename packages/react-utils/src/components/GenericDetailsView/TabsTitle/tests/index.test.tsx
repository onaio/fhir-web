import React from 'react';
import { Provider } from 'react-redux';
import { TabsTitle } from '..';
import * as reactQuery from 'react-query';
import { store } from '@opensrp/store';
import { patientResourceDetails } from '../../PopulatedResourceDetails/tests/fixtures';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import { resourceEntriesCount } from './fixtures';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

afterEach(() => {
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

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TabsTitle {...props} />
      </QueryClientProvider>
    </Provider>
  );
};

const { id, resourceType } = patientResourceDetails;
const fhirBaseURL = 'http://test.server.org';

const props = {
  title: 'Test',
  fhirBaseURL,
  resourceType: resourceType,
  resourceFilters: { 'subject:Patient': id },
};

it('renders correctly', async () => {
  nock(props.fhirBaseURL)
    .get(`/Patient/_search`)
    .query({ _summary: 'count', 'subject:Patient': id })
    .reply(200, resourceEntriesCount);
  render(<AppWrapper {...props}></AppWrapper>);

  await waitForElementToBeRemoved(document.querySelector('.custom-spinner'));
  expect(document.querySelector('body')?.textContent).toEqual(
    `${props.title} ${resourceEntriesCount.total}`
  );
});

it('shows title only on error', async () => {
  nock(props.fhirBaseURL)
    .get(`/Condition/_search`)
    .query({ _summary: 'count', 'subject:Patient': id })
    .replyWithError({
      message: 'something awful happened',
      code: 'AWFUL_ERROR',
    });
  render(<AppWrapper {...props}></AppWrapper>);

  await waitForElementToBeRemoved(document.querySelector('.custom-spinner'));

  expect(document.querySelector('body')?.textContent).toEqual(`${props.title}`);
});
