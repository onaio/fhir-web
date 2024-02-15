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
  commodity1,
  createdCommodity,
  editedCommodity1,
  editedList,
  newList,
} from './fixtures';
import { groupResourceType, listResourceType, unitOfMeasure } from '../../../../constants';
import userEvent from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import flushPromises from 'flush-promises';

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

it('renders correctly', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Create Commodity');
    // id,
    screen.getByLabelText('Commodity Id');
    // identifier
    screen.getByLabelText('Identifier');
    // name
    screen.getByPlaceholderText('Name');
    // active
    // active
    screen.getByText('Select Commodity status');
    const activeRadioBtn = document.querySelector('#active input[value="true"]');
    const disabledRadioBtn = document.querySelector('#active input[value="false"]');
    expect(activeRadioBtn).toMatchSnapshot('active radio button');
    expect(disabledRadioBtn).toMatchSnapshot('disabled radio button');
    // type
    screen.getByLabelText('Select Commodity Type');
    // unit of measure
    screen.getByLabelText('Select the unit of measure');
    // submit btn
    screen.getByRole('button', {
      name: /Save/i,
    });
    // cancel btn.
    screen.getByRole('button', {
      name: /Cancel/i,
    });
  });
});

it('form validation works', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Create Commodity');
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

  expect(errorMsgs).toEqual(['Required', "'type' is required", "'unitOfMeasure' is required"]);
});

it('submits new group', async () => {
  const history = createMemoryHistory();
  history.push(`/add`);

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL)
    .get(`/${listResourceType}/${props.listId}`)
    .reply(200, newList)
    .put(`/${listResourceType}/${props.listId}`, editedList)
    .reply(201, {})
    .persist();

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/9b782015-8392-4847-b48c-50c11638656b`, createdCommodity)
    .reply(200, { ...createdCommodity, id: '123' })
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Create Commodity');
  });

  const nameField = screen.getByPlaceholderText('Name');
  userEvent.type(nameField, 'Dettol');

  // simulate value selection for type
  const groupTypeSelectConfig = {
    selectId: 'type',
    searchOptionText: 'dev',
    fullOptionText: 'Device',
    beforeFilterOptions: ['Medication', 'Device', 'Substance'],
    afterFilterOptions: ['Device'],
  };
  fillSearchableSelect(groupTypeSelectConfig);
  // unit of measure
  // simulate value selection for type
  const unitMeasureSelectConfig = {
    selectId: unitOfMeasure,
    searchOptionText: 'bot',
    fullOptionText: 'Bottles',
    beforeFilterOptions: [
      'Pieces',
      'Tablets',
      'Ampoules',
      'Strips',
      'Cycles',
      'Bottles',
      'Test kits',
      'Sachets',
      'Straps',
    ],
    afterFilterOptions: ['Bottles'],
  };
  fillSearchableSelect(unitMeasureSelectConfig);

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

  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL).get(`/${groupResourceType}/${commodity1.id}`).reply(200, commodity1);

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/${commodity1.id}`, editedCommodity1)
    .replyWithError('Failed to update Commodity')
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Edit Commodity | Paracetamol 100mg Tablets');
  });

  const nameField = screen.getByPlaceholderText('Name');
  userEvent.type(nameField, 'Dettol');

  // simulate value selection for type
  const groupTypeSelectConfig = {
    selectId: 'type',
    searchOptionText: 'dev',
    fullOptionText: 'Device',
    beforeFilterOptions: ['Medication', 'Device', 'Substance'],
    afterFilterOptions: ['Device'],
  };
  fillSearchableSelect(groupTypeSelectConfig);
  // unit of measure
  // simulate value selection for type
  const unitMeasureSelectConfig = {
    selectId: unitOfMeasure,
    searchOptionText: 'bot',
    fullOptionText: 'Bottles',
    beforeFilterOptions: [
      'Pieces',
      'Tablets',
      'Ampoules',
      'Strips',
      'Cycles',
      'Bottles',
      'Test kits',
      'Sachets',
      'Straps',
    ],
    afterFilterOptions: ['Bottles'],
  };
  fillSearchableSelect(unitMeasureSelectConfig);

  userEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(errorNoticeMock.mock.calls).toEqual([
      [
        `request to http://test.server.org/Group/${commodity1.id} failed, reason: Failed to update Commodity`,
      ],
    ]);
  });

  expect(nock.isDone()).toBeTruthy();
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
  screen.getByText('Create Commodity');
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

