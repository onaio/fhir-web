/** Redux module for product-catalogue
 * initially developed for eusm-web
 */

import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
} from '@opensrp/reducer-factory';

/** The reducer name */
export const reducerName = 'team-assignments';

/** interface for a Assignment object */
export interface TeamAssignment {
  fromDate: number;
  jurisdictionId: string;
  organizationId: string;
  planId: string;
  toDate: number;
}

/** Action types */
const FETCHED_TEAM_ASSIGNMENTS = `src/store/ducks/team-assignments/reducer/FETCHED_TEAM_ASSIGNMENTS`;
const REMOVE_TEAM_ASSIGNMENTS = `src/store/ducks/team-assignments/reducer/REMOVE_TEAM_ASSIGNMENTS`;

/** Item Reducer */
export const teamAssignmentReducer = reducerFactory<TeamAssignment>(
  reducerName,
  FETCHED_TEAM_ASSIGNMENTS,
  REMOVE_TEAM_ASSIGNMENTS
);

// action
export const fetchTeamAssignments = fetchActionCreatorFactory<TeamAssignment>(
  reducerName,
  'organizationId'
);
export const removeTeamAssignments = removeActionCreatorFactory(reducerName);

// selectors
export const getTeamAssignmentsById = getItemsByIdFactory<TeamAssignment>(reducerName);
export const getTeamAssignmentById = getItemByIdFactory<TeamAssignment>(reducerName);
export const getTeamAssignmentsArray = getItemsArrayFactory<TeamAssignment>(reducerName);
