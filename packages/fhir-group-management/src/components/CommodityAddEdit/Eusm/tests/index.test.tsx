/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CommodityAddEdit } from '..';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import nock from 'nock';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import {
  binary1,
  commodity1,
  createdBinary,
  createdCommodity,
  editedBinary1,
  editedCommodity1,
  listEdited1,
  newList,
} from './fixtures';
import { binaryResourceType, groupResourceType, listResourceType } from '../../../../constants';
import userEvent from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import { fillSearchableSelect } from '../../Default/tests/index.test';
import { photoUploadCharacteristicCode } from '../../../../helpers/utils';
import { cloneDeep } from 'lodash';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const mockv4 = '9b782015-8392-4847-b48c-50c11638656b';
jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => mockv4,
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

const listResId = 'list-resource-id';
const productImage = new File(['hello'], 'product.png', { type: 'image/png' });
const props = {
  fhirBaseURL: 'http://test.server.org',
  listId: listResId,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/add">
            <CommodityAddEdit {...props} />
          </Route>
          <Route exact path="/add/:id">
            <CommodityAddEdit {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  nock.cleanAll();
  jest.resetAllMocks();
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

test('renders correctly', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Create commodity');
    // id,
    screen.getByLabelText('Commodity Id');
    // identifier
    screen.getByLabelText('Identifier');
    // name
    screen.getByLabelText('Enter commodity name');
    // active
    screen.getByText('Select commodity status');
    const activeRadioBtn = document.querySelector('#active input[value="true"]');
    const disabledRadioBtn = document.querySelector('#active input[value="false"]');
    expect(activeRadioBtn).toMatchSnapshot('active radio button');
    expect(disabledRadioBtn).toMatchSnapshot('disabled radio button');

    // type
    screen.getByLabelText('Select commodity Type');
    // material number
    screen.getByLabelText('Material number');
    // attractive item
    screen.getByText('Attractive item');
    const yesRadioBtn = document.querySelector('#isAttractiveItem input[value="true"]');
    const noRadioBtn = document.querySelector('#isAttractiveItem input[value="false"]');
    expect(yesRadioBtn).toMatchSnapshot('attractive item yes radio button');
    expect(noRadioBtn).toMatchSnapshot('attractive item no radio button');

    // availability
    screen.getByLabelText('Is it there');
    // condition
    screen.getByLabelText('Is it in good condition');
    // appropriate usage
    screen.getByLabelText('Is it being used appropriately');
    // accountability
    screen.getByLabelText('Accountability period (in months)');
    screen.getByLabelText('Photo of the product');
    // productImage
    // submit btn
    screen.getByRole('button', {
      name: /Save/i,
    });
    // cancel btn.
    screen.getByRole('button', {
      name: /Cancel/i,
    });
  });

  expect(document.querySelector('body')?.textContent).toMatchSnapshot('A catch all');
});

// TODO - do form validation
test('form validation works', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Create commodity');
  });

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

  expect(errorMsgs).toEqual(['Required', 'Required', "'type' is required", 'Required']);
});

