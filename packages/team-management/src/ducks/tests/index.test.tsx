import reducerRegistry from '@onaio/redux-reducer-registry';
import { FlushThunks } from 'redux-testkit';
import reducer, {
  fetchTeamsAction,
  getTeamsArray,
  getTotalTeams,
  reducerName,
  removeTeamsAction,
  setTotalTeamsAction,
} from '../teams';
import { store } from '@opensrp/store';
import * as fixtures from './fixtures';

reducerRegistry.register(reducerName, reducer);

describe('reducers/teams', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(removeTeamsAction());
  });

  it('should have initial state', () => {
    // what do we expect returned from selectors for an unpopulated store
    expect(getTeamsArray(store.getState())).toEqual([]);
  });

  it('should fetch teams', () => {
    // checking that dispatching actions has desired effect

    store.dispatch(fetchTeamsAction([fixtures.team1]));
    const teamsNumber = getTeamsArray(store.getState()).length;
    expect(teamsNumber).toEqual(1);
  });

  it('saves fetched teams correctly', () => {
    store.dispatch(fetchTeamsAction(fixtures.teams));
    expect(getTeamsArray(store.getState())).toEqual(fixtures.teams);
  });

  it('sets total team records correctly', () => {
    store.dispatch(setTotalTeamsAction(2));
    expect(getTotalTeams(store.getState())).toEqual(2);
    store.dispatch(setTotalTeamsAction(100));
    expect(getTotalTeams(store.getState())).toEqual(100);
  });

  it('has action to clear teams form store', () => {
    store.dispatch(removeTeamsAction());
    let teamsNum = getTeamsArray(store.getState()).length;
    expect(teamsNum).toEqual(0);

    store.dispatch(fetchTeamsAction(fixtures.teams));
    teamsNum = getTeamsArray(store.getState()).length;
    expect(teamsNum).toEqual(2);

    store.dispatch(removeTeamsAction());
    teamsNum = getTeamsArray(store.getState()).length;
    expect(teamsNum).toEqual(0);
  });
});
