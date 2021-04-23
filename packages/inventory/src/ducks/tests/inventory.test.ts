import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  inventoryReducerName,
  inventoryReducer,
  getInventoriesByIdsFactory,
  getInventoriesByServicePointsIdsFactory,
  getInventoriesArray,
  getTotalInventories,
  setTotalInventories,
  removeInventories,
  fetchInventories,
  Inventory,
  getInventoriesByExpiry,
} from '../inventory';
import { inventory1, inventory2 } from './fixtures';

reducerRegistry.register(inventoryReducerName, inventoryReducer);

describe('src/ducks/inventory', () => {
  beforeEach(() => {
    store.dispatch(removeInventories());
  });

  it('should have initial state', () => {
    expect(getInventoriesByIdsFactory(store.getState(), {})).toEqual([]);
    expect(getInventoriesByServicePointsIdsFactory(store.getState(), {})).toEqual([]);
    expect(getInventoriesArray(store.getState())).toEqual([]);
    expect(getTotalInventories(store.getState())).toEqual(0);
  });

  it('sets total records correctly', () => {
    store.dispatch(setTotalInventories(5));
    expect(getTotalInventories(store.getState())).toEqual(5);
    store.dispatch(setTotalInventories(10));
    expect(getTotalInventories(store.getState())).toEqual(10);
  });

  it('fetches inventory by _id correctly', () => {
    store.dispatch(fetchInventories([inventory1, inventory2] as Inventory[]));
    expect(
      getInventoriesByIdsFactory(store.getState(), {
        ids: [inventory1._id, inventory2._id],
      })
    ).toEqual([inventory1, inventory2]);
    expect(getInventoriesArray(store.getState())).toEqual([inventory1, inventory2]);
  });

  it('fetches inventory by servicePointIds correctly', () => {
    store.dispatch(fetchInventories([inventory1, inventory2] as Inventory[]));
    expect(
      getInventoriesByServicePointsIdsFactory(store.getState(), {
        servicePointIds: [inventory1.locationId, inventory2.locationId],
      })
    ).toEqual([inventory1, inventory2]);
    expect(getInventoriesArray(store.getState())).toEqual([inventory1, inventory2]);
  });

  it('fetches inventories by expiry', () => {
    store.dispatch(fetchInventories([inventory1, inventory2] as Inventory[]));
    expect(
      getInventoriesByExpiry(store.getState(), {
        servicePointIds: [inventory1.locationId],
        expired: true,
      })
    ).toEqual([inventory1]);
    expect(
      getInventoriesByExpiry(store.getState(), {
        servicePointIds: [inventory2.locationId],
        expired: false,
      })
    ).toEqual([inventory2]);
  });

  it('fetches inventories if expiry is not defined', () => {
    store.dispatch(fetchInventories([inventory1, inventory2] as Inventory[]));
    expect(getInventoriesByExpiry(store.getState(), {})).toEqual([inventory1, inventory2]);
  });

  it('removes inventory correctly', () => {
    store.dispatch(fetchInventories([inventory1, inventory2] as Inventory[]));
    expect(getInventoriesArray(store.getState())).toHaveLength(2);

    store.dispatch(removeInventories());
    expect(getInventoriesArray(store.getState())).toHaveLength(0);
  });
});
