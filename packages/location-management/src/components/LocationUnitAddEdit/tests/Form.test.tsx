/* eslint-disable @typescript-eslint/camelcase */
import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import { notification } from 'antd';
import fetch from 'jest-fetch-mock';
import { id, formValue, locationUnitgroups, parsedHierarchy, locationSettings } from './fixtures';
import Form, { findParentGeoLocation, onSubmit, removeEmptykeys } from '../Form';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { baseURL, ERROR_OCCURED } from '../../../constants';

describe('location-management/src/components/LocationUnitAddEdit', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const accessToken = 'sometoken';

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            opensrpBaseURL={baseURL}
            locationUnitGroup={locationUnitgroups}
            treedata={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('creates new location unit', async () => {
    const mockNotificationSuccess = jest.spyOn(notification, 'success');

    await onSubmit(
      jest.fn,
      formValue,
      accessToken,
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
    const parentgeo = findParentGeoLocation(
      parsedHierarchy,
      '400e9d97-4640-44f5-af54-6f4b314384f5'
    );
    expect(parentgeo).toEqual(5);
  });

  it('handles error when creating new location unit', async () => {
    fetch.mockReject(() => Promise.reject(ERROR_OCCURED));
    const mockNotificationError = jest.spyOn(notification, 'error');

    await onSubmit(
      jest.fn,
      formValue,
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      [],
      '1'
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
          <Form
            opensrpBaseURL={baseURL}
            id="1"
            locationUnitGroup={locationUnitgroups}
            treedata={parsedHierarchy}
          />
        </Router>
      </Provider>
    );
    await onSubmit(
      jest.fn,
      { ...formValue, parentId: '400e9d97-4640-44f5-af54-6f4b314384f5' },
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      [],
      '1'
    );

    expect(fetch.mock.calls[0]).toEqual([
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

  it('fail create location unit successfully', async () => {
    fetch.mockReject();

    const mockNotificationError = jest.spyOn(notification, 'error');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            opensrpBaseURL={baseURL}
            id="1"
            locationUnitGroup={locationUnitgroups}
            treedata={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    await onSubmit(
      jest.fn,
      formValue,
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test'
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual([
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
          id: JSON.parse(fetch.mock.calls[0][1].body as string).id,
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
          <Form
            opensrpBaseURL={baseURL}
            id="1"
            locationUnitGroup={locationUnitgroups}
            treedata={parsedHierarchy}
          />
        </Router>
      </Provider>
    );
    await onSubmit(
      jest.fn,
      { ...formValue, parentId: 'wrong parent id' },
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      [],
      '1'
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual(undefined);

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
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      [],
      '1'
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: ERROR_OCCURED,
    });
  });

  it('renders without crashing with id', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            opensrpBaseURL={baseURL}
            initialValue={formValue}
            id={id}
            locationUnitGroup={locationUnitgroups}
            treedata={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

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

  it('Cancel button', () => {
    const mockBack = jest.fn();
    history.goBack = mockBack;

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            opensrpBaseURL={baseURL}
            locationUnitGroup={locationUnitgroups}
            treedata={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    wrapper.find('button#cancel').simulate('click');

    // click go back
    expect(wrapper.find('button').first().text()).toMatchInlineSnapshot(`"Save"`);
    wrapper.find('button').first().simulate('click');

    // click go back
    expect(wrapper.find('button').last().text()).toMatchInlineSnapshot(`"Cancel"`);
    wrapper.find('button').last().simulate('click');

    expect(mockBack).toHaveBeenCalled();
  });

  it('Update LocationUnitGroupValue', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            opensrpBaseURL={baseURL}
            initialValue={formValue}
            id={id}
            locationUnitGroup={locationUnitgroups}
            treedata={parsedHierarchy}
          />
        </Router>
      </Provider>
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
  });

  it('Create LocationUnitGroupValue', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            opensrpBaseURL={baseURL}
            initialValue={formValue}
            locationUnitGroup={locationUnitgroups}
            treedata={parsedHierarchy}
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
