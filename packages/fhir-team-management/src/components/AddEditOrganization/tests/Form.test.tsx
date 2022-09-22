import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import { OrganizationForm } from '../Form';
import { createBrowserHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import nock from 'nock';
import { QueryClientProvider, QueryClient } from 'react-query';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import flushPromises from 'flush-promises';
import { organizationResourceType, practitionerRoleResourceType } from '../../../constants';
import {
  allPractitioners,
  createdOrg,
  createdRole1,
  createdRole2,
  editedOrg,
  org105,
  org105Practitioners,
} from './fixtures';
import { getResourcesFromBundle } from '@opensrp/react-utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { getOrgFormFields } from '../utils';
import * as notifications from '@opensrp/notifications';
import userEvents from '@testing-library/user-event';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

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

describe('OrganizationForm', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  const AppWrapper = (props: { children: React.ReactNode }) => {
    return (
      <Router history={history}>
        <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
      </Router>
    );
  };

  const formProps = {
    fhirBaseUrl: 'http://test.server.org',
    practitioners: getResourcesFromBundle<IPractitioner>(allPractitioners),
    existingPractitionerRoles: [],
    initialValues: getOrgFormFields(),
  };

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

  it('renders correctly', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = mount(
      <AppWrapper>
        <OrganizationForm {...formProps} />
      </AppWrapper>,
      { attachTo: div }
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(toJson(wrapper.find('FormItem#id label'))).toMatchSnapshot('id label');
    expect(toJson(wrapper.find('FormItem#id input'))).toMatchSnapshot('id field');

    expect(toJson(wrapper.find('FormItem#identifier label'))).toMatchSnapshot('identifier label');
    expect(toJson(wrapper.find('FormItem#identifier input'))).toMatchSnapshot('identifier field');

    expect(toJson(wrapper.find('FormItem#name label'))).toMatchSnapshot('name label');
    expect(toJson(wrapper.find('FormItem#name input'))).toMatchSnapshot('name field');

    expect(toJson(wrapper.find('FormItem#alias label'))).toMatchSnapshot('alias label');
    expect(toJson(wrapper.find('FormItem#alias input'))).toMatchSnapshot('alias field');

    expect(toJson(wrapper.find('FormItem#status label').first())).toMatchSnapshot('status label');
    expect(toJson(wrapper.find('FormItem#status input'))).toMatchSnapshot('status field');

    expect(toJson(wrapper.find('FormItem#type label').first())).toMatchSnapshot('type label');
    expect(toJson(wrapper.find('FormItem#type select'))).toMatchSnapshot('type field');

    expect(toJson(wrapper.find('FormItem#members label'))).toMatchSnapshot('members label');
    expect(toJson(wrapper.find('FormItem#members select'))).toMatchSnapshot('members field');

    expect(toJson(wrapper.find('#submit-button button'))).toMatchSnapshot('submit button');
    expect(toJson(wrapper.find('#cancel-button button'))).toMatchSnapshot('cancel button');

    wrapper.find('button#cancel-button').simulate('click');
    wrapper.unmount();
  });

  it('form validation works', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = mount(
      <AppWrapper>
        <OrganizationForm {...formProps} />
      </AppWrapper>,
      { attachTo: div }
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    await waitFor(() => {
      const atLeastOneError = document.querySelector('.ant-form-item-explain-error');
      expect(atLeastOneError).toBeInTheDocument();
    });

    // not required
    expect(wrapper.find('FormItem#id').text()).toMatchInlineSnapshot(`"Id"`);

    // name is required and has no default
    expect(wrapper.find('FormItem#name').text()).toMatchInlineSnapshot(`"NameRequired"`);

    // alias is not required required and has no default
    expect(wrapper.find('FormItem#alias').text()).toMatchInlineSnapshot(`"Alias"`);

    // status has no
    expect(wrapper.find('FormItem#status').text()).toMatchInlineSnapshot(`"StatusactiveInactive"`);

    // has default value
    expect(wrapper.find('FormItem#type').text()).toMatchInlineSnapshot(`"TypeOrganizational team"`);

    // not required
    expect(wrapper.find('FormItem#members').text()).toMatchSnapshot(
      `"Practitioners Select user (practitioners only)"`
    );

    wrapper.unmount();
  });

  it('submits new organization and practitioner roles', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const successNoticeMock = jest
      .spyOn(notifications, 'sendSuccessNotification')
      .mockImplementation(() => undefined);

    const someMockURL = '/someURL';

    nock(formProps.fhirBaseUrl)
      .post(`/${organizationResourceType}`, createdOrg)
      .reply(200, { ...createdOrg, id: '123' })
      .post(`/${practitionerRoleResourceType}`, createdRole2)
      .reply(200, {})
      .persist();

    const wrapper = mount(
      <AppWrapper>
        <OrganizationForm successUrl={someMockURL} {...formProps} />
      </AppWrapper>,
      { attachTo: container }
    );

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
      .simulate('change', { target: { name: 'name', value: 'Seal team' } });

    wrapper
      .find('FormItem#alias input')
      .simulate('change', { target: { name: 'alias', value: 'ghosts' } });

    // simulate value selection for members
    wrapper.find('input#members').simulate('mousedown');

    const optionTexts = [
      ...document.querySelectorAll(
        '#members_list+div.rc-virtual-list .ant-select-item-option-content'
      ),
    ].map((option) => {
      return option.textContent;
    });

    expect(optionTexts).toHaveLength(5);
    expect(optionTexts).toEqual([
      'Practitioner/5123',
      'Bobi mapesa',
      'Ward N Williams MD',
      'Allay Allan',
      'test fhir',
    ]);

    // filter searching through members works
    await userEvents.type(document.querySelector('input#members'), 'allan');

    // options after search
    const afterFilterOptionTexts = [
      ...document.querySelectorAll(
        '#members_list+div.rc-virtual-list .ant-select-item-option-content'
      ),
    ].map((option) => {
      return option.textContent;
    });

    expect(afterFilterOptionTexts).toHaveLength(1);
    expect(afterFilterOptionTexts).toEqual(['Allay Allan']);

    fireEvent.click(document.querySelector('[title="Allay Allan"]'));

    await flushPromises();
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await waitFor(() => {
      expect(successNoticeMock.mock.calls).toEqual([
        ['Organization updated successfully'],
        ['Practitioner assignments updated successfully'],
      ]);
    });

    expect(nock.isDone()).toBeTruthy();
    wrapper.unmount();
  });

  it('cancel handler is called on cancel', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const cancelUrl = '/canceled';

    const wrapper = mount(
      <AppWrapper>
        <OrganizationForm cancelUrl={cancelUrl} {...formProps} />
      </AppWrapper>,

      { attachTo: container }
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('button#cancel-button').simulate('click');
    wrapper.update();

    expect(history.location.pathname).toEqual('/canceled');
    wrapper.unmount();
  });

  it('Edits organization and associated practitioners', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const successNoticeMock = jest
      .spyOn(notifications, 'sendSuccessNotification')
      .mockImplementation(() => undefined);

    const errorNoticeMock = jest
      .spyOn(notifications, 'sendErrorNotification')
      .mockImplementation(() => undefined);

    nock(formProps.fhirBaseUrl)
      .put(`/${organizationResourceType}/${org105.id}`, editedOrg)
      .reply(200, editedOrg)
      .delete(`/${practitionerRoleResourceType}/392`)
      .reply(200, {})
      .post(`/${practitionerRoleResourceType}`, createdRole1)
      .replyWithError('Failed operation outcome')
      .persist();

    const existingPractitionerRoles =
      getResourcesFromBundle<IPractitionerRole>(org105Practitioners);

    const initialValues = getOrgFormFields(org105, existingPractitionerRoles);

    const localProps = {
      ...formProps,
      initialValues,
      existingPractitionerRoles,
    };

    const wrapper = mount(
      <AppWrapper>
        <OrganizationForm {...localProps} />
      </AppWrapper>,
      { attachTo: container }
    );

    // simulate name change
    wrapper
      .find('FormItem#name input')
      .simulate('change', { target: { name: 'name', value: 'Owls of Minerva' } });

    // simulate active check to be active
    wrapper
      .find('FormItem#status input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate value selection for members
    wrapper.find('input#members').simulate('mousedown');
    // check options
    document
      .querySelectorAll('#members_list .ant-select-item ant-select-item-option')
      .forEach((option) => {
        expect(option).toMatchSnapshot('practitioner option');
      });

    fireEvent.click(document.querySelector('[title="test fhir"]'));

    // remove one of the previously selected options - Bobi mapesa
    const bobiMapesaOption = wrapper.find('span[title="Bobi mapesa"]');
    const bobiRemoveAction = bobiMapesaOption.find('span.ant-select-selection-item-remove');

    bobiRemoveAction.simulate('click');

    wrapper
      .find('FormItem#alias input')
      .simulate('change', { target: { name: 'alias', value: 'Ss' } });

    await flushPromises();
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await waitFor(() => {
      expect(successNoticeMock.mock.calls).toEqual([['Organization updated successfully']]);
      expect(errorNoticeMock.mock.calls).toEqual([
        [
          'request to http://test.server.org/PractitionerRole failed, reason: Failed operation outcome',
        ],
      ]);
    });

    expect(nock.isDone()).toBeTruthy();

    wrapper.unmount();
  });
});
