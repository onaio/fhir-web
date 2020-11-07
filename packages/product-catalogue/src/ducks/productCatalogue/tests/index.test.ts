import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  reducerName,
  ProductCatalogueReducer,
  getProductsById,
  getProductById,
  getProductArray,
  getTotalProducts,
  setTotalProducts,
  removeProducts,
  fetchProducts,
} from '..';
import { product1, product2 } from './fixtures';

reducerRegistry.register(reducerName, ProductCatalogueReducer);

describe('src/ducks/product-catalogue', () => {
  beforeEach(() => {
    store.dispatch(removeProducts());
  });

  it('should have initial state', () => {
    expect(getProductsById(store.getState())).toEqual({});
    expect(getProductById(store.getState(), 'someId')).toEqual(null);
    expect(getProductArray(store.getState())).toEqual([]);
    expect(getTotalProducts(store.getState())).toEqual(0);
  });

  it('sets total products correctly', () => {
    store.dispatch(setTotalProducts(5));
    expect(getTotalProducts(store.getState())).toEqual(5);
    store.dispatch(setTotalProducts(10));
    expect(getTotalProducts(store.getState())).toEqual(10);
  });

  it('fetches products correctly', () => {
    store.dispatch(fetchProducts([product1, product2]));
    expect(getProductsById(store.getState())).toEqual({
      1: product1,
      2: product2,
    });
    expect(getProductById(store.getState(), '2')).toEqual(product2);
    expect(getProductArray(store.getState())).toEqual([product1, product2]);
  });

  it('removes products correctly', () => {
    store.dispatch(fetchProducts([product1, product2]));
    expect(getProductArray(store.getState())).toHaveLength(2);

    store.dispatch(removeProducts());
    expect(getProductArray(store.getState())).toHaveLength(0);
  });
});
