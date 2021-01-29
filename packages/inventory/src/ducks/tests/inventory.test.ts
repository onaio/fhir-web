import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  inventoryReducerName,
  inventoryReducer,
  getInventoriesByIdsFactory,
  getInventoriesArray,
  getTotalInventories,
  setTotalInventories,
  removeInventories,
  fetchInventoriesByStockId,
  Inventory,
  fetchInventoriesByServicePointId,
} from '../inventory';
import { inventory1, inventory2 } from './fixtures';

reducerRegistry.register(inventoryReducerName, inventoryReducer);

describe('src/ducks/inventory', () => {
  beforeEach(() => {
    store.dispatch(removeInventories());
  });

  it('should have initial state', () => {
    expect(getInventoriesByIdsFactory(store.getState(), {})).toEqual([]);
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
    store.dispatch(fetchInventoriesByStockId([inventory1, inventory2] as Inventory[]));
    expect(
      getInventoriesByIdsFactory(store.getState(), {
        stockIds: [inventory1.stockId, inventory2.stockId],
      })
    ).toEqual([inventory1, inventory2]);
    expect(getInventoriesArray(store.getState())).toEqual([inventory1, inventory2]);
  });

  it('removes stockid inventory correctly', () => {
    store.dispatch(fetchInventoriesByStockId([inventory1, inventory2] as Inventory[]));
    expect(getInventoriesArray(store.getState())).toHaveLength(2);

    store.dispatch(removeInventories());
    expect(getInventoriesArray(store.getState())).toHaveLength(0);
  });

  it('fetches inventory by servicePointId correctly', () => {
    store.dispatch(fetchInventoriesByServicePointId([inventory1, inventory2] as Inventory[]));
    expect(
      getInventoriesByIdsFactory(store.getState(), {
        stockIds: [inventory1.servicePointId],
      })
    ).toEqual([inventory1]);
    expect(getInventoriesArray(store.getState())).toEqual([inventory1, inventory2]);
  });

  it('removes servicePointId inventory correctly', () => {
    store.dispatch(fetchInventoriesByServicePointId([inventory1, inventory2] as Inventory[]));
    expect(getInventoriesArray(store.getState())).toHaveLength(2);

    store.dispatch(removeInventories());
    expect(getInventoriesArray(store.getState())).toHaveLength(0);
  });
});
