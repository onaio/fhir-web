import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp-web/store';
import reducer, {
  reducerName,
  getLocationUnitGroupsById,
  getLocationUnitGroupById,
  getLocationUnitGroupsArray,
  getTotalLocationUnitGroups,
  setTotalLocationunitgroups,
  removeLocationUnitGroups,
  fetchLocationUnitGroups,
  LocationUnitGroup,
} from '../location-unit-groups';
import { locationUnitGroup1, locationUnitGroup2 } from './fixtures';

reducerRegistry.register(reducerName, reducer);

describe('src/ducks/location-tags', () => {
  beforeEach(() => {
    store.dispatch(removeLocationUnitGroups());
  });

  it('should have initial state', () => {
    expect(getLocationUnitGroupsById(store.getState())).toEqual({});
    expect(getLocationUnitGroupById(store.getState(), 'someId')).toEqual(null);
    expect(getLocationUnitGroupsArray(store.getState())).toEqual([]);
    expect(getTotalLocationUnitGroups(store.getState())).toEqual(0);
  });

  it('sets total records correctly', () => {
    store.dispatch(setTotalLocationunitgroups(5));
    expect(getTotalLocationUnitGroups(store.getState())).toEqual(5);
    store.dispatch(setTotalLocationunitgroups(10));
    expect(getTotalLocationUnitGroups(store.getState())).toEqual(10);
  });

  it('fetches location tags correctly', () => {
    store.dispatch(
      fetchLocationUnitGroups([locationUnitGroup1, locationUnitGroup2] as LocationUnitGroup[])
    );
    expect(getLocationUnitGroupsById(store.getState())).toEqual({
      1: locationUnitGroup1,
      2: locationUnitGroup2,
    });
    expect(getLocationUnitGroupById(store.getState(), '2')).toEqual(locationUnitGroup2);
    expect(getLocationUnitGroupsArray(store.getState())).toEqual([
      locationUnitGroup1,
      locationUnitGroup2,
    ]);
  });

  it('removes location tags correctly', () => {
    store.dispatch(
      fetchLocationUnitGroups([locationUnitGroup1, locationUnitGroup2] as LocationUnitGroup[])
    );
    expect(getLocationUnitGroupsArray(store.getState())).toHaveLength(2);

    store.dispatch(removeLocationUnitGroups());
    expect(getLocationUnitGroupsArray(store.getState())).toHaveLength(0);
  });
});
