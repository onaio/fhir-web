import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { QuestRForm } from '..';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router, Route, Switch } from 'react-router';
import { createMemoryHistory } from 'history';
import nock from 'nock';
import { openChoiceQuest, openChoiceQuestRes } from './fixtures';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

const qClient = new QueryClient();

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App = (props: any) => {
  return (
    <Switch>
      <Route exact path="/:resourceId/:resourceType">
        <QuestRForm {...props} />
      </Route>
    </Switch>
  );
};

// TODO: boilerplate
store.dispatch(
  authenticateUser(
    true,
    {
      email: 'bob@example.com',
      name: 'Bobbie',
      username: 'RobertBaratheon',
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { api_token: 'hunter2', oAuth2Data: { access_token: 'iLoveOov', state: 'abcde' } }
  )
);

afterEach(() => {
  cleanup();
  nock.cleanAll();
});

test('renders and submits a questionnaire correctly', async () => {
  const history = createMemoryHistory();
  history.push('/123/Questionnaire');
  const props = {
    fhirBaseURL: 'https://test.server.org',
  };

  nock(props.fhirBaseURL).get('/Questionnaire/123').reply(200, openChoiceQuest);
  nock(props.fhirBaseURL).post('/QuestionnaireResponse').reply(200, {});

  render(
    <Router history={history}>
      <QueryClientProvider client={qClient}>
        <App {...props} />
      </QueryClientProvider>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  expect(screen.getByText(/submit/i)).toBeInTheDocument();

  expect(screen.getByText(/What pizza toppings would you like?/i)).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText(/cheese/i));

  fireEvent.click(screen.getByText(/submit$/i));
  await waitFor(() => {
    expect(document.querySelector('.ant-notification')).toBeInTheDocument();
    expect(
      screen.getByText(/Questionnaire Response resource submitted successfully/)
    ).toBeInTheDocument();
  });
});

test('renders and submits a questionnaire response correctly', async () => {
  const history = createMemoryHistory();
  history.push('/321/QuestionnaireResponse');
  const props = {
    fhirBaseURL: 'https://test.server.org',
  };

  nock(props.fhirBaseURL).get('/QuestionnaireResponse/321').reply(200, openChoiceQuestRes);
  nock(props.fhirBaseURL).get('/Questionnaire/123').reply(200, openChoiceQuest);

  render(
    <Router history={history}>
      <QueryClientProvider client={qClient}>
        <App {...props} />
      </QueryClientProvider>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  expect(screen.getByText(/submit$/i)).toBeInTheDocument();
});
