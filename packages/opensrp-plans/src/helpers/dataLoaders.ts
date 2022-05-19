/** get the full plans data-loader */
import { get, keyBy, uniqBy } from 'lodash';
import { store, makeAPIStateSelector } from '@opensrp/store';
import {
  NO_DATA_FOUND,
  OPENSRP_ACTIVE,
  OPENSRP_API_BASE_URL,
  OPENSRP_FIND_BY_PROPERTIES,
  OPENSRP_GET_ASSIGNMENTS_ENDPOINT,
  OPENSRP_LOCATION,
  OPENSRP_ORGANIZATION_ENDPOINT,
  OPENSRP_PLANS,
  OPENSRP_POST_ASSIGNMENTS_ENDPOINT,
  OPENSRP_TASK_SEARCH,
} from '../constants';
import { OpenSRPService as GenericOpenSRPService, URLParams } from '@opensrp/server-service';
import { fetchPlanDefinitions } from '../ducks/planDefinitions';
import {
  fetchAssignments,
  Assignment,
  RawAssignment,
  processRawAssignments,
} from '@opensrp/team-assignment';
import { PlanDefinition } from '@opensrp/plan-form-core';
import moment from 'moment';
import {
  fetchOrganizationsAction as fetchOrganizations,
  Organization,
} from '@opensrp/team-management';
import { fetchJurisdictions, Jurisdiction } from '../ducks/jurisdictions';
import { Dictionary } from '@onaio/utils';
import type { TFunction } from 'react-i18next';

const sessionSelector = makeAPIStateSelector();

export interface TaskCount {
  total_records: number;
  tasks: Dictionary[];
}

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
        return Promise.reject(new Error(NO_DATA_FOUND));
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
 * get all the assignments for plan
 *
 * @param baseURL -  base url of api
 * @param planId - id of the product to be fetched
 * @param service - the opensrp service
 * @param actionCreator - Action creator; creates actions that adds plans to the store
 * @param t - the translator function
 */
export async function loadAssignments(
  baseURL: string,
  planId: string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchAssignments = fetchAssignments,
  t: TFunction
) {
  // get all assignments
  const serve = new service(OPENSRP_GET_ASSIGNMENTS_ENDPOINT, baseURL);
  return serve
    .list({ plan: planId })
    .then((response: RawAssignment[] | null) => {
      if (response) {
        const receivedAssignments: Assignment[] = processRawAssignments(response);
        // save assignments to store
        actionCreator(receivedAssignments);
      } else {
        throw new Error(t('Could not load assignments'));
      }
    })
    .catch((e) => {
      throw e;
    });
}

/**
 * load organizations for plan
 *
 * @param {string} baseURL -  base url of api
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchOrganizations} actionCreator - Action creator; creates actions that adds plans to the store
 * @returns {Promise<void>}
 */
export async function loadOrganizations(
  baseURL: string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchOrganizations = fetchOrganizations
) {
  // fetch all organizations
  const serve = new service(OPENSRP_ORGANIZATION_ENDPOINT, baseURL);
  return serve
    .list()
    .then((response: Organization[] | null) => {
      if (response) {
        actionCreator(response);
      }
    })
    .catch((e) => {
      throw e;
    });
}

/**
 * Get assignments payload
 *
 * Takes values from the JurisdictionAssignmentForm component and generates a payload
 * of assignments ready to be sent to the OpenSRP API.
 *
 * @param {string[]} selectedOrgs - an array of the selected organization ids
 * @param {PlanDefinition} selectedPlan - the selected plan definition object
 * @param {string} selectedJurisdiction - the selected OpenSRP jurisdiction
 * @param {string[]} initialOrgs - an array of initial (existing) organization ids
 * @param {Assignment[]} existingAssignments - an array of Assignment objects that exist for this plan/jurisdiction
 * @returns {Assignment[]} -
 */
