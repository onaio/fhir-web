/** Organizations redux module */
import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
  getTotalRecordsFactory,
} from '@opensrp/reducer-factory';

/** The reducer name */
export const orgReducerName = 'organizations';

/** interface for Organizations coding property */
interface OrganizationCoding {
  code: string;
  display: string;
  system: string;
}

/** interface for the type key in an Organization Object */
interface OrganizationType {
  coding: OrganizationCoding[];
}

/** interface for a Organization object */
export interface Organization {
  active: boolean;
  identifier: string;
  name: string;
  id: number;
  partOf?: number;
  type?: OrganizationType;
}

export interface OrganizationPOST extends Partial<Organization> {
  active: boolean;
  identifier: string;
  name: string;
}

// action interfaces

/** Item Reducer */
export const organizationsReducer = reducerFactory<Organization>(orgReducerName);

// actions
/** actionCreator returns action to add Item records to store */
export const fetchOrganizationsAction = fetchActionCreatorFactory<Organization>(
  orgReducerName,
  'id'
);
export const removeOrganizationsAction = removeActionCreatorFactory(orgReducerName);
export const setTotalOrganizationsAction = setTotalRecordsFactory(orgReducerName);

// selectors
export const getOrganizationsById = getItemsByIdFactory<Organization>(orgReducerName);
export const getOrganizationById = getItemByIdFactory<Organization>(orgReducerName);
export const getOrganizationsArray = getItemsArrayFactory<Organization>(orgReducerName);
export const getTotalOrganizations = getTotalRecordsFactory(orgReducerName);
