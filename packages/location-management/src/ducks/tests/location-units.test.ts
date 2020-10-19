import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import reducer, {
  reducerName,
  getLocationUnitsById,
  getLocationUnitById,
  getLocationUnitsArray,
  getTotalLocationUnits,
  setTotalLocationUnits,
  removeLocationUnits,
  fetchLocationUnits,
  LocationUnit,
} from '../location-units';
import { locationUnit1, locationUnit2 } from './fixtures';

reducerRegistry.register(reducerName, reducer);

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
    expect(getLocationUnitsArray(store.getState()).length).toEqual(2);

    store.dispatch(removeLocationUnits());
    expect(getLocationUnitsArray(store.getState()).length).toEqual(0);
  });
});
