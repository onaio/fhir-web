/* eslint-disable @typescript-eslint/camelcase */
import { OpenSRPService } from '@opensrp/react-utils';
import { Dictionary } from '@onaio/utils';
import {
  ACTIVE,
  baseURL,
  LOCATION_HIERARCHY,
  LOCATION_UNIT_FIND_BY_PROPERTIES,
  LOCATION_UNIT_ENDPOINT,
  LOCATION_UNIT_GROUP_ALL,
  OPENSRP_V2_SETTINGS,
} from '../constants';
import { fetchLocationUnits, LocationUnit } from '../ducks/location-units';
import { fetchTree } from '../ducks/locationHierarchy';
import { RawOpenSRPHierarchy } from '../ducks/locationHierarchy/types';
import { URLParams } from '@opensrp/server-service';
import { LocationUnitGroup } from '../ducks/location-unit-groups';

/** Abstract 2 functions; get jurisdiction at any geo-level, get hierarchy */

/** hierarchy params */
export interface LoadHierarchyParams {
  return_structure_count?: boolean;
}

export const defaultHierarchyParams: LoadHierarchyParams = {
  return_structure_count: false,
};

/** get the jurisdiction Tree given the rootJurisdiction Id
 *
 * @param rootJurisdictionId - id of top level jurisdiction
 * @param dispatcher - dispatches an action to add hierarchy to store
 * @param openSRPBaseURL - base url
 * @param urlParams - parameters to add to request
 * @param service - the openSRP service
 */
export async function loadHierarchy(
  rootJurisdictionId: string,
  dispatcher?: typeof fetchTree,
  openSRPBaseURL: string = baseURL,
  urlParams: LoadHierarchyParams = defaultHierarchyParams,
  service: typeof OpenSRPService = OpenSRPService
) {
  const serve = new service(LOCATION_HIERARCHY, openSRPBaseURL);
  const params = {
    ...urlParams,
  } as Dictionary;
  return serve
    .read(rootJurisdictionId, params)
    .then((response: RawOpenSRPHierarchy) => {
      if (!dispatcher) {
        return response;
      }
      dispatcher(response);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/** URL params for load jurisdiction request */
export interface GetLocationParams {
  is_jurisdiction?: boolean;
  return_geometry?: boolean;
  properties_filter?: string;
}

export const defaultGetLocationParams: GetLocationParams = {
  is_jurisdiction: true,
  return_geometry: false,
};

/** filter params to be added as value of properties_filter url param */
export interface ParamFilters {
  status?: string;
  geographicLevel?: number;
}

export const defaultParamFilters: ParamFilters = {
  status: ACTIVE,
  geographicLevel: 0,
};

/**
 * loader function to get jurisdictions by geographic level
 *
 * @param dispatcher - called with response, adds data to store
 * @param openSRPBaseURL - the openSRP api base url
 * @param urlParams - search params to be added to request
 * @param filterParams - filterParams for property_filter search_param
 * @param service - openSRP service class
 * @param endpoint - the openSRP endpoint
 */
export async function loadJurisdictions(
  dispatcher?: typeof fetchLocationUnits,
  openSRPBaseURL: string = baseURL,
  urlParams: GetLocationParams = defaultGetLocationParams,
  filterParams: ParamFilters = defaultParamFilters,
  service: typeof OpenSRPService = OpenSRPService,
  endpoint: string = LOCATION_UNIT_FIND_BY_PROPERTIES
) {
  const serve = new service(endpoint, openSRPBaseURL);
  const filterParamsObject =
    Object.values(filterParams).length > 0
      ? { properties_filter: service.getFilterParams(filterParams as Dictionary) }
      : {};
  const params = {
    ...urlParams,
    ...filterParamsObject,
  } as Dictionary;
  return serve
    .list(params)
    .then((response: LocationUnit[]) => {
      if (!dispatcher) {
        return response;
      }
      dispatcher(response);
    })
    .catch((e) => {
      throw e;
    });
}

export const defaultSettingsParams = {
  serverVersion: '0',
};

/** request to get service points from settings
 *
 * @param settingsIdentifier - id for settings to query from api
 * @param baseURL - the openSRP api base url
 * @param serviceClass - the openSRP service
 * @param callback - callback to call with resolved response
 * @param params - extra params to add to request
 */
export async function loadSettings<T>(
  settingsIdentifier: string,
  baseURL: string,
  serviceClass: typeof OpenSRPService = OpenSRPService,
  callback?: (data: T[]) => void,
  params: URLParams = defaultSettingsParams
) {
  const service = new serviceClass(OPENSRP_V2_SETTINGS, baseURL);
  const queryParams = {
    ...params,
    identifier: settingsIdentifier,
  };
  return service
    .read('', queryParams)
    .then((res: T[]) => {
      if (callback) {
        callback(res);
      }
    })
    .catch((error: Error) => {
      throw error;
    });
}

/** gets location tags from the api
 *
 * @param baseURL - openSRP base url
 * @param serviceClass  -  the openSRP service class
 * @param callback - callback to call with response data
 */
export async function loadLocationTags(
  baseURL: string,
  serviceClass: typeof OpenSRPService = OpenSRPService,
  callback?: (data: LocationUnitGroup[]) => void
) {
  const serve = new serviceClass(LOCATION_UNIT_GROUP_ALL, baseURL);
  return serve
    .list()
    .then((response: LocationUnitGroup[]) => {
      callback?.(response);
    })
    .catch((error: Error) => {
      throw error;
    });
}

export const defaultPostLocationParams = {
  is_jurisdiction: true,
};

/**
 * @param payload - the payload
 * @param openSRPBaseURL -  base url of api
 * @param service - the opensrp service
 * @param isEdit - help decide whether to post or put plan
 * @param params - params to add to url
 */
export async function postPutLocationUnit(
  payload: LocationUnit,
  openSRPBaseURL: string = baseURL,
  service = OpenSRPService,
  isEdit = true,
  params: URLParams = defaultPostLocationParams
) {
  const serve = new service(LOCATION_UNIT_ENDPOINT, openSRPBaseURL);
  if (isEdit) {
    return serve.update(payload, params).catch((err: Error) => {
      throw err;
    });
  }
  return serve.create(payload, params).catch((err: Error) => {
    throw err;
  });
}

/**
 * loader function to get jurisdictions by id
 *
 * @param locId - the string
 * @param dispatcher - called with response, adds data to store
 * @param openSRPBaseURL - the openSRP api base url
 * @param urlParams - search params to be added to request
 * @param service - openSRP service class
 */
export async function loadJurisdiction(
  locId: string,
  dispatcher?: (loc: LocationUnit | null) => void,
  openSRPBaseURL: string = baseURL,
  urlParams: GetLocationParams = defaultGetLocationParams,
  service: typeof OpenSRPService = OpenSRPService
) {
  const serve = new service(LOCATION_UNIT_ENDPOINT, openSRPBaseURL);
  const params = {
    ...urlParams,
  } as Dictionary;
  return serve
    .read(locId, params)
    .then((response: LocationUnit | null) => {
      if (dispatcher && response) {
        dispatcher(response);
      }
      return response;
    })
    .catch((e) => {
      throw e;
    });
}
