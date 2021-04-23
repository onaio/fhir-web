import reducerRegistry from '@onaio/redux-reducer-registry';
import MockDate from 'mockdate';
import {
  assignmentsReducer,
  fetchAssignments,
  getAssignmentsArrayByPlanId,
  getAssignmentsByPlanId,
  assignmentsReducerName,
  removeAssignmentsAction,
  resetPlanAssignments,
} from '..';
import * as fixtures from './fixtures';
import { store } from '@opensrp/store';
import { processRawAssignments } from '../utils';

reducerRegistry.register(assignmentsReducerName, assignmentsReducer);

const getAssByPlanId = getAssignmentsArrayByPlanId();

describe('reducers/assignments', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(removeAssignmentsAction);
    MockDate.set('12/30/2019');
  });

  it('should have initial state', () => {
    expect(getAssByPlanId(store.getState(), { planId: 'randomId' })).toEqual([]);
    expect(getAssignmentsByPlanId(store.getState())).toEqual({});
  });

  it('should fetch Assignments', () => {
    store.dispatch(fetchAssignments(fixtures.assignments));
    const planAssignments = getAssByPlanId(store.getState(), { planId: 'alpha' });
    expect(planAssignments).toHaveLength(4);
  });

  it('does not override existing Assignments with newly fetched', () => {
    store.dispatch(fetchAssignments([fixtures.assignment5])); // not alpha plan

    store.dispatch(fetchAssignments([fixtures.assignments[0]]));
    let assignmentsNum = getAssByPlanId(store.getState(), { planId: 'alpha' }).length;
    expect(assignmentsNum).toEqual(1);

    store.dispatch(fetchAssignments([fixtures.assignments[1]]));
    assignmentsNum = getAssByPlanId(store.getState(), { planId: 'alpha' }).length;
    expect(assignmentsNum).toEqual(2);

    store.dispatch(fetchAssignments([fixtures.assignments[2]]));
    assignmentsNum = getAssByPlanId(store.getState(), { planId: 'alpha' }).length;
    expect(assignmentsNum).toEqual(3);

    store.dispatch(fetchAssignments([fixtures.assignment6]));
    assignmentsNum = getAssByPlanId(store.getState(), { planId: 'alpha' }).length;
    expect(assignmentsNum).toEqual(2);

    expect(getAssByPlanId(store.getState(), { planId: 'alpha' })).toEqual([
      fixtures.assignments[1],
      fixtures.assignments[2],
    ]);

    store.dispatch(fetchAssignments([fixtures.assignment7]));
    assignmentsNum = getAssByPlanId(store.getState(), { planId: 'alpha' }).length;
    expect(assignmentsNum).toEqual(3);

    expect(getAssByPlanId(store.getState(), { planId: 'alpha' })).toEqual([
      fixtures.assignment7,
      fixtures.assignments[2],
      fixtures.assignments[1],
    ]);

    expect(getAssByPlanId(store.getState(), { planId: 'beta' })).toHaveLength(1);
  });

  it('is able to overwrite existing Assignments with newly fetched', () => {
    store.dispatch(fetchAssignments([fixtures.assignments[0]]));
    let assignmentsNum = getAssByPlanId(store.getState(), { planId: 'alpha' }).length;
    expect(assignmentsNum).toEqual(1);

    store.dispatch(fetchAssignments([fixtures.assignments[1]], true));
    assignmentsNum = getAssByPlanId(store.getState(), { planId: 'alpha' }).length;
    expect(assignmentsNum).toEqual(1);
  });

  it('should reset existing Assignments', () => {
    store.dispatch(fetchAssignments(fixtures.assignments));
    store.dispatch(
      resetPlanAssignments({
        [fixtures.assignment1.plan]: [fixtures.assignment1],
      })
    );
    const assignments = getAssByPlanId(store.getState(), { planId: fixtures.assignment1.plan });
    expect(assignments).toHaveLength(1);
  });
});

describe('utils', () => {
  it('parses raw assignments correctly', () => {
    const res = processRawAssignments(fixtures.rawAssignment1);
    expect(JSON.stringify(res)).toEqual(fixtures.expectedAssignment1);
  });
});
