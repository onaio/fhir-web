import React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Router, Switch } from 'react-router-dom';
import { PatientDetailsOverview } from '..';
import nock from 'nock';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import { Provider } from 'react-redux';
import { LIST_PATIENTS_URL } from '../../../constants';
import { patientResourceDetails } from '../../PatientDetails/tests/fixtures';

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

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

const { id: patientId } = patientResourceDetails;
const props = {
  fhirBaseURL: 'http://test.server.org',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path={`${LIST_PATIENTS_URL}`}>
            {(routeProps) => <PatientDetailsOverview {...{ ...props, ...routeProps }} />}
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

it('renders error state when an error occurs', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}?viewDetails=${patientId}`);
  nock(props.fhirBaseURL).get(`/Patient/${patientId}`).replyWithError('Error fetching data');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-alert-content'));
  expect(screen.getByText(/error fetching data/i)).toBeInTheDocument();
});

it('renders patient details when data is fetched successfully', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}?viewDetails=${patientId}`);
  nock(props.fhirBaseURL).get(`/Patient/${patientId}`).reply(200, patientResourceDetails);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-alert-content'));
  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual([
    'UUID',
    'Phone+254722123456',
    'Address213,One Pademore',
    'Date of birth1988-08-04',
    'MRNUnknown',
    'CountryKenya',
  ]);

  const headerLeftElementValues = document.querySelector('.header-bottom');
  expect(headerLeftElementValues?.textContent).toEqual('ID: 1Gender: male');
  expect(history.location.search).toEqual(`?viewDetails=${patientId}`);

  const closeBtn = screen.findByTestId('cancel');
  fireEvent.click(await closeBtn);
  expect(history.location.pathname).toEqual(LIST_PATIENTS_URL);
  expect(history.location.search).toEqual('');
});

it('Navigate to details page', async () => {
  const history = createMemoryHistory();
  history.push(`${LIST_PATIENTS_URL}?viewDetails=${patientId}`);
  nock(props.fhirBaseURL).get(`/Patient/${patientId}`).reply(200, patientResourceDetails);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-alert-content'));
  const FullDetailsLink = screen.findByRole('link', { name: 'View full details' });
  fireEvent.click(await FullDetailsLink);
  expect(history.location.pathname).toEqual(`${LIST_PATIENTS_URL}/${patientId}`);
});

it('renders null when patient Id not found', async () => {
  const history = createMemoryHistory();
  history.push(LIST_PATIENTS_URL);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  expect(document.querySelector('body')).toMatchInlineSnapshot(`
    <body>
      <div />
    </body>
  `);
});
