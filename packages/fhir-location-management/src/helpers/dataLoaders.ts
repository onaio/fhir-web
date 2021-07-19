/* eslint-disable @typescript-eslint/camelcase */
import { OpenSRPService } from '@opensrp/react-utils';
import { Dictionary } from '@onaio/utils';
import {
  ACTIVE,
  baseURL,
  LOCATION_HIERARCHY,
  LOCATION_UNIT_FIND_BY_PROPERTIES,
  LOCATION_UNIT_ENDPOINT,
  OPENSRP_V2_SETTINGS,
} from '../constants';
import { fetchLocationUnits, LocationUnit } from '../ducks/location-units';
import { fetchTree } from '../ducks/locationHierarchy';
import { RawOpenSRPHierarchy } from '../ducks/locationHierarchy/types';
import { URLParams } from '@opensrp/server-service';

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
 */
export async function loadHierarchy(
  rootJurisdictionId: string,
  dispatcher?: typeof fetchTree,
  openSRPBaseURL: string = baseURL,
  urlParams: LoadHierarchyParams = defaultHierarchyParams
) {
  const serve = new OpenSRPService(LOCATION_HIERARCHY, openSRPBaseURL);
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
};

/**
 * loader function to get jurisdictions by geographic level
 *
 * @param dispatcher - called with response, adds data to store
 * @param openSRPBaseURL - the openSRP api base url
 * @param urlParams - search params to be added to request
 * @param filterParams - filterParams for property_filter search_param
 * @param endpoint - the openSRP endpoint
 * @param filterByParentId - boolean to filter by parentId properties filter
 */
export async function loadJurisdictions(
  dispatcher?: typeof fetchLocationUnits,
  openSRPBaseURL: string = baseURL,
  urlParams: GetLocationParams = defaultGetLocationParams,
  filterParams: ParamFilters = defaultParamFilters,
  endpoint: string = LOCATION_UNIT_FIND_BY_PROPERTIES,
  filterByParentId?: boolean
) {
  const serve = new OpenSRPService(endpoint, openSRPBaseURL);
  const filterParamsObject =
    Object.values(filterParams).length > 0
      ? {
          properties_filter: OpenSRPService.getFilterParams({
            ...filterParams,
            ...{ ...(filterByParentId ? { parentId: null } : { geographicLevel: 0 }) },
          }),
        }
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
 * @param callback - callback to call with resolved response
 * @param params - extra params to add to request
 */
export async function loadSettings<T>(
  settingsIdentifier: string,
  baseURL: string,
  callback?: (data: T[]) => void,
  params: URLParams = defaultSettingsParams
) {
  const service = new OpenSRPService(OPENSRP_V2_SETTINGS, baseURL);
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

export const defaultPostLocationParams = {
  is_jurisdiction: true,
};

/**
 * @param payload - the payload
 * @param openSRPBaseURL -  base url of api
 * @param isEdit - help decide whether to post or put plan
 * @param params - params to add to url
 */
export async function postPutLocationUnit(
  payload: LocationUnit,
  openSRPBaseURL: string = baseURL,
  isEdit = true,
  params: URLParams = defaultPostLocationParams
) {
  const serve = new OpenSRPService(LOCATION_UNIT_ENDPOINT, openSRPBaseURL);
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
 */
export async function loadJurisdiction(
  locId: string,
  dispatcher?: (loc: LocationUnit | null) => void,
  openSRPBaseURL: string = baseURL,
  urlParams: GetLocationParams = defaultGetLocationParams
) {
  const serve = new OpenSRPService(LOCATION_UNIT_ENDPOINT, openSRPBaseURL);
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
