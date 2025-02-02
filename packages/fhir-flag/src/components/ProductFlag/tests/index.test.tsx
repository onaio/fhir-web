import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import {
  screen,
  render,
  cleanup,
  waitForElementToBeRemoved,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ProductFlag, ProductFlagProps } from '..';
import nock from 'nock';
import { authenticateUser } from '@onaio/session-reducer';
import {
  EncounterResourceType,
  FlagResourceType,
  ObservationResourceType,
  groupResourceType,
  listResourceType,
  locationResourceType,
  servicePointProfileInventoryListCoding,
} from '@opensrp/fhir-helpers';
import userEvents from '@testing-library/user-event';
import { status } from '../../../constants';
import * as notifications from '@opensrp/notifications';
import {
  createdEncounterProductFlag,
  createdObservationProductFlag,
  listBundle,
  productFlag,
  productGroup,
  productInventoryGroup,
  productLocation,
  productUpdatedFlag,
} from './fixtures';
import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

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

const fhirBaseURL = 'http://test.server.org';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
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
      {
        api_token: 'hunter2',
        oAuth2Data: { access_token: 'sometoken', state: 'abcde' },
        user_id: 'bobbie',
      }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

test('renders correctly and fetches data', async () => {
  const history = createMemoryHistory();

  const scope = nock(fhirBaseURL)
    .get(`/${groupResourceType}/inventoryGroupId`)
    .reply(200, productInventoryGroup)
    .get(`/${groupResourceType}/03310a5c-7c8f-4338-a2bf-e601bf84327f`)
    .reply(200, productGroup)
    .get(`/${listResourceType}/_search`)
    .query({
      item: 'inventoryGroupId',
      code: `${servicePointProfileInventoryListCoding.system}|${servicePointProfileInventoryListCoding.code}`,
    })
    .reply(200, listBundle)
    .get(`/${locationResourceType}/20bef46f-b5f2-490f-beca-d9fa6205be06`)
    .reply(200, productLocation)
    .persist();

  const putScope = nock(fhirBaseURL)
    .put(
      `/${EncounterResourceType}/15e2dd99-91f7-5dc8-b84b-14d546610f3c`,
      createdEncounterProductFlag
    )
    .reply(200, createdEncounterProductFlag)
    .put(
      `/${ObservationResourceType}/d15869ed-1ab1-5dc8-b07c-d384bc4ce9b8`,
      createdObservationProductFlag
    )
    .reply(200, createdObservationProductFlag)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .put(`/${FlagResourceType}/1a3a0d65-b6ad-40af-b6cd-2e8801614de9`, productUpdatedFlag as any)
    .reply(200, productUpdatedFlag)
    .persist();

  const defaultProps: ProductFlagProps = {
    fhirBaseUrl: fhirBaseURL,
    flag: productFlag as IFlag,
    practitionerId: 'practitionerId',
    inventoryGroupReference: 'Group/inventoryGroupId',
  };

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  render(
    <QueryClientProvider client={queryClient}>
      <RoleContext.Provider value={superUserRole}>
        <Router history={history}>
          <ProductFlag {...defaultProps} />
        </Router>
      </RoleContext.Provider>
    </QueryClientProvider>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(document.querySelector('form')?.textContent).toMatchInlineSnapshot(
    `"Service PointProductStatusActiveCommentsSave"`
  );

  const commentField = screen.getByLabelText('Comments');
  userEvents.type(commentField, 'Some comments here');

  const statusSelectField = document.querySelector(`input#${status}`) as HTMLElement;
  fireEvent.mouseDown(statusSelectField);

  fireEvent.click(document.querySelector(`[title="Inactive"]`) as HTMLElement);

  const submitBtn = screen.getByRole('button', {
    name: /Save/i,
  });

  act(() => {
    fireEvent.click(submitBtn);
  });

  await waitFor(() => {
    expect(successNoticeMock).toHaveBeenCalledWith('Flag Closed successfully');
    expect(errorNoticeMock).not.toHaveBeenCalledWith();
  });

  await waitFor(() => {
    expect(putScope.isDone()).toBeTruthy();
  });

  expect(scope.isDone()).toBeTruthy();
});
