import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import React from 'react';
import { Router } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { ViewDetails } from '..';
import { careTeam2, careTeamWithIncluded } from './fixtures';
import { createBrowserHistory } from 'history';
import { createTestQueryClient } from '../../ListView/tests/utils';
import nock from 'nock';
import { cleanup, fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import { careTeamResourceType } from '../../../constants';

const history = createBrowserHistory();

const testQueryClient = createTestQueryClient();

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const props = {
  fhirBaseURL: 'http://test.server.org',
  careTeamId: '131411',
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
    <Router history={history}>
      <QueryClientProvider client={testQueryClient}>
        <ViewDetails {...props} />
      </QueryClientProvider>
    </Router>
  );
};

test('works correctly', async () => {
  nock(props.fhirBaseURL)
    .get(`/${careTeamResourceType}/_search`)
    .query({ _id: '131411', _include: 'CareTeam:*' })
    .reply(200, careTeamWithIncluded);

  const { queryByText } = render(<AppWrapper {...props}></AppWrapper>);
  await waitForElementToBeRemoved(queryByText(/Fetching Care team/i));

  // see view details contents
  const keyValuePairs = document.querySelectorAll(
    'div[data-testid="key-value"] .singleKeyValue-pair'
  );
  keyValuePairs.forEach((pair) => {
    expect(pair).toMatchSnapshot();
  });

  expect(nock.pendingMocks()).toEqual([]);
});

test('Closes on clicking cancel (X) ', async () => {
  const localProps = {
    ...props,
    careTeamId: '142534',
  };

  nock(props.fhirBaseURL)
    .get(`/${careTeamResourceType}/_search`)
    .query({ _id: localProps.careTeamId, _include: 'CareTeam:*' })
    .reply(200, careTeam2);

  const { queryByText } = render(<AppWrapper {...localProps}></AppWrapper>);
  await waitForElementToBeRemoved(queryByText(/Fetching Care team/i));

  // see view details contents
  const keyValuePairs = document.querySelectorAll(
    'div[data-testid="key-value"] .singleKeyValue-pair'
  );
  keyValuePairs.forEach((pair) => {
    expect(pair).toMatchSnapshot();
  });

  // simulate clicking on close button
  const button = document.querySelector('.flex-right button');
  fireEvent.click(button);

  expect(history.location.pathname).toEqual('/admin/CareTeams');
});

test('shows broken page if fhir api is down', async () => {
  nock(props.fhirBaseURL)
    .get(`/${careTeamResourceType}/_search`)
    .query({ _id: props.careTeamId, _include: 'CareTeam:*' })
    .replyWithError('coughid');

  const { getByText, queryByText } = render(<AppWrapper {...props}></AppWrapper>);
  await waitForElementToBeRemoved(queryByText(/Fetching Care team/i));

  expect(getByText(/coughid/)).toBeInTheDocument();
});