it('can create new commodity', async () => {
  const history = createMemoryHistory();
  history.push(`/add`);

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL)
    .put(`/${binaryResourceType}/9b782015-8392-4847-b48c-50c11638656b`, createdBinary)
    .reply(200, createdBinary)
    .persist();

  nock(props.fhirBaseURL)
    .get(`/${listResourceType}/${props.listId}`)
    .reply(200, newList)
    .put(`/${listResourceType}/${props.listId}`, listEdited1)
    .reply(201, {})
    .persist();

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/9b782015-8392-4847-b48c-50c11638656b`, createdCommodity)
    .reply(200, createdCommodity)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Create commodity');
  });

  const nameField = screen.getByPlaceholderText('Name');
  userEvent.type(nameField, 'Dettol');

  const materialNumber = screen.getByLabelText('Material number');
  userEvent.type(materialNumber, 'SKU001');

  // set attractive item
  const yesRadioBtn = document.querySelector('#isAttractiveItem input[value="true"]')!;
  fireEvent.click(yesRadioBtn);

  const availabilityField = screen.getByLabelText('Is it there');
  userEvent.type(availabilityField, 'adimika');

  const conditionField = screen.getByLabelText('Is it in good condition');
  userEvent.type(conditionField, 'as good as it can be');

  const appropriateUsageField = screen.getByLabelText('Is it being used appropriately');
  userEvent.type(appropriateUsageField, 'Define appropriately used.');

  const accountabilityField = screen.getByLabelText('Accountability period (in months)');
  userEvent.type(accountabilityField, '12');

  const productUploadField = screen.getByLabelText('Photo of the product');
  userEvent.upload(productUploadField, productImage);

  // simulate value selection for type
  const groupTypeSelectConfig = {
    selectId: 'type',
    searchOptionText: 'sub',
    fullOptionText: 'Substance',
    beforeFilterOptions: ['Medication', 'Device', 'Substance'],
    afterFilterOptions: ['Substance'],
  };
  fillSearchableSelect(groupTypeSelectConfig);

  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(errorNoticeMock).not.toHaveBeenCalled();
    expect(successNoticeMock.mock.calls).toEqual([['Commodity updated successfully']]);
  });

  expect(nock.isDone()).toBeTruthy();
});

it('edits resource', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${commodity1.id}`);

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/${commodity1.id}`)
    .reply(200, commodity1)
    .persist();

  nock(props.fhirBaseURL).get(`/${binaryResourceType}/${binary1.id}`).reply(200, binary1).persist();

  nock(props.fhirBaseURL)
    .put(`/${binaryResourceType}/${mockv4}`, editedBinary1)
    .reply(200, editedBinary1)
    .persist();

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/${editedCommodity1.id}`, editedCommodity1)
    .reply(201, editedCommodity1)
    .persist();

  const withEditEntriesList = {
    ...newList,
    entry: [
      {
        item: {
          reference: `${binaryResourceType}/${binary1.id}`,
        },
      },
      {
        item: {
          reference: `${groupResourceType}/${commodity1.id}`,
        },
      },
    ],
  };

  const withEditEntriesListResponse = {
    ...newList,
    entry: [
      { item: { reference: 'Group/52cffa51-fa81-49aa-9944-5b45d9e4c117' } },
      { item: { reference: 'Binary/9b782015-8392-4847-b48c-50c11638656b' } },
    ],
  };

  // list resource
  nock(props.fhirBaseURL)
    .get(`/${listResourceType}/${props.listId}`)
    .reply(200, withEditEntriesList)
    .put(`/${listResourceType}/${props.listId}`, withEditEntriesListResponse)
    .reply(201, withEditEntriesListResponse)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Edit commodity | Bed nets');
  });

  const materialNumberField = screen.getByLabelText('Material number');
  userEvent.clear(materialNumberField);
  userEvent.type(materialNumberField, 'Bed nets');

  // set attractive item
  const yesRadioBtn = document.querySelector('#isAttractiveItem input[value="true"]')!;
  fireEvent.click(yesRadioBtn);

  const availabilityField = screen.getByLabelText('Is it there');
  userEvent.clear(availabilityField);
  userEvent.type(availabilityField, 'could be better');

  const conditionField = screen.getByLabelText('Is it in good condition');
  userEvent.clear(conditionField);
  userEvent.type(conditionField, 'as good as it can be');

  const appropriateUsageField = screen.getByLabelText('Is it being used appropriately');
  userEvent.clear(appropriateUsageField);
  userEvent.type(appropriateUsageField, 'Define appropriately used.');

  const accountabilityField = screen.getByLabelText('Accountability period (in months)');
  userEvent.clear(accountabilityField);
  userEvent.type(accountabilityField, '12');

  const productUploadField = screen.getByLabelText('Photo of the product');
  userEvent.upload(productUploadField, productImage);

  userEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Commodity updated successfully']]);
    expect(errorNoticeMock.mock.calls).toEqual([]);
  });

  expect(nock.pendingMocks()).toEqual([]);
  expect(nock.isDone()).toBeTruthy();
});

it('can remove product image', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${commodity1.id}`);

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/${commodity1.id}`)
    .reply(200, commodity1)
    .persist();

  nock(props.fhirBaseURL).get(`/${binaryResourceType}/${binary1.id}`).reply(200, binary1).persist();

  const imageLessList = cloneDeep(listEdited1);
  imageLessList.entry = imageLessList.entry.filter(
    (entry) => entry.item.reference !== `${binaryResourceType}/${binary1.id}`
  );
  nock(props.fhirBaseURL)
    .get(`/${listResourceType}/${props.listId}`)
    .reply(200, listEdited1)
    .put(`/${listResourceType}/${props.listId}`, imageLessList)
    .reply(201, imageLessList)
    .persist();

  const commodityLessImage = cloneDeep(commodity1);
  commodityLessImage.characteristic = (commodity1.characteristic ?? []).filter(
    (stic) =>
      (stic.code.coding ?? []).map((coding) => coding.code).indexOf(photoUploadCharacteristicCode) <
      0
  );

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/${commodity1.id}`, commodityLessImage)
    .reply(200, commodityLessImage)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Edit commodity | Bed nets');
  });

  const removeFileIcon = screen.getByTitle('Remove file');
  userEvent.click(removeFileIcon);

  userEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Commodity updated successfully']]);
    expect(errorNoticeMock.mock.calls).toEqual([]);
  });

  expect(nock.pendingMocks()).toEqual([]);
});

test('cancel handler is called on cancel', async () => {
  const history = createMemoryHistory();
  history.push(`/add`);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  // test view is loaded.
  screen.getByText('Create commodity');
  const cancelBtn = screen.getByRole('button', { name: /Cancel/ });

  fireEvent.click(cancelBtn);
  expect(history.location.pathname).toEqual('/commodity/list');
});

test('data loading problem', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${commodity1.id}`);

  nock(props.fhirBaseURL)
    .get(`/${groupResourceType}/${commodity1.id}`)
    .replyWithError('something aweful happened');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // errors out
  expect(screen.getByText(/something aweful happened/)).toBeInTheDocument();
});
