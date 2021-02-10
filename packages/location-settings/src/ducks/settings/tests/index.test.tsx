import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  reducerName,
  reducer,
  getCurrentLocationSettings,
  fetchLocationSettingsAction,
  removeLocationSettingsAction,
} from '..';
import { allSettings } from './fixtures';

const getLocationSettings = getCurrentLocationSettings();

reducerRegistry.register(reducerName, reducer);
const locId = 'b652b2f4-a95d-489b-9e28-4629746db96a';

describe('reducers/settings', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(removeLocationSettingsAction());
  });

  it('should have initial state', () => {
    expect(getLocationSettings(store.getState(), { locationId: locId })).toEqual([]);
  });

  it('should fetch settings', () => {
    // dispatch locations
    store.dispatch(fetchLocationSettingsAction(allSettings, locId));
    // get location settings
    expect(getLocationSettings(store.getState(), { locationId: locId })).toEqual(allSettings);
  });

  it('should update single setting', () => {
    // Fetch settings
    store.dispatch(fetchLocationSettingsAction(allSettings, locId));
    expect(getLocationSettings(store.getState(), { locationId: locId })).toEqual(allSettings);

    // Update setting
    const updatedSetting = { ...allSettings[0], editing: true, value: 'true' };
    store.dispatch(fetchLocationSettingsAction([updatedSetting], locId));
    // Setting should now be updated in store
    expect(getLocationSettings(store.getState(), { locationId: locId })).toEqual([
      updatedSetting,
      ...allSettings.slice(0, 0),
      ...allSettings.slice(0 + 1, allSettings.length),
    ]);
  });

  it('replaces the settings for the location correctly', () => {
    // Fetch settings
    store.dispatch(fetchLocationSettingsAction(allSettings, locId));
    expect(getLocationSettings(store.getState(), { locationId: locId })).toEqual(allSettings);
    // Now replace settings
    store.dispatch(fetchLocationSettingsAction([allSettings[0]], locId, true));
    expect(getLocationSettings(store.getState(), { locationId: locId })).toEqual([allSettings[0]]);
  });

  it('should clear settings', () => {
    // Fetch settings
    store.dispatch(fetchLocationSettingsAction(allSettings, locId));
    expect(getLocationSettings(store.getState(), { locationId: locId })).toEqual(allSettings);
    // Now clear settings
    store.dispatch(removeLocationSettingsAction());
    expect(getLocationSettings(store.getState(), { locationId: locId })).toEqual([]);
  });
});
