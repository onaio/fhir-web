import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import {
  hierarchyReducer,
  hierarchyReducerName,
  getTreesByIds,
  fetchTree,
  deforest,
  getLocationsByLevel,
  getLocationsByNameAndId,
} from '..';
import { parsedHierarchy, rawHierarchy } from './hierarchyFixtures';
import { serializeTree } from '../utils';

reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
const treesSelector = getTreesByIds();
const geoLevelSelector = getLocationsByLevel();
const nameIdSelector = getLocationsByNameAndId();

describe('src/ducks/locationHierarchies', () => {
  beforeEach(() => {
    store.dispatch(deforest());
  });

  it('works for initial state', () => {
    expect(treesSelector(store.getState(), {})).toEqual([]);
    expect(treesSelector(store.getState(), { rootJurisdictionId: [null] })).toEqual([]);
    expect(geoLevelSelector(store.getState(), {})).toEqual([]);
    expect(geoLevelSelector(store.getState(), { geoLevel: 0 })).toEqual([]);
    expect(nameIdSelector(store.getState(), {})).toEqual([]);
    expect(nameIdSelector(store.getState(), { searchQuery: 'far' })).toEqual([]);
  });

  it('selectors work for non-empty data', () => {
    const singleRawHierarchy1 = rawHierarchy[0];
    const id1 = 'a26ca9c8-1441-495a-83b6-bb5df7698996';
    store.dispatch(fetchTree(singleRawHierarchy1));

    expect(treesSelector(store.getState(), { rootJurisdictionId: [null] })).toEqual([]);
    let result = treesSelector(store.getState(), {});
    expect(result).toHaveLength(1);
    expect(result[0].model.id).toEqual(id1);

    result = treesSelector(store.getState(), {
      rootJurisdictionId: [id1],
    });
    expect(result).toHaveLength(1);
    expect(result[0].model.id).toEqual(id1);
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

    const res1 = treesSelector(store.getState(), { rootJurisdictionId: [id1] });
    const res2 = treesSelector(store.getState(), { rootJurisdictionId: [id1] });

    expect(serializeTree(res1)).toEqual(serializeTree(res2));
  });

  it('gets locations by geographic levels', () => {
    const singleRawHierarchy1 = rawHierarchy[0];
    store.dispatch(fetchTree(singleRawHierarchy1));

    // should have all locations
    const result1 = geoLevelSelector(store.getState(), {});
    const result2 = geoLevelSelector(store.getState(), { geoLevel: 0 });
    expect(result1).toHaveLength(16);
    expect(result2).toHaveLength(1);
  });

  it('gets locations by geographic level for specific tree', () => {
    const singleRawHierarchy1 = rawHierarchy[0];
    const singleRawHierarchy2 = rawHierarchy[1];
    store.dispatch(fetchTree(singleRawHierarchy1));
    store.dispatch(fetchTree(singleRawHierarchy2));
    const id2 = 'b652b2f4-a95d-489b-9e28-4629746db96a';

    // should have all locations from both trees
    const results = geoLevelSelector(store.getState(), {});
    expect(results).toHaveLength(34);

    // should have all locations only for tree with id2
    const node1 = geoLevelSelector(store.getState(), { rootJurisdictionId: [id2] });
    expect(node1).toHaveLength(18);
    expect(node1[0].model.id).toEqual(id2);
  });

  it('filters locations by name and id', () => {
    const singleRawHierarchy1 = rawHierarchy[0];
    store.dispatch(fetchTree(singleRawHierarchy1));
    // id for top node
    const id1 = 'a26ca9c8-1441-495a-83b6-bb5df7698996';

    // should return all nodes
    const results = nameIdSelector(store.getState(), {});
    expect(results).toHaveLength(16);

    // search by id
    const node1 = nameIdSelector(store.getState(), { searchQuery: id1 });

    // should be rootNode
    expect(node1[0].model.label).toEqual('Tunisia');

    // search by name
    const node2 = nameIdSelector(store.getState(), { searchQuery: 'IROUA' });

    // search by name with different case
    const node3 = nameIdSelector(store.getState(), { searchQuery: 'irouA' });

    // nodes are same searched by title but with different case
    expect(node2).toEqual(node3);
    expect(node2[0].model.id).toEqual('e66a6f38-93d5-42c2-ba1d-57b6d529baa6');
  });
});