test('#1116 adds new resources to list', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/${mockv4}`, createdCommodity)
    .reply(200, { ...createdCommodity, id: '123' })
    .persist();

  nock(props.fhirBaseURL).get(`/${listResourceType}/${listResId}`).reply(200, newList).persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  // simulate name change
  const nameInput = document.querySelector('input#name')!;
  userEvent.type(nameInput, 'Dettol');

  // simulate value selection for type
  const typeInput = document.querySelector('input#type')!;
  userEvent.click(typeInput);
  const deviceTitle = document.querySelector('[title="Device"]')!;
  fireEvent.click(deviceTitle);

  // simulate unit measure value
  const unitOfMeasureInput = document.querySelector('input#unitOfMeasure')!;
  userEvent.click(unitOfMeasureInput);
  const bottlesOption = document.querySelector('[title="Bottles"]')!;
  fireEvent.click(bottlesOption);

  const submitButton = document.querySelector('#submit-button')!;
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Commodity updated successfully']]);
  });
  expect(nock.isDone()).toBeTruthy();
});

test('#1116 adding new group but list does not exist', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  nock(props.fhirBaseURL)
    .put(`/${groupResourceType}/${mockv4}`, createdCommodity)
    .reply(200, { ...createdCommodity })
    .persist();

  nock(props.fhirBaseURL)
    .get(`/${listResourceType}/${listResId}`)
    .reply(404, {
      resourceType: 'OperationOutcome',
      text: {
        status: 'generated',
        div: '<div xmlns="http://www.w3.org/1999/xhtml"><h1>Operation Outcome</h1><table border="0"><tr><td style="font-weight: bold;">ERROR</td><td>[]</td><td><pre>HAPI-2001: Resource List/ea15c35a-8e8c-47ce-8122-c347cefa1b4d is not known</pre></td>\n\t\t\t</tr>\n\t\t</table>\n\t</div>',
      },
      issue: [
        {
          severity: 'error',
          code: 'processing',
          diagnostics: `HAPI-2001: Resource List/${listResId} is not known`,
        },
      ],
    });

  const updatedList = {
    ...newList,
    entry: [{ item: { reference: `${groupResourceType}/${mockv4}` } }],
  };

  nock(props.fhirBaseURL)
    .put(`/${listResourceType}/${listResId}`, newList)
    .reply(200, newList)
    .persist();

  nock(props.fhirBaseURL)
    .put(`/${listResourceType}/${listResId}`, updatedList)
    .reply(200, updatedList)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  // simulate name change
  const nameInput = document.querySelector('input#name')!;
  userEvent.type(nameInput, 'Dettol');

  // simulate value selection for type
  const typeInput = document.querySelector('input#type')!;
  userEvent.click(typeInput);
  const deviceTitle = document.querySelector('[title="Device"]')!;
  fireEvent.click(deviceTitle);

  // simulate unit measure value
  const unitOfMeasureInput = document.querySelector('input#unitOfMeasure')!;
  userEvent.click(unitOfMeasureInput);
  const bottlesOption = document.querySelector('[title="Bottles"]')!;
  fireEvent.click(bottlesOption);

  const submitButton = document.querySelector('#submit-button')!;
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Commodity updated successfully']]);
    expect(nock.isDone()).toBeTruthy();
  });

  await flushPromises();
});

export interface SearchableSelectValues {
  selectId: string;
  searchOptionText: string;
  fullOptionText: string;
  beforeFilterOptions: string[];
  afterFilterOptions: string[];
}

/**
 * @param searchableSelectOptions options
 */
export function fillSearchableSelect(searchableSelectOptions: SearchableSelectValues) {
  const { selectId, fullOptionText, searchOptionText, beforeFilterOptions, afterFilterOptions } =
    searchableSelectOptions;

  // simulate value selection for type
  const selectComponent = document.querySelector(`input#${selectId}`)!;
  fireEvent.mouseDown(selectComponent);

  const optionTexts = [
    ...document.querySelectorAll(
      `#${selectId}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(optionTexts).toHaveLength(beforeFilterOptions.length);
  expect(optionTexts).toEqual(beforeFilterOptions);

  // filter searching through members works
  userEvent.type(selectComponent, searchOptionText);

  // options after search
  const afterFilterOptionTexts = [
    ...document.querySelectorAll(
      `#${selectId}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(afterFilterOptionTexts).toEqual(afterFilterOptions);

  fireEvent.click(document.querySelector(`[title="${fullOptionText}"]`)!);
}
