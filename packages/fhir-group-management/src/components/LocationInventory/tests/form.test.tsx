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
  locationServicePointList,
} from './fixtures';

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

  expect(errorMsgs).toEqual(['Required', 'Required', 'Required', 'Required']);
});

it('creates new product as expected', async () => {
  props.initialValues = formValues;

  nock(props.fhirBaseURL)
    .put(`/Group/${mockResourceId}`)
    .reply(201, locationResourcePayload)
    .persist();

  nock(props.fhirBaseURL)
    .put(`/List/${mockResourceId}`)
    .reply(201, locationInventoryList)
    .persist();

  nock(props.fhirBaseURL)
    .get(`/List/${listResourceId}`)
    .reply(404, { message: 'Not found' })
    .persist();

  nock(props.fhirBaseURL)
    .put(`/List/${listResourceId}`)
    .reply(201, locationServicePointList)
    .persist();

  nock(props.fhirBaseURL)
    .put(`/List/${listResourceId}`)
    .reply(201, locationServicePointList)
    .persist();

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  render(<AppWrapper {...props}></AppWrapper>);

  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(errorNoticeMock).not.toHaveBeenCalled();
    expect(successNoticeMock.mock.calls).toEqual([['Location inventory created successfully']]);
  });
});

it('edits product as expected', async () => {
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
