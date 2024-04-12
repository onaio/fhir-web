/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import nock from 'nock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import * as notifications from '@opensrp/notifications';
import { AddLocationInventoryForm } from '../form';
import {
  mockResourceId,
  servicePointDatum,
  formValues,
  locationResourcePayload,
  locationInventoryList,
  allInventoryList,
  productsList,
  unicefDonorsValueSet,
  unicefSectionValueSet,
  createdInventoryGroup1,
} from './fixtures';
import {
  donor,
  groupResourceType,
  listResourceType,
  product,
  unicefDonorValueSetURL,
  unicefSection,
  unicefSectionValueSetURL,
} from '../../../constants';
import { valueSetResourceType } from '@opensrp/react-utils';

import dayjs from 'dayjs';
import { fillSearchableSelect } from '../../CommodityAddEdit/Default/tests/test-utils';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => mockResourceId,
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const listResourceId = 'list-resource-id';
const props = {
  fhirBaseURL: 'http://test.server.org',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: {} as any,
  inventoryId: undefined,
  listResourceId,
  inventoryResourceObj: undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  servicePointObj: servicePointDatum as any,
  commodityListId: 'products-resource-id',
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
  cleanup();
  nock.cleanAll();
  jest.resetAllMocks();
});

afterAll(() => {
  nock.enableNetConnect();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AddLocationInventoryForm {...props} />
      </QueryClientProvider>
    </Provider>
  );
};

test('form validation works', async () => {
  render(<AppWrapper {...props} />);

  const submitBtn = screen.getByRole('button', {
    name: /Save/i,
  });

  fireEvent.click(submitBtn);

  await waitFor(() => {
    const atLeastOneError = document.querySelector('.ant-form-item-explain-error');
    expect(atLeastOneError).toBeInTheDocument();
  });

  const errorNodes = [...document.querySelectorAll('.ant-form-item-explain-error')];
  const errorMsgs = errorNodes.map((node) => node.textContent);

  expect(errorMsgs).toEqual([
    'Delivery date is required',
    'Accountability end date is required',
    'UNICEF section is required',
    'PO number is required',
  ]);
});

test('creates new inventory as expected', async () => {
  const thisProps = {
    ...props,
    initialValues: {
      // TODO - hack -> Could not yet find a way to reliably mock dates when simulating datepicker
      deliveryDate: dayjs('2024-03-25T08:24:51.149Z'),
      accountabilityEndDate: dayjs('2024-03-26T08:24:53.645Z'),
    },
  };
  const preFetchScope = nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/_search`)
    .query({
      _getpagesoffset: 0,
      _count: 20,
      code: 'http://snomed.info/sct|386452003',
      '_has:List:item:_id': props.commodityListId,
    })
    .reply(200, productsList)
    .get(`/${valueSetResourceType}/$expand?url=${unicefSectionValueSetURL}`)
    .reply(200, unicefSectionValueSet)
    .get(`/${valueSetResourceType}/$expand?url=${unicefDonorValueSetURL}`)
    .reply(200, unicefDonorsValueSet)
    .persist();

  const postCreationalScope = nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/${mockResourceId}`, createdInventoryGroup1)
    .reply(201, createdInventoryGroup1)
    .put(`/${listResourceType}/${mockResourceId}`, locationInventoryList)
    .reply(201, locationInventoryList)
    .get(`/List/${listResourceId}`)
    .reply(404, { message: 'Not found' })
    .put(`/List/${listResourceId}`, { ...allInventoryList, entry: [] })
    .reply(201, { ...allInventoryList, entry: [] })
    .put(`/List/${listResourceId}`, allInventoryList)
    .reply(201, allInventoryList)
    .persist();

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  render(<AppWrapper {...thisProps}></AppWrapper>);

  await waitFor(() => {
    expect(preFetchScope.isDone()).toBeTruthy();
  });

  // simulate value selection for product
  const productSelectComponent = document.querySelector(`input#${product}`)!;
  fireEvent.mouseDown(productSelectComponent);

  const optionTexts = [
    ...document.querySelectorAll(
      `#${product}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(optionTexts).toEqual([
    'Yellow sunshine',
    'Fig tree',
    'Lumpy nuts',
    'Happy Feet',
    'Lilly Flowers',
    'Smartphone TEST',
  ]);
  fireEvent.click(document.querySelector(`[title="${'Lumpy nuts'}"]`)!);

  const quantity = screen.getByLabelText('Quantity');
  userEvent.type(quantity, '20');

  const serialNumber = screen.getByLabelText('Serial number');
  userEvent.type(serialNumber, 'yk254');

  const unicefSectionSelectionCriteria = {
    selectId: unicefSection,
    fullOptionText: 'Health',
    searchOptionText: 'heal',
    beforeFilterOptions: ['Health', 'WASH'],
    afterFilterOptions: ['Health'],
  };
  fillSearchableSelect(unicefSectionSelectionCriteria);

  const unicefDonorSelectionCriteria = {
    selectId: donor,
    fullOptionText: 'ADB',
    searchOptionText: 'ad',
    beforeFilterOptions: ['ADB', 'NatCom Belgium', 'BMGF'],
    afterFilterOptions: ['ADB'],
  };
  fillSearchableSelect(unicefDonorSelectionCriteria);

  const poNumber = screen.getByLabelText('PO number');
  userEvent.type(poNumber, '578643');

  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(postCreationalScope.isDone()).toBeTruthy();
    expect(errorNoticeMock).not.toHaveBeenCalled();
    expect(successNoticeMock.mock.calls).toEqual([['Location inventory created successfully']]);
  });

  expect(nock.isDone()).toBeTruthy();
});

test('edits inventory as expected', async () => {
  props.initialValues = formValues;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props.inventoryId = mockResourceId as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props.inventoryResourceObj = locationResourcePayload as any;

  nock(props.fhirBaseURL)
    .put(`/Group/${mockResourceId}`)
    .reply(201, locationResourcePayload)
    .persist();

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  render(<AppWrapper {...props}></AppWrapper>);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const quantityField = document.querySelector(`input#quantity`)!;
  userEvent.clear(quantityField);
  expect(quantityField).toHaveValue(null);
  userEvent.type(quantityField, '15');
  expect(quantityField).toHaveValue(15);

  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(errorNoticeMock).not.toHaveBeenCalled();
    expect(successNoticeMock.mock.calls).toEqual([['Location inventory updated successfully']]);
  });

  expect(nock.isDone()).toBeTruthy();
});
