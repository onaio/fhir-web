/** get the full plans data-loader */
import { get, keyBy, uniqBy } from 'lodash';
import { store, makeAPIStateSelector } from '@opensrp/store';
import { OpenSRPService as GenericOpenSRPService } from '@opensrp/server-service';
import {
  OPENSRP_ACTIVE,
  OPENSRP_API_BASE_URL,
  OPENSRP_FIND_BY_PROPERTIES,
  OPENSRP_GET_ASSIGNMENTS_ENDPOINT,
  OPENSRP_LOCATION,
  OPENSRP_ORGANIZATION_ENDPOINT,
  OPENSRP_PLANS,
  OPENSRP_POST_ASSIGNMENTS_ENDPOINT,
} from '../constants';
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

/** get all the assignments for plan
 *
 * @param {string} baseURL -  base url of api
 * @param {string} planId - id of the product to be fetched
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchAssignments} actionCreator - Action creator; creates actions that adds plans to the store
 * @returns {Promise<void>}
 */
export async function loadAssignments(
  baseURL: string,
  planId: string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchAssignments = fetchAssignments
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
        throw new Error(COULD_NOT_LOAD_ASSIGNMENTS);
      }
    })
    .catch((e) => e);
}

// TODO: - create issue that effects pagination on the api

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
    .catch((e) => e);
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

/** retire assignments for the given jurisdictions
 *
 * @param {string[]} selectedOrgs - an array of the selected organization ids
 * @param {string[]} selectedJurisdictions - the selected OpenSRP jurisdiction
 * @param {string[]} initialJurisdictions - the selected OpenSRP jurisdiction
 * @param {Assignment[]} existingAssignments - an array of Assignment objects that exist for this plan/jurisdiction
 * @returns {Assignment[]} -
 */
export const retireAssignmentsByJur = (
  selectedOrgs: string[],
  selectedJurisdictions: string[],
  initialJurisdictions: string[] = [],
  existingAssignments: Assignment[] = []
) => {
  const now = moment(new Date());
  if (selectedOrgs.length === 0) {
    return [];
  }
  const removedJurisdictions = initialJurisdictions.filter(
    (jurisdiction) => !selectedJurisdictions.includes(jurisdiction)
  );
  const assignmentsByJur = keyBy(existingAssignments, 'jurisdiction');
  const retireDate = now.format();
  const payload: Assignment[] = [];
  removedJurisdictions.forEach((jurisdiction) => {
    const thisAssignment = assignmentsByJur[jurisdiction];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (thisAssignment) {
      payload.push({ ...thisAssignment, toDate: retireDate });
    }
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
      return err;
    });
}

/** post assignments to api
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
    .catch((error: Error) => error);
};

/** load jurisdictions at a specific level of the hierarchy
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
    // eslint-disable-next-line @typescript-eslint/camelcase
    is_jurisdiction: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
    return_geometry: false,
  };
  const serve = new service(`${OPENSRP_LOCATION}/${OPENSRP_FIND_BY_PROPERTIES}`, baseURL);
  const propertiesToFilter = {
    status: OPENSRP_ACTIVE,
    ...{ geographicLevel: geographicLevel },
  };
  const paramsToUse = {
    ...params,
    // eslint-disable-next-line @typescript-eslint/camelcase
    properties_filter: service.getFilterParams(propertiesToFilter),
  };

  return serve
    .list({ ...paramsToUse })
    .then((response: Jurisdiction[]) => {
      actionCreator(response);
    })
    .catch((error: Error) => error);
};
