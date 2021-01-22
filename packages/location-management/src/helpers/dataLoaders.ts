/* eslint-disable @typescript-eslint/camelcase */
import { OpenSRPService } from '@opensrp/react-utils';
import { Dictionary } from '@onaio/utils';
import {
  ACTIVE,
  baseURL,
  LOCATION_HIERARCHY,
  LOCATION_UNIT_FINDBYPROPERTIES,
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

/** loader function to get jurisdictions by geographic level
 *
 * @param dispatcher - called with response, adds data to store
 * @param openSRPBaseURL - the openSRP api base url
 * @param urlParams - search params to be added to request
 * @param filterParams - filterParams for property_filter search_param
 * @param service - openSRP service class
 */
export async function loadJurisdictions(
  dispatcher?: typeof fetchLocationUnits,
  openSRPBaseURL: string = baseURL,
  urlParams: GetLocationParams = defaultGetLocationParams,
  filterParams: ParamFilters = defaultParamFilters,
  service: typeof OpenSRPService = OpenSRPService
) {
  const serve = new service(LOCATION_UNIT_FINDBYPROPERTIES, openSRPBaseURL);
  const params = {
    ...urlParams,
    properties_filter: service.getFilterParams(filterParams as Dictionary),
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
  serviceClass: typeof OpenSRPService,
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
