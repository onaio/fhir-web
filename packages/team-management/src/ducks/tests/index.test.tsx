import reducerRegistry from '@onaio/redux-reducer-registry';
import { FlushThunks } from 'redux-testkit';
import {
  reducer,
  reducerName,
  fetchOrganizationsAction,
  getOrganizationsArray,
  getTotalOrganizations,
  removeOrganizationsAction,
  setTotalOrganizationsAction,
} from '../organizations';
import { store } from '@opensrp-web/store';
import * as fixtures from './fixtures';

reducerRegistry.register(reducerName, reducer);

describe('reducers/organizations', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(removeOrganizationsAction());
  });

  it('should have initial state', () => {
    // what do we expect returned from selectors for an unpopulated store
    expect(getOrganizationsArray(store.getState())).toEqual([]);
  });

  it('should fetch organizations', () => {
    // checking that dispatching actions has desired effect

    store.dispatch(fetchOrganizationsAction([fixtures.org1]));
    const organizationsNumber = getOrganizationsArray(store.getState()).length;
    expect(organizationsNumber).toEqual(1);
  });

  it('saves fetched orgs correctly', () => {
    store.dispatch(fetchOrganizationsAction(fixtures.organizations));
    expect(getOrganizationsArray(store.getState())).toEqual(fixtures.organizations);
  });

  it('sets total org records correctly', () => {
    store.dispatch(setTotalOrganizationsAction(2));
    expect(getTotalOrganizations(store.getState())).toEqual(2);
    store.dispatch(setTotalOrganizationsAction(100));
    expect(getTotalOrganizations(store.getState())).toEqual(100);
  });

  it('has action to clear orgs form store', () => {
    store.dispatch(removeOrganizationsAction());
    let organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(0);

    store.dispatch(fetchOrganizationsAction(fixtures.organizations));
    organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(2);

    store.dispatch(removeOrganizationsAction());
    organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(0);
  });
});