export const getSingleJurisdictionPayload = (
  selectedOrgs: string[],
  selectedPlan: PlanDefinition,
  selectedJurisdiction: string,
  initialOrgs: string[] = [],
  existingAssignments: Assignment[] = []
): Assignment[] => {
  const now = moment(new Date());
  let startDate = now.format();
  const endDate = moment(selectedPlan.effectivePeriod.end).format();

  const payload: Assignment[] = [];
  const assignmentsByOrgId = keyBy(existingAssignments, 'organization');

  for (const orgId of selectedOrgs) {
    if (!payload.map((obj) => obj.organization).includes(orgId)) {
      if (initialOrgs.includes(orgId)) {
        // we should not change the fromDate, ever (the API will reject it)
        const thisAssignment = get(assignmentsByOrgId, orgId);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (thisAssignment) {
          startDate = thisAssignment.fromDate;
        }
      }
      payload.push({
        fromDate: startDate,
        jurisdiction: selectedJurisdiction,
        organization: orgId,
        plan: selectedPlan.identifier,
        toDate: endDate,
      });
    }
  }

  // turns out if you put it in the loop it keeps subtracting a day for every iteration
  const retireDate = now.format();

  for (const retiredOrgId of initialOrgs.filter((orgId) => !selectedOrgs.includes(orgId))) {
    if (!payload.map((obj) => obj.organization).includes(retiredOrgId)) {
      // we should not change the fromDate, ever (the API will reject it)
      const thisAssignment = get(assignmentsByOrgId, retiredOrgId);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (thisAssignment) {
        startDate = thisAssignment.fromDate;
      }
      payload.push({
        fromDate: startDate,
        jurisdiction: selectedJurisdiction,
        organization: retiredOrgId,
        plan: selectedPlan.identifier,
        toDate: retireDate,
      });
    }
  }

  return payload;
};

/**
 * retire all assignments pertaining to a certain jurisdiction, bound by the rules:
 * if plan is given; retire assignments by jurisdiction for only the specified plan, otherwise retire everything for said jurisdiction
 * if orgs are given; retire assignments by jurisdiction for only specified orgs, otherwise retire everything for said jurisdiction
 * if both are given; retire assignments by jurisdiction that have the plan and org
 *
 * @param selectedJurisdictions - the selected OpenSRP jurisdiction
 * @param initialJurisdictions - the selected OpenSRP jurisdiction
 * @param existingAssignments - an array of Assignment objects that exist for this plan/jurisdiction
 * @param selectedOrgs - an array of the selected organization ids
 * @param planId - id of plan that set scope of retired assignments
 */
export const retireAssignmentsByJur = (
  selectedJurisdictions: string[],
  initialJurisdictions: string[] = [],
  existingAssignments: Assignment[] = [],
  selectedOrgs: string[] = [],
  planId: string | undefined = undefined
) => {
  const now = moment(new Date());
  const retireDate = now.format();

  const removedJurisdictions = initialJurisdictions.filter(
    (jurisdiction) => !selectedJurisdictions.includes(jurisdiction)
  );

  if (removedJurisdictions.length === 0) {
    return [];
  }

  const payload: Assignment[] = [];
  // looped through the assignments and checked if they match the criteria for retirements
  existingAssignments.forEach((assignment) => {
    if (planId && assignment.plan !== planId) {
      return;
    }
    if (selectedOrgs.length > 0 && !selectedOrgs.includes(assignment.organization)) {
      return;
    }
    if (!removedJurisdictions.includes(assignment.jurisdiction)) {
      return;
    }
    payload.push({
      ...assignment,
      toDate: retireDate,
    });
  });

  return payload;
};

/**
 * Get assignments payload for several areas
 *
 * Takes values from the JurisdictionAssignmentForm component and generates a payload
 * of assignments ready to be sent to the OpenSRP API.
 *
 * @param {string[]} selectedOrgs - an array of the selected organization ids
 * @param {PlanDefinition} selectedPlan - the selected plan definition object
 * @param {string []} selectedJurisdictions - the selected OpenSRP jurisdiction
 * @param {string[]} initialOrgs - an array of initial (existing) organization ids
 * @param {Assignment[]} existingAssignments - an array of Assignment objects that exist for this plan/jurisdiction
 * @returns {Assignment[]} -
 */
export const getAllJursPayload = (
  selectedOrgs: string[],
  selectedPlan: PlanDefinition,
  selectedJurisdictions: string[],
  initialOrgs: string[] = [],
  existingAssignments: Assignment[] = []
): Assignment[] => {
  let allAssignments: Assignment[] = [];
  selectedJurisdictions.forEach((selectedJurisdiction) => {
    const selectedJursAssignments = getSingleJurisdictionPayload(
      selectedOrgs,
      selectedPlan,
      selectedJurisdiction,
      initialOrgs,
      existingAssignments
    );
    allAssignments = [...allAssignments, ...selectedJursAssignments];
  });
  return allAssignments;
};

// put jurisdictions to plan

