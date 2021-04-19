/** Organizations redux module */
import { Require } from '@opensrp/react-utils';
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
import { IfhirR4 } from '@smile-cdr/fhirts';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/identifier';

/** The reducer name */
export const reducerName = 'organizations';

/** interface for FHIR response */
export interface FHIRResponse<T> {
  resourceType: string;
  id: string;
  meta: { lastUpdated: string };
  type: string;
  total: number;
  link: [{ relation: string; url: string }];
  entry: {
    fullUrl: string;
    resource: T;
    search: { mode: string };
  }[];
}

/** interface for Objects */
export interface Organization extends Require<IfhirR4.IOrganization, 'name' | 'id' | 'active'> {
  resourceType: 'Organization';
  identifier?: [Identifier & { use: 'official' }];
}

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
