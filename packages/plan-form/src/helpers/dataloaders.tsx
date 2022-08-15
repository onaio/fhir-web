/** plans  service hook */

import { OpenSRPService } from '@opensrp/react-utils';
import { OPENSRP_PLAN_ENDPOINT } from '../constants';
import { PlanDefinition } from '@opensrp/plan-form-core';

/**
 * @param payload - the payload
 * @param baseURL -  base url of api
 * @param isEdit - help decide whether to post or put plan
 * @param service - the opensrp service
 * @returns a promise with response or error
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
