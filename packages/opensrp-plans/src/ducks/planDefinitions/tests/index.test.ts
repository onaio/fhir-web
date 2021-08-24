import reducerRegistry from '@onaio/redux-reducer-registry';
import { keyBy } from 'lodash';
import { FlushThunks } from 'redux-testkit';
import { PlanDefinition, InterventionType } from '@opensrp-web/plan-form-core';
import { store } from '@opensrp-web/store';
import {
  filterPlansByStatus,
  getPlanDefinitionsArrayByStatus,
  getPlanIds,
  getStatus,
  getTitle,
  FilterPlanDefinitionsByInterventionType,
} from '../index';
import {
  plansReducer,
  addPlanDefinition,
  fetchPlanDefinitions,
  getPlanDefinitionById,
  getPlanDefinitionsArray,
  getPlanDefinitionsArrayByTitle,
  getPlanDefinitionsById,
  makePlanDefinitionsArraySelector,
  plansReducerName,
  removePlanDefinitions,
} from '../index';
import * as fixtures from './fixtures';

reducerRegistry.register(plansReducerName, plansReducer);

describe('reducers/opensrp/PlanDefinition', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(removePlanDefinitions());
  });

  it('should have initial state', () => {
    expect(getPlanDefinitionsArray(store.getState())).toEqual([]);
    expect(getPlanDefinitionById(store.getState(), '356b6b84-fc36-4389-a44a-2b038ed2f38d')).toEqual(
      null
    );
    expect(getPlanDefinitionsById(store.getState())).toEqual({});
  });

  it('Fetches plan definitions correctly', () => {
    // action creators dispatch
    store.dispatch(fetchPlanDefinitions(fixtures.plans as PlanDefinition[]));

    expect(getPlanDefinitionsArray(store.getState())).toEqual(fixtures.plans);
    expect(getPlanDefinitionById(store.getState(), '356b6b84-fc36-4389-a44a-2b038ed2f38d')).toEqual(
      fixtures.plans[0]
    );
    expect(getPlanDefinitionsById(store.getState())).toEqual(keyBy(fixtures.plans, 'identifier'));

    // filter by intervention type
    expect(getPlanDefinitionsArray(store.getState(), InterventionType.FI)).toEqual([
      fixtures.plans[0],
      fixtures.plans[2],
      fixtures.plans[3],
    ]);
    expect(getPlanDefinitionsArray(store.getState(), InterventionType.IRS)).toEqual([
      fixtures.plans[1],
    ]);

    expect(getPlanDefinitionsById(store.getState(), InterventionType.IRS)).toEqual(
      keyBy([fixtures.plans[1]], 'identifier')
    );
    expect(getPlanDefinitionsById(store.getState(), InterventionType.FI)).toEqual(
      keyBy([fixtures.plans[0], fixtures.plans[2], fixtures.plans[3]], 'identifier')
    );

    // RESELECT TESTS
    const titleFilter = {
      title: 'mosh',
    };
    const statusFilter = {
      status: 'active',
    };
    const idsFilter = {
      planIds: ['0e85c238-39c1-4cea-a926-3d89f0c98429'],
    };
    const titleUpperFilter = {
      title: 'MOSH',
    };
    const PlanDefinitionsArraySelector = makePlanDefinitionsArraySelector();

    expect(getTitle(store.getState(), titleFilter)).toEqual('mosh');
    expect(getPlanIds(store.getState(), idsFilter)).toEqual([
      '0e85c238-39c1-4cea-a926-3d89f0c98429',
    ]);
    expect(getStatus(store.getState(), statusFilter)).toEqual('active');
    expect(getPlanDefinitionsArrayByTitle()(store.getState(), titleFilter)).toEqual([
      fixtures.plans[3],
    ]);
    expect(getPlanDefinitionsArrayByTitle()(store.getState(), titleUpperFilter)).toEqual([
      fixtures.plans[3],
    ]);
    // filters plans by status
    expect(filterPlansByStatus(fixtures.eusmPlans as PlanDefinition[], 'active')).toEqual(
      fixtures.eusmPlans
    );
    // returns all plans if filter isn't provided
    expect(FilterPlanDefinitionsByInterventionType(fixtures.eusmPlans as PlanDefinition[])).toEqual(
      fixtures.eusmPlans
    );
    // filters  plans if filter is provided
    expect(
      FilterPlanDefinitionsByInterventionType(fixtures.plans as PlanDefinition[], 'FI')
    ).toHaveLength(3);
    expect(filterPlansByStatus(fixtures.eusmPlans as PlanDefinition[], 'retired')).toEqual([]);
    expect(getPlanDefinitionsArrayByStatus()(store.getState(), { status: 'retired' })).toEqual([
      fixtures.plans[5],
    ]);
    expect(filterPlansByStatus(fixtures.eusmPlans as PlanDefinition[], undefined)).toEqual(
      fixtures.eusmPlans
    );
    expect(getPlanDefinitionsArrayByStatus()(store.getState(), { status: 'complete' })).toEqual([]);
    expect(PlanDefinitionsArraySelector(store.getState(), { title: 'Mosh' })).toEqual([
      fixtures.plans[3],
    ]);
    expect(
      PlanDefinitionsArraySelector(store.getState(), { planIds: [fixtures.plans[3].identifier] })
    ).toEqual([fixtures.plans[3]]);
    expect(PlanDefinitionsArraySelector(store.getState(), { planIds: [] })).toEqual([]);
    expect(PlanDefinitionsArraySelector(store.getState(), { planIds: null })).toHaveLength(6);
    const plansSelector = makePlanDefinitionsArraySelector(undefined, 'date');
    const sorted = plansSelector(store.getState(), {});
    const dates = sorted.map((plan) => plan.date);
    expect(dates).toEqual([
      '2020-06-24',
      '2019-10-18',
      '2019-07-18',
      '2019-07-10',
      '2019-05-19',
      '2019-05-19',
    ]);

    // reset
    store.dispatch(removePlanDefinitions());
    expect(getPlanDefinitionsArray(store.getState())).toEqual([]);
  });

  it('Fetching plans does not replace planDefinitionsById', () => {
    // fetch two plan definition objects
    store.dispatch(
      fetchPlanDefinitions([fixtures.plans[0], fixtures.plans[1]] as PlanDefinition[])
    );
    // we should have them in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([
      fixtures.plans[0],
      fixtures.plans[1],
    ]);
    expect(
      getPlanDefinitionsArrayByStatus()(
        store.getState(),
        { status: 'active' },
        { sortField: 'date' }
      )
    ).toEqual([fixtures.plans[0], fixtures.plans[1]]);
    // get plansarray definition by interventiontype
    expect(getPlanDefinitionsArray(store.getState(), InterventionType.FI)).toEqual([
      fixtures.plans[0],
    ]);
    // get plansarray sorted in descending order
    expect(getPlanDefinitionsArray(store.getState(), null, 'date')).toEqual([
      fixtures.plans[1],
      fixtures.plans[0],
    ]);

    // fetch one more plan definition objects
    store.dispatch(fetchPlanDefinitions([fixtures.plans[3]] as PlanDefinition[]));
    // we should now have a total of three plan definition objects in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([
      fixtures.plans[0],
      fixtures.plans[1],
      fixtures.plans[3],
    ]);
  });

  it('You can add one plan definition object to the store', () => {
    // reset
    store.dispatch(removePlanDefinitions());

    // add one plan definition objects
    store.dispatch(addPlanDefinition(fixtures.plans[2] as PlanDefinition));
    // we should have it in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([fixtures.plans[2]]);

    // fetch one more plan definition objects
    store.dispatch(addPlanDefinition(fixtures.plans[3] as PlanDefinition));
    // we should now have a total of three plan definition objects in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([
      fixtures.plans[2],
      fixtures.plans[3],
    ]);

    // add an existing plan again
    store.dispatch(addPlanDefinition(fixtures.plans[2] as PlanDefinition));
    // nothing should have changed in the store
    // we should now have a total of three plan definition objects in the store
    expect(getPlanDefinitionsArray(store.getState())).toEqual([
      fixtures.plans[2],
      fixtures.plans[3],
    ]);
  });

  it('non Existent plan key', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const planSelectors = makePlanDefinitionsArraySelector('someKey' as any);
    const response = planSelectors(store.getState(), {});
    expect(response).toEqual([]);
  });
});
