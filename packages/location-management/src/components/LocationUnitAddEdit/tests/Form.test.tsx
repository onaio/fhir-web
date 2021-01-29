/* eslint-disable @typescript-eslint/camelcase */
import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import { notification } from 'antd';
import fetch from 'jest-fetch-mock';
import { formValue, locationUnitgroups, parsedHierarchy, locationSettings } from './fixtures';
import { LocationForm, findParentGeoLocation, onSubmit, removeEmptykeys } from '../Form';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { authenticateUser } from '@onaio/session-reducer';
import { baseURL, ERROR_OCCURED } from '../../../constants';
import toJson from 'enzyme-to-json';
import { defaultFormField, FormInstances } from '../utils';

describe('location-management/src/components/LocationUnitAddEdit', () => {
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

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm
            openSRPBaseURL={baseURL}
            locationUnitGroup={locationUnitgroups}
            treeData={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('creates new location unit', async () => {
    const mockNotificationSuccess = jest.spyOn(notification, 'success');

    await onSubmit(
      jest.fn,
      formValue,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      locationSettings
    );
    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: fetch.mock.calls[0][1].body,
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);

    expect(mockNotificationSuccess).toHaveBeenCalledWith({
      description: undefined,
      message: 'Location Unit Created successfully',
    });
  });

  it('test removeEmptykeys from payload ', async () => {
    const obj = {
      key: 'value',
      testa: undefined,
      testb: [],
      testc: null,
      testd: '',
      child: {
        key: 'value',
        testa: undefined,
        testb: [],
        testc: null,
      },
    };
    removeEmptykeys(obj);

    expect(obj).toMatchObject({
      key: 'value',
      child: { key: 'value' },
    });
  });

  it('checks geo level is calculated correctly', async () => {
    expect(findParentGeoLocation(parsedHierarchy, '400e9d97-4640-44f5-af54-6f4b314384f5')).toEqual(
      5
    );

    expect(findParentGeoLocation(parsedHierarchy, 'a26ca9c8-1441-495a-83b6-bb5df7698996')).toEqual(
      0
    );

    expect(findParentGeoLocation(parsedHierarchy, 'test')).toEqual(undefined);
  });

  it('handles error when creating new location unit', async () => {
    fetch.mockReject(() => Promise.reject(ERROR_OCCURED));
    const mockNotificationError = jest.spyOn(notification, 'error');

    await onSubmit(
      jest.fn,
      formValue,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      []
    );
    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: ERROR_OCCURED,
    });
  });

  it('edits location unit successfully', async () => {
    const mockNotificationSuccess = jest.spyOn(notification, 'success');
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm
            openSRPBaseURL={baseURL}
            locationUnitGroup={locationUnitgroups}
            treeData={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    await onSubmit(
      jest.fn,
      {
        ...formValue,
        parentId: '400e9d97-4640-44f5-af54-6f4b314384f5',
        id: '1',
        serviceTypes: ['Test service type'],
      },
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      []
    );

    expect(fetch.mock.calls[1]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          is_jurisdiction: true,
          properties: {
            geographicLevel: 6,
            username: 'user_test',
            parentId: '400e9d97-4640-44f5-af54-6f4b314384f5',
            name: 'Tunisia',
            name_en: 'Tunisia',
            status: 'Active',
            serviceTypes: [{ name: 'Test service type' }],
          },
          id: '1',
          syncStatus: 'Synced',
          type: 'Feature',
          locationTags: [{ id: 2, name: 'Sample 2' }],
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationSuccess).toHaveBeenCalledWith({
      description: undefined,
      message: 'Location Unit Updated successfully',
    });
  });

  it('fail geoloaction fetch when create location unit', async () => {
    const mockNotificationError = jest.spyOn(notification, 'error');

    await onSubmit(
      jest.fn,
      { ...formValue, parentId: 'test' },
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test'
    ).catch((e) => {
      expect(e.message).toEqual(ERROR_OCCURED);
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: ERROR_OCCURED,
    });
  });

  it('fail create location unit', async () => {
    fetch.mockReject();

    const mockNotificationError = jest.spyOn(notification, 'error');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm
            openSRPBaseURL={baseURL}
            locationUnitGroup={locationUnitgroups}
            treeData={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    await onSubmit(jest.fn, formValue, baseURL, locationUnitgroups, parsedHierarchy, 'user_test');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[1]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          is_jurisdiction: true,
          properties: {
            geographicLevel: 0,
            username: 'user_test',
            name: 'Tunisia',
            name_en: 'Tunisia',
            status: 'Active',
          },
          id: JSON.parse(fetch.mock.calls[1][1].body as string).id,
          syncStatus: 'Synced',
          type: 'Feature',
          locationTags: [{ id: 2, name: 'Sample 2' }],
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: ERROR_OCCURED,
    });
  });

  it('handles error when editing location unit', async () => {
    fetch.mockReject(() => Promise.reject(ERROR_OCCURED));
    const mockNotificationError = jest.spyOn(notification, 'error');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm
            openSRPBaseURL={baseURL}
            locationUnitGroup={locationUnitgroups}
            treeData={parsedHierarchy}
          />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: ERROR_OCCURED,
    });
  });

  it('handle failed on submit', async () => {
    fetch.mockReject(() => Promise.reject(ERROR_OCCURED));
    const mockNotificationError = jest.spyOn(notification, 'error');
    await onSubmit(
      jest.fn,
      formValue,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      []
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: ERROR_OCCURED,
    });
  });

  it('renders without crashing with id', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm
            openSRPBaseURL={baseURL}
            initialValues={formValue}
            locationUnitGroup={locationUnitgroups}
            treeData={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.find('form input[name="name"]').prop('value')).toBe(formValue.name);

    expect(
      wrapper.find(`form input[type="radio"][value="${formValue.status}"]`).prop('checked')
    ).toBe(true);

    expect(wrapper.find('form TreeSelect[className="ant-tree-select"]').prop('value')).toBe(
      formValue.parentId
    );
    expect(
      wrapper.find('form Field[name="locationTags"] Select[prefixCls="ant-select"]').prop('value')
    ).toBe(formValue.locationTags);
    expect(wrapper.find('form input[name="type"]').prop('value')).toBe(formValue.type);
  });

  it('Cancel button', async () => {
    const mockBack = jest.fn();
    history.goBack = mockBack;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm
            openSRPBaseURL={baseURL}
            locationUnitGroup={locationUnitgroups}
            treeData={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    wrapper.find('button#cancel').simulate('click');

    // click go back
    expect(wrapper.find('button').first().text()).toMatchInlineSnapshot(`"Save"`);
    wrapper.find('button').first().simulate('click');

    // click go back
    expect(wrapper.find('button').last().text()).toMatchInlineSnapshot(`"Cancel"`);
    wrapper.find('button').last().simulate('click');

    expect(mockBack).toHaveBeenCalled();
  });

  // TODO - review: what does this test check? where is the assertion
  it('Update LocationUnitGroupValue', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm
            openSRPBaseURL={baseURL}
            initialValues={formValue}
            locationUnitGroup={locationUnitgroups}
            treeData={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
  });

  // TODO - review: what does this test check? where is the assertion
  it('Create LocationUnitGroupValue', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm
            openSRPBaseURL={baseURL}
            initialValues={formValue}
            locationUnitGroup={locationUnitgroups}
            treeData={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
  });
});

