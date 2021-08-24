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
} from '@opensrp-web/reducer-factory';

/** The reducer name */
export const reducerName = 'organizations';

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
export const reducer = reducerFactory<Organization>(reducerName);

// actions
/** actionCreator returns action to add Item records to store */
export const fetchOrganizationsAction = fetchActionCreatorFactory<Organization>(reducerName, 'id');
export const removeOrganizationsAction = removeActionCreatorFactory(reducerName);
export const setTotalOrganizationsAction = setTotalRecordsFactory(reducerName);

// selectors
export const getOrganizationsById = getItemsByIdFactory<Organization>(reducerName);
export const getOrganizationById = getItemByIdFactory<Organization>(reducerName);
export const getOrganizationsArray = getItemsArrayFactory<Organization>(reducerName);
export const getTotalOrganizations = getTotalRecordsFactory(reducerName);
