/** get the full plans data-loader */
import { get, keyBy, uniqBy } from 'lodash';
import { store, makeAPIStateSelector } from '@opensrp/store';
import {
  customFetch,
  OpenSRPService as GenericOpenSRPService,
  throwHTTPError,
} from '@opensrp/server-service';
import { OPENSRP_API_BASE_URL, OPENSRP_PLANS, OPENSRP_TASK_SEARCH } from '../constants';
import { fetchPlanDefinitions } from '../ducks/planDefinitions';
import { fetchAssignments, Assignment, RawAssignment } from '../ducks/assignments';
import { PlanDefinition } from '@opensrp/plan-form-core';
import moment from 'moment';
import {
  fetchOrganizationsAction as fetchOrganizations,
  Organization,
} from '@opensrp/team-management';
import { fetchJurisdictions, Jurisdiction } from '../ducks/jurisdictions';
import { processRawAssignments } from '../ducks/assignments/utils';
import { COULD_NOT_LOAD_ASSIGNMENTS } from '../lang';

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
  planStatus?: string | null
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

/**
 * @param  baseURL - base url of the api
 * @param planId - fetch tasks data for this plan
 * @param code - activity code
 * @param onlyCount - whether to get the count only
 * @returns a response object
 */
export async function loadTasksIndicators(
  baseURL: string,
  planId: string,
  code: string,
  onlyCount: boolean
) {
  const params = {
    planIdentifier: planId,
    code,
    returnTaskCountOnly: onlyCount,
  };
  const endpoint = OPENSRP_TASK_SEARCH;
  const generalURL = `${baseURL}${endpoint}`;
  const url = OpenSRPService.getURL(generalURL, params);
  const accessToken = sessionSelector(store.getState(), { accessToken: true });
  const accept = 'application/json';
  const authorizationType = 'Bearer';
  const contentType = 'application/json;charset=UTF-8';
  const requestOptions = {
    headers: {
      // accept,
      authorization: `${authorizationType} ${accessToken}`,
      // 'content-type': contentType,
    },
    method: 'GET',
  };
  let response: any;
  await fetch(url, requestOptions).then((res) => {
    response = res.clone();
    for (const header of res.headers) {
      console.log('***********', header);
    }
  });
  console.log('Orignal response', response);
  for (const key of response.headers) {
    console.log('>>>', key);
  }

  if (response.ok) {
    return response;
  }

  const defaultMessage = `OpenSRPService list on ${endpoint} failed, HTTP status ${response.status}`;
  return throwHTTPError(response, defaultMessage);
}
