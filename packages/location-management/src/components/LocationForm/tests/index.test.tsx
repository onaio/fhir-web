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
import { render, fireEvent, waitFor } from '@testing-library/react';
import flushPromises from 'flush-promises';

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
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
      await flushPromises();
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
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await waitFor(() => {
      const atLeastOneError = document.querySelector('.ant-form-item-explain-error');
      expect(atLeastOneError).toBeInTheDocument();
    });

    expect(wrapper.find('#instance .ant-form-item').text()).toMatchInlineSnapshot(`"Instance"`);

    expect(wrapper.find('#parentId .ant-form-item').text()).toMatchInlineSnapshot(
      `"ParentSelect the parent location"`
    );

    expect(wrapper.find('#status .ant-form-item').text()).toMatchInlineSnapshot(`"StatusActiveInactive"`);

    expect(wrapper.find('#isJurisdiction .ant-form-item').text()).toMatchInlineSnapshot(
      `"Location categoryService pointJurisdiction"`
    );

    // name is required for core
    expect(wrapper.find('#name .ant-form-item').text()).toMatchInlineSnapshot(`"NameName is required"`);

    // not required for core
    expect(wrapper.find('#serviceType .ant-form-item').text()).toMatchInlineSnapshot(
      `"TypeSelect the service point type"`
    );

    expect(wrapper.find('#externalId .ant-form-item').text()).toMatchInlineSnapshot(`"External ID"`);

    expect(wrapper.find('#geometry .ant-form-item').text()).toMatchInlineSnapshot(`"Geometry"`);

    expect(wrapper.find('#locationTags .ant-form-item').text()).toMatchSnapshot(
      'location Tags does not have error message'
    );

    wrapper.unmount();
  });

  it('form validation works for wrong data types', async () => {
    fetch.mockResponse(JSON.stringify([]));

    const { getByLabelText, getByText, getAllByText, unmount } = render(
      <Router history={history}>
        <LocationForm />
      </Router>
    );

    const longitudeInput = getByLabelText('Longitude');
    const latitudeInput = getByLabelText('Latitude');
    fireEvent.change(longitudeInput, { target: { value: '432dsff', name: 'longitude' } });
    fireEvent.change(latitudeInput, { target: { value: '43f', name: 'latitude' } });

    const submitButton = getByText('Save');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getAllByText('Only decimal values allowed')).toHaveLength(2);
    });

    unmount();
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
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await waitFor(() => {
      const atLeastOneError = document.querySelector('.ant-form-item-explain-error');
      expect(atLeastOneError).toBeInTheDocument();
    });

    expect(wrapper.find('#instance .ant-form-item').text()).toMatchInlineSnapshot(`"Instance"`);

    expect(wrapper.find('InternalFormItem #parentId .ant-form-item').text()).toMatchInlineSnapshot(
      `"ParentSelect the parent location'parentId' is required"`
    );

    expect(wrapper.find('#status .ant-form-item').text()).toMatchInlineSnapshot(`"StatusActiveInactive"`);

    expect(wrapper.find('#isJurisdiction .ant-form-item').text()).toMatchInlineSnapshot(
      `"Location categoryService pointJurisdiction"`
    );

    console.log(toJson(wrapper.find('#name').at(5)))
    // name is required for core
    expect(wrapper.find('#name .ant-form-item').text()).toMatchInlineSnapshot(`"NameName is required"`);

    // service types is required for eusm
    expect(wrapper.find('#serviceType .ant-form-item').text()).toMatchInlineSnapshot(
      `"TypeSelect the service point typeService types is required"`
    );

    expect(wrapper.find('#externalId .ant-form-item').text()).toMatchInlineSnapshot(`"External ID"`);

    expect(wrapper.find('#geometry .ant-form-item').text()).toMatchInlineSnapshot(`"Geometry"`);

    expect(wrapper.find('#locationTags .ant-form-item').text()).toMatchSnapshot(
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
      await flushPromises();
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
      .find('#status .ant-form-item input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // set isJurisdiction to false
    wrapper
      .find('#isJurisdiction .ant-form-item input')
      .first()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate name change
    wrapper
      .find('#name .ant-form-item input')
      .simulate('change', { target: { name: 'name', value: 'area51' } });

    // simulate service type change
    // change service types
    formInstance.setFieldsValue({
      serviceType: 'School',
    });

    wrapper
      .find('#externalId .ant-form-item input')
      .simulate('change', { target: { name: 'externalId', value: 'secret' } });

    wrapper.find('#geometry textarea').simulate('change', {
      target: { value: JSON.stringify([19.92919921875, 30.135626231134587]) },
    });

    fetch.resetMocks();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
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
      await flushPromises();
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
      .find('#status .ant-form-item input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // set isJurisdiction to false
    wrapper
      .find('#isJurisdiction .ant-form-item input')
      .first()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate name change
    wrapper
      .find('#name .ant-form-item input')
      .simulate('change', { target: { name: 'name', value: 'area51' } });

    // simulate service type change
    // change service types
    formInstance.setFieldsValue({
      serviceType: 'School',
    });

    wrapper
      .find('#externalId .ant-form-item input')
      .simulate('change', { target: { name: 'externalId', value: 'secret' } });

    wrapper.find('#geometry .ant-form-item textarea').simulate('change', {
      target: { value: JSON.stringify([19.92919921875, 30.135626231134587]) },
    });

    fetch.resetMocks();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
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
      await flushPromises();
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
      .find('#status .ant-form-item input')
      .last()
      .simulate('change', {
        target: { checked: true },
      });

    // simulate name change
    wrapper
      .find('#name .ant-form-item input')
      .simulate('change', { target: { name: 'name', value: 'Mars' } });

    // simulate service type change
    // change service types
    formInstance.setFieldsValue({
      serviceType: 'School',
    });

    wrapper
      .find('#externalId .ant-form-item input')
      .simulate('change', { target: { name: 'externalId', value: 'alien' } });

    const geometry = {
      type: 'Point',
      coordinates: [19.92919921875, 30.135626231134587],
    };

    wrapper.find('#geometry .ant-form-item textarea').simulate('change', {
      target: { value: JSON.stringify(geometry) },
    });

    // extra fields
    expect(wrapper.find('.extra-fields .ant-form-item')).toHaveLength(4);
    wrapper.find('.ant-form-item.extra-fields').forEach((field) => {
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
      await flushPromises();
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
      await flushPromises();
      wrapper.update();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    // simulate service type change
    // change service types
    formInstance.setFieldsValue({
      serviceType: 'School',
    });

    wrapper.find('#latitude .ant-form-item input').simulate('change', {
      target: { value: '34.56' },
    });

    wrapper.find('#longitude .ant-form-item input').simulate('change', {
      target: { value: '19.56' },
    });

    fetch.resetMocks();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
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
      await flushPromises();
      wrapper.update();
    });

    fetch.mockReset();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
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

  it('issue 850 - form re renders invalidates and clears filled in values', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const MockComponent = () => {
      const [counter, setCounter] = React.useState<number>(0);
      const props = {
        initialValues: { ...getLocationFormFields(), latitude: undefined, longitude: undefined },
        filterByParentId: false,
        successURLGenerator: () => '/',
        hidden: [],
        disabled: [],
        onCancel: () => void 0,
        username: '',
        opensrpBaseURL: 'http://example.com',
        afterSubmit: () => {
          return;
        },
      };

      return (
        <>
          <button id="render" onClick={() => setCounter(counter + 1)}></button>
          <LocationForm {...props} />
        </>
      );
    };

    fetch.mockResponse(JSON.stringify([]));

    const wrapper = mount(
      <Router history={history}>
        <MockComponent />
      </Router>,
      { attachTo: div }
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    let formValues = formInstance.getFieldsValue();
    expect(formValues.latitude).toBeUndefined();
    expect(formValues.longitude).toBeUndefined();

    wrapper.find('#latitude .ant-form-item input').simulate('change', {
      target: { value: '34.56' },
    });

    wrapper.find('#longitude .ant-form-item input').simulate('change', {
      target: { value: '19.56' },
    });

    wrapper.update();

    // expect that the above data is recorded by form.
    formValues = formInstance.getFieldsValue();
    expect(formValues.latitude).toEqual('34.56');
    expect(formValues.longitude).toEqual('19.56');

    // force a rerender that reloads initial values in form
    wrapper.find('#render').simulate('click');
    wrapper.update();

    // see if the values that were field above persisted,
    // the before behavior is that the below fields would have taken their initialValues which is undefined
    formValues = formInstance.getFieldsValue();
    expect(formValues.latitude).toEqual('34.56');
    expect(formValues.longitude).toEqual('19.56');

    wrapper.unmount();
  });
});