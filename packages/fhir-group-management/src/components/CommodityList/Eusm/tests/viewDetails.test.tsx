import { EusmViewDetails } from '../ViewDetails';
import React from 'react';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, render, screen } from '@testing-library/react';
import { binaryResourceType, groupResourceType } from '../../../../constants';
import { firstTwentyEusmCommodities } from './fixtures';
import { cloneDeep } from 'lodash';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
  },
});

const props = {
  fhirBaseURL: 'http://test.server.org',
  resourceId: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
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
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <EusmViewDetails {...props} />
      </QueryClientProvider>
    </Provider>
  );
};

test('test error on commodity request', async () => {
  nock(props.fhirBaseURL).get(`/${groupResourceType}/52cffa51-fa81-49aa-9944-5b45d9e4c117`).replyWithError('coughid');

  render(<AppWrapper {...props}></AppWrapper>);

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/coughid/)).toBeInTheDocument();

  expect(nock.isDone()).toBeTruthy();
});

test('test error on attached binary request', async () => {
  nock(props.fhirBaseURL).get(`/${groupResourceType}/52cffa51-fa81-49aa-9944-5b45d9e4c117`).reply(200, firstTwentyEusmCommodities.entry[0].resource);

  nock(props.fhirBaseURL).get(`/${binaryResourceType}/24d55827-fbd8-4b86-a47a-2f5b4598c515`).replyWithError("coughId")

  render(<AppWrapper {...props}></AppWrapper>);

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const commodityValues = [...document.querySelectorAll(".singleKeyValue-pair")].map(keyValue => keyValue.textContent)
  expect(commodityValues).toEqual(["Product Id52cffa51-fa81-49aa-9944-5b45d9e4c117", "NameBed nets", "ActiveActive", "Is it thereyes", "Is it in good conditionYes, no tears, and inocuated", "Is it being used appropriatelyHanged at correct height and covers averagely sized beds", "accountability period(in months)12"]
  );

  // image section
  screen.getByTestId("fallback-img")

  expect(nock.isDone()).toBeTruthy();
});

test('test missing binary in commodity', async () => {
  const groupResource = cloneDeep(firstTwentyEusmCommodities.entry[0].resource)
  // remove image characteristic
  groupResource.characteristic = groupResource.characteristic.splice(0, groupResource.characteristic.length - 1)
  nock(props.fhirBaseURL).get(`/${groupResourceType}/52cffa51-fa81-49aa-9944-5b45d9e4c117`).reply(200, groupResource);

  render(<AppWrapper {...props}></AppWrapper>);

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const commodityValues = [...document.querySelectorAll(".singleKeyValue-pair")].map(keyValue => keyValue.textContent)
  expect(commodityValues).toEqual(["Product Id52cffa51-fa81-49aa-9944-5b45d9e4c117", "NameBed nets", "ActiveActive", "Is it thereyes", "Is it in good conditionYes, no tears, and inocuated", "Is it being used appropriatelyHanged at correct height and covers averagely sized beds", "accountability period(in months)12"]
  );

  // image section
  screen.getByTestId("fallback-img")


  expect(nock.isDone()).toBeTruthy();
});