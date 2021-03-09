import {
  draftReducer,
  fetchManifestDraftFiles,
  removeManifestDraftFiles,
  getAllManifestDraftFilesById,
  getManifestDraftFilesById,
  getAllManifestDraftFilesArray,
  draftReducerName,
} from '../manifestDraftFiles';
import reducerRegistry, { store } from '@onaio/redux-reducer-registry';
import { FixManifestDraftFiles } from './fixtures';
import { ManifestFilesTypes } from '../manifestFiles';

reducerRegistry.register(draftReducerName, draftReducer);
describe('ducks/manifestDraftFiles', () => {
  it('selectors work for empty initialState', () => {
    expect(getAllManifestDraftFilesById(store.getState())).toEqual({});
    expect(getAllManifestDraftFilesArray(store.getState())).toEqual([]);
    expect(getManifestDraftFilesById(store.getState(), 'some-id')).toBeNull();
  });

  it('fetches manifest draft files correctly', () => {
    store.dispatch(fetchManifestDraftFiles(FixManifestDraftFiles as ManifestFilesTypes[]));
    // get all draft files in store
    expect(getAllManifestDraftFilesArray(store.getState())).toEqual(FixManifestDraftFiles);
    // get all draft files by id
    expect(getAllManifestDraftFilesById(store.getState())).toEqual({
      '52': FixManifestDraftFiles[0],
      '53': FixManifestDraftFiles[1],
    });
    // get a single draft file
    expect(getManifestDraftFilesById(store.getState(), '53')).toEqual(FixManifestDraftFiles[1]);
  });

  it('removes manifest draft files correctly', () => {
    store.dispatch(fetchManifestDraftFiles(FixManifestDraftFiles as ManifestFilesTypes[]));

    store.dispatch(removeManifestDraftFiles());
    expect(getAllManifestDraftFilesArray(store.getState())).toEqual([]);
  });
});
