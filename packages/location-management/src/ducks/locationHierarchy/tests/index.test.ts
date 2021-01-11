import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import { hierarchyReducer, hierarchyReducerName, getTreesByIds, fetchTree, deforest } from '..';
import { rawHierarchy } from './hierarchyFixtures';

reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
const treesSelector = getTreesByIds();

describe('src/ducks/locationHierarchies', () => {
  beforeEach(() => {
    store.dispatch(deforest());
  });

  it('works for initial state', () => {
    expect(treesSelector(store.getState(), {})).toEqual([]);
    expect(treesSelector(store.getState(), { rootJurisdictionId: [null] })).toEqual([]);
  });

  it('selectors work for non-empty data', () => {
    const singleRawHierarchy1 = rawHierarchy[0];
    const id1 = 'a26ca9c8-1441-495a-83b6-bb5df7698996';
    store.dispatch(fetchTree(singleRawHierarchy1));

    expect(treesSelector(store.getState(), { rootJurisdictionId: [null] })).toEqual([]);
    let result = treesSelector(store.getState(), {});
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(id1);

    result = treesSelector(store.getState(), {
      rootJurisdictionId: [id1],
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(id1);
  });

  it('Adds hierarchies correctly', () => {
    const singleRawHierarchy1 = rawHierarchy[0];
    const singleRawHierarchy2 = rawHierarchy[1];
    const id1 = 'a26ca9c8-1441-495a-83b6-bb5df7698996';
    const id2 = 'b652b2f4-a95d-489b-9e28-4629746db96a';

    store.dispatch(fetchTree(singleRawHierarchy1));
    let result = treesSelector(store.getState(), {});
    expect(result).toHaveLength(1);
    expect(treesSelector(store.getState(), { rootJurisdictionId: [id1] })).toHaveLength(1);
    expect(treesSelector(store.getState(), { rootJurisdictionId: [id2] })).toHaveLength(0);

    store.dispatch(fetchTree(singleRawHierarchy2));
    result = treesSelector(store.getState(), {});
    expect(result).toHaveLength(2);
    expect(treesSelector(store.getState(), { rootJurisdictionId: [id1] })).toHaveLength(1);
    expect(treesSelector(store.getState(), { rootJurisdictionId: [id2] })).toHaveLength(1);
  });
});
