import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import {
  baseLocationUnits,
  rawHierarchy,
  id,
  locationSettings,
  locationUnitgroups,
} from './fixtures';
import { LocationUnitAddEdit } from '..';
import { LocationForm } from '../Form';
import { act } from 'react-dom/test-utils';
import { FormInstances } from '../utils';

/** moved this to separate file since it seems the tests are not getting cleaned up
 * correctly and they fail when put together.
 *
 * My clue is that since data calls are dependent on data in the store, this might
 * be causing inconsistencies across tests, some calls are skipped if data is present
 */
describe('', () => {
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

  it('only calls hierarchy if jurisdictions defined', async () => {
    fetch.resetMocks();
    fetch.once(JSON.stringify([]));
    fetch.once(JSON.stringify([]));
    fetch.once(JSON.stringify(null));
    fetch.once(JSON.stringify(null));

    const parentId = '654654';

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: `/${id}`, hash: '', search: `?parentId=${parentId}`, state: {} },
          ]}
        >
          <Route
            path={'/:id'}
            component={(props) => {
              const allProps = {
                ...props,
                hiddenFields: ['name'],
                instance: FormInstances.EUSM,
              };
              return <LocationUnitAddEdit {...allProps} />;
            }}
          />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();

    expect(fetch.mock.calls.map((entry) => entry[0])).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true',
      'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
      'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=location_settings',
    ]);

    wrapper.unmount();
  });
  it('passes the correct values to form', async () => {
    fetch.resetMocks();
    fetch.once(JSON.stringify(baseLocationUnits[0]));
    fetch.once(JSON.stringify([locationUnitgroups]));
    fetch.once(JSON.stringify([baseLocationUnits[0]]));
    fetch.once(JSON.stringify(locationSettings));
    fetch.once(JSON.stringify(rawHierarchy[0]));
    fetch.once(JSON.stringify([]));

    const parentId = '654654';

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: `/${id}`, hash: '', search: `?parentId=${parentId}`, state: {} },
          ]}
        >
          <Route
            path={'/:id'}
            component={(props) => {
              const allProps = {
                ...props,
                hiddenFields: ['name'],
                instance: FormInstances.EUSM,
              };
              return <LocationUnitAddEdit {...allProps} />;
            }}
          />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();

    expect(fetch.mock.calls.map((entry) => entry[0])).toEqual([
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/a26ca9c8-1441-495a-83b6-bb5df7698996?is_jurisdiction=true',
      'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
      'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=location_settings',
      'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/a26ca9c8-1441-495a-83b6-bb5df7698996',
      'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=service_types',
    ]);

    const locationFormProps = wrapper.find(LocationForm).props();

    expect(locationFormProps.initialValues.instance).toEqual(FormInstances.EUSM);
    expect(locationFormProps.hiddenFields).toEqual(['name']);
    expect(locationFormProps.initialValues.parentId).toEqual(parentId);
    wrapper.unmount();
  });
});
