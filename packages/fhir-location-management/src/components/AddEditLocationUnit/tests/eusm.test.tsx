/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EusmAddEditLocationUnit } from '..';
import React from 'react';
import { store } from '@opensrp/store';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import { locationHierarchyResourceType, parentIdQueryParam, serviceType } from '../../../constants';
import { fhirHierarchy } from '../../../ducks/tests/fixtures';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import { createdLoc, editedLoc, servicePointTypeValueSet } from './fixtures';
import {
  locationResourceType,
  valueSetResourceType,
  eusmServicePointValueSetURI,
} from '@opensrp/fhir-helpers';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => '13cafa46-7251-429a-8d19-8da0583c0c5a',
  };
});

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: Infinity,
    },
  },
});

const props = {
  fhirBaseURL: 'http://test.server.org',
  fhirRootLocationId: 'someId',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/add">
            <EusmAddEditLocationUnit {...props} />
          </Route>
          <Route exact path="/add/:id">
            <EusmAddEditLocationUnit {...props} />
          </Route>
        </Switch>
      </QueryClientProvider>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

test('works ok for new locations', async () => {
  const history = createMemoryHistory();
  history.push(`/add?${parentIdQueryParam}=Location/971`);

  const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
  const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

  const preFetchScope = nock(props.fhirBaseURL)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ _id: props.fhirRootLocationId })
    .reply(200, fhirHierarchy)
    .get(`/${valueSetResourceType}/$expand?url=${eusmServicePointValueSetURI}`)
    .reply(200, servicePointTypeValueSet)
    .persist();

  nock(props.fhirBaseURL).put(`/Location/${createdLoc.id}`, createdLoc).reply(201, {}).persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(async () => {
    expect(preFetchScope.isDone()).toBeTruthy();
    for (const loader of document.querySelectorAll('.anticon-loading,.anticon-spin')) {
      await waitForElementToBeRemoved(loader);
    }
  });

  // simulate name change
  const nameInput = screen.getByLabelText('Name');
  userEvent.type(nameInput, 'area51');

  // check parent is already set from url
  const parentInputSelection = document.querySelector(`.ant-select-selection-item`)!;
  expect(parentInputSelection.textContent).toEqual('Arundel mobile clinic');

  // simulate parent change
  const parentIdDropdown = document.querySelector(`input#location-form_${'parentId'}`)!;
  fireEvent.mouseDown(parentIdDropdown);
  fireEvent.click(document.querySelector(`[title="${'Ona Office Sub Location'}"]`)!);

  // simulate service type selection
  const serviceTypesDropdown = document.querySelector(`input#location-form_${serviceType}`)!;
  fireEvent.mouseDown(serviceTypesDropdown);

  const optionTexts = [
    ...document.querySelectorAll(
      `#location-form_${serviceType}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(optionTexts).toEqual([
    'CSB2',
    'BSD',
    'CHRD1',
    'CHRD2',
    'CHRR',
    'SDSP',
    'DRSP',
    'MSP',
    'EPP',
    'CEG',
    'Warehouse',
    'Water Point',
  ]);
  fireEvent.click(document.querySelector(`[title="${'Warehouse'}"]`)!);

  const save = screen.getByRole('button', { name: 'Save' });
  userEvent.click(save);

  await waitFor(() => {
    expect(notificationSuccessMock).toHaveBeenCalledWith('Location was successfully created');
  });

  // successful submission after action should not result in a disabled
  // query immediately fetching data and thus running into an error.
  expect(notificationErrorMock).not.toHaveBeenCalled();
  expect(nock.isDone()).toBeTruthy();
});

test('editing works correctly', async () => {
  const history = createMemoryHistory();
  history.push(`/add/${createdLoc.id}`);

  const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
  const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/${createdLoc.id}`)
    .reply(200, createdLoc)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ _id: props.fhirRootLocationId })
    .reply(200, fhirHierarchy)
    .get(`/${valueSetResourceType}/$expand?url=${eusmServicePointValueSetURI}`)
    .reply(200, servicePointTypeValueSet)
    .persist();

  nock(props.fhirBaseURL).put(`/Location/${editedLoc.id}`, editedLoc).reply(201, {}).persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(async () => {
    for (const loader of document.querySelectorAll('.anticon-loading,.anticon-spin,.ant-spin')) {
      await waitForElementToBeRemoved(loader);
    }
  });

  // simulate name change
  const nameInput = screen.getByLabelText('Name');
  userEvent.clear(nameInput);
  userEvent.type(nameInput, 'River road');

  // simulate service type selection
  const serviceTypesDropdown = document.querySelector(`input#location-form_${serviceType}`)!;
  fireEvent.mouseDown(serviceTypesDropdown);

  fireEvent.click(document.querySelector(`[title="${'CEG'}"]`)!);

  const save = screen.getByRole('button', { name: 'Save' });
  userEvent.click(save);

  await waitFor(() => {
    expect(notificationSuccessMock).toHaveBeenCalledWith('Location was successfully updated');
  });

  // successful submission after action should not result in a disabled
  // query immediately fetching data and thus running into an error.
  expect(notificationErrorMock).not.toHaveBeenCalled();
  expect(nock.isDone()).toBeTruthy();
});

test('Back search param works correctly', async () => {
  const backToPath = '/location/view';
  const history = createMemoryHistory();
  history.push(`/add/${createdLoc.id}?back_to=${backToPath}`);

  nock(props.fhirBaseURL)
    .get(`/${locationResourceType}/${createdLoc.id}`)
    .reply(200, createdLoc)
    .get(`/${locationHierarchyResourceType}/_search`)
    .query({ _id: props.fhirRootLocationId })
    .reply(200, fhirHierarchy)
    .get(`/${valueSetResourceType}/$expand?url=${eusmServicePointValueSetURI}`)
    .reply(200, servicePointTypeValueSet)
    .persist();

  nock(props.fhirBaseURL).put(`/Location/${editedLoc.id}`, editedLoc).reply(201, {}).persist();

  render(
    <Router history={history}>
      <AppWrapper {...props}></AppWrapper>
    </Router>
  );

  await waitFor(async () => {
    for (const loader of document.querySelectorAll('.anticon-loading,.anticon-spin,.ant-spin')) {
      await waitForElementToBeRemoved(loader);
    }
  });

  const cancel = screen.getByRole('button', { name: 'Cancel' });
  userEvent.click(cancel);
  expect(history.location.pathname).toEqual(backToPath);
});
