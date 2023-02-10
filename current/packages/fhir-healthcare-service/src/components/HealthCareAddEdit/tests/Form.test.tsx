import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import { HealthCareForm } from '../Form';
import { createBrowserHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import nock from 'nock';
import { QueryClientProvider, QueryClient } from 'react-query';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import flushPromises from 'flush-promises';
import { healthCareServiceResourceType } from '../../../constants';
import { allOrgs, createdHealthCareService, editedHealthCare, healthCare313 } from './fixtures';
import { getResourcesFromBundle } from '@opensrp/react-utils';
import { getHealthCareFormFields } from '../utils';
import * as notifications from '@opensrp/notifications';
import userEvents from '@testing-library/user-event';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';

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

describe('Health care form', () => {
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
    organizations: getResourcesFromBundle<IOrganization>(allOrgs),
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
        <HealthCareForm {...formProps} />
      </AppWrapper>,
      { attachTo: div }
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(toJson(wrapper.find('FormItem#name label'))).toMatchSnapshot('name label');
    expect(toJson(wrapper.find('FormItem#name input'))).toMatchSnapshot('name field');

    expect(toJson(wrapper.find('FormItem#active label').first())).toMatchSnapshot('active label');
    expect(toJson(wrapper.find('FormItem#active input'))).toMatchSnapshot('active field');

    expect(toJson(wrapper.find('FormItem#comment label').first())).toMatchSnapshot('comment label');
    expect(toJson(wrapper.find('FormItem#comment textarea'))).toMatchSnapshot('comment field');

    expect(toJson(wrapper.find('FormItem#extra-details label').first())).toMatchSnapshot(
      'extraDetails label'
    );
    expect(toJson(wrapper.find('FormItem#extra-details textarea'))).toMatchSnapshot(
      'extraDetails field'
    );

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
        <HealthCareForm {...formProps} />
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

    // name is required and has no default
    expect(wrapper.find('FormItem#name').text()).toMatchInlineSnapshot(`"NameRequired"`);

    // comment is not required required and has no default
    expect(wrapper.find('FormItem#comment').text()).toMatchInlineSnapshot(`"Comment"`);

    // status has no
    expect(wrapper.find('FormItem#active').text()).toMatchInlineSnapshot(
      `"StatusInactiveactiveRequired"`
    );

    // not required
    expect(wrapper.find('FormItem#extraDetails').text()).toMatchInlineSnapshot(`"Extra details"`);

    // not required?
    expect(wrapper.find('FormItem#providedBy').text()).toMatchSnapshot(
      `"Practitioners Select user (practitioners only)"`
    );

    wrapper.unmount();
  });

  it('submits new health care', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const successNoticeMock = jest
      .spyOn(notifications, 'sendSuccessNotification')
      .mockImplementation(() => undefined);

    const someMockURL = '/someURL';

    nock(formProps.fhirBaseUrl)
      .put(
        `/${healthCareServiceResourceType}/9b782015-8392-4847-b48c-50c11638656b`,
        createdHealthCareService
      )
      .reply(200, { ...createdHealthCareService, id: '123' })
      .persist();

    const wrapper = mount(
      <AppWrapper>
        <HealthCareForm successUrl={someMockURL} {...formProps} />
      </AppWrapper>,
      { attachTo: container }
    );

    // simulate active change
    wrapper
      .find('FormItem#active input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate name change
    wrapper
      .find('FormItem#name input')
      .simulate('change', { target: { name: 'name', value: 'Good doctor' } });

    wrapper
      .find('FormItem#comment textarea')
      .simulate('change', { target: { name: 'alias', value: 'Best services ever' } });

    wrapper.find('FormItem#extraDetails textarea').simulate('change', {
      target: { name: 'alias', value: 'Treatment using cutting-edge stuff' },
    });

    // simulate value selection for members
    wrapper.find('input#providedBy').simulate('mousedown');

    const optionTexts = [
      ...document.querySelectorAll(
        '#providedBy_list+div.rc-virtual-list .ant-select-item-option-content'
      ),
    ].map((option) => {
      return option.textContent;
    });

    expect(optionTexts).toHaveLength(5);
    expect(optionTexts).toEqual([
      'Test Team 4',
      'Test Team 5',
      'Test Team 5',
      'Test Team 5',
      'Test Team One',
    ]);

    // filter searching through members works
    await userEvents.type(document.querySelector('input#providedBy'), 'one');

    // options after search
    const afterFilterOptionTexts = [
      ...document.querySelectorAll(
        '#providedBy_list+div.rc-virtual-list .ant-select-item-option-content'
      ),
    ].map((option) => {
      return option.textContent;
    });

    expect(afterFilterOptionTexts).toHaveLength(1);
    expect(afterFilterOptionTexts).toEqual(['Test Team One']);

    fireEvent.click(document.querySelector('[title="Test Team One"]'));

    await flushPromises();
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await waitFor(() => {
      expect(successNoticeMock.mock.calls).toEqual([['Health care service updated successfully']]);
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
        <HealthCareForm cancelUrl={cancelUrl} {...formProps} />
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

  it('edits resource', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const errorNoticeMock = jest
      .spyOn(notifications, 'sendErrorNotification')
      .mockImplementation(() => undefined);

    nock(formProps.fhirBaseUrl)
      .put(`/${healthCareServiceResourceType}/${healthCare313.id}`, editedHealthCare)
      .replyWithError('Failed to update healthCare')
      .persist();

    const initialValues = getHealthCareFormFields(healthCare313);

    const localProps = {
      ...formProps,
      initialValues,
    };

    const wrapper = mount(
      <AppWrapper>
        <HealthCareForm {...localProps} />
      </AppWrapper>,
      { attachTo: container }
    );

    // simulate name change
    wrapper
      .find('FormItem#name input')
      .simulate('change', { target: { name: 'name', value: 'Medieval healers' } });

    // simulate active check to be active
    wrapper
      .find('FormItem#active input')
      .first()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate value selection for members
    wrapper.find('input#providedBy').simulate('mousedown');
    // check options
    document
      .querySelectorAll('#providedBy_list .ant-select-item ant-select-item-option')
      .forEach((option) => {
        expect(option).toMatchSnapshot('organizations option');
      });

    fireEvent.click(document.querySelector('[title="Test Team 4"]'));

    wrapper
      .find('FormItem#comment textarea')
      .simulate('change', { target: { name: 'alias', value: 'Eat shrubs' } });

    await flushPromises();
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await waitFor(() => {
      expect(errorNoticeMock.mock.calls).toEqual([
        [
          'request to http://test.server.org/HealthcareService/313 failed, reason: Failed to update healthCare',
        ],
      ]);
    });

    expect(nock.isDone()).toBeTruthy();

    wrapper.unmount();
  });
});
