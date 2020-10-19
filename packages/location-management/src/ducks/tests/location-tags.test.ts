import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import reducer, {
  reducerName,
  getLocationTagsById,
  getLocationTagById,
  getLocationTagsArray,
  getTotalLocationTags,
  setTotalLocationtags,
  removeLocationTags,
  fetchLocationTags,
  LocationTag,
} from '../location-tags';
import { locationTag1, locationTag2 } from './fixtures';

reducerRegistry.register(reducerName, reducer);

describe('src/ducks/location-tags', () => {
  beforeEach(() => {
    store.dispatch(removeLocationTags());
  });

  it('should have initial state', () => {
    expect(getLocationTagsById(store.getState())).toEqual({});
    expect(getLocationTagById(store.getState(), 'someId')).toEqual(null);
    expect(getLocationTagsArray(store.getState())).toEqual([]);
    expect(getTotalLocationTags(store.getState())).toEqual(0);
  });

  it('sets total records correctly', () => {
    store.dispatch(setTotalLocationtags(5));
    expect(getTotalLocationTags(store.getState())).toEqual(5);
    store.dispatch(setTotalLocationtags(10));
    expect(getTotalLocationTags(store.getState())).toEqual(10);
  });

  it('fetches location tags correctly', () => {
    store.dispatch(fetchLocationTags([locationTag1, locationTag2] as LocationTag[]));
    expect(getLocationTagsById(store.getState())).toEqual({
      1: locationTag1,
      2: locationTag2,
    });
    expect(getLocationTagById(store.getState(), '2')).toEqual(locationTag2);
    expect(getLocationTagsArray(store.getState())).toEqual([locationTag1, locationTag2]);
  });

  it('removes location tags correctly', () => {
    store.dispatch(fetchLocationTags([locationTag1, locationTag2] as LocationTag[]));
    expect(getLocationTagsArray(store.getState()).length).toEqual(2);

    store.dispatch(removeLocationTags());
    expect(getLocationTagsArray(store.getState()).length).toEqual(0);
  });
});
