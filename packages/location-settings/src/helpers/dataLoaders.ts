/** get the full product Catalogue
 */

import { store } from '@opensrp/store';
import { URLParams } from '@opensrp/server-service';
import { OpenSRPService } from '@opensrp/react-utils';
import { fetchLocationSettingsAction, Setting } from '../ducks/settings';
import { SECURITY_AUTHENTICATE_ENDPOINT } from '../constants';
import { generateJurisdictionTree, locationHierachyDucks } from '@opensrp/location-management';

/**
 * @param {string} baseURL -  base url of api
 * @param {string} locId - current location id
 * @param {URLParams} params - url query params
 * @param {Dispatch<AnyAction>} dispatch - dispatches action
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchProducts} actionCreator - Action creator; creates actions thad adds products to the store
 *
 * @returns {Promise<void>}
 */
export async function fetchSettings(
  baseURL: string,
  locId: string,
  params: URLParams,
  dispatch: typeof store.dispatch,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchLocationSettingsAction = fetchLocationSettingsAction
) {
  const serve = new service('settings', baseURL);
  return serve
    .list(params)
    .then((response: Setting[]) => {
      dispatch(actionCreator(response, locId, false));
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 *
 * @param {string} baseURL - api base url
 * @param {OpenSRPService} service - opensrp service class
 *
 */
export async function fetchUserLocationSettings(
  baseURL: string,
  service: typeof OpenSRPService = OpenSRPService
) {
  const serve = new service(SECURITY_AUTHENTICATE_ENDPOINT, baseURL);
  return serve.list();
}

export async function getLocationHierarchy(baseURL: string, dispatch: typeof store.dispatch) {
  const userLocSettings = await fetchUserLocationSettings(baseURL);
  const { locationsHierarchy } = userLocSettings.locations;
  const processedHierarchy = generateJurisdictionTree({ locationsHierarchy });
  dispatch(locationHierachyDucks.fetchAllHierarchies([processedHierarchy.model]));

  const { map: userLocMap } = userLocSettings.locations.locationsHierarchy;
  return Object.keys(userLocMap)[0];
}
