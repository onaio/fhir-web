import { Dictionary } from '@onaio/utils/dist/types/types';
import {
  fetchActionCreatorFactory,
  reducerFactory,
  removeActionCreatorFactory,
} from '@opensrp/reducer-factory';
import { Geometry } from 'geojson';
import { get, values } from 'lodash';
import { Store } from 'redux';
import { createSelector } from 'reselect';

export interface LocationTag {
  id: number;
  name: string;
}

/** The shape of a jurisdiction received from the OpenSRP API */
export interface Jurisdiction {
  id: string;
  geometry?: Geometry;
  properties: {
    code?: string;
    geographicLevel: number;
    name: string;
    parentId?: string;
    status: string;
    version: string | number;
    OpenMRS_Id?: string;
    externalId?: string;
    username?: string;
  };
  locationTags: LocationTag[];
  serverVersion: number;
  type: Readonly<'Feature'>;
}

/** the reducer name */
export const jurisdictionReducerName = 'Jurisdiction';

/** Jurisdiction Reducer */
export const JurisdictionsReducer = reducerFactory<Jurisdiction>(jurisdictionReducerName);

// actions
/** actionCreator returns action to to add Item records to store */
export const fetchJurisdictions = fetchActionCreatorFactory<Jurisdiction>(
  jurisdictionReducerName,
  'id'
);
export const removeJurisdictions = removeActionCreatorFactory(jurisdictionReducerName);

// selectors
/** prop filters to customize selector queries */
export interface Filters {
  jurisdictionId?: string /** jurisdiction id */;
  geoLevel?: number /** return jurisdictions with this geo level */;
}

/**
 * retrieve the jurisdictionId value
 *
 * @param _ - the store
 * @param props -  the filterProps
 * @returns jurisdictionId filter prop
 */
export const getJurisdictionId = (_: Partial<Store>, props: Filters) => props.jurisdictionId;

/**
 * retrieve the geoLevel value
 *
 * @param _ - the store
 * @param props -  the filterProps
 * @returns the geoLevel prop
 */
export const getGeoLevel = (_: Partial<Store>, props: Filters) => props.geoLevel;

/**
 * gets all jurisdictions keyed by id
 *
 * @param state - the store
 * @param _ -  the filterProps
 * @returns jurisdictions map whose keys are their respective ids
 */
export const getJurisdictionsById = (state: Partial<Store>, _: Filters): Dictionary<Jurisdiction> =>
  (state as Dictionary)[jurisdictionReducerName].objectsById;

/**
 * retrieve the Jurisdiction using an id
 *
 * @returns returns single jurisdiction or null
 */
export const getJurisdictionById = () =>
  createSelector(
    [getJurisdictionsById, getJurisdictionId],
    (jurisdictionsById, jurisdictionId): Jurisdiction | null => {
      if (!jurisdictionId) {
        return null;
      }
      return get(jurisdictionsById, jurisdictionId, null);
    }
  );

/**
 * retrieve jurisdictions as an array filtered by geoLevel
 *
 * @returns jurisdictions filtered by geoLevel
 */
export const getJursByGeoLevel = () =>
  createSelector(
    [getJurisdictionsById, getGeoLevel],
    (jurisdictionsById, geoLevel): Jurisdiction[] => {
      const result = values(jurisdictionsById);
      if (geoLevel) {
        return result.filter((item) => item.properties.geographicLevel === geoLevel);
      }
      return result;
    }
  );
