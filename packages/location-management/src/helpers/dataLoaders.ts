/* eslint-disable @typescript-eslint/camelcase */
import { OpenSRPService } from '@opensrp/react-utils';
import { ACTIVE, baseURL, LOCATION_HIERARCHY, LOCATION_UNIT_FINDBYPROPERTIES } from '../constants';
import { fetchLocationUnits, LocationUnit } from '../ducks/location-units';
import { fetchTree } from '../ducks/locationHierarchy';
import { RawOpenSRPHierarchy } from '../ducks/locationHierarchy/types';

/** Abstract 2 functions; get jurisdiction at any geo-level, get hierarchy */

interface LoadHierarchyParams {
  return_structure_count?: boolean;
}

/** get the jurisdiction Tree given the rootJurisdiction Id
 *
 * @param rootJurisdictionId - id of top level jurisdiction
 * @param dispatcher - dispatches an action to add hierarchy to store
 * @param urlParams - parameters to add to request
 * @param openSRPBaseURL - base url
 * @param service - the opensrp service
 */
export async function loadHierarchy(
  rootJurisdictionId: string,
  dispatcher?: typeof fetchTree,
  urlParams: LoadHierarchyParams = {},
  openSRPBaseURL: string = baseURL,
  service: typeof OpenSRPService = OpenSRPService
) {
  const serve = new service(openSRPBaseURL, LOCATION_HIERARCHY);
  const params = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    return_structure_count: false,
    ...urlParams,
  };
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

/** filter params to be added as value of properties_filter url param */
export interface ParamFilters {
  status?: string;
  geographicLevel?: number;
}

/** loader function to get jurisdictions by geographic level
 *
 * @param dispatcher - called with response, adds data to store
 * @param urlParams - search params to be added to request
 * @param filterParams - filterParams for property_filter search_param
 * @param openSRPBaseURL - the openSRP api base url
 * @param service - openSRP service class
 */
export async function loadJurisdictions(
  dispatcher?: typeof fetchLocationUnits,
  urlParams: GetLocationParams = {},
  filterParams: ParamFilters = {},
  openSRPBaseURL: string = baseURL,
  service: typeof OpenSRPService = OpenSRPService
) {
  const serve = new service(openSRPBaseURL, LOCATION_UNIT_FINDBYPROPERTIES);
  const filterParameters = {
    status: ACTIVE,
    geographicLevel: 0,
    ...filterParams,
  };
  const params = {
    is_jurisdiction: true,
    return_geometry: false,
    ...urlParams,
    properties_filter: OpenSRPService.getFilterParams(filterParameters),
  };
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
