import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';

import { id, locationgroup, sampleHierarchiesList, sampleLocationUnit } from './fixtures';
import LocationUnitAdd from '..';
import { act } from 'react-dom/test-utils';
import { sampleHierarchy } from '../../LocationUnitView/tests/fixtures';
import toJson from 'enzyme-to-json';

describe('containers/pages/locations/LocationUnitAdd', () => {
  it('renders without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitAdd />
        </Router>
      </Provider>
    );
    expect(wrapper.props()).toMatchSnapshot();

    await act(async () => {
      await flushPromises();
    });
    wrapper.unmount();
  });

  it('renders without crashing when editting', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={LocationUnitAdd} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.props()).toMatchSnapshot();

    await act(async () => {
      await flushPromises();
    });
    wrapper.unmount();
  });

  it('works correctly with store', async () => {
    fetch
      .once(JSON.stringify(sampleLocationUnit))
      .once(JSON.stringify(locationgroup))
      .once(JSON.stringify(sampleHierarchiesList))
      .once(JSON.stringify(sampleHierarchy));
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={LocationUnitAdd} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    const fetchCalls = [
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status%3AActive%2CgeographicLevel%3A0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
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
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status%3AActive%2CgeographicLevel%3A0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
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
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status%3AActive%2CgeographicLevel%3A0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/5a286fc9-e985-4aa7-a843-d71f93d1f4b4',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/9feb1a4d-3020-4f1a-bbd9-0a47b54d2ae9',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/b652b2f4-a95d-489b-9e28-4629746db96a',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/35bf4771-a404-4220-bd9e-e2916decc116',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/a68d8a73-f235-4b9c-9717-41ba2546d771',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/66be3e59-5d49-4051-8ea4-dff7503d8d69',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/4f12391e-48ce-40d7-9dbb-813e93d042cb',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/c692b90d-ee20-4240-8904-8cbbbcab54f7',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
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
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ];
    expect(fetch.mock.calls).toEqual(fetchCalls);
  });
});
