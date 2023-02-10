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
import { commodity1, createdCommodity, newList } from './fixtures';
import { groupResourceType, listResourceType } from '../../../constants';
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

test('renders correctly for new resource', async () => {
  const history = createMemoryHistory();
  history.push('/add');

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  // some small but inconclusive proof that the form rendered
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/type/i)).toMatchSnapshot('type field');
});

test('renders correctly for edit resource', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${commodity1.id}`);

  nock(props.fhirBaseURL).get(`/${groupResourceType}/${commodity1.id}`).reply(200, commodity1);

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  // some small but inconclusive proof that the form rendered and has some initial values
  expect(screen.getByLabelText(/name/i)).toMatchSnapshot('name field');
  expect(screen.getByLabelText(/type/i)).toMatchSnapshot('type field');
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
