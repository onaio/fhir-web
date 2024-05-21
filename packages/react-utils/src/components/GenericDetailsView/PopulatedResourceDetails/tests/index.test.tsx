import React from 'react';
import { Provider } from 'react-redux';
import { PopulatedResourceDetails } from '..';
import { Router } from 'react-router';
import * as reactQuery from 'react-query';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { patientResourceDetails } from './fixtures';
import { screen, render, waitForElementToBeRemoved } from '@testing-library/react';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import { FHIRServiceClass } from '../../../../helpers/dataLoaders';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { TFunction } from '@opensrp/i18n';

const history = createMemoryHistory();
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
        <PopulatedResourceDetails<IPatient> {...props} />
      </QueryClientProvider>
    </Provider>
  );
};

const { id, resourceType } = patientResourceDetails;
const fhirBaseURL = 'http://test.server.org';
const resourceDetailsPropsGetter = (data: IPatient, t: TFunction) => {
  const { meta, identifier, birthDate, active } = data;
  return {
    title: 'Test Name',
    headerRightData: { [t('Date created')]: meta?.lastUpdated },
    headerLeftData: { [t('ID')]: id },
    bodyData: { [t('UUID')]: identifier?.[0]?.value, [t('Date of birth')]: birthDate },
    status: {
      title: active,
      color: 'green',
    },
  };
};
const props = {
  resourceQueryParams: {
    queryKey: [resourceType, id],
    queryFn: async () => new FHIRServiceClass<IPatient>(fhirBaseURL, resourceType).read(id),
  },
  resourceDetailsPropsGetter,
};

it('renders correctly', async () => {
  nock(fhirBaseURL).get(`/Patient/${id}`).reply(200, patientResourceDetails);
  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual(['UUID', 'Date of birth1988-08-04']);

  const headerRightData = [...document.querySelectorAll('.singleKeyValue-pair__light')].map(
    (keyValue) => keyValue.textContent
  );
  expect(headerRightData).toEqual(['Date created2021-03-10T13:27:48.632+00:00']);

  const headerLeftElementValues = document.querySelector('.header-bottom');
  expect(headerLeftElementValues?.textContent).toEqual(
    'ID: 1Date created2021-03-10T13:27:48.632+00:00'
  );
});

it('shows broken page on error', async () => {
  nock(fhirBaseURL).get(`/Patient/${id}`).replyWithError({
    message: 'something awful happened',
    code: 'AWFUL_ERROR',
  });
  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.custom-spinner'));

  expect(screen.getByText(/something awful happened/)).toBeInTheDocument();
});
