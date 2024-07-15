import React from 'react';
import { authenticateUser } from '@onaio/session-reducer';
import { DataImportForm } from '../form';
import nock from 'nock';
import * as reactQuery from 'react-query';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { store } from '@opensrp/store';
import userEvent from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import * as constants from '../../../constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');
global.fetch = fetch;

jest.mock('../../../constants', () => {
  return {
    __esModule: true,
    ...Object.assign({}, jest.requireActual('../../../constants')),
    IMPORT_DOMAIN_URI: 'http://localhost',
  };
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
  jest.restoreAllMocks();
  cleanup();
});

const sampleCsv = new File([''], 'sample.csv', { type: 'text/csv' });

// TODO - form values is not correctly updated even if individual form items correctly
// register a change event.
// eslint-disable-next-line jest/no-disabled-tests
test.skip('creates an import submission correctly', async () => {
  nock(constants.IMPORT_DOMAIN_URI)
    .post('/$import', () => {
      return true;
    })
    .reply(200, [])
    .persist();

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  render(
    <QueryClientProvider client={queryClient}>
      <DataImportForm />
    </QueryClientProvider>
  );

  const usersField = screen.getByLabelText('Users');
  userEvent.upload(usersField, sampleCsv);
  const locationsField = screen.getByLabelText('Locations');
  userEvent.upload(locationsField, sampleCsv);
  const organizationsField = screen.getByLabelText('Organizations');
  userEvent.upload(organizationsField, sampleCsv);
  const careTeamsField = screen.getByLabelText('CareTeams');
  userEvent.upload(careTeamsField, sampleCsv);
  const orgLocationAssignmentField = screen.getByLabelText('Organization location assignment');
  userEvent.upload(orgLocationAssignmentField, sampleCsv);
  const userOrgAssignmentField = screen.getByLabelText('User organization assignment');
  userEvent.upload(userOrgAssignmentField, sampleCsv);
  const inventoryField = screen.getByLabelText('Inventory');
  userEvent.upload(inventoryField, sampleCsv);
  const productsField = screen.getByLabelText('Products');
  userEvent.upload(productsField, sampleCsv);

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => {
    expect(errorNoticeMock).not.toHaveBeenCalled();
    expect(successNoticeMock.mock.calls).toEqual([['Commodity updated successfully']]);
  });

  expect(nock.isDone()).toBeTruthy();
});
