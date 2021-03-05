import {
  releasesReducer,
  fetchManifestReleases,
  removeManifestReleases,
  getAllManifestReleasesById,
  getManifestReleasesById,
  getAllManifestReleasesArray,
  releasesReducerName,
  ManifestReleasesTypes,
} from '../manifestReleases';
import reducerRegistry, { store } from '@onaio/redux-reducer-registry';
import { fixManifestReleases } from './fixtures';

reducerRegistry.register(releasesReducerName, releasesReducer);
describe('ducks/manifestReleases', () => {
  it('selectors work for empty initialState', () => {
    expect(getAllManifestReleasesById(store.getState())).toEqual({});
    expect(getAllManifestReleasesArray(store.getState())).toEqual([]);
    expect(getManifestReleasesById(store.getState(), 'some-id')).toBeNull();
  });

  it('fetches releases correctly', () => {
    store.dispatch(fetchManifestReleases(fixManifestReleases as ManifestReleasesTypes[]));
    // get all releases in store
    expect(getAllManifestReleasesArray(store.getState())).toEqual(fixManifestReleases);
    // get all release by id
    expect(getAllManifestReleasesById(store.getState())).toEqual({
      '1.0.11': fixManifestReleases[0],
      '1.0.12': fixManifestReleases[1],
      '1.0.16': fixManifestReleases[2],
    });
    // get a single release
    expect(getManifestReleasesById(store.getState(), '1.0.12')).toEqual(fixManifestReleases[1]);
  });

  it('removes releases correctly', () => {
    store.dispatch(fetchManifestReleases(fixManifestReleases as ManifestReleasesTypes[]));

    store.dispatch(removeManifestReleases());
    expect(getAllManifestReleasesArray(store.getState())).toEqual([]);
  });
});
