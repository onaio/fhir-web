/** Organizations redux module */
import {
  fetchActionCreatorFactory,
  reducerFactory,
  getItemsArrayFactory,
  removeActionCreatorFactory,
} from '@opensrp/reducer-factory';

/** The reducer name */
export const reducerName = 'practioners';

/** interface for a Organization object */
export interface Practioner {
  active: boolean;
  identifier: string;
  name: string;
  username: number;
  userId: string;
}

// action interfaces

/** action type for action that adds Organizations to store */
export const PRACTIONERS_FETCH = 'practioners/ORGANIZATIONS_FETCHED';

/** Item Reducer */
const reducer = reducerFactory<Practioner>(reducerName, PRACTIONERS_FETCH);

// actions
/** actionCreator returns action to add Item records to store */
export const fetchPractionerAction = fetchActionCreatorFactory<Practioner>(reducerName, 'userId');
export const removePractionerAction = removeActionCreatorFactory(reducerName);

// selectors
export const getPractitionerArray = getItemsArrayFactory<Practioner>(reducerName);

export default reducer;
