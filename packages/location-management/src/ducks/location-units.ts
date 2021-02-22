import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
  getTotalRecordsFactory,
} from '@opensrp/reducer-factory';
import { Dictionary } from '@onaio/utils';
import { Geometry } from 'geojson';
import { createSelector } from 'reselect';
import { Store } from 'redux';
import { values } from 'lodash';
import intersect from 'fast_array_intersect';

/** interface for extra fields in location properties **/

export interface ExtraField {
  key: string; // key with which the the payload will be sent to server
  value?: string | number; // default value of the field
  label?: string; // label of the field
  description?: string; // default placeholder of the field
  type: 'email' | 'number' | 'password' | 'text' | 'time' | 'url'; // type of the field
  uuid: string; // received by the response thought we dont really use it
  settingsId: string; // received by the response thought we dont really use it
  settingIdentifier: string; // received by the response thought we dont really use it
  settingMetadataId: string; // received by the response thought we dont really use it
  v1Settings: boolean; // received by the response thought we dont really use it
  resolveSettings: boolean; // received by the response thought we dont really use it
  documentId: string; // received by the response thought we dont really use it
  serverVersion: number; // received by the response thought we dont really use it
}

/** Enum representing the possible location unit status types */
export enum LocationUnitStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
}

export enum LocationUnitSyncStatus {
  SYNCED = 'Synced',
  NOTSYNCED = 'NotSynced',
}

/** interface for LocationUnit.properties */
export interface Properties
  extends Dictionary<string | number | LocationUnitStatus | undefined | string[] | number[]> {
  name: string;
  parentId: string;
  status: LocationUnitStatus;
  geographicLevel?: number;
  username?: string;
  version?: number;
  name_en?: string;
  externalId?: string;
  type?: string;
}

/** location unit tag interface */
export interface LocationUnitTag {
  id: number;
  name: string;
}

/** location interface */
export interface LocationUnit {
  id: string;
  properties: Properties;
  type: string;
  locationTags?: LocationUnitTag[];
  geometry?: Geometry; // todo : need to implement the functionality
  syncStatus?: LocationUnitSyncStatus;
  parentId?: string;
  serverVersion?: number; // received by the response thought we dont really use it
  isJurisdiction?: boolean;
}

/** reducer name for the Item module */
export const locationUnitsReducerName = 'location-units';

/** Item Reducer */
export const locationUnitsReducer = reducerFactory<LocationUnit>(locationUnitsReducerName);

// action
/** actionCreator returns action to to add Item records to store */
export const defaultFetchLocations = fetchActionCreatorFactory<LocationUnit>(
  locationUnitsReducerName,
  'id'
);

// modify actionCreator to add isJurisdiction information to location
/** action creator to add locations to store,
 *
 * @param locations - the location objects
 * @param isJurisdiction - if the location is a jurisdiction or structure
 */
export const fetchLocationUnits = (locations: LocationUnit[] = [], isJurisdiction?: boolean) => {
  const withJurisdiction = locations.map((loc) => ({
    ...loc,
    // preserve backwards compatibility
    ...(isJurisdiction === undefined ? {} : { isJurisdiction }),
  }));
  return defaultFetchLocations(withJurisdiction);
};

export const removeLocationUnits = removeActionCreatorFactory(locationUnitsReducerName);
export const setTotalLocationUnits = setTotalRecordsFactory(locationUnitsReducerName);

// selectors
export const getLocationUnitsById = getItemsByIdFactory<LocationUnit>(locationUnitsReducerName);
export const getLocationUnitById = getItemByIdFactory<LocationUnit>(locationUnitsReducerName);
export const getLocationUnitsArray = getItemsArrayFactory<LocationUnit>(locationUnitsReducerName);
export const getTotalLocationUnits = getTotalRecordsFactory(locationUnitsReducerName);

/**  prop filters for the selectors */
export interface LocationUnitSelectFilters {
  searchQuery?: string;
  isJurisdiction?: boolean;
  ids?: string[];
}

/** get the searchQuery from filter props
 *
 * @param _ the store
 * @param props - the filter props
 */
const getSearchQuery = (_: Partial<Store>, props: LocationUnitSelectFilters) => props.searchQuery;

/** get the isJurisdiction from filter props
 *
 * @param _ the store
 * @param props - the filter props
 */
const getIsJurisdiction = (_: Partial<Store>, props: LocationUnitSelectFilters) =>
  props.isJurisdiction;

/** get the ids from filter props
 *
 * @param _ the store
 * @param props - the filter props
 */
const getIds = (_: Partial<Store>, props: LocationUnitSelectFilters) => props.ids;

/**
 * non-memoized selector that returns the locationUnit array
 *
 * @param state - the store
 */
export const locationsByIdsSelector = (state: Partial<Store>): Dictionary<LocationUnit> => {
  return (state as Dictionary)[locationUnitsReducerName].objectsById;
};

/**
 * memoized selector to get the location units array from their ids object
 */
export const locationsArraySelector = createSelector(locationsByIdsSelector, (locationsByIds) =>
  values(locationsByIds)
);

/** get locations depending on the isJurisdiction status */
export const getLocationsIfJurisdiction = () =>
  createSelector(locationsArraySelector, getIsJurisdiction, (locations, isJurisdiction) => {
    if (isJurisdiction === undefined) {
      return locations;
    }
    return locations.filter((loc) => loc.isJurisdiction === isJurisdiction);
  });

const locationsIfJurisdictionSelector = getLocationsIfJurisdiction();

/** get structures(locations with isJurisdiction = false) filterable by search text */
export const getLocationsBySearch = () =>
  createSelector(locationsIfJurisdictionSelector, getSearchQuery, (locations, searchText) => {
    if (searchText === undefined) {
      return locations;
    }
    return locations.filter(
      (loc) =>
        loc.properties.name.toLowerCase().includes(searchText.toLowerCase()) ||
        loc.id === searchText
    );
  });

/** get locations by their ids */
export const getLocationByIds = () =>
  createSelector(
    locationsByIdsSelector,
    locationsArraySelector,
    getIds,
    (locationsByIds, locations, ids) => {
      if (ids === undefined) {
        return locations;
      }
      const locationsOfInterest: LocationUnit[] = [];
      ids.forEach((id) => {
        const thisLocation = locationsByIds[id] as LocationUnit | undefined;
        if (thisLocation) locationsOfInterest.push(thisLocation);
      });
      return locationsOfInterest;
    }
  );

const locationsBySearch = getLocationsBySearch();
const locationsByIds = getLocationByIds();

/** main selector, combines the other selectors into one. */
export const getLocationsByFilters = () =>
  createSelector(
    locationsBySearch,
    locationsIfJurisdictionSelector,
    locationsByIds,
    (bySearch, byJurisdiction, byIds) => {
      return intersect([bySearch, byJurisdiction, byIds], JSON.stringify);
    }
  );
