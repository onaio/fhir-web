/** plans  service hook */

import { store, makeAPIStateSelector } from '@opensrp-web/store';
import { OpenSRPService as GenericOpenSRPService } from '@opensrp-web/server-service';
import { Dictionary } from '@onaio/utils';
import { OPENSRP_API_BASE_URL, OPENSRP_PLAN_ENDPOINT } from '../constants';
import { PlanDefinition } from '@opensrp-web/plan-form-core';

const sessionSelector = makeAPIStateSelector();

/** OpenSRP service */
export class OpenSRPService<T extends object = Dictionary> extends GenericOpenSRPService<T> {
  constructor(endpoint: string, baseURL: string = OPENSRP_API_BASE_URL) {
    const accessToken = sessionSelector(store.getState(), { accessToken: true });
    super(accessToken, baseURL, endpoint);
  }
}

/**
 * @param {Dictionary} payload - the payload
 * @param {string} baseURL -  base url of api
 * @param {boolean} isEdit - help decide whether to post or put plan
 * @param {OpenSRPService} service - the opensrp service
 * @returns {Promise<void>}
 */
export async function postPutPlan(
  payload: PlanDefinition,
  baseURL: string,
  isEdit = true,
  service = OpenSRPService
) {
  const serve = new service(OPENSRP_PLAN_ENDPOINT, baseURL);
  if (isEdit) {
    return serve.update(payload).catch((err: Error) => {
      throw err;
    });
  }
  return serve.create(payload).catch((err: Error) => {
    throw err;
  });
}
