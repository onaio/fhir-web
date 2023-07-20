import React from 'react';
import { Provider } from 'react-redux';
import { PatientDetails } from '..';
import { Route, Router, Switch } from 'react-router';
import * as reactQuery from 'react-query';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { patientDetails } from './fixtures';
import { LIST_PATIENTS_URL } from '../../../constants';
import {
  cleanup,
  screen,
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const props = {
  fhirBaseURL: 'http://test.server.org',
};

describe('Patients list view', () => {
  beforeAll(() => {
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
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    cleanup();
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AppWrapper = (props: any) => {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route exact path={`${LIST_PATIENTS_URL}/:id`}>
              {(routeProps) => <PatientDetails {...{ ...props, ...routeProps }} />}
            </Route>
          </Switch>
        </QueryClientProvider>
      </Provider>
    );
  };

  it('renders correctly', async () => {
    const history = createMemoryHistory();
    history.push(`${LIST_PATIENTS_URL}/${patientDetails.id}`);

    nock(props.fhirBaseURL)
      .get(`/Patient/${patientDetails.id}/$everything`)
      .query({ _count: 1000 })
      .reply(200, patientDetails);

    render(
      <Router history={history}>
        <AppWrapper {...props}></AppWrapper>
      </Router>
    );

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    document.querySelectorAll('.patient-detail__key-value').forEach((keyValue) => {
      expect(keyValue).toMatchSnapshot('Patient key value details');
    });

    // click on documentReference button
    const docReferenceBtn = document.querySelector('li#DocumentReference');
    fireEvent.click(docReferenceBtn);

    const firstAndOnlyReference = screen.getByText(/^1015$/);
    expect(firstAndOnlyReference).toMatchSnapshot('reference collapse item');
    fireEvent.click(firstAndOnlyReference);

    const docReferenceValues = document.querySelectorAll('.fhir-ui__Value');
    expect(docReferenceValues).toHaveLength(1);
    docReferenceValues.forEach((reference) => {
      expect(reference).toMatchSnapshot('Doc reference values');
    });

    // click on immunizationRecommendation button
    const immunizationRecommendationBtn = document.querySelector('li#ImmunizationRecommendation');
    fireEvent.click(immunizationRecommendationBtn);

    document.querySelectorAll('tr').forEach((tr, idx) => {
      tr.querySelectorAll('td').forEach((td) => {
        expect(td).toMatchSnapshot(`table row ${idx} page 1`);
      });
    });

    // see sort direction in Observations.
    const observationMenuItem = document.querySelector('li#Observation');
    fireEvent.click(observationMenuItem);

    // generally see the table view
    document.querySelectorAll('table tr').forEach((tr) => {
      const tdsText = Array.from(tr.querySelectorAll('td'))
        .map((td) => td.textContent)
        .join(' | ');
      expect(tdsText).toMatchSnapshot('Observation table row');
    });

    // unsorted state. Observation Issue Date
    const unsorted = Array.from(document.querySelectorAll('table tr td:nth-child(4)')).map(
      (td) => td.textContent
    );
    expect(unsorted).toEqual(['4/16/2018', '4/11/2016', '3/29/2010', '4/7/2014', '4/2/2012']);

    const sortCaret = document.querySelector('.anticon-caret-up');
    fireEvent.click(sortCaret);

    const sorted = Array.from(document.querySelectorAll('table tr td:last-of-type')).map(
      (td) => td.textContent
    );
    // there are 192 observations, table only shows the first 5.
    expect(sorted).toEqual(['3/29/2010', '3/29/2010', '3/29/2010', '3/29/2010', '3/29/2010']);

    expect(nock.isDone()).toBeTruthy();
  });

  it('shows broken page if fhir api is down', async () => {
    const history = createMemoryHistory();
    history.push(`${LIST_PATIENTS_URL}/${patientDetails.id}`);

    nock(props.fhirBaseURL)
      .get(`/Patient/${patientDetails.id}/$everything`)
      .query({ _count: 1000 })
      .replyWithError('Something went wrong');

    render(
      <Router history={history}>
        <AppWrapper {...props}></AppWrapper>
      </Router>
    );

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

    expect(screen.getByText(/There was a problem fetching the patient/)).toBeInTheDocument();
  });
});
