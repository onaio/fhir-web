import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import { notification } from 'antd';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import {
  baseLocationUnits,
  rawHierarchy,
  locationUnitgroups as locationUnitGroups,
  id,
  locationSettings,
  locationUnitgroups,
} from './fixtures';
import { LocationUnitAddEdit, getHierarchy } from '..';
import { act } from 'react-dom/test-utils';
import { baseURL, ERROR_OCCURED } from '../../../constants';

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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockReset();
  });

  it('test getHierarchy', async () => {
    fetch.mockResponse(JSON.stringify(rawHierarchy[2]));

    const response = await getHierarchy([baseLocationUnits[2]], baseURL);

    expect(response).toEqual([rawHierarchy[2]]);
  });

  it('fail loading location ', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');

    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitAddEdit openSRPBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: ERROR_OCCURED,
      description: undefined,
    });
    wrapper.unmount();
  });

  it('fail loading location hierarchy', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');

    fetch.once(JSON.stringify(locationUnitGroups));
    fetch.once(JSON.stringify([baseLocationUnits[0]]));
    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitAddEdit openSRPBaseURL={baseURL} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: ERROR_OCCURED,
      description: undefined,
    });

    wrapper.unmount();
  });

  it('Fail id data fetch', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockReject();

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={LocationUnitAddEdit} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=location_settings',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: ERROR_OCCURED,
      description: undefined,
    });

    wrapper.unmount();
  });

  it('renders everything correctly with id and header name', async () => {
    fetch.once(JSON.stringify(baseLocationUnits[0]));
    fetch.once(JSON.stringify([locationUnitgroups]));
    fetch.once(JSON.stringify([baseLocationUnits[0]]));
    fetch.once(JSON.stringify(locationSettings));
    fetch.once(JSON.stringify(rawHierarchy[0]));
    fetch.once(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={LocationUnitAddEdit} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=location_settings',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/a26ca9c8-1441-495a-83b6-bb5df7698996',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=service_types',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('form')).toHaveLength(1);
    expect(wrapper.find('.mb-4.header-title').text()).toEqual(
      `Edit Location Unit | ${baseLocationUnits[0].properties.name}`
    );
    wrapper.unmount();
  });
});
