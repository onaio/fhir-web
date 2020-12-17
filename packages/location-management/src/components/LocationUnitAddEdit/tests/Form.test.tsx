/* eslint-disable @typescript-eslint/camelcase */
import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import { notification } from 'antd';
import fetch from 'jest-fetch-mock';

import { id, formValue, locationUnitgroups, parsedHierarchy } from './fixtures';
import Form, { findParentGeoLocation, onSubmit } from '../Form';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';

import { baseURL } from '../../../constants';

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
      formValue,
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      jest.fn
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

  it('checks geo level is calculated correctly', async () => {
    const parentgeo = findParentGeoLocation(
      parsedHierarchy,
      '400e9d97-4640-44f5-af54-6f4b314384f5'
    );
    expect(parentgeo).toEqual(5);
  });

  it('handles error when creating new location unit', async () => {
    fetch.mockReject(() => Promise.reject('An error occurred'));
    const mockNotificationError = jest.spyOn(notification, 'error');

    await onSubmit(
      formValue,
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      jest.fn,
      id
    );
    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: 'An error occurred',
    });
  });

  it('edits location unit successfully', async () => {
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
    const mockNotificationSuccess = jest.spyOn(notification, 'success');
    await onSubmit(
      formValue,
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      jest.fn,
      '1'
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
        body: fetch.mock.calls[0][1].body,
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);

    expect(mockNotificationSuccess).toHaveBeenCalledWith({
      description: undefined,
      message: 'Location Unit Updated successfully',
    });
    wrapper.unmount();
  });

  it('handles error when editing location unit', async () => {
    fetch.mockReject(() => Promise.reject('An error occurred'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    await onSubmit(
      formValue,
      accessToken,
      baseURL,
      locationUnitgroups,
      parsedHierarchy,
      'user_test',
      jest.fn,
      '1'
    );

    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: undefined,
      message: 'An error occurred',
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
