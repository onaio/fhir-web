import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
} from '@opensrp/reducer-factory';
import { ManifestFilesTypes } from './manifestFiles';

/** reducer name */
export const draftReducerName = 'manifestDraftFiles';

/** manifest draft files Reducer */
export const draftReducer = reducerFactory<ManifestFilesTypes>(draftReducerName);

// action
/** fetch manifest draft files to store action */
export const fetchManifestDraftFiles = fetchActionCreatorFactory<ManifestFilesTypes>(
  draftReducerName,
  'id'
);

/** clear manifest draft files data in store action*/
export const removeManifestDraftFiles = removeActionCreatorFactory(draftReducerName);

// selectors
export const getAllManifestDraftFilesById =
  getItemsByIdFactory<ManifestFilesTypes>(draftReducerName);
export const getManifestDraftFilesById = getItemByIdFactory<ManifestFilesTypes>(draftReducerName);
export const getAllManifestDraftFilesArray =
  getItemsArrayFactory<ManifestFilesTypes>(draftReducerName);
