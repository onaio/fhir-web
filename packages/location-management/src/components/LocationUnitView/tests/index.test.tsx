import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import fetch from 'jest-fetch-mock';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { notification } from 'antd';
import { Router } from 'react-router';
import LocationUnitView, { loadSingleLocation } from '..';
import {
  sampleHierarchiesList,
  sampleLocationUnit,
  treedata,
} from '../../LocationUnitAddEdit/tests/fixtures';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { sampleHierarchy } from './fixtures';
import { fetchCurrentChildren } from '../../../ducks/location-hierarchy';

describe('containers/pages/locations/locationunit', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <LocationUnitView />
      </Provider>
    );
  });
  it('location unit table renders correctly', async () => {
    fetch.once(JSON.stringify(sampleHierarchiesList)).once(JSON.stringify(sampleHierarchy));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('Table').first().props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('renders fetched data correctly', async () => {
    fetch.once(JSON.stringify(sampleLocationUnit));
    loadSingleLocation(
      { id: '1', geographicLevel: 0, key: 'key', name: 'Name' },
      'sometoken',
      jest.fn()
    );
    store.dispatch(fetchCurrentChildren(treedata[0].children));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/1?is_jurisdiction=true',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(wrapper.find('Table').at(1).text()).toEqual(
      'NameLevelActionsNairobi West2EditCentral2Edit1'
    );
    wrapper.unmount();
  });

  it('test error thrown if API is down', async () => {
    const notificationErrorMock = jest.spyOn(notification, 'error');
    fetch.mockReject(() => Promise.reject('API is down'));
    loadSingleLocation(
      { id: '1', geographicLevel: 0, key: 'key', name: 'Name' },
      'sometoken',
      jest.fn()
    );
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(notificationErrorMock).toHaveBeenCalledWith({
      message: 'API is down',
      description: undefined,
    });
  });
});
