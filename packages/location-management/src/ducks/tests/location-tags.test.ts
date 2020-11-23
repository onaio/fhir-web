import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import reducer, {
  reducerName,
  getLocationGroupsById,
  getLocationGroupById,
  getLocationGroupsArray,
  getTotalLocationGroups,
  setTotalLocationgroups,
  removeLocationGroups,
  fetchLocationGroups,
  LocationGroup,
} from '../location-groups';
import { locationGroup1, locationGroup2 } from './fixtures';

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
    store.dispatch(setTotalLocationgroups(5));
    expect(getTotalLocationGroups(store.getState())).toEqual(5);
    store.dispatch(setTotalLocationgroups(10));
    expect(getTotalLocationGroups(store.getState())).toEqual(10);
  });

  it('fetches location tags correctly', () => {
    store.dispatch(fetchLocationGroups([locationGroup1, locationGroup2] as LocationGroup[]));
    expect(getLocationGroupsById(store.getState())).toEqual({
      1: locationGroup1,
      2: locationGroup2,
    });
    expect(getLocationGroupById(store.getState(), '2')).toEqual(locationGroup2);
    expect(getLocationGroupsArray(store.getState())).toEqual([locationGroup1, locationGroup2]);
  });

  it('removes location tags correctly', () => {
    store.dispatch(fetchLocationGroups([locationGroup1, locationGroup2] as LocationGroup[]));
    expect(getLocationGroupsArray(store.getState())).toHaveLength(2);

    store.dispatch(removeLocationGroups());
    expect(getLocationGroupsArray(store.getState())).toHaveLength(0);
  });
});
