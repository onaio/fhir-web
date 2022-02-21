import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import { LocationForm } from '..';
import { getLocationFormFields } from '../utils';
import { createBrowserHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import { Form } from 'antd';
import { createdLocation1, createdLocation2 } from './fixtures';
import nock, { RequestBodyMatcher } from 'nock';
import { QueryClientProvider, QueryClient } from 'react-query';
import { locationHierarchyResourceType } from '../CustomTreeSelect';
import { fhirHierarchy } from '../../../ducks/tests/fixtures';
import { convertApiResToTree } from '../../../helpers/utils';
import flushPromises from 'flush-promises';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();
nock.disableNetConnect();

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

describe('LocationForm', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
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

  const tree = convertApiResToTree(fhirHierarchy);
  const formProps = {
    fhirBaseURL: 'http://test.server.org',
    fhirRootLocationIdentifier: 'potus',
    tree,
  };

  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('renders correctly', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    nock(formProps.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: formProps.fhirRootLocationIdentifier })
      .reply(200, fhirHierarchy)
      .persist();

    const wrapper = mount(
      <AppWrapper>
        <LocationForm {...formProps} />
      </AppWrapper>,
      { attachTo: div }
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(toJson(wrapper.find('#parentId label'))).toMatchSnapshot('parentId label');
    expect(toJson(wrapper.find('#parentId select'))).toMatchSnapshot('parentId field');

    expect(toJson(wrapper.find('#name label'))).toMatchSnapshot('name label');
    expect(toJson(wrapper.find('#name input'))).toMatchSnapshot('name field');

    expect(toJson(wrapper.find('#status label').first())).toMatchSnapshot('status label');
    expect(toJson(wrapper.find('#status input'))).toMatchSnapshot('status field');

    expect(toJson(wrapper.find('#isJurisdiction label').first())).toMatchSnapshot(
      'isJurisdiction label'
    );
    expect(toJson(wrapper.find('#isJurisdiction input'))).toMatchSnapshot('isJurisdiction field');

    expect(toJson(wrapper.find('#description label'))).toMatchSnapshot('description label');
    expect(toJson(wrapper.find('#description textarea'))).toMatchSnapshot('description field');

    expect(toJson(wrapper.find('#location-form-submit-button button'))).toMatchSnapshot(
      'submit button'
    );
    expect(toJson(wrapper.find('#location-form-cancel-button button'))).toMatchSnapshot(
      'cancel button'
    );
    wrapper.unmount();
  });

  it('form validation works', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    nock(formProps.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: formProps.fhirRootLocationIdentifier })
      .reply(200, fhirHierarchy)
      .persist();

    // when instance is set to core by default, types is required, serviceType is not required
    const wrapper = mount(
      <AppWrapper>
        <LocationForm {...formProps} />
      </AppWrapper>,
      { attachTo: div }
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // not required
    expect(wrapper.find('FormItem#parentId').text()).toMatchInlineSnapshot(
      `"Part OfSelect the parent location"`
    );

    // name is required and has not default
    expect(wrapper.find('FormItem#name').text()).toMatchInlineSnapshot(`"NameName is required"`);

    // status has default value
    expect(wrapper.find('FormItem#status').text()).toMatchInlineSnapshot(
      `"StatusActiveInactiveSuspended"`
    );

    // has default value
    expect(wrapper.find('FormItem#isJurisdiction').text()).toMatchInlineSnapshot(
      `"Physical TypeBuildingJurisdiction"`
    );

    expect(wrapper.find('FormItem#alias').text()).toMatchInlineSnapshot(`"Alias"`);

    // not required
    expect(wrapper.find('FormItem#description').text()).toMatchInlineSnapshot(`"Description"`);

    wrapper.unmount();
  });

  it('submits new location unit', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    nock(formProps.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: formProps.fhirRootLocationIdentifier })
      .reply(200, fhirHierarchy)
      .post('/Location', (createdLocation1 as unknown) as RequestBodyMatcher)
      .reply(201, {})
      .persist();

    const someMockURL = '/someURL';
    const successURLGeneratorMock = jest.fn(() => someMockURL);

    const wrapper = mount(
      <AppWrapper>
        <LocationForm successURLGenerator={successURLGeneratorMock} {...formProps} />
      </AppWrapper>,
      { attachTo: container }
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    // change parent Id
    formInstance.setFieldsValue({
      parentId: 'Location/303',
    });

    wrapper.update();

    // simulate active check to be suspended
    wrapper
      .find('FormItem#status input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // set isJurisdiction to structure
    wrapper
      .find('FormItem#isJurisdiction input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate name change
    wrapper
      .find('FormItem#name input')
      .simulate('change', { target: { name: 'name', value: 'area51' } });

    wrapper
      .find('FormItem#alias input')
      .simulate('change', { target: { name: 'alias', value: 'creepTown' } });

    wrapper.find('FormItem#description textarea').simulate('change', {
      target: {
        value:
          'The secret Nevada base, known as Area 51, is often the subject of alien conspiracy theories.',
      },
    });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    wrapper.unmount();
  });

  it('cancel handler is called on cancel', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    nock(formProps.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: formProps.fhirRootLocationIdentifier })
      .reply(200, fhirHierarchy)

      .persist();

    const cancelMock = jest.fn();

    const wrapper = mount(
      <AppWrapper>
        <LocationForm onCancel={cancelMock} {...formProps} />
      </AppWrapper>,

      { attachTo: container }
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('button#location-form-cancel-button').simulate('click');
    wrapper.update();

    expect(cancelMock).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('is able to edit a location unit', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    nock(formProps.fhirBaseURL)
      .get(`/${locationHierarchyResourceType}/_search`)
      .query({ identifier: formProps.fhirRootLocationIdentifier })
      .reply(200, fhirHierarchy)
      .post('/Location', (createdLocation2 as unknown) as RequestBodyMatcher)
      .reply(201, {})
      .persist();

    const initialValues = getLocationFormFields(createdLocation1);

    const wrapper = mount(
      <AppWrapper>
        <LocationForm initialValues={initialValues} {...formProps} />
      </AppWrapper>,
      { attachTo: container }
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // simulate active check to be active
    wrapper
      .find('FormItem#status input')
      .first()
      .simulate('change', {
        target: { checked: true },
      });

    // set isJurisdiction to structure
    wrapper
      .find('FormItem#isJurisdiction input')
      .first()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate name change
    wrapper
      .find('FormItem#name input')
      .simulate('change', { target: { name: 'name', value: 'Yosemite' } });

    wrapper
      .find('FormItem#alias input')
      .simulate('change', { target: { name: 'alias', value: 'world wonder' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.unmount();
  });
});
