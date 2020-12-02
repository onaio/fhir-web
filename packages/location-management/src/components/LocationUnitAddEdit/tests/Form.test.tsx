/* eslint-disable @typescript-eslint/camelcase */
import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import { notification } from 'antd';
import fetch from 'jest-fetch-mock';
import * as fixtures from './fixtures';

import { id, LocationUnitGroupValue, locationUnitgroup, treedata } from './fixtures';
import Form, { onSubmit } from '../Form';
import { act } from 'react-dom/test-utils';
import { sampleHierarchy } from '../../LocationUnitView/tests/fixtures';

// jest.mock('antd', () => {
//   const antd = jest.requireActual('antd');

//   /* eslint-disable react/prop-types */
//   const Select = ({ children, onChange }) => {
//     return <select onChange={(e) => onChange(e.target.value)}>{children}</select>;
//   };

//   const Option = ({ children, ...otherProps }) => {
//     return <option {...otherProps}>{children}</option>;
//   };
//   /* eslint-disable react/prop-types */

//   Select.Option = Option;

//   return {
//     __esModule: true,
//     ...antd,
//     Select,
//   };
// });

describe('containers/pages/locations/LocationUnitAddEdit', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });
  const values = {
    is_jurisdiction: true,
    properties: {
      geographicLevel: 1,
      username: 'testuser',
      externalId: 'testextid',
      parentId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
      name: 'Tunisia',
      // eslint-disable-next-line @typescript-eslint/camelcase
      name_en: 'Tunisia',
      status: 'Active',
    },
    id: 'testextid',
    syncStatus: 'Synced',
    type: 'Feature',
    locationTags: fixtures.locationUnitgroup,
    geometry: undefined,
  };

  const props = {
    id: undefined,
    user: {
      username: 'user_test',
    },
    locationUnitGroup: fixtures.locationUnitgroup,
  };

  const accessToken = 'sometoken';
  const setSubmittingMock = jest.fn();

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form locationUnitGroup={locationUnitgroup} treedata={treedata} />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('creates new location unit', async () => {
    const mockNotificationSuccess = jest.spyOn(notification, 'success');
    await onSubmit(values, accessToken, props, props.user, setSubmittingMock);
    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: fetch.mock.calls[0][1]?.body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);

    expect(mockNotificationSuccess).toHaveBeenCalledWith({
      description: '',
      message: 'Location Unit Created successfully',
    });
  });

  it('handles error when creating new location unit', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    await onSubmit(values, accessToken, props, props.user, setSubmittingMock);
    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: '',
      message: 'API is down',
    });
  });

  it('edits location unit successfully', async () => {
    const newProps = {
      ...props,
      id: '1',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form id="1" locationUnitGroup={locationUnitgroup} treedata={treedata} />
        </Router>
      </Provider>
    );
    const mockNotificationSuccess = jest.spyOn(notification, 'success');
    await onSubmit(values, accessToken, newProps, props.user, setSubmittingMock);
    await act(async () => {
      wrapper.update();
      await flushPromises();
    });
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body:
            '{"is_jurisdiction":true,"properties":{"geographicLevel":0,"username":"user_test","parentId":""},"id":"1","syncStatus":"Synced","type":"Feature","locationTags":[]}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);

    expect(mockNotificationSuccess).toHaveBeenCalledWith({
      description: '',
      message: 'Location Unit Updated successfully',
    });
    wrapper.unmount();
  });

  it('handles error when editing location unit', async () => {
    const newProps = {
      ...props,
      id: '1',
    };
    fetch.mockReject(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notification, 'error');
    await onSubmit(values, accessToken, newProps, props.user, setSubmittingMock);
    await act(async () => {
      await flushPromises();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      description: '',
      message: 'API is down',
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
    const newProps = {
      ...props,
      id: '1',
    };
    fetch.once(JSON.stringify(sampleHierarchy));
    await onSubmit(newValues, accessToken, newProps, props.user, setSubmittingMock);
    await act(async () => {
      await flushPromises();
    });
    // first call is made on the hierarchies endpoint to get geographic level
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/51d421a8-ba53-4ae0-b1d1-00e2d1a8c2a2',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location?is_jurisdiction=true',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body:
            '{"is_jurisdiction":true,"properties":{"geographicLevel":0,"username":"user_test","parentId":"51d421a8-ba53-4ae0-b1d1-00e2d1a8c2a2"},"id":"1","syncStatus":"Synced","type":"Feature","locationTags":[],"geometry":{"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}}}',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
  });

  it('renders without crashing with id', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            initialValue={LocationUnitGroupValue}
            id={id}
            locationUnitGroup={locationUnitgroup}
            treedata={treedata}
          />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form input[name="name"]').prop('value')).toBe(LocationUnitGroupValue.name);

    expect(
      wrapper
        .find(`form input[type="radio"][value="${LocationUnitGroupValue.status}"]`)
        .prop('checked')
    ).toBe(true);

    expect(wrapper.find('form TreeSelect[className="ant-tree-select"]').prop('value')).toBe(
      LocationUnitGroupValue.parentId
    );
    expect(
      wrapper.find('form Field[name="locationTags"] Select[prefixCls="ant-select"]').prop('value')
    ).toBe(LocationUnitGroupValue.locationTags);
    expect(wrapper.find('form input[name="type"]').prop('value')).toBe(LocationUnitGroupValue.type);
  });

  it('Cancel button', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form locationUnitGroup={locationUnitgroup} treedata={treedata} />
        </Router>
      </Provider>
    );

    wrapper.find('button#cancel').simulate('click');
  });

  it('Update LocationUnitGroupValue', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            initialValue={LocationUnitGroupValue}
            id={id}
            locationUnitGroup={locationUnitgroup}
            treedata={treedata}
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
            initialValue={LocationUnitGroupValue}
            locationUnitGroup={locationUnitgroup}
            treedata={treedata}
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
