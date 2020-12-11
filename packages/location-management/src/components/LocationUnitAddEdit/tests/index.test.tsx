import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';

import { id, locationUnitgroup, sampleHierarchiesList, sampleLocationUnit } from './fixtures';
import LocationUnitAddEdit from '..';
import { act } from 'react-dom/test-utils';
import { sampleHierarchy } from '../../LocationUnitView/tests/fixtures';

describe('location-management/src/components/LocationUnitAddEdit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('renders without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitAddEdit />
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
          <Route path={'/:id'} component={LocationUnitAddEdit} />
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
      .once(JSON.stringify(locationUnitgroup))
      .once(JSON.stringify(sampleHierarchiesList))
      .once(JSON.stringify(sampleHierarchy));
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/${id}`, hash: '', search: '', state: {} }]}>
          <Route path={'/:id'} component={LocationUnitAddEdit} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location-tag",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
        Array [
          "https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status%3AActive%2CgeographicLevel%3A0",
          Object {
            "headers": Object {
              "accept": "application/json",
              "authorization": "Bearer null",
              "content-type": "application/json;charset=UTF-8",
            },
            "method": "GET",
          },
        ],
      ]
    `);
  });
});
