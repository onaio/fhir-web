/** get the full product Catalogue
 */

import { store, makeAPIStateSelector } from '@opensrp/store';
import { OpenSRPService as GenericOpenSRPService } from '@opensrp/server-service';
import { OPENSRP_API_BASE_URL, OPENSRP_PLANS } from '../constants';
import { fetchPlanDefinitions } from '../ducks';
import { PlanDefinition } from '../plan-global-types';

/** OpenSRP service */
export class OpenSRPService extends GenericOpenSRPService {
  constructor(endpoint: string, baseURL: string = OPENSRP_API_BASE_URL) {
    const sessionSelector = makeAPIStateSelector();
    const accessToken = sessionSelector(store.getState(), { accessToken: true });
    super(accessToken, baseURL, endpoint);
  }
}

/**
 * @param {string} baseURL -  base url of api
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchPlanDefinitions} actionCreator - Action creator; creates actions thad adds products to the store
 *
 * @returns {Promise<void>}
 */
export async function loadPlans(
  baseURL: string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchPlanDefinitions = fetchPlanDefinitions
) {
  const serve = new service(OPENSRP_PLANS, baseURL);
  return serve
    .list()
    .then((response: PlanDefinition[] | null) => {
      if (response === null || response.length === 0) {
        return Promise.reject(new Error('No data found'));
      }
      actionCreator(response);
    })
    .catch((err: Error) => {
      throw err;
    });
}
