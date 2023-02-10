import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import { Dictionary } from '@onaio/utils';
import {
  reducer,
  reducerName,
  getLocationTreeState,
  setLocationTreeState,
} from '../location-hierarchy';
import { LocationTreeState } from '../types';
import { locationTree } from './fixtures';

reducerRegistry.register(reducerName, reducer);

describe('src/ducks/location-hierarchy', () => {
  it('should render with correct data', () => {
    store.dispatch(setLocationTreeState(locationTree));
    expect(getLocationTreeState(store.getState()) as Dictionary as LocationTreeState).toEqual(
      locationTree
    );
  });
});
