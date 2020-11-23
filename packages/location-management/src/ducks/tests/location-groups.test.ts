import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import reducer, {
  reducerName,
  getLocationGroupsById,
  getLocationGroupById,
  getLocationGroupsArray,
  getTotalLocationGroups,
  setTotalLocationGroups,
  removeLocationGroups,
  fetchLocationGroups,
  LocationGroup,
} from '../location-tags';
import { LocationGroup1, LocationGroup2 } from './fixtures';

reducerRegistry.register(reducerName, reducer);

describe('src/ducks/location-tags', () => {
  beforeEach(() => {
    store.dispatch(removeLocationGroups());
  });

  it('should have initial state', () => {
    expect(getLocationGroupsById(store.getState())).toEqual({});
    expect(getLocationGroupById(store.getState(), 'someId')).toEqual(null);
    expect(getLocationGroupsArray(store.getState())).toEqual([]);
    expect(getTotalLocationGroups(store.getState())).toEqual(0);
  });

  it('sets total records correctly', () => {
    store.dispatch(setTotalLocationGroups(5));
    expect(getTotalLocationGroups(store.getState())).toEqual(5);
    store.dispatch(setTotalLocationGroups(10));
    expect(getTotalLocationGroups(store.getState())).toEqual(10);
  });

  it('fetches location groups correctly', () => {
    store.dispatch(fetchLocationGroups([LocationGroup1, LocationGroup2] as LocationGroup[]));
    expect(getLocationGroupsById(store.getState())).toEqual({
      1: LocationGroup1,
      2: LocationGroup2,
    });
    expect(getLocationGroupById(store.getState(), '2')).toEqual(LocationGroup2);
    expect(getLocationGroupsArray(store.getState())).toEqual([LocationGroup1, LocationGroup2]);
  });

  it('removes location groups correctly', () => {
    store.dispatch(fetchLocationGroups([LocationGroup1, LocationGroup2] as LocationGroup[]));
    expect(getLocationGroupsArray(store.getState())).toHaveLength(2);

    store.dispatch(removeLocationGroups());
    expect(getLocationGroupsArray(store.getState())).toHaveLength(0);
  });
});