describe('LocationForm', () => {
  afterEach(() => {
    fetch.resetMocks();
  });
  it('renders correctly', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm />
        </Router>
      </Provider>,
      { attachTo: div }
    );

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
    expect(toJson(wrapper.find('#serviceTypes label'))).toMatchSnapshot('serviceTypes label');
    expect(toJson(wrapper.find('#serviceTypes input'))).toMatchSnapshot('serviceTypes field');
    expect(toJson(wrapper.find('#externalId label'))).toMatchSnapshot('externalId label');
    expect(toJson(wrapper.find('#externalId input'))).toMatchSnapshot('externalId field');
    expect(toJson(wrapper.find('#geometry label'))).toMatchSnapshot('geometry label');
    expect(toJson(wrapper.find('#geometry input'))).toMatchSnapshot('geometry field');
    expect(toJson(wrapper.find('#locationTags label'))).toMatchSnapshot('locationTags label');
    expect(toJson(wrapper.find('#locationTags input'))).toMatchSnapshot('locationTags field');

    wrapper.find('.extraFields').forEach((field) => {
      expect(toJson(field.find('label'))).toMatchSnapshot('field label');
      expect(toJson(field.find('input'))).toMatchSnapshot('field input');
    });

    expect(toJson(wrapper.find('#submit button'))).toMatchSnapshot('submit button');
    expect(toJson(wrapper.find('#cancel button'))).toMatchSnapshot('cancel button');
  });

  it('form validation works for core instance', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    // when instance is set to core by default, types is required, serviceTypes is not required
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm />
        </Router>
      </Provider>,
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

    expect(wrapper.find('FormItem#parentId').text()).toMatchInlineSnapshot(`"ParentPlease select"`);

    expect(wrapper.find('FormItem#status').text()).toMatchInlineSnapshot(`"StatusActiveInactive"`);

    expect(wrapper.find('FormItem#isJurisdiction').text()).toMatchInlineSnapshot(
      `"Location Category(optional)Service pointJurisdiction"`
    );

    // type is required for core
    expect(wrapper.find('FormItem#type').text()).toMatchInlineSnapshot(`"TypeType is Required"`);

    // not required for core
    expect(wrapper.find('FormItem#serviceTypes').text()).toMatchInlineSnapshot(`"Type"`);

    expect(wrapper.find('FormItem#externalId').text()).toMatchInlineSnapshot(
      `"External ID(optional)"`
    );

    expect(wrapper.find('FormItem#geometry').text()).toMatchInlineSnapshot(`"geometry(optional)"`);

    expect(wrapper.find('FormItem#locationTags').text()).toMatchSnapshot(
      'location Tags does not have error message'
    );

    wrapper.unmount();
  });

  it('form validation works for eusm instance', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    // when instance is set to core by default, types is required, serviceTypes is not required
    const initialValues = { ...defaultFormField, instance: FormInstances.EUSM };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationForm initialValues={initialValues} />
        </Router>
      </Provider>,
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

    expect(wrapper.find('FormItem#parentId').text()).toMatchInlineSnapshot(`"ParentPlease select"`);

    expect(wrapper.find('FormItem#status').text()).toMatchInlineSnapshot(`"StatusActiveInactive"`);

    expect(wrapper.find('FormItem#isJurisdiction').text()).toMatchInlineSnapshot(
      `"Location Category(optional)Service pointJurisdiction"`
    );

    // type is required for core, but not required for eusm instance
    expect(wrapper.find('FormItem#type').text()).toMatchInlineSnapshot(`"Type"`);

    // service types is required for eusm
    expect(wrapper.find('FormItem#serviceTypes').text()).toMatchInlineSnapshot(
      `"TypeService Types is required"`
    );

    expect(wrapper.find('FormItem#externalId').text()).toMatchInlineSnapshot(
      `"External ID(optional)"`
    );

    expect(wrapper.find('FormItem#geometry').text()).toMatchInlineSnapshot(`"geometry(optional)"`);

    expect(wrapper.find('FormItem#locationTags').text()).toMatchSnapshot(
      'location Tags does not have error message'
    );
    wrapper.unmount();
  });
});
