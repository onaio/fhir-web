import reducerRegistry from '@onaio/redux-reducer-registry';
import { FlushThunks } from 'redux-testkit';
import reducer, {
  fetchAssignments,
  getAssignments,
  reducerName,
  removeAssignmentsAction,
} from '..';
import { store } from '@opensrp/store';
import * as fixtures from './fixtures';
reducerRegistry.register(reducerName, reducer);

describe('reducers/assignments', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    jest.resetAllMocks();
    store.dispatch(removeAssignmentsAction());
  });

  it('should have initial state', () => {
    expect(getAssignments(store.getState())).toEqual([]);
  });

  it('should fetch Assignments', () => {
    store.dispatch(fetchAssignments(fixtures.assignments));
    const teamAssignments = getAssignments(store.getState());
    expect(teamAssignments).toHaveLength(3);
  });
});
