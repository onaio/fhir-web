import React from 'react';
import { mount } from 'enzyme';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { CareTeamForm } from '../Form';
import { defaultInitialValues, getCareTeamFormFields } from '../utils';
import { getResourcesFromBundle } from '@opensrp/react-utils';
import { cleanup, fireEvent, waitFor, render, screen } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import nock from 'nock';
import { careTeamResourceType } from '../../../constants';
import {
  createdCareTeam,
  createdCareTeam2,
  careTeam4201alternativeEdited,
  organizations,
  practitioners,
  careTeam4201alternative,
} from './fixtures';
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
  practitioners: getResourcesFromBundle(practitioners),
  organizations: getResourcesFromBundle(organizations),
};

test('filter select by text able to create new careteam', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL)
    .put(`/${careTeamResourceType}/${createdCareTeam.id}`, createdCareTeam)
    .reply(200)
    .persist();

  const wrapper = mount(<CareTeamForm {...props} />, { attachTo: container });

  await act(async () => {
    await flushPromises();
    wrapper.update();
  });

  // simulate active change
  wrapper
    .find('.ant-form-item.status input')
    .first()
    .simulate('change', {
      target: { checked: true },
    });

  // simulate name change
  wrapper
    .find('.ant-form-item.name input')
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
    expect(successNoticeMock.mock.calls).toEqual([['Successfully added CareTeams']]);
  });

  expect(nock.isDone()).toBeTruthy();
  wrapper.unmount();
});

test('1157 - Create care team works corectly', async () => {
  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL)
    .put(`/${careTeamResourceType}/${createdCareTeam2.id}`, createdCareTeam2)
    .reply(200)
    .persist();

  render(<CareTeamForm {...props} />);

  await waitFor(() => {
    expect(screen.getByText(/Create Care Team/)).toBeInTheDocument();
  });

  const nameInput = screen.getByLabelText('Name') as Element;
  userEvents.type(nameInput, 'care team');

  const activeStatusRadio = screen.getByLabelText('Active');
  expect(activeStatusRadio).toBeChecked();

  const inactiveStatusRadio = screen.getByLabelText('Inactive');
  expect(inactiveStatusRadio).not.toBeChecked();
  userEvents.click(inactiveStatusRadio);

  const practitionersInput = screen.getByLabelText('Practitioner Participant');
  userEvents.click(practitionersInput);
  fireEvent.click(screen.getByTitle('Ward N 2 Williams MD'));

  const managingOrgsSelect = screen.getByLabelText('Managing organizations');
  userEvents.click(managingOrgsSelect);
  fireEvent.click(screen.getByTitle('Test Team 70'));

  const saveBtn = screen.getByRole('button', { name: 'Save' });
  userEvents.click(saveBtn);

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Successfully added CareTeams']]);
  });

  expect(nock.isDone()).toBeTruthy();
});

test('1157 - editing care team works corectly', async () => {
  const thisProps = {
    ...props,
    initialValues: getCareTeamFormFields(careTeam4201alternative),
  };
  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  nock(props.fhirBaseURL)
    .put(
      `/${careTeamResourceType}/${careTeam4201alternativeEdited.id}`,
      careTeam4201alternativeEdited
    )
    .reply(200)
    .persist();

  render(<CareTeamForm {...thisProps} />);

  await waitFor(() => {
    expect(screen.getByText(/Edit Care Team /)).toBeInTheDocument();
  });

  const nameInput = screen.getByLabelText('Name') as Element;
  userEvents.type(nameInput, 'care team');

  const activeStatusRadio = screen.getByLabelText('Active');
  expect(activeStatusRadio).toBeChecked();

  const inactiveStatusRadio = screen.getByLabelText('Inactive');
  expect(inactiveStatusRadio).not.toBeChecked();
  userEvents.click(inactiveStatusRadio);

  // remove assigned
  const selectClear = [...document.querySelectorAll('.ant-select-selection-item-remove')];
  expect(selectClear).toHaveLength(2);
  selectClear.forEach((clear) => {
    fireEvent.click(clear);
  });

  const practitionersInput = screen.getByLabelText('Practitioner Participant');
  userEvents.click(practitionersInput);
  fireEvent.click(screen.getByTitle('Ward N 1 Williams MD'));

  const managingOrgsSelect = screen.getByLabelText('Managing organizations');
  userEvents.click(managingOrgsSelect);
  fireEvent.click(screen.getByTitle('testing ash123'));

  const saveBtn = screen.getByRole('button', { name: 'Save' });
  userEvents.click(saveBtn);

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Successfully updated CareTeams']]);
  });

  expect(nock.isDone()).toBeTruthy();
});
