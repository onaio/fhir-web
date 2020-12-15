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
import Form, { FormField, onSubmit } from '../Form';
import { act } from 'react-dom/test-utils';
import { LocationUnitStatus } from '../../../ducks/location-units';
import { history } from '@onaio/connected-reducer-registry';
import { rawHierarchy } from '../../LocationUnitView/tests/fixtures';

jest.mock('../../../configs/env');

describe('location-management/src/components/LocationUnitAddEdit', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const values: FormField = {
    name: 'Tunisia',
    status: LocationUnitStatus.ACTIVE,
    type: 'Feature',
    parentId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
    locationTags: locationUnitgroups.map((loc) => loc.id),
    geometry: undefined,
  };

  const props = {
    id: undefined,
    username: 'user_test',
    locationUnitGroup: locationUnitgroups,
  };

  const accessToken = 'sometoken';
  const setSubmittingMock = jest.fn();

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form locationUnitGroup={locationUnitgroups} treedata={parsedHierarchy} />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('creates new location unit', async () => {
    const mockNotificationSuccess = jest.spyOn(notification, 'success');

    await onSubmit(
      setSubmittingMock,
      values,
      accessToken,
      props.locationUnitGroup,
      props.username,
      props.id
    );
    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      'https://test.smartregister.org/opensrp/rest/location/hierarchy/a26ca9c8-1441-495a-83b6-bb5df7698996',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(fetch.mock.calls[1]).toEqual([
      'https://test.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: fetch.mock.calls[1][1].body,
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

  it('handles error when creating new location unit', async () => {
    fetch.mockReject(() => Promise.reject('An error occurred'));
    const mockNotificationError = jest.spyOn(notification, 'error');

    await onSubmit(
      setSubmittingMock,
      values,
      accessToken,
      props.locationUnitGroup,
      props.username,
      props.id
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
          <Form id="1" locationUnitGroup={locationUnitgroups} treedata={parsedHierarchy} />
        </Router>
      </Provider>
    );
    const mockNotificationSuccess = jest.spyOn(notification, 'success');
    await onSubmit(
      setSubmittingMock,
      values,
      accessToken,
      props.locationUnitGroup,
      props.username,
      '1'
    );
    await act(async () => {
      wrapper.update();
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      'https://test.smartregister.org/opensrp/rest/location/hierarchy/a26ca9c8-1441-495a-83b6-bb5df7698996',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[1]).toEqual([
      'https://test.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: fetch.mock.calls[1][1].body,
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
      setSubmittingMock,
      values,
      accessToken,
      props.locationUnitGroup,
      props.username,
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

  it('checks geo level is calculated correctly', async () => {
    const newValues = {
      ...values,
      parentId: '51d421a8-ba53-4ae0-b1d1-00e2d1a8c2a2',
      geometry: JSON.stringify({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [125.6, 10.1],
        },
        properties: {
          name: 'Dinagat Islands',
        },
      }),
    };

    fetch.once(JSON.stringify(rawHierarchy));
    await onSubmit(
      setSubmittingMock,
      newValues,
      accessToken,
      props.locationUnitGroup,
      props.username,
      '1'
    );

    await act(async () => {
      await flushPromises();
    });
    // first call is made on the hierarchies endpoint to get geographic level
    expect(fetch.mock.calls[0]).toEqual([
      'https://test.smartregister.org/opensrp/rest/location/hierarchy/51d421a8-ba53-4ae0-b1d1-00e2d1a8c2a2',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(fetch.mock.calls[1]).toEqual([
      'https://test.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: fetch.mock.calls[1][1].body,
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
  });

  it('renders without crashing with id', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
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
          <Form locationUnitGroup={locationUnitgroups} treedata={parsedHierarchy} />
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
