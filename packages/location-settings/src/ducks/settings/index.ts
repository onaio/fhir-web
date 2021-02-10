import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { keyBy } from 'lodash';
import { Dictionary } from '@onaio/utils';

/** reducer name */
export const reducerName = 'location-settings';

/** SETTING_FETCHED action type */
export const LOC_SETTINGS_FETCHED = 'settings/location/SETTINGS_FETCHED';
/** REMOVE_SETTING action_type */
export const REMOVE_LOC_SETTINGS = 'settings/location/REMOVE_SETTINGS';

/** interface for settings */
export interface Setting {
  editing?: boolean;
  key: string;
  value: boolean | string;
  label: string;
  description: string;
  inheritedFrom?: string;
  uuid: string;
  settingsId: string;
  settingIdentifier: string;
  settingMetadataId: string;
  locationId: string;
  providerId?: string;
  v1Settings: boolean;
  resolveSettings: boolean;
  documentId: string;
  serverVersion: number;
  team?: string;
  teamId?: string;
  type: string;
}

export type SettingStorage = Dictionary<Setting | {}>;

/** FetchLocSettingsAction interface for LOC_SETTINGS_FETCHED */
export interface FetchLocSettingsAction extends AnyAction {
  settingsByLocId: { [key: string]: SettingStorage };
  type: typeof LOC_SETTINGS_FETCHED;
  locId: string;
}

/** removeLocSettingsAction interface for REMOVE_LOC_SETTINGS */
interface RemoveLocSettingsAction extends AnyAction {
  type: typeof REMOVE_LOC_SETTINGS;
  settingsByLocId: {};
}

/** interface for settings state */
export interface LocSettingState {
  settingsByLocId: { [key: string]: SettingStorage } | {};
}

/** immutable location settings state */
export type ImmutableLocSettingState = LocSettingState &
  SeamlessImmutable.ImmutableObject<LocSettingState>;

/** initial location settings state */
const initialState: ImmutableLocSettingState = SeamlessImmutable({
  settingsByLocId: {},
});

/** Create type for Settings reducer actions */
export type LocSettingsTypes = FetchLocSettingsAction | RemoveLocSettingsAction | AnyAction;

/**
 * the Settings reducer function
 *
 * @param state - the store
 * @param action - the redux action
 */
export function reducer(state = initialState, action: LocSettingsTypes): ImmutableLocSettingState {
  switch (action.type) {
    case LOC_SETTINGS_FETCHED:
      return SeamlessImmutable({
        ...state,
        settingsByLocId: {
          ...state.settingsByLocId,
          [action.locId]: action.replace
            ? { ...action.settingsByLocId[action.locId] }
            : {
                ...(state.settingsByLocId as { [key: string]: SettingStorage })[action.locId],
                ...action.settingsByLocId[action.locId],
              },
        },
      });
    case REMOVE_LOC_SETTINGS:
      return SeamlessImmutable({
        ...state,
        settingsByLocId: action.settingsByLocId,
      });
    default:
      return state;
  }
}

/** removeLocSettingAction */
export const removeLocationSettingsAction = () => ({
  settingsByLocId: {},
  type: REMOVE_LOC_SETTINGS,
});

/** fetchLocSettings
 *
 * @param {Array} settings - array of settings from api
 * @param {string} locId - current location id
 * @param {boolean} replace - boolean to replace settings data for a location
 */
export const fetchLocationSettingsAction = (
  settings: Setting[] = [],
  locId: string,
  replace = false
): FetchLocSettingsAction => ({
  settingsByLocId: {
    [locId]: keyBy(
      settings.map((set: Setting) => {
        set['editing'] = set['editing'] ?? false;
        return set;
      }),
      (setting) => setting.settingMetadataId
    ),
  },
  type: LOC_SETTINGS_FETCHED,
  locId,
  replace,
});

export interface Filters {
  locationId: string;
}

/** retrieve location id
 *
 * @param _  - redux store
 * @param props - location filter props
 */
export const getLocationId = (_: Partial<Store>, props: Filters) => props.locationId;

/** getLocSettings - get get location settings
 *
 * @param {Store} state - the redux store
 * @param {string} _ - location filters
 */
export const getAllLocationSettings = (
  state: Partial<Store>,
  _: Filters
): { [key: string]: SettingStorage } => (state as Dictionary)[reducerName].settingsByLocId;

/** factory than returns a selector to retrieve settings for a particular location */
export const getCurrentLocationSettings = () =>
  createSelector(getAllLocationSettings, getLocationId, (settingsByLocId, locationId) => {
    const currentLocSettings = settingsByLocId[locationId] as SettingStorage | undefined;
    if (!currentLocSettings) return [];
    return Object.keys(currentLocSettings).map((key: string) => currentLocSettings[key]) as [
      Setting
    ];
  });
