import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  jurisdictionReducerName,
  JurisdictionsReducer,
  fetchJurisdictions,
  getJurisdictionById,
  getJursByGeoLevel,
  removeJurisdictions,
} from '..';
import { store } from '@opensrp-web/store';
import { jurisdiction1, jurisdictions } from './fixtures';

reducerRegistry.register(jurisdictionReducerName, JurisdictionsReducer);

const byIdSelector = getJurisdictionById();
const geoLevelSelector = getJursByGeoLevel();

describe('reducers/opensrp/hierarchies', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(removeJurisdictions());
  });

  it('should have initial state', () => {
    expect(byIdSelector(store.getState(), {})).toEqual(null);
    expect(geoLevelSelector(store.getState(), {})).toEqual([]);
  });

  it('should be able to store and retrieve jurisdictions', () => {
    store.dispatch(fetchJurisdictions(jurisdictions));
    // idsSelector
    let res = byIdSelector(store.getState(), { jurisdictionId: 'nonExisting' });
    expect(res).toEqual(null);
    let res1 = geoLevelSelector(store.getState(), { geoLevel: 34 });
    expect(res1).toEqual([]);

    res = byIdSelector(store.getState(), { jurisdictionId: jurisdiction1.id });
    expect(res).toEqual(jurisdiction1);
    res1 = geoLevelSelector(store.getState(), { geoLevel: 0 });
    expect(res1).toEqual(jurisdictions);
  });
});
