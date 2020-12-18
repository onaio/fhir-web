import reducerRegistry from '@onaio/redux-reducer-registry';
import MockDate from 'mockdate';
import {
  assignmentsReducer,
  fetchAssignments,
  getAssignmentsArrayByPlanId,
  getAssignmentsByPlanId,
  assignmentReducerName,
  removeAssignmentsAction,
  resetPlanAssignments,
} from '..';
import * as fixtures from './fixtures';
import { store } from '@opensrp/store';
import { processRawAssignments } from '../utils';

reducerRegistry.register(assignmentReducerName, assignmentsReducer);

describe('reducers/assignments', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(removeAssignmentsAction);
    MockDate.set('12/30/2019');
  });

  it('should have initial state', () => {
    expect(getAssignmentsArrayByPlanId(store.getState(), 'randomId')).toEqual([]);
    expect(getAssignmentsByPlanId(store.getState())).toEqual({});
  });

  it('should fetch Assignments', () => {
    store.dispatch(fetchAssignments(fixtures.assignments));
    const planAssignments = getAssignmentsArrayByPlanId(store.getState(), 'alpha');
    expect(planAssignments).toHaveLength(4);
  });

  it('does not override existing Assignments with newly fetched', () => {
    store.dispatch(fetchAssignments([fixtures.assignment5])); // not alpha plan

    store.dispatch(fetchAssignments([fixtures.assignments[0]]));
    let assignmentsNum = getAssignmentsArrayByPlanId(store.getState(), 'alpha').length;
    expect(assignmentsNum).toEqual(1);

    store.dispatch(fetchAssignments([fixtures.assignments[1]]));
    assignmentsNum = getAssignmentsArrayByPlanId(store.getState(), 'alpha').length;
    expect(assignmentsNum).toEqual(2);

    store.dispatch(fetchAssignments([fixtures.assignments[2]]));
    assignmentsNum = getAssignmentsArrayByPlanId(store.getState(), 'alpha').length;
    expect(assignmentsNum).toEqual(3);

    store.dispatch(fetchAssignments([fixtures.assignment6]));
    assignmentsNum = getAssignmentsArrayByPlanId(store.getState(), 'alpha').length;
    expect(assignmentsNum).toEqual(2);

    expect(getAssignmentsArrayByPlanId(store.getState(), 'alpha')).toEqual([
      fixtures.assignments[1],
      fixtures.assignments[2],
    ]);

    store.dispatch(fetchAssignments([fixtures.assignment7]));
    assignmentsNum = getAssignmentsArrayByPlanId(store.getState(), 'alpha').length;
    expect(assignmentsNum).toEqual(3);

    expect(getAssignmentsArrayByPlanId(store.getState(), 'alpha')).toEqual([
      fixtures.assignment7,
      fixtures.assignments[2],
      fixtures.assignments[1],
    ]);

    expect(getAssignmentsArrayByPlanId(store.getState(), 'beta')).toHaveLength(1);
  });

  it('is able to overwrite existing Assignments with newly fetched', () => {
    store.dispatch(fetchAssignments([fixtures.assignments[0]]));
    let assignmentsNum = getAssignmentsArrayByPlanId(store.getState(), 'alpha').length;
    expect(assignmentsNum).toEqual(1);

    store.dispatch(fetchAssignments([fixtures.assignments[1]], true));
    assignmentsNum = getAssignmentsArrayByPlanId(store.getState(), 'alpha').length;
    expect(assignmentsNum).toEqual(1);
  });

  it('should reset existing Assignments', () => {
    store.dispatch(fetchAssignments(fixtures.assignments));
    store.dispatch(
      resetPlanAssignments({
        [fixtures.assignment1.plan]: [fixtures.assignment1],
      })
    );
    const assignments = getAssignmentsArrayByPlanId(store.getState(), fixtures.assignment1.plan);
    expect(assignments).toHaveLength(1);
  });
});

describe('utils', () => {
  it('parses raw assignments correctly', () => {
    const res = processRawAssignments(fixtures.rawAssignment1);
    expect(JSON.stringify(res)).toEqual(fixtures.expectedAssignment1);
  });
});
