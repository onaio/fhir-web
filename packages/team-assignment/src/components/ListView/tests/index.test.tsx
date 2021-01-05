import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { TeamAssignmentView } from '..';
import { store } from '@opensrp/store';
import { history } from '@onaio/connected-reducer-registry';
import fetch from 'jest-fetch-mock';
import flushPromises from 'flush-promises';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { TEAM_ASSIGNMENT_LIST_VIEW_URL } from '../../../constants';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import reducer, { reducerName as assignmentReducerName } from '../../../ducks/assignments';
import {
  reducerName as hierarchyReducerName,
  reducer as hierarchyReducer,
  generateJurisdictionTree,
  fetchAllHierarchies,
} from '@opensrp/location-management';
import { reducer as teamsReducer, reducerName as teamsReducerName } from '@opensrp/team-management';
import { OPENSRP_API_BASE_URL } from '../../../constants';
import { assignments, sampleHierarchy, samplePlan } from './fixtures';
import { organizations } from '@opensrp/team-management/src/ducks/tests/fixtures';

// register reducers
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(teamsReducerName, teamsReducer);
reducerRegistry.register(assignmentReducerName, reducer);

// eslint-disable-next-line @typescript-eslint/no-var-requires

describe('List view Page', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.resetMocks();
  });

  it('works as expected', async () => {
    fetch
      .once(JSON.stringify(samplePlan))
      .once(JSON.stringify(assignments))
      .once(JSON.stringify(organizations));
    const props = {
      history,
      opensrpBaseURL: OPENSRP_API_BASE_URL,
      defaultPlanId: '27362060-0309-411a-910c-64f55ede3758',
      location: {
        hash: '',
        pathname: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
        url: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamAssignmentView {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching Assigned Locations and TeamsPlease wait, as we fetch Assigned Locations and Teams."`
    );
    wrapper.unmount();
  });

  it('works correctly with store', async () => {
    fetch
      .once(JSON.stringify(samplePlan))
      .once(JSON.stringify(assignments))
      .once(JSON.stringify(organizations))
      .once(JSON.stringify(sampleHierarchy));

    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies(hierarchy));

    const props = {
      history,
      opensrpBaseURL: OPENSRP_API_BASE_URL,
      defaultPlanId: '27362060-0309-411a-910c-64f55ede3758',
      location: {
        hash: '',
        pathname: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
        url: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamAssignmentView {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toEqual('');
  });

  it('shows broken page', async () => {
    fetch.mockResponses(
      /** Get plan hierarchy */
      [JSON.stringify(samplePlan), { status: 200 }],
      /** These calls are made by PlanAssignment */
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }],
      [JSON.stringify(sampleHierarchy), { status: 200 }]
    );
    const props = {
      history,
      opensrpBaseURL: OPENSRP_API_BASE_URL,
      defaultPlanId: '27362060-0309-411a-910c-64f55ede3758',
      location: {
        hash: '',
        pathname: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { productId: '1' },
        path: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
        url: `${TEAM_ASSIGNMENT_LIST_VIEW_URL}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TeamAssignmentView {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo BackBack Home"`);
  });
});
