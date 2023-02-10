import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import * as reactQuery from 'react-query';
import { FhirSelect } from '../index';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import nock from 'nock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { organizationsPage1, organizationsPage1Summary, organizationsPage2 } from './fixtures';
import flushPromises from 'flush-promises';

const organizationResourceType = 'Organization';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
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

export const QueryWrapper = ({ children }: { children: JSX.Element }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

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
  jest.resetAllMocks();
});

const commonProps = {
  baseUrl: 'https://sample.com',
  resourceType: organizationResourceType,
  filterPageSize: 5,
  transformOption: (resource: IOrganization) => {
    const { name } = resource;
    const id = resource.id as string;
    return {
      label: name ?? id,
      value: id,
      ref: resource,
    };
  },
};

test('works correctly nominal case', async () => {
  nock(commonProps.baseUrl)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '5' })
    .reply(200, organizationsPage1);

  nock(commonProps.baseUrl)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '5', _summary: 'count' })
    .reply(200, organizationsPage1Summary);

  const changeMock = jest.fn();
  const fullOptionHandlerMock = jest.fn();

  const props = {
    ...commonProps,
    onChange: changeMock,
    getFullOptionOnChange: fullOptionHandlerMock,
  };

  const { queryByText, getByRole, getByTitle } = render(
    <QueryWrapper>
      <FhirSelect<IOrganization> {...props}></FhirSelect>
    </QueryWrapper>
  );

  await waitForElementToBeRemoved(document.querySelector('.anticon-spin'));

  // click on input. - should see the first 5 records by default
  const input = document.querySelector('.ant-select-selector') as Element;

  // simulate click on select - to show dropdown items
  fireEvent.mouseDown(input);

  // find antd select options
  let selectOptions = document.querySelectorAll('.ant-select-item-option-content');

  await flushPromises();
  // expect all practitioners (except inactive ones)
  expect([...selectOptions].map((opt) => opt.textContent)).toStrictEqual([
    '高雄榮民總醫院',
    'Blok Operacyjny Chirurgii Naczyń',
    'Volunteer virtual hospital 志工虛擬醫院',
    'Volunteer virtual hospital 志工虛擬醫院',
    'Volunteer virtual hospital 志工虛擬醫院',
  ]);

  // how many records
  let recordsText = queryByText(/Showing\s*5\s*\s*;\s*5\s*more records/);
  expect(recordsText).toBeInTheDocument();

  // load more button
  let loadMoreButton = getByRole('button', { name: 'plus Load more options' });
  expect(loadMoreButton).toBeInTheDocument();

  // load more data.
  nock(commonProps.baseUrl)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '5', _count: '5' })
    .reply(200, organizationsPage2);

  nock(commonProps.baseUrl)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '5', _count: '5', _summary: 'count' })
    .reply(200, organizationsPage1Summary);

  fireEvent.click(loadMoreButton);

  await waitFor(() => {
    expect(queryByText(/Fetching next page/)).toBeInTheDocument();
  });

  loadMoreButton = getByRole('button', { name: /Fetching next page/ });
  expect(loadMoreButton).toHaveAttribute('disabled', '');

  await waitFor(() => {
    expect(queryByText(/Fetching next page/)).not.toBeInTheDocument();
  });

  //find antd select options
  selectOptions = document.querySelectorAll('.ant-select-item-option-content');

  // expect all practitioners (except inactive ones)
  expect([...selectOptions].map((opt) => opt.textContent)).toStrictEqual([
    '高雄榮民總醫院',
    'Blok Operacyjny Chirurgii Naczyń',
    'Volunteer virtual hospital 志工虛擬醫院',
    'Volunteer virtual hospital 志工虛擬醫院',
    'Volunteer virtual hospital 志工虛擬醫院',
    'Test',
    'Hospital Krel Tarron',
    'clinFHIR Sample creator',
    'Health Level Seven International',
    'Health Level Seven International',
  ]);

  // how many records
  recordsText = queryByText(/Showing\s*10\s*\s*;\s*0\s*more records/);
  expect(recordsText).toBeInTheDocument();

  loadMoreButton = getByRole('button', { name: 'plus Load more options' });
  expect(loadMoreButton).toHaveAttribute('disabled', '');

  // search and then select.
  // userEvent.type(input.querySelector('input') as Element, 'test');

  fireEvent.click(getByTitle('Hospital Krel Tarron') as Element);

  const tarronHospitalId = '30099';
  const tarronHospital = {
    label: 'Hospital Krel Tarron',
    ref: {
      active: true,
      id: '30099',
      meta: {
        lastUpdated: '2019-09-26T13:14:11.303+00:00',
        source: '#20dc8ea0e407f070',
        versionId: '1',
      },
      name: 'Hospital Krel Tarron',
      resourceType: 'Organization',
    },
    value: '30099',
  };

  expect(changeMock).toHaveBeenCalledWith(tarronHospitalId, tarronHospital);
  expect(fullOptionHandlerMock).toHaveBeenCalledWith(tarronHospital);
});

test('handles error in request', async () => {
  nock(commonProps.baseUrl)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '5' })
    .reply(200, organizationsPage1);

  const errorMessage = 'Ask slowly';

  nock(commonProps.baseUrl)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '5', _summary: 'count' })
    .replyWithError(errorMessage);

  const props = {
    ...commonProps,
  };

  const { queryByText } = render(
    <QueryWrapper>
      <FhirSelect<IOrganization> {...props}></FhirSelect>
    </QueryWrapper>
  );

  await waitForElementToBeRemoved(document.querySelector('.anticon-spin'));

  // click on input. - should see the first 5 records by default
  const input = document.querySelector('.ant-select-selector') as Element;

  // simulate click on select - to show dropdown items
  fireEvent.mouseDown(input);

  expect(queryByText(/Unable to load dropdown options./)).toBeInTheDocument();
});
