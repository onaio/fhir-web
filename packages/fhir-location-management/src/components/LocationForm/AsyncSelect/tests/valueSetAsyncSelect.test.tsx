/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import nock from 'nock';
import { cleanup, fireEvent, render, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ValueSetAsyncSelect } from '../ValueSetAsyncSelect';
import { eusmServicePointValueSetId, valueSetResourceType } from '../../../../constants';
import { eusmServicePoint } from './fixtures';
import userEvent from '@testing-library/user-event';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
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

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

afterAll(() => {
  nock.enableNetConnect();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const commonProps = {
  fhirBaseUrl: 'http://test.server.org/fhir',
  valueSetId: eusmServicePointValueSetId,
};

const AppWrapper = (props: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};

test('works correctly when api errors out', async () => {
  const props = {
    ...commonProps,
    id: 'select',
  };
  nock(props.fhirBaseUrl)
    .get(`/${valueSetResourceType}/${props.valueSetId}/$expand`)
    .reply(500, 'Ran into an error');
  render(
    <AppWrapper>
      <ValueSetAsyncSelect {...props} />
    </AppWrapper>
  );

  // select is disabled during loading
  const antSelectContainer = document.querySelector('.ant-select');
  expect(antSelectContainer?.classList.contains('ant-select-disabled')).toBeTruthy();
  expect(antSelectContainer?.classList.contains('ant-select-loading')).toBeTruthy();

  await waitFor(() => {
    expect(antSelectContainer?.classList).not.toContain('ant-select-loading');
  });

  const selectComponent = document.querySelector(`input#${props.id}`)!;
  fireEvent.mouseDown(selectComponent);
  screen.getByText(/Unable to load dropdown options./i);

  expect(nock.isDone()).toBeTruthy();
});

test('chooses correctly dropdown', async () => {
  const onChangeHandlerMock = jest.fn();
  const props = {
    ...commonProps,
    id: 'select',
    onChange: onChangeHandlerMock,
    showSearch: true,
  };
  nock(props.fhirBaseUrl)
    .get(`/${valueSetResourceType}/${props.valueSetId}/$expand`)
    .reply(200, eusmServicePoint);

  render(
    <AppWrapper>
      <ValueSetAsyncSelect {...props} />
    </AppWrapper>
  );

  // select is disabled during loading
  const antSelectContainer = document.querySelector('.ant-select');
  expect(antSelectContainer?.classList.contains('ant-select-disabled')).toBeTruthy();
  expect(antSelectContainer?.classList.contains('ant-select-loading')).toBeTruthy();

  await waitFor(() => {
    expect(antSelectContainer?.classList).not.toContain('ant-select-loading');
  });

  const selectComponent = document.querySelector(`input#${props.id}`)!;
  fireEvent.mouseDown(selectComponent);

  const optionTexts = [
    ...document.querySelectorAll(
      `#${props.id}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(optionTexts).toEqual([
    'NatCom Switzerland',
    'NatCom Germany',
    'USAID FFP',
    'NatCom Denmark',
    'NatCom France',
    'NatCom Japan',
    'NatCom Luxembourg',
    'Govt of UK',
    'Nutrition International',
    'Monaco',
    'NatCom Canada',
    'UNICEF',
  ]);

  // filter searching through members works
  userEvent.type(selectComponent, 'UNi');

  // options after search
  const afterFilterOptionTexts = [
    ...document.querySelectorAll(
      `#${props.id}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(afterFilterOptionTexts).toEqual(['UNICEF']);

  fireEvent.click(document.querySelector(`[title="UNICEF"]`)!);
  expect(onChangeHandlerMock.mock.calls).toEqual([
    [
      '{"code":"UNICEF","display":"UNICEF","system":"http://smartregister.org/CodeSystem/eusm-donors"}',
      {
        label: 'UNICEF',
        value:
          '{"code":"UNICEF","display":"UNICEF","system":"http://smartregister.org/CodeSystem/eusm-donors"}',
      },
    ],
  ]);
});
