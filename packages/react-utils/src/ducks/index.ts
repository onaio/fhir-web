/** Filtered Data redux module */
import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  reducerFactory,
  getItemsArrayFactory,
} from '@opensrp/reducer-factory';

import { Dictionary } from '@onaio/utils';

/** The reducer name */
export const reducerName = 'filtered-data';

/** Item Reducer */
export const filteredDataReducer = reducerFactory<Dictionary>(reducerName);

// actions
/** actionCreator returns action to add Item records to store */
export const fetchFilteredDataAction = fetchActionCreatorFactory<Dictionary>(reducerName, 'id');
export const removeFilteredDataAction = removeActionCreatorFactory(reducerName);

// selectors
export const getFilteredDataArray = getItemsArrayFactory<Dictionary>(reducerName);
