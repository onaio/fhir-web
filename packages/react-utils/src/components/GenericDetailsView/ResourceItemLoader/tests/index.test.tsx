import React from 'react';
import { Provider } from 'react-redux';
import { ResourceItemLoader } from '..';
import * as reactQuery from 'react-query';
import { store } from '@opensrp/store';
import { patientResourceDetails } from '../../PopulatedResourceDetails/tests/fixtures';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import { FHIRServiceClass } from '../../../../helpers/dataLoaders';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';

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
        <ResourceItemLoader<IPatient> {...props} />
      </QueryClientProvider>
    </Provider>
  );
};

const { id, resourceType } = patientResourceDetails;
const fhirBaseURL = 'http://test.server.org';

const props = {
  resourceQueryParams: {
    queryKey: [resourceType, id],
    queryFn: async () => new FHIRServiceClass<IPatient>(fhirBaseURL, resourceType).read(id),
  },
  itemGetter: (data: IPatient) => data.birthDate,
};

it('renders correctly', async () => {
  nock(fhirBaseURL).get(`/Patient/${id}`).reply(200, patientResourceDetails);
  render(<AppWrapper {...props}></AppWrapper>);

  await waitForElementToBeRemoved(document.querySelector('.custom-spinner'));
  expect(document.querySelector('body')?.innerHTML).toEqual(
    `<div>${patientResourceDetails.birthDate}</div>`
  );
});

it('shows null on error', async () => {
  nock(fhirBaseURL).get(`/Patient/${id}`).replyWithError({
    message: 'something awful happened',
    code: 'AWFUL_ERROR',
  });
  render(<AppWrapper {...props}></AppWrapper>);

  await waitForElementToBeRemoved(document.querySelector('.custom-spinner'));

  expect(document.querySelector('body')?.innerHTML).toEqual('<div></div>');
});
