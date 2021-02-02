import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  locationUnitsReducer,
  locationUnitsReducerName,
  getLocationUnitsById,
  getLocationUnitById,
  getLocationUnitsArray,
  getTotalLocationUnits,
  setTotalLocationUnits,
  removeLocationUnits,
  fetchLocationUnits,
  LocationUnit,
  getLocationsIfJurisdiction,
  getLocationsBySearch,
} from '../location-units';
import { locationUnit1, locationUnit2 } from './fixtures';

reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);

describe('src/ducks/location-units', () => {
  beforeEach(() => {
    store.dispatch(removeLocationUnits());
  });

  it('should have initial state', () => {
    expect(getLocationUnitsById(store.getState())).toEqual({});
    expect(getLocationUnitById(store.getState(), 'someId')).toEqual(null);
    expect(getLocationUnitsArray(store.getState())).toEqual([]);
    expect(getTotalLocationUnits(store.getState())).toEqual(0);
  });

  it('sets total records correctly', () => {
    store.dispatch(setTotalLocationUnits(5));
    expect(getTotalLocationUnits(store.getState())).toEqual(5);
    store.dispatch(setTotalLocationUnits(10));
    expect(getTotalLocationUnits(store.getState())).toEqual(10);
  });

  it('fetches location units correctly', () => {
    store.dispatch(fetchLocationUnits([locationUnit1, locationUnit2] as LocationUnit[]));
    expect(getLocationUnitsById(store.getState())).toEqual({
      [locationUnit1.id]: locationUnit1,
      [locationUnit2.id]: locationUnit2,
    });
    expect(getLocationUnitById(store.getState(), locationUnit2.id)).toEqual(locationUnit2);
    expect(getLocationUnitsArray(store.getState())).toEqual([locationUnit1, locationUnit2]);
  });

  it('removes location units correctly', () => {
    store.dispatch(fetchLocationUnits([locationUnit1, locationUnit2] as LocationUnit[]));
    expect(getLocationUnitsArray(store.getState())).toHaveLength(2);

    store.dispatch(removeLocationUnits());
    expect(getLocationUnitsArray(store.getState())).toHaveLength(0);
  });
});

describe('src/ducks/location-units.reselect', () => {
  const isJurisdictionSelector = getLocationsIfJurisdiction();
  const jurisdictionBySearch = getLocationsBySearch();

  beforeEach(() => {
    store.dispatch(removeLocationUnits());
  });

  it('selectors work correctly on initial state', () => {
    expect(isJurisdictionSelector(store.getState(), {})).toEqual([]);
    expect(isJurisdictionSelector(store.getState(), { isJurisdiction: true })).toEqual([]);
    expect(jurisdictionBySearch(store.getState(), {})).toEqual([]);
    expect(jurisdictionBySearch(store.getState(), { searchQuery: 'tango' })).toEqual([]);
  });

  it('jurisdiction selector work correctly on non-empty state', () => {
    store.dispatch(fetchLocationUnits([locationUnit1] as LocationUnit[], true));
    store.dispatch(fetchLocationUnits([locationUnit2] as LocationUnit[], false));
    expect(isJurisdictionSelector(store.getState(), { isJurisdiction: true })).toEqual([
      { ...locationUnit1, isJurisdiction: true },
    ]);
    expect(isJurisdictionSelector(store.getState(), { isJurisdiction: false })).toEqual([
      { ...locationUnit2, isJurisdiction: false },
    ]);
  });

  it('By search selector work correctly on non-empty state', () => {
    store.dispatch(fetchLocationUnits([locationUnit1, locationUnit2] as LocationUnit[], false));
    expect(jurisdictionBySearch(store.getState(), { searchQuery: 'tango' })).toEqual([]);
    expect(jurisdictionBySearch(store.getState(), { searchQuery: 'Thail' })).toEqual([
      { ...locationUnit2, isJurisdiction: false },
    ]);
  });
});
