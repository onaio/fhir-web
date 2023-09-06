import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { QuestionnaireResponseList } from '..';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Router, Route, Switch } from 'react-router';
import nock from 'nock';
import { questionnairesPage1, questRespPage1, questRespPage2 } from '../../tests/fixtures';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const props = {
  fhirBaseURL: 'http://example.com',
};

const rQClient = new QueryClient();

// TODO - boiler plate
store.dispatch(
  authenticateUser(
    true,
    {
      email: 'bob@example.com',
      name: 'Bobbie',
      username: 'RobertBaratheon',
    },
    { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App = (props: any) => {
  return (
    <Switch>
      <Route exact path="/qr/:id">
        <QueryClientProvider client={rQClient}>{props.children}</QueryClientProvider>
      </Route>
    </Switch>
  );
};
nock.disableNetConnect();

test('pagination events work correctly', async () => {
  const history = createMemoryHistory();
  history.push('/qr/214');

  nock(props.fhirBaseURL)
    .get('/Questionnaire/214')
    .reply(200, questionnairesPage1.entry[0])
    .persist();

  nock(props.fhirBaseURL)
    .get('/QuestionnaireResponse/_search')
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
      questionnaire: '214',
    })
    .reply(200, questRespPage1)
    .persist();

  nock(props.fhirBaseURL)
    .get('/QuestionnaireResponse/_search')
    .query({
      _total: 'accurate',
      _getpagesoffset: 20,
      _count: 20,
      questionnaire: '214',
    })
    .reply(200, questRespPage2)
    .persist();
  nock(props.fhirBaseURL)
    .get('/QuestionnaireResponse/_search')
    .query({ _total: 'accurate', _getpagesoffset: 40, _count: 20, questionnaire: '214' })
    .reply(200, [])
    .persist();

  render(
    <Router history={history}>
      <App>
        <QuestionnaireResponseList {...props}></QuestionnaireResponseList>
      </App>
    </Router>
  );

  const waitForSpinner = async () => {
    return await waitFor(() => {
      expect(document.querySelector('.ant-spin')).not.toBeInTheDocument();
    });
  };

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  await waitFor(() => {
    expect(screen.getByText(/d8eb71c1-085d-4667-8fe1-b64ad1c6dd77/)).toBeInTheDocument();
  });

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  fireEvent.click(screen.getByTitle('2'));

  expect(history.location.search).toEqual('?pageSize=20&page=2');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/8d8d0c07-c2bf-4e5a-9cb3-6c264c3e58dd/)).toBeInTheDocument();
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 2`);
    });
  });
});
