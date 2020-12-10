/** get the full plans dataloader
 */

import { store, makeAPIStateSelector } from '@opensrp/store';
import { OpenSRPService as GenericOpenSRPService } from '@opensrp/server-service';
import { OPENSRP_API_BASE_URL, OPENSRP_PLANS } from '../constants';
import { fetchPlanDefinitions } from '../ducks';
import { PlanDefinition } from '@opensrp/plan-form-core';

const sessionSelector = makeAPIStateSelector();

/** OpenSRP service */
export class OpenSRPService extends GenericOpenSRPService {
  constructor(endpoint: string, baseURL: string = OPENSRP_API_BASE_URL) {
    const accessToken = sessionSelector(store.getState(), { accessToken: true });
    super(accessToken, baseURL, endpoint);
  }
}

/**
 * @param {string} baseURL -  base url of api
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchPlanDefinitions} actionCreator - Action creator; creates actions that adds plans to the store
 * @param {string} planStatus - plan's status
 * @returns {Promise<void>}
 */
export async function loadPlans(
  baseURL: string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchPlanDefinitions = fetchPlanDefinitions,
  planStatus?: string
) {
  const serve = new service(OPENSRP_PLANS, baseURL);
  return serve
    .list(planStatus ? { status: planStatus } : null)
    .then((response: PlanDefinition[] | null) => {
      if (response === null) {
        return Promise.reject(new Error('No data found'));
      }
      actionCreator(response);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 * @param {string} baseURL -  base url of api
 * @param {string} id - id of the product to be fetched
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchPlanDefinitions} actionCreator - Action creator; creates actions thad adds plans to the store
 *
 * @returns {Promise<void>}
 */
export async function loadSinglePlan(
  baseURL: string,
  id: string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchPlanDefinitions = fetchPlanDefinitions
) {
  const serve = new service(OPENSRP_PLANS, baseURL);
  return serve
    .read(id)
    .then((response: PlanDefinition[]) => {
      actionCreator(response);
    })
    .catch((err: Error) => {
      throw err;
    });
}
