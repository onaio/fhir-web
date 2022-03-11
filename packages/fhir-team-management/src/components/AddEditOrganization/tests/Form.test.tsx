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
import { cleanup, fireEvent, waitFor, screen } from '@testing-library/react';
import flushPromises from 'flush-promises';
import { organizationResourceType, practitionerRoleResourceType } from '../../../constants';
import { allPractitioners, createdOrg, createdRole2 } from './fixtures';
import { getResourcesFromBundle } from '@opensrp/react-utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';

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
    expect(wrapper.find('FormItem#status').text()).toMatchInlineSnapshot(
      `"StatusInactiveactiveRequired"`
    );

    // has default value
    expect(wrapper.find('FormItem#type').text()).toMatchInlineSnapshot(`"Type"`);

    // not required
    expect(wrapper.find('FormItem#members').text()).toMatchSnapshot(
      `"Practitioners Select user (practitioners only)"`
    );

    wrapper.unmount();
  });

  it('submits new organization and practitioner roles', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

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
      .last()
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
    // check options
    document
      .querySelectorAll('#members_list .ant-select-item ant-select-item-option')
      .forEach((option) => {
        expect(option).toMatchSnapshot('practitioner option');
      });

    fireEvent.click(document.querySelector('[title="Allay, Allan"]'));

    // simulate value selection for type
    wrapper.find('input#type').simulate('mousedown');
    document
      .querySelectorAll('#type_list .ant-select-item ant-select-item-option')
      .forEach((option) => {
        expect(option).toMatchSnapshot('types option');
      });

    fireEvent.click(document.querySelector('[title="Organizational team"]'));

    await flushPromises();
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await waitFor(() => {
      expect(screen.getByText(/Organization updated successfully/)).toBeInTheDocument();
      expect(screen.getByText(/Practitioner assignments updated successfully/)).toBeInTheDocument();
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
});
