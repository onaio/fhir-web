import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  inventoryReducerName,
  inventoryReducer,
  getInventoriesByStockIdsFactory,
  getInventoriesByServicePointsIdsFactory,
  getInventoriesArray,
  getTotalInventories,
  setTotalInventories,
  removeInventories,
  fetchInventories,
  Inventory,
} from '../inventory';
import { inventory1, inventory2 } from './fixtures';

reducerRegistry.register(inventoryReducerName, inventoryReducer);

describe('src/ducks/inventory', () => {
  beforeEach(() => {
    store.dispatch(removeInventories());
  });

  it('should have initial state', () => {
    expect(getInventoriesByStockIdsFactory(store.getState(), {})).toEqual([]);
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

  it('fetches inventory by stockId correctly', () => {
    store.dispatch(fetchInventories([inventory1, inventory2] as Inventory[]));
    expect(
      getInventoriesByStockIdsFactory(store.getState(), {
        stockIds: [inventory1.stockId, inventory2.stockId],
      })
    ).toEqual([inventory1, inventory2]);
    expect(getInventoriesArray(store.getState())).toEqual([inventory1, inventory2]);
  });

  it('fetches inventory by servicePointIds correctly', () => {
    store.dispatch(fetchInventories([inventory1, inventory2] as Inventory[]));
    expect(
      getInventoriesByServicePointsIdsFactory(store.getState(), {
        servicePointIds: [inventory1.servicePointId, inventory2.servicePointId],
      })
    ).toEqual([inventory1, inventory2]);
    expect(getInventoriesArray(store.getState())).toEqual([inventory1, inventory2]);
  });

  it('removes inventory correctly', () => {
    store.dispatch(fetchInventories([inventory1, inventory2] as Inventory[]));
    expect(getInventoriesArray(store.getState())).toHaveLength(2);

    store.dispatch(removeInventories());
    expect(getInventoriesArray(store.getState())).toHaveLength(0);
  });
});
