import reducerRegistry from '@onaio/redux-reducer-registry';
import { FlushThunks } from 'redux-testkit';
import reducer, {
  fetchAssignments,
  getAssignmentsArray,
  getAssignmentsById,
  reducerName,
  removeAssignments,
} from '..';
import { store } from '@opensrp/store';
import * as fixtures from './fixtures';
reducerRegistry.register(reducerName, reducer);

describe('reducers/assignments', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(removeAssignments());
  });

  it('should have initial state', () => {
    expect(getAssignmentsArray(store.getState())).toEqual([]);
    expect(getAssignmentsById(store.getState())).toEqual({});
  });

  it('should fetch Assignments', () => {
    store.dispatch(fetchAssignments(fixtures.assignments));
    const teamAssignments = getAssignmentsArray(store.getState());
    expect(teamAssignments).toHaveLength(3);
  });
});
