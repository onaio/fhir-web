import { store } from '@opensrp/store';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { RouteComponentProps, Router } from 'react-router';
import { LocationForm } from '..';
import { defaultFormField, FormInstances, getLocationFormFields } from '../utils';
import { createBrowserHistory } from 'history';
import { authenticateUser } from '@onaio/session-reducer';
import { Form } from 'antd';
import {
  createdLocation1,
  duplicateLocationTags,
  fetchCalls1,
  generatedLocation2,
  generatedLocation4,
  generatedLocation4Dot1,
  location2,
  location4,
  locationSettings,
  locationTags,
  rawOpenSRPHierarchy1,
  serviceTypeSettings,
} from './fixtures';

const history = createBrowserHistory();

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => '9b782015-8392-4847-b48c-50c11638656b',
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('LocationForm', () => {
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
    fetch.resetMocks();
  });

  it('renders correctly', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    fetch.mockResponse(JSON.stringify([]));

    const wrapper = mount(
      <Router history={history}>
        <LocationForm />
      </Router>,
      { attachTo: div }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // getter fetch calls made
    expect(fetch.mock.calls).toEqual(fetchCalls1);

    expect(toJson(wrapper.find('#instance label'))).toMatchSnapshot('instance label');
    expect(toJson(wrapper.find('#instance input'))).toMatchSnapshot('instance field');

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
    expect(toJson(wrapper.find('#type label'))).toMatchSnapshot('type label');
    expect(toJson(wrapper.find('#type input'))).toMatchSnapshot('type field');
    expect(toJson(wrapper.find('#serviceType label'))).toMatchSnapshot('serviceType label');
    expect(toJson(wrapper.find('#serviceType input'))).toMatchSnapshot('serviceType field');
    expect(toJson(wrapper.find('#externalId label'))).toMatchSnapshot('externalId label');
    expect(toJson(wrapper.find('#externalId input'))).toMatchSnapshot('externalId field');
    expect(toJson(wrapper.find('#geometry label'))).toMatchSnapshot('geometry label');
    expect(toJson(wrapper.find('#geometry textarea'))).toMatchSnapshot('geometry field');
    expect(toJson(wrapper.find('#longitude label'))).toMatchSnapshot('longitude label');
    expect(toJson(wrapper.find('#longitude input'))).toMatchSnapshot('longitude field');
    expect(toJson(wrapper.find('#latitude label'))).toMatchSnapshot('latitude label');
    expect(toJson(wrapper.find('#latitude input'))).toMatchSnapshot('latitude field');
    expect(toJson(wrapper.find('#locationTags label'))).toMatchSnapshot('locationTags label');
    expect(toJson(wrapper.find('#locationTags input'))).toMatchSnapshot('locationTags field');

    wrapper.find('.extraFields').forEach((field) => {
      expect(toJson(field.find('label'))).toMatchSnapshot('field label');
      expect(toJson(field.find('input'))).toMatchSnapshot('field input');
    });

    expect(toJson(wrapper.find('#location-form-submit-button button'))).toMatchSnapshot(
      'submit button'
    );
    expect(toJson(wrapper.find('#location-form-cancel-button button'))).toMatchSnapshot(
      'cancel button'
    );
    wrapper.unmount();
  });

  it('form validation works for core instance', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    fetch.mockResponse(JSON.stringify([]));

    // when instance is set to core by default, types is required, serviceType is not required
    const wrapper = mount(
      <Router history={history}>
        <LocationForm />
      </Router>,
      { attachTo: div }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.find('FormItem#instance').text()).toMatchInlineSnapshot(`"Instance"`);

    expect(wrapper.find('FormItem#parentId').text()).toMatchInlineSnapshot(
      `"ParentSelect the parent location"`
    );

    expect(wrapper.find('FormItem#status').text()).toMatchInlineSnapshot(`"StatusActiveInactive"`);

    expect(wrapper.find('FormItem#isJurisdiction').text()).toMatchInlineSnapshot(
      `"Location categoryService pointJurisdiction"`
    );

    // type is required for core
    expect(wrapper.find('FormItem#type').text()).toMatchInlineSnapshot(
      `"TypeType can only contain letters, numbers and spaces"`
    );

    // name is required for core
    expect(wrapper.find('FormItem#name').text()).toMatchInlineSnapshot(`"NameName is required"`);

    // not required for core
    expect(wrapper.find('FormItem#serviceType').text()).toMatchInlineSnapshot(`"Type"`);

    expect(wrapper.find('FormItem#externalId').text()).toMatchInlineSnapshot(`"External ID"`);

    expect(wrapper.find('FormItem#geometry').text()).toMatchInlineSnapshot(`"Geometry"`);

    expect(wrapper.find('FormItem#locationTags').text()).toMatchSnapshot(
      'location Tags does not have error message'
    );

    wrapper.unmount();
  });

  it('form validation works for wrong data types', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    fetch.mockResponse(JSON.stringify([]));

    const wrapper = mount(
      <Router history={history}>
        <LocationForm />
      </Router>,
      { attachTo: div }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // set longitude, and latitude to invalid values
    wrapper
      .find('FormItem#longitude input')
      .simulate('change', { target: { value: '432dsff', name: 'longitude' } });

    wrapper
      .find('FormItem#latitude input')
      .simulate('change', { target: { value: '43f', name: 'latitude' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.find('FormItem#longitude').text()).toMatchInlineSnapshot(
      `"LongitudeOnly decimal values allowed"`
    );

    expect(wrapper.find('FormItem#latitude').text()).toMatchInlineSnapshot(
      `"LatitudeOnly decimal values allowed"`
    );

    wrapper.unmount();
  });

  it('form validation works for eusm instance', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    fetch.mockResponse(JSON.stringify([]));

    // when instance is set to core by default, types is required, serviceType is not required
    const initialValues = { ...defaultFormField, instance: FormInstances.EUSM };
    const wrapper = mount(
      <Router history={history}>
        <LocationForm initialValues={initialValues} />
      </Router>,
      {
        attachTo: div,
      }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.find('FormItem#instance').text()).toMatchInlineSnapshot(`"Instance"`);

    expect(wrapper.find('FormItem#parentId').text()).toMatchInlineSnapshot(
      `"ParentSelect the parent location'parentId' is required"`
    );

    expect(wrapper.find('FormItem#status').text()).toMatchInlineSnapshot(`"StatusActiveInactive"`);

    expect(wrapper.find('FormItem#isJurisdiction').text()).toMatchInlineSnapshot(
      `"Location categoryService pointJurisdiction"`
    );

    // type is required for core, but not required for eusm instance
    expect(wrapper.find('FormItem#type').text()).toMatchInlineSnapshot(`"Type"`);

    // name is required for core
    expect(wrapper.find('FormItem#name').text()).toMatchInlineSnapshot(`"NameName is required"`);

    // service types is required for eusm
    expect(wrapper.find('FormItem#serviceType').text()).toMatchInlineSnapshot(
      `"TypeService types is required"`
    );

    expect(wrapper.find('FormItem#externalId').text()).toMatchInlineSnapshot(`"External ID"`);

    expect(wrapper.find('FormItem#geometry').text()).toMatchInlineSnapshot(`"Geometry"`);

    expect(wrapper.find('FormItem#locationTags').text()).toMatchSnapshot(
      'location Tags does not have error message'
    );
    wrapper.unmount();
  });

  it('submits new location unit', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fetch.mockResponse(JSON.stringify([]));

    const wrapper = mount(
      <Router history={history}>
        <LocationForm />
      </Router>,
      { attachTo: container }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    // change parent Id
    formInstance.setFieldsValue({
      parentId: '51',
    });

    // simulate active check to be inactive
    wrapper
      .find('FormItem#status input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // set isJurisdiction to false
    wrapper
      .find('FormItem#isJurisdiction input')
      .first()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate type field change
    wrapper
      .find('FormItem#type input')
      .simulate('change', { target: { name: 'type', value: 'Feature' } });

    // simulate name change
    wrapper
      .find('FormItem#name input')
      .simulate('change', { target: { name: 'name', value: 'area51' } });

    // simulate service type change
    // change service types
    formInstance.setFieldsValue({
      serviceType: 'School',
    });

    wrapper
      .find('FormItem#externalId input')
      .simulate('change', { target: { name: 'externalId', value: 'secret' } });

    wrapper.find('FormItem#geometry textarea').simulate('change', {
      target: { value: JSON.stringify([19.92919921875, 30.135626231134587]) },
    });

    fetch.resetMocks();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=false',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(createdLocation1),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);

    wrapper.unmount();
  });

  it('correctly redirects on submit', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fetch.mockResponse(JSON.stringify([]));

    const someMockURL = '/someURL';
    const successURLGeneratorMock = jest.fn(() => someMockURL);

    const wrapper = mount(
      <Router history={history}>
        <LocationForm successURLGenerator={successURLGeneratorMock} />
      </Router>,
      { attachTo: container }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    // change parent Id
    formInstance.setFieldsValue({
      parentId: '51',
    });

    // simulate active check to be inactive
    wrapper
      .find('FormItem#status input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // set isJurisdiction to false
    wrapper
      .find('FormItem#isJurisdiction input')
      .first()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate type field change
    wrapper
      .find('FormItem#type input')
      .simulate('change', { target: { name: 'type', value: 'Feature' } });

    // simulate name change
    wrapper
      .find('FormItem#name input')
      .simulate('change', { target: { name: 'name', value: 'area51' } });

    // simulate service type change
    // change service types
    formInstance.setFieldsValue({
      serviceType: 'School',
    });

    wrapper
      .find('FormItem#externalId input')
      .simulate('change', { target: { name: 'externalId', value: 'secret' } });

    wrapper.find('FormItem#geometry textarea').simulate('change', {
      target: { value: JSON.stringify([19.92919921875, 30.135626231134587]) },
    });

    fetch.resetMocks();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(successURLGeneratorMock).toHaveBeenCalledWith(createdLocation1);
    expect(
      (wrapper.find('Router').props() as RouteComponentProps).history.location.pathname
    ).toEqual(someMockURL);
    wrapper.unmount();
  });

  it('cancel handler is called on cancel', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fetch.mockResponse(JSON.stringify([]));
    const cancelMock = jest.fn();

    const wrapper = mount(
      <Router history={history}>
        <LocationForm onCancel={cancelMock} />
      </Router>,
      { attachTo: container }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
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

    fetch
      .once(JSON.stringify([location2]))
      .once(JSON.stringify(serviceTypeSettings))
      .once(JSON.stringify(locationTags))
      .once(JSON.stringify(locationSettings))
      .once(JSON.stringify(rawOpenSRPHierarchy1));

    const initialValues = getLocationFormFields(location2);

    const locationFormProps = {
      initialValues,
    };

    const wrapper = mount(
      <Router history={history}>
        <LocationForm {...locationFormProps} />
      </Router>,
      { attachTo: container }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // put this here to help guide to know how to mock the fetch calls
    expect(fetch.mock.calls.map((call) => call[0])).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
      'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=service_point_types',
      'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
      'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=location_settings',
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/95310ca2-02df-47ba-80fc-bf31bfaa88d7?return_structure_count=false',
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    // simulate active check to be inactive
    wrapper
      .find('FormItem#status input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate name change
    wrapper
      .find('FormItem#name input')
      .simulate('change', { target: { name: 'name', value: 'Mars' } });

    // simulate service type change
    // change service types
    formInstance.setFieldsValue({
      serviceType: 'School',
    });

    wrapper
      .find('FormItem#externalId input')
      .simulate('change', { target: { name: 'externalId', value: 'alien' } });

    const geometry = {
      type: 'Point',
      coordinates: [19.92919921875, 30.135626231134587],
    };

    wrapper.find('FormItem#geometry textarea').simulate('change', {
      target: { value: JSON.stringify(geometry) },
    });

    // extra fields
    expect(wrapper.find('FormItem.extra-fields')).toHaveLength(4);
    wrapper.find('FormItem.extra-fields').forEach((field) => {
      // snapshot of label
      expect(toJson(field.find('label'))).toMatchSnapshot('field label');
      expect(toJson(field.find('input'))).toMatchSnapshot('field input');

      // fill the fields
      field
        .find('input')
        .simulate('change', { target: { value: `extraFields - ${field.find('label').text()}` } });
    });

    fetch.resetMocks();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(generatedLocation2),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);

    wrapper.unmount();
  });

  it('Editing latitude and longitudes works fine', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fetch
      .once(JSON.stringify([location2]))
      .once(JSON.stringify(serviceTypeSettings))
      .once(JSON.stringify(locationTags))
      .once(JSON.stringify(locationSettings))
      .once(JSON.stringify(rawOpenSRPHierarchy1));

    const initialValues = getLocationFormFields(location4);

    const locationFormProps = {
      initialValues,
    };

    const wrapper = mount(
      <Router history={history}>
        <LocationForm {...locationFormProps} />
      </Router>,

      { attachTo: container }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    // simulate service type change
    // change service types
    formInstance.setFieldsValue({
      serviceType: 'School',
    });

    wrapper.find('FormItem#latitude input').simulate('change', {
      target: { value: '34.56' },
    });

    wrapper.find('FormItem#longitude input').simulate('change', {
      target: { value: '19.56' },
    });

    fetch.resetMocks();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(generatedLocation4),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
    wrapper.unmount();
  });

  it('#595 Duplicate location Tags failing upload', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fetch
      .once(JSON.stringify([location2]))
      .once(JSON.stringify(serviceTypeSettings))
      .once(JSON.stringify(duplicateLocationTags))
      .once(JSON.stringify(locationSettings))
      .once(JSON.stringify(rawOpenSRPHierarchy1));

    const initialValues = getLocationFormFields(location4);

    const locationFormProps = {
      initialValues,
    };

    const wrapper = mount(
      <Router history={history}>
        <LocationForm {...locationFormProps} />
      </Router>,

      { attachTo: container }
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    fetch.mockReset();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    /** payload does not contain duplicate entries in locationTags field*/
    expect(generatedLocation4Dot1.locationTags).toHaveLength(1);
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(generatedLocation4Dot1),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
    wrapper.unmount();
  });
});