/**
 * send plan payload to api
 *
 * @param {string} baseURL -  base url of api
 * @param {PlanDefinition} planPayload - original plan definition
 * @param {string []} jurisdictionIds -  the ids to attach to plan
 * @param {boolean} append - whether to add jurisdictions to existing
 * @param {OpenSRPService} service - the openSRP service
 * @param {object} fetchPlanCreator - action creator to add plan to store
 * @returns {object} -
 */
export async function putJurisdictionsToPlan(
  baseURL: string,
  planPayload: PlanDefinition,
  jurisdictionIds: string[],
  append = false,
  service: typeof OpenSRPService = OpenSRPService,
  fetchPlanCreator: typeof fetchPlanDefinitions = fetchPlanDefinitions
) {
  const serve = new service(OPENSRP_PLANS, baseURL);
  // can append operations be idempotent
  let jurisdictions = jurisdictionIds.map((jurisdictionId) => ({ code: jurisdictionId }));
  if (append) {
    // add jurisdictions to existing
    jurisdictions = [...planPayload.jurisdiction, ...jurisdictions];
  }
  const uniqJurisdictions = uniqBy(jurisdictions, 'code');
  const payload = { ...planPayload, jurisdiction: uniqJurisdictions };
  return serve
    .update(payload)
    .then(() => {
      fetchPlanCreator([payload]);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 * post assignments to api
 *
 * @param {string} baseURL -  base url of api
 * @param {Assignment[]} payload - the assignments payload
 * @param {fetchAssignments} actionCreator -  dispatches assignments to store
 * @param {OpenSRPService} service - the openSRP service
 * @param {boolean} overwrite - whether to replace assignments for this plan
 * @returns {Promise} - promise
 */
export const updateAssignments = (
  baseURL: string,
  payload: Assignment[],
  actionCreator: typeof fetchAssignments = fetchAssignments,
  service: typeof OpenSRPService = OpenSRPService,
  overwrite = false
) => {
  const serve = new service(OPENSRP_POST_ASSIGNMENTS_ENDPOINT, baseURL);
  return serve
    .create(payload)
    .then(() => {
      actionCreator(payload, overwrite);
    })
    .catch((error: Error) => {
      throw error;
    });
};

/**
 * load jurisdictions at a specific level of the hierarchy
 *
 * @param {string} baseURL -  base url of api
 * @param {number} geographicLevel - geography level to load jurisdictions for
 * @param {fetchJurisdictions} actionCreator -  dispatches jurisdictions to store
 * @param {OpenSRPService} service - the openSRP service
 * @returns {OpenSRPService} - promise
 */
export const loadJurisdictions = (
  baseURL: string,
  geographicLevel: number,
  actionCreator: typeof fetchJurisdictions = fetchJurisdictions,
  service: typeof OpenSRPService = OpenSRPService
) => {
  const params = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    is_jurisdiction: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return_geometry: false,
  };
  const serve = new service(`${OPENSRP_LOCATION}/${OPENSRP_FIND_BY_PROPERTIES}`, baseURL);
  const propertiesToFilter = {
    status: OPENSRP_ACTIVE,
    ...{ geographicLevel: geographicLevel },
  };
  const paramsToUse = {
    ...params,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    properties_filter: service.getFilterParams(propertiesToFilter),
  };

  return serve
    .list({ ...paramsToUse })
    .then((response: Jurisdiction[]) => {
      actionCreator(response);
    })
    .catch((error: Error) => {
      throw error;
    });
};

export interface TaskParams extends URLParams {
  status?: string;
  businessStatus?: string;
}

/**
 * @param baseURL - base url of the api
 * @param planId - fetch tasks data for this plan
 * @param code - activity code
 * @param onlyCount - whether to get the count only
 * @param otherParams - other adhoc params to add to request
 * @returns a response object
 */
export async function loadTasksIndicators(
  baseURL: string,
  planId: string,
  code: string,
  onlyCount: boolean,
  otherParams: TaskParams
) {
  const params = {
    planIdentifier: planId,
    code,
    returnTaskCountOnly: onlyCount,
    ...otherParams,
  };
  const serve = new OpenSRPService(OPENSRP_TASK_SEARCH, baseURL);
  return serve
    .list(params)
    .then((response: TaskCount | null) => {
      if (response === null) {
        return Promise.reject(new Error(NO_DATA_FOUND));
      }
      return response;
    })
    .catch((err: Error) => {
      throw err;
    });
}
