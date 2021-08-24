import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
} from '@opensrp-web/reducer-factory';

/** manifest files interface */
export interface ManifestFilesTypes {
  createdAt: string;
  form_relation: string;
  id: string;
  identifier: string;
  isDraft: boolean;
  isJsonValidator: boolean;
  jursdiction: string;
  label: string;
  module: string;
  version: string;
}

/** reducer name */
export const filesReducerName = 'manifestFiles';

/** manifest files Reducer */
export const filesReducer = reducerFactory<ManifestFilesTypes>(filesReducerName);

// action
/** fetch manifest files to store action */
export const fetchManifestFiles = fetchActionCreatorFactory<ManifestFilesTypes>(
  filesReducerName,
  'id'
);

/** clear manifest files data in store action*/
export const removeManifestFiles = removeActionCreatorFactory(filesReducerName);

// selectors
export const getAllManifestFilesById = getItemsByIdFactory<ManifestFilesTypes>(filesReducerName);
export const getManifestFilesById = getItemByIdFactory<ManifestFilesTypes>(filesReducerName);
export const getAllManifestFilesArray = getItemsArrayFactory<ManifestFilesTypes>(filesReducerName);
