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
export const reducerName = 'assignments';

/** interface for a Assignment object */
export interface Assignment {
  fromDate: number;
  jurisdictionId: string;
  organizationId: string;
  planId: string;
  toDate: number;
}

/** Action types */
const FETCHED_ASSIGNMENTS = `src/store/ducks/team-assignments/reducer/FETCHED_ASSIGNMENTS`;
const REMOVE_ASSIGNMENTS = `src/store/ducks/team-assignments/reducer/REMOVE_ASSIGNMENTS`;

/** Item Reducer */
export const assignmentReducer = reducerFactory<Assignment>(
  reducerName,
  FETCHED_ASSIGNMENTS,
  REMOVE_ASSIGNMENTS
);

// action
export const fetchAssignments = fetchActionCreatorFactory<Assignment>(
  reducerName,
  'organizationId'
);
export const removeAssignments = removeActionCreatorFactory(reducerName);

// selectors
export const getAssignmentsById = getItemsByIdFactory<Assignment>(reducerName);
export const getAssignmentById = getItemByIdFactory<Assignment>(reducerName);
export const getAssignmentsArray = getItemsArrayFactory<Assignment>(reducerName);
