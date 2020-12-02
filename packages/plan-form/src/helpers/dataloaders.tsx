/** get the full product Catalogue
 */

import { store, makeAPIStateSelector } from '@opensrp/store';
import { getFetchOptions, OpenSRPService as GenericOpenSRPService } from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';
import { OPENSRP_API_BASE_URL, OPENSRP_PLAN_ENDPOINT } from '../constants';
import { PlanDefinition } from '@opensrp/planform-core';

const sessionSelector = makeAPIStateSelector();

/** OpenSRP service */
export class OpenSRPService<T extends object = Dictionary> extends GenericOpenSRPService<T> {
  constructor(
    endpoint: string,
    baseURL: string = OPENSRP_API_BASE_URL,
    fetchOptions: typeof getFetchOptions = getFetchOptions
  ) {
    const accessToken = sessionSelector(store.getState(), { accessToken: true });
    super(accessToken, baseURL, endpoint, fetchOptions);
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
  let serveMethod = serve.create;
  if (isEdit) {
    serveMethod = serve.update;
  }
  return serveMethod(payload).catch((err: Error) => {
    throw err;
  });
}
