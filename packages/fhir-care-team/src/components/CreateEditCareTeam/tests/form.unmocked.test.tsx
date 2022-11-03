import React from 'react';
import { mount } from 'enzyme';
import flushPromises from 'flush-promises';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';
import { CareTeamForm } from '../Form';
import { defaultInitialValues } from '../utils';
import { getResourcesFromBundle } from '@opensrp/react-utils';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import nock from 'nock';
import { careTeamResourceType } from '../../../constants';
import { createdCareTeam } from './fixtures';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

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
    v4: () => '9b782015-8392-4847-b48c-50c11638656b',
  };
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

afterEach(() => {
  nock.cleanAll();
  cleanup();
  jest.resetAllMocks();
});

const props = {
  initialValues: defaultInitialValues,
  fhirBaseURL: 'https://r4.smarthealthit.org/',
  practitioners: getResourcesFromBundle(fixtures.practitioners),
  organizations: getResourcesFromBundle(fixtures.organizations),
};

test('filter select by text able to create new careteam', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL).put(`/${careTeamResourceType}/`, createdCareTeam).reply(200).persist();

  const wrapper = mount(<CareTeamForm {...props} />, { attachTo: container });

  await act(async () => {
    await flushPromises();
    wrapper.update();
  });

  // simulate active change
  wrapper
    .find('FormItem#status input')
    .first()
    .simulate('change', {
      target: { checked: true },
    });

  // simulate name change
  wrapper
    .find('FormItem#name input')
    .simulate('change', { target: { name: 'name', value: 'Care team 1' } });

  // simulate value selection for type
  wrapper.find('input#practitionerParticipants').simulate('mousedown');

  let optionTexts = [
    ...document.querySelectorAll(
      '#practitionerParticipants_list+div.rc-virtual-list .ant-select-item-option-content'
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(optionTexts).toHaveLength(12);
  expect(optionTexts).toEqual([
    'Ward N 2 Williams MD',
    'Ward N 1 Williams MD',
    'Ward N Williams MD',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
    'test fhir',
  ]);

  // filter searching through members works
  await userEvents.type(document.querySelector('input#practitionerParticipants'), 'Ward');

  // options after search
  let afterFilterOptionTexts = [
    ...document.querySelectorAll(
      '#practitionerParticipants_list+div.rc-virtual-list .ant-select-item-option-content'
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(afterFilterOptionTexts).toEqual([
    'Ward N 2 Williams MD',
    'Ward N 1 Williams MD',
    'Ward N Williams MD',
  ]);

  fireEvent.click(document.querySelector('[title="Ward N 2 Williams MD"]'));

  // simulate value selection for type
  wrapper.find('input#managingOrganizations').simulate('mousedown');

  optionTexts = [
    ...document.querySelectorAll(
      '#managingOrganizations_list+div.rc-virtual-list .ant-select-item-option-content'
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(optionTexts).toHaveLength(12);
  expect(optionTexts).toEqual([
    'Test Team 5',
    'Test Team 5',
    'Test Team 5',
    'Test Team One',
    'Test UUID 46',
    'Test Team 70',
    'test123',
    'testing ash123',
    'ashfahan test 1',
    'ashfahan test 2',
    'ashfahan test 2',
    'ashfahan test 2',
  ]);

  // filter searching through members works
  await userEvents.type(document.querySelector('input#managingOrganizations'), '70');

  // options after search
  afterFilterOptionTexts = [
    ...document.querySelectorAll(
      '#managingOrganizations_list+div.rc-virtual-list .ant-select-item-option-content'
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(afterFilterOptionTexts).toEqual(['Test Team 70']);

  fireEvent.click(document.querySelector('[title="Test Team 70"]'));

  await flushPromises();
  wrapper.update();

  wrapper.find('form').simulate('submit');

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Successfully Added Care Teams']]);
  });

  expect(nock.isDone()).toBeTruthy();
  wrapper.unmount();
});
