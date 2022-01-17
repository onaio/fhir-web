import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { QuestionnaireList } from '../QuestionnaireList';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Router, Route, Switch } from 'react-router';
import nock from 'nock';
import { questionnairesPage1, questionnairesPage2 } from './fixtures';

jest.unmock('fhirclient');

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
    // eslint-disable-next-line @typescript-eslint/camelcase
    { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App = (props: any) => {
  return (
    <Switch>
      <Route exact path="/questList">
        <QueryClientProvider client={rQClient}>{props.children}</QueryClientProvider>
      </Route>
    </Switch>
  );
};
nock.disableNetConnect();

test('pagination events work correctly', async () => {
  const history = createMemoryHistory();
  history.push('/questList');

  nock(props.fhirBaseURL)
    .get('/Questionnaire/_search')
    .query({
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, questionnairesPage1)
    .persist();

  nock(props.fhirBaseURL)
    .get('/Questionnaire/_search')
    .query({
      _getpagesoffset: 20,
      _count: 20,
    })
    .reply(200, questionnairesPage2)
    .persist();

  render(
    <Router history={history}>
      <App>
        <QuestionnaireList {...props}></QuestionnaireList>
      </App>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByTitle(/Questionnaire list view/)).toBeInTheDocument();

  expect(screen.getByText(/NSW Government My Personal Health Record/)).toBeInTheDocument();
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  fireEvent.click(screen.getByTitle('2'));

  expect(history.location.search).toEqual('?pageSize=20&page=2');

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  expect(screen.getByText(/426/)).toBeInTheDocument();
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 2`);
    });
  });
});
