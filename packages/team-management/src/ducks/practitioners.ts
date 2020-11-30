/** Organizations redux module */
import {
  fetchActionCreatorFactory,
  reducerFactory,
  getItemsArrayFactory,
  removeActionCreatorFactory,
} from '@opensrp/reducer-factory';

/** The reducer name */
export const reducerName = 'Practitioner';

/** interface for a Organization object */
interface PractitionerCoding {
  text: string;
}

/** interface for a Practitioner object */
export interface Practitioner {
  identifier: string;
  active: boolean;
  name: string;
  userId: string;
  username: string;
  code?: PractitionerCoding;
}

export interface PractitionerPOST {
  active: boolean;
  code: { text: 'Community Health Worker' };
  identifier: string; // --- uuid, auto generated
  organization: string; // --- team uuid
  practitioner: string; // --- practitioner uuid
}

// action interfaces

/** action type for action that adds Organizations to store */
export const PRACTITIONER_FETCH = 'Practitioner/ORGANIZATIONS_FETCHED';

/** Item Reducer */
const reducer = reducerFactory<Practitioner>(reducerName, PRACTITIONER_FETCH);

// actions
/** actionCreator returns action to add Item records to store */
export const fetchPractitionerAction = fetchActionCreatorFactory<Practitioner>(
  reducerName,
  'identifier'
);
export const removePractitionerAction = removeActionCreatorFactory(reducerName);

// selectors
export const getPractitionerArray = getItemsArrayFactory<Practitioner>(reducerName);

export default reducer;
