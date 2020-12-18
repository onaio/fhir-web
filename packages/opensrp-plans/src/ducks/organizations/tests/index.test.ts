import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, {
  fetchOrganizations,
  getOrganizationsArray,
  makeOrgsArraySelector,
  reducerName,
  removeOrganizationsAction,
} from '..';
import { store } from '@opensrp/store';
import * as fixtures from './fixtures';

reducerRegistry.register(reducerName, reducer);

const organizationSelector = makeOrgsArraySelector();

describe('reducers/plans', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(removeOrganizationsAction);
  });

  it('should have initial state', () => {
    /** reselect */
    expect(organizationSelector(store.getState(), {})).toEqual([]);
  });

  it('should fetch households', () => {
    // checking that dispatching actions has desired effect

    store.dispatch(fetchOrganizations([fixtures.organization1]));
    const organizationsNumber = getOrganizationsArray(store.getState()).length;
    expect(organizationsNumber).toEqual(1);

    /** reselect */
    expect(
      organizationSelector(store.getState(), {
        identifiers: ['fcc19470-d599-11e9-bb65-2a2ae2dbcce4'],
      })
    ).toEqual([fixtures.organization1]);
  });

  it('has action to clear organizations from store', () => {
    store.dispatch(removeOrganizationsAction);
    let organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(0);

    store.dispatch(fetchOrganizations(fixtures.organizations));
    organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(2);

    store.dispatch(removeOrganizationsAction);
    organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(0);
  });

  it('does not override existing organizations with newly fetched', () => {
    store.dispatch(fetchOrganizations([fixtures.organization1]));
    let organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(1);

    store.dispatch(fetchOrganizations([fixtures.organization2]));
    organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(2);
  });

  it('overwrites existing organizations when told to', () => {
    store.dispatch(fetchOrganizations([fixtures.organization1]));
    let organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(1);

    store.dispatch(fetchOrganizations([fixtures.organization2], true));
    organizationsNum = getOrganizationsArray(store.getState()).length;
    expect(organizationsNum).toEqual(1);
  });
});
