import {
  filesReducer,
  fetchManifestFiles,
  removeManifestFiles,
  getAllManifestFilesById,
  getManifestFilesById,
  getAllManifestFilesArray,
  ManifestFilesTypes,
  filesReducerName,
} from '../manifestFiles';
import reducerRegistry, { store } from '@onaio/redux-reducer-registry';
import { fixManifestFiles } from './fixtures';

reducerRegistry.register(filesReducerName, filesReducer);
describe('ducks/manifestFiles', () => {
  it('selectors work for empty initialState', () => {
    expect(getAllManifestFilesById(store.getState())).toEqual({});
    expect(getAllManifestFilesArray(store.getState())).toEqual([]);
    expect(getManifestFilesById(store.getState(), 'some-id')).toBeNull();
  });

  it('fetches manifest files correctly', () => {
    store.dispatch(fetchManifestFiles(fixManifestFiles as ManifestFilesTypes[]));
    // get all files in store
    expect(getAllManifestFilesArray(store.getState())).toEqual(fixManifestFiles);
    // get all files by id
    expect(getAllManifestFilesById(store.getState())).toEqual({
      '52': fixManifestFiles[0],
      '53': fixManifestFiles[1],
    });
    // get a single file
    expect(getManifestFilesById(store.getState(), '53')).toEqual(fixManifestFiles[1]);
  });

  it('removes manifest files correctly', () => {
    store.dispatch(fetchManifestFiles(fixManifestFiles as ManifestFilesTypes[]));

    store.dispatch(removeManifestFiles());
    expect(getAllManifestFilesArray(store.getState())).toEqual([]);
  });
});
