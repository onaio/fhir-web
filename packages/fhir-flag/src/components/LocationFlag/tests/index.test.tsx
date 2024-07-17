import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import {
  screen,
  render,
  cleanup,
  waitForElementToBeRemoved,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';

import { LocationFlag, LocationFlagProps } from '..';
import { spCheckFlag, location, encounterBodyLocationFlag } from './fixtures';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import {
  EncounterResourceType,
  FlagResourceType,
  ObservationResourceType,
  locationResourceType,
} from '@opensrp/fhir-helpers';
import userEvents from '@testing-library/user-event';
import { status } from '../../../constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const fhirBaseURL = 'http://test.server.org';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
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
      {
        api_token: 'hunter2',
        oAuth2Data: { access_token: 'sometoken', state: 'abcde' },
        user_id: 'bobbie',
      }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

test('renders correctly and fetches data', async () => {
  const history = createMemoryHistory();
  const scope = nock(fhirBaseURL)
    .get(`/${locationResourceType}/locationId`)
    .reply(200, location)
    .persist();

  const putScope = nock(fhirBaseURL)
    .put(
      `/${EncounterResourceType}/7892014e-56d7-53c1-9df0-b4642dba2486`,
      encounterBodyLocationFlag
    )
    .reply(200, encounterBodyLocationFlag)
    .put(`/${ObservationResourceType}/observationId`)
    .reply(200, location)
    .put(`/${FlagResourceType}/FlagId`)
    .reply(200, location)
    .persist();

  const defaultProps: LocationFlagProps = {
    fhirBaseUrl: fhirBaseURL,
    locationReference: 'Location/locationId',
    flag: spCheckFlag,
    practitionerId: 'practitionerId',
  };
  render(
    <QueryClientProvider client={queryClient}>
      <Router history={history}>
        <LocationFlag {...defaultProps} />
      </Router>
    </QueryClientProvider>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(document.querySelector('form')?.textContent).toMatchInlineSnapshot(
    `"Service PointProductStatusActiveCommentsSave"`
  );

  const commentField = screen.getByLabelText('Comments');
  userEvents.type(commentField, 'Some comments here');

  const statusSelectField = document.querySelector(`input#${status}`) as HTMLElement;
  fireEvent.mouseDown(statusSelectField);

  fireEvent.click(document.querySelector(`[title="Inactive"]`) as HTMLElement);

  const submitBtn = screen.getByRole('button', {
    name: /Save/i,
  });

  act(() => {
    fireEvent.click(submitBtn);
  });
  expect(scope.isDone()).toBeTruthy();
  waitFor(() => {
    expect(putScope.isDone()).toBeTruthy();
  });
});
