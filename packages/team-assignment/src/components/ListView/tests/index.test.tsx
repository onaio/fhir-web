import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { TeamAssignmentView } from '..';
import { store } from '@opensrp/store';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import flushPromises from 'flush-promises';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { TEAM_ASSIGNMENT_LIST_VIEW_URL } from '../../../constants';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import reducer, {
  fetchAssignments,
  reducerName as assignmentReducerName,
} from '../../../ducks/assignments';
import { OPENSRP_API_BASE_URL } from '../../../constants';
import { assignments, sampleHierarchy, samplePlan } from './fixtures';
import { organizations } from '@opensrp/team-management/src/ducks/tests/fixtures';
import {
  fetchOrganizationsAction,
  orgReducerName,
  organizationsReducer,
} from '@opensrp/team-management';
import {
  generateJurisdictionTree,
  locationHierachyDucks,
  TreeNode,
} from '@opensrp/location-management';

// register reducers
const { fetchAllHierarchies } = locationHierachyDucks;

reducerRegistry.register(orgReducerName, organizationsReducer);
reducerRegistry.register(locationHierachyDucks.reducerName, locationHierachyDucks.reducer);
reducerRegistry.register(assignmentReducerName, reducer);
// eslint-disable-next-line @typescript-eslint/no-var-requires

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('List view Page', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
    jest.spyOn(React, 'useLayoutEffect').mockImplementation(() => false);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    store.dispatch(fetchAllHierarchies(([] as unknown) as TreeNode));
  });

  it('works as expected', async () => {
    fetch.mockResponses(
      /** Get plan hierarchy */
      [JSON.stringify(samplePlan), { status: 200 }],
      /** These calls are made by PlanAssignment */
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }]
    );

    const hierarchy = ([generateJurisdictionTree(sampleHierarchy).model] as unknown) as TreeNode;
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

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Team AssignmentKenyaNameAssigned TeamsActionsKenya-Edit1"`
    );
    wrapper.unmount();
  });

  it('works correctly with store', async () => {
    fetch.mockResponses(
      /** Get plan hierarchy */
      [JSON.stringify(samplePlan), { status: 200 }],
      /** These calls are made by PlanAssignment */
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }]
    );

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies(([hierarchy.model] as unknown) as TreeNode));

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

    expect(wrapper.find('TeamAssignmentView').props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('handles errors', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

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
    expect(notificationErrorMock).toHaveBeenCalled();
    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
    wrapper.unmount();
  });
});
