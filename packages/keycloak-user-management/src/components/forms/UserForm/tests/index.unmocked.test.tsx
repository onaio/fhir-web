import { mount } from 'enzyme';
import flushPromises from 'flush-promises';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { defaultUserFormInitialValues, UserForm } from '..';
import { compositionPage1, createdUser, keycloakUser, practitioner1, userGroup } from './fixtures';
import { act } from 'react-dom/test-utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { Router } from 'react-router';
import { getFormValues, postPutPractitioner } from '../utils';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { compositionResourceType } from '../../../../constants';
import {
  screen,
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
  prettyDOM,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { compositionUrlFilter } from '../utils';
import { CreateEditUser } from '../../../CreateEditUser';
import * as notifications from '@opensrp/notifications';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');
global.fetch = fetch;

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/notifications'),
}));

// TODO - we need to dry this setup section
jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.unmock('');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const QueryWrapper = ({ children }: { children: JSX.Element }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const props = {
  initialValues: defaultUserFormInitialValues,
  keycloakBaseURL: 'https://example.org/auth/admin/realms/opensrp-web-stage',
  baseUrl: OPENSRP_API_BASE_URL,
  extraData: {},
  userGroups: userGroup,
  practitionerUpdaterFactory: postPutPractitioner,
};

describe('forms/userForm', () => {
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


  it('form validation works for required fields', async () => {

    render(
      <QueryWrapper>
        <Router history={history}>
          <UserForm {...props} />
        </Router>
      </QueryWrapper>
    );

    const submitBtn = screen.getByText("Save")
    userEvent.click(submitBtn)



    await waitFor(() => [
      ['First Name is required', 'Last Name is required', 'Username is required'].forEach(err => screen.getByText(err))
    ]);

    const allErrors = [...document.querySelectorAll(".ant-form-item-explain-error")].map(el => el.textContent)
    expect(allErrors).toEqual([
      "First Name is required",
      "Last Name is required",
      "Username is required",

    ])
  });


  it('filters user groups', async () => {
    const propsOwn = {
      ...props,
      practitioner: practitioner1,
      // mount with both user and practitioner enabled
      initialValues: getFormValues(
        { ...keycloakUser, enabled: true },
        { ...practitioner1, active: true }
      ),
    };

    const wrapper = mount(
      <Router history={history}>
        <UserForm {...propsOwn} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find antd Select with id 'practitioners' in the 'Form' component
    const userGroupSelect = wrapper.find('Select#userGroups');

    // simulate click on select - to show dropdown items
    userGroupSelect.find('.ant-select-selector').simulate('mousedown');
    wrapper.update();

    // find antd select options
    const selectOptions = wrapper.find('.ant-select-item-option-content');

    // expect all groups options
    expect(selectOptions.map((opt) => opt.text())).toStrictEqual(['Admin', 'Admin 2', 'New Group']);

    // find search input field
    const inputField = userGroupSelect.find('input#userGroups');
    // simulate change (type search phrase)
    inputField.simulate('change', { target: { value: 'dmi' } });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // expect to see only filtered options
    const selectOptions2 = wrapper.find('.ant-select-item-option-content');
    expect(selectOptions2.map((opt) => opt.text())).toStrictEqual(['Admin', 'Admin 2']);
  });

  it('Fhir instance fields - creating user', async () => {
    const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const propsOwn = {
      ...props,
      // mount with both user and practitioner enabled
      initialValues: getFormValues(),
      isFHIRInstance: true,
    };

    nock(propsOwn.baseUrl)
      .get(`/${compositionResourceType}/_search`)
      .query({ _getpagesoffset: '0', _count: '20', ...compositionUrlFilter })
      .reply(200, compositionPage1);

    const newId = 'keycloakNewUserId';
    nock(propsOwn.keycloakBaseURL)
      .post(`/users`, createdUser)
      .reply(201, { ...CreateEditUser, id: newId }, { location: `/${newId}` });

    const { getByRole } = render(
      <QueryWrapper>
        <Router history={history}>
          <UserForm {...propsOwn} />
        </Router>
      </QueryWrapper>
    );

    const nameInput = document.querySelector('input#firstName') as Element;
    userEvent.type(nameInput, 'Test');

    // set users last name
    const lastNameInput = document.querySelector('input#lastName') as Element;
    userEvent.type(lastNameInput, 'One');

    // set username
    const usernameInput = document.querySelector('input#username') as Element;
    userEvent.type(usernameInput, 'TestOne');

    // set user email
    const emailInput = document.querySelector('input#email') as Element;
    userEvent.type(emailInput, 'testone@gmail.com');

    // find antd Select with id 'practitioners' in the 'Form' component
    const appIdSection = screen.getByTestId('fhirCoreAppId') as Element;

    // click on input. - should see the first 5 records by default
    const appIdInput = appIdSection.querySelector('.ant-select-selector') as Element;

    // simulate click on select - to show dropdown items
    fireEvent.mouseDown(appIdInput);

    await waitForElementToBeRemoved(appIdSection.querySelector('.anticon-spin'));
    const appIdOptionList = document.querySelector(
      'div#fhirCoreAppId_list + .rc-virtual-list'
    ) as Element;

    // find antd select options
    const selectOptions = appIdOptionList.querySelectorAll('.ant-select-item-option-content');

    await flushPromises();
    // expect all practitioners (except inactive ones)
    expect([...selectOptions].map((opt) => opt.textContent)).toStrictEqual([
      'Device configurations(cha)',
      'Device configurations(notice-f)',
      'Device configurations(map)',
      'Device configurations(ecbis_sc)',
      'Device configurations(ay)',
    ]);

    fireEvent.click(screen.getByTitle('Device configurations(cha)') as Element);

    const saveBtn = getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    await flushPromises();
    await waitFor(() => {
      expect(notificationSuccessMock.mock.calls).toEqual([['User created successfully'], [
        "Practitioner created successfully",
      ],
      [
        "User Group edited successfully",
      ],
      ]);
    });

    expect(nock.pendingMocks()).toHaveLength(0);
  });
});
