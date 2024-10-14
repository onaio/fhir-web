import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import * as reactQuery from 'react-query';
import { ClientSideActionsSelect } from '../index';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import nock from 'nock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import flushPromises from 'flush-promises';
import {
  organizationsPage1,
  organizationsPage1Summary,
} from '../../PaginatedAsyncSelect/tests/fixtures';
import userEvent from '@testing-library/user-event';

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
  fhirBaseUrl: 'https://sample.com',
  resourceType: organizationResourceType,
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
  nock(commonProps.fhirBaseUrl)
    .get(`/${organizationResourceType}/_search`)
    .query({ _count: '10' })
    .reply(200, organizationsPage1);

  nock(commonProps.fhirBaseUrl)
    .get(`/${organizationResourceType}/_search`)
    .query({ _summary: 'count' })
    .reply(200, organizationsPage1Summary);

  const changeMock = jest.fn();
  const fullOptionHandlerMock = jest.fn();

  const props = {
    ...commonProps,
    onChange: changeMock,
    getFullOptionOnChange: fullOptionHandlerMock,
  };

  render(
    <QueryWrapper>
      <ClientSideActionsSelect<IOrganization> {...props}></ClientSideActionsSelect>
    </QueryWrapper>
  );

  await waitForElementToBeRemoved(document.querySelector('.anticon-spin'));

  // click on input. - should see the first 5 records by default
  const input = document.querySelector('.ant-select-selector') as Element;

  // simulate click on select - to show dropdown items
  fireEvent.mouseDown(input);

  // find antd select options
  const selectOptions = document.querySelectorAll('.ant-select-item-option-content');

  await flushPromises();
  // expect all practitioners (except inactive ones)
  expect([...selectOptions].map((opt) => opt.textContent)).toStrictEqual([
    '高雄榮民總醫院',
    'Blok Operacyjny Chirurgii Naczyń',
    'Volunteer virtual hospital 志工虛擬醫院',
    'Volunteer virtual hospital 志工虛擬醫院',
    'Volunteer virtual hospital 志工虛擬醫院',
  ]);

  // search and then select.
  userEvent.type(input.querySelector('input') as Element, 'Blok');

  fireEvent.click(screen.getByTitle('Blok Operacyjny Chirurgii Naczyń') as Element);

  const blokOrgId = '22332';
  const blokOrganizationFullOption = {
    value: '22332',
    ref: organizationsPage1.entry[1].resource,
    label: 'Blok Operacyjny Chirurgii Naczyń',
  };

  expect(changeMock).toHaveBeenCalledWith(blokOrgId, blokOrganizationFullOption);
  expect(fullOptionHandlerMock).toHaveBeenCalledWith(blokOrganizationFullOption);
});
