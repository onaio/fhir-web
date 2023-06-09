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
import {
  assignmentsReducer,
  fetchAssignments,
  assignmentsReducerName,
} from '../../../ducks/assignments';
import { generateJurisdictionTree, locationHierachyDucks } from '@opensrp/location-management';
import {
  fetchOrganizationsAction,
  reducer as teamsReducer,
  reducerName as teamsReducerName,
} from '@opensrp/team-management';
import { OPENSRP_API_BASE_URL } from '../../../constants';
import {
  assignments,
  sampleHierarchy,
  sampleHierarchy2,
  samplePlan,
  organizations,
} from './fixtures';
import toJson from 'enzyme-to-json';
import { Dictionary } from '@onaio/utils';
import { cleanup, render, waitForElementToBeRemoved } from '@testing-library/react';

const { fetchAllHierarchies } = locationHierachyDucks;

// register reducers
// reducerRegistry.register(hierarchyReducerName, hierarchyReducer);
reducerRegistry.register(locationHierachyDucks.reducerName, locationHierachyDucks.reducer);
reducerRegistry.register(teamsReducerName, teamsReducer);
reducerRegistry.register(assignmentsReducerName, assignmentsReducer);

// eslint-disable-next-line @typescript-eslint/no-var-requires

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

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

const mockFetches = () => {
  fetch.mockResponses(
    /** Get plan hierarchy */
    [JSON.stringify([samplePlan]), { status: 200 }],
    [JSON.stringify(assignments), { status: 200 }],
    [JSON.stringify(20), { status: 200 }],
    [JSON.stringify(sampleHierarchy), { status: 200 }],
    [JSON.stringify(organizations), { status: 200 }]
    /** These calls are made by PlanAssignment */
  );
};

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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    fetch.mockClear();
    fetch.resetMocks();
    jest.clearAllMocks();
    jest.spyOn(React, 'useLayoutEffect').mockImplementation(() => false);
  });

  afterEach(() => {
    store.dispatch(fetchAllHierarchies([]));
  });

  it('works as expected', async () => {
    mockFetches();

    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

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

    expect(fetch.mock.calls.map((d) => d[0])).toEqual([
      'https://opensrp-staging.smartregister.org/opensrp/rest/plans/27362060-0309-411a-910c-64f55ede3758',
      'https://opensrp-staging.smartregister.org/opensrp/rest/organization/assignedLocationsAndPlans?plan=27362060-0309-411a-910c-64f55ede3758',
      'https://opensrp-staging.smartregister.org/opensrp/rest/organization/count',
      'https://opensrp-staging.smartregister.org/opensrp/rest/location/hierarchy/b652b2f4-a95d-489b-9e28-4629746db96a',
      'https://opensrp-staging.smartregister.org/opensrp/rest/organization?pageNumber=1&pageSize=1000',
    ]);

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Team AssignmentKenyaNameAssigned TeamsActionsKenya-Edit15 / page"`
    );
    wrapper.unmount();
  });

  test('renders error page on request rejection', async () => {
    fetch.mockReject(new Error('coughid'));

    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

    const { container } = render(
      <Provider store={store}>
        <Router history={history}>
          <TeamAssignmentView {...props} />
        </Router>
      </Provider>
    );

    await waitForElementToBeRemoved(container.querySelector('.ant-spin'));

    expect(document.querySelector('.ant-result.ant-result-500')).toBeInTheDocument();

    cleanup();
  });

  it('works correctly with store', async () => {
    fetch.mockResponses(
      /** Get plan */
      [JSON.stringify([samplePlan]), { status: 200 }],
      [JSON.stringify(sampleHierarchy), { status: 200 }],
      [JSON.stringify(20), { status: 200 }],
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }]
    );

    fetch.once(JSON.stringify(sampleHierarchy));

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

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

  it('hierarchy store is reset if hierarchies are more than 1', async () => {
    fetch.mockResponses(
      /** Get plan */
      [JSON.stringify([samplePlan]), { status: 200 }],
      [JSON.stringify(sampleHierarchy), { status: 200 }],
      [JSON.stringify(20), { status: 200 }],
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }]
    );

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    const hierarchy2 = generateJurisdictionTree(sampleHierarchy2);
    store.dispatch(fetchAllHierarchies([hierarchy.model, hierarchy2.model]));

    // hierarch array length should be 2
    expect(store.getState()[locationHierachyDucks.reducerName].hierarchyArray).toHaveLength(2);

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
    // hierarchy array should be empty
    expect(store.getState()[locationHierachyDucks.reducerName].hierarchyArray).toHaveLength(2);
    wrapper.unmount();
  });

  it('handles errors', async () => {
    fetch.mockResponses(
      /** Get plan */
      [JSON.stringify([]), { status: 500 }],
      [JSON.stringify(null), { status: 500 }],
      [JSON.stringify(null), { status: 500 }]
    );
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

  it('on submit works correctly', async () => {
    mockFetches();

    const mockNotificationSuccess = jest.spyOn(notifications, 'sendSuccessNotification');

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

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
    // simulate to open modal
    wrapper.find('button').at(0).simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // modal text: save button, cancel button, placeholder and header text
    expect(wrapper.find('Modal').text()).toMatchInlineSnapshot(
      // eslint-disable-next-line no-irregular-whitespace
      `"Assign/Unassign Teams | KenyaTeamsTeam 1Team 2ANC Test Team SaveCancel"`
    );

    // mock multi select on change event
    (wrapper.find('Modal Select').props() as Dictionary).onChange(
      ['fcc19470-d599-11e9-bb65-2a2ae2dbcce4'],
      [{ label: 'The Luang', value: 'fcc19470-d599-11e9-bb65-2a2ae2dbcce4' }]
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // filter props works correctly
    expect(
      (wrapper.find('Modal Select').props() as Dictionary).filterOption('luang', {
        label: 'The Luang',
        value: 'fcc19470-d599-11e9-bb65-2a2ae2dbcce4',
      })
    ).toBeTruthy();

    expect(
      (wrapper.find('Modal Select').props() as Dictionary).filterOption('anglu', {
        label: 'The Luang',
        value: 'fcc19470-d599-11e9-bb65-2a2ae2dbcce4',
      })
    ).toBeFalsy();

    // save assignment successfully
    expect(wrapper.find('button').at(1).text()).toEqual('Save');
    (wrapper.find('Modal Select').props() as Dictionary).onChange(
      ['4c506c98-d3a9-11e9-bb65-2a2ae2dbcce4'],
      [{ label: 'Demo Team', value: '4c506c98-d3a9-11e9-bb65-2a2ae2dbcce4' }]
    );
    fetch.once(JSON.stringify([assignments[0]]));
    wrapper.find('form').simulate('submit');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(mockNotificationSuccess).toHaveBeenCalledWith('Successfully Assigned Teams');
    wrapper.unmount();
  });

  it('correctly updates unassigning/assigning teams on table', async () => {
    mockFetches();
    fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });
    mockFetches();

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

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
    // simulate to open modal
    wrapper.find('button').at(0).simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // modal text: save button, cancel button, placeholder and header text
    expect(wrapper.find('Modal').text()).toMatchInlineSnapshot(
      // eslint-disable-next-line no-irregular-whitespace
      `"Assign/Unassign Teams | KenyaTeamsTeam 1Team 2ANC Test Team SaveCancel"`
    );

    // mock multi select on change event
    (wrapper.find('Modal Select').props() as Dictionary).onChange(
      ['c53900dd-cb8e-4f9f-befc-5b21742612a1'],
      [{ label: 'Team 1', value: 'c53900dd-cb8e-4f9f-befc-5b21742612a1' }]
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // filter props works correctly
    expect(
      (wrapper.find('Modal Select').props() as Dictionary).filterOption('Team 1', {
        label: 'Team 1',
        value: 'c53900dd-cb8e-4f9f-befc-5b21742612a1',
      })
    ).toBeTruthy();

    expect(
      (wrapper.find('Modal Select').props() as Dictionary).filterOption('TseT', {
        label: 'Team 1',
        value: 'c53900dd-cb8e-4f9f-befc-5b21742612a1',
      })
    ).toBeFalsy();

    // save assignment successfully
    expect(wrapper.find('button').at(1).text()).toEqual('Save');
    (wrapper.find('Modal Select').props() as Dictionary).onChange(
      ['e740e6b8-98dc-4d99-af34-ab2eb602da00'],
      [{ label: 'Team 2', value: 'e740e6b8-98dc-4d99-af34-ab2eb602da00' }]
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    wrapper.find('button').at(1).simulate('click');
    wrapper.find('form').simulate('submit');
    // check that the othe 2 teams have been unassigned
    expect(wrapper.find('Modal').text()).toMatchInlineSnapshot(
      // eslint-disable-next-line no-irregular-whitespace
      `"Assign/Unassign Teams | KenyaTeamsTeam 2 SaveCancel"`
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    const payload = [
      {
        fromDate: '2021-01-19T21:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: 'e740e6b8-98dc-4d99-af34-ab2eb602da00',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2027-07-13T19:31:00+00:00',
      },
      {
        fromDate: '2021-01-19T21:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: 'c53900dd-cb8e-4f9f-befc-5b21742612a1',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2017-07-13T19:31:00+00:00',
      },
      {
        fromDate: '2021-01-19T21:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2ea3733c-04fa-4136-b091-726ec3205422',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2017-07-13T19:31:00+00:00',
      },
    ];

    expect(fetch.mock.calls[5]).toEqual([
      'https://opensrp-staging.smartregister.org/opensrp/rest/organization/assignLocationsAndPlans',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
    wrapper.unmount();
  });

  it('closes modal on cancel button click', async () => {
    fetch.mockResponses(
      /** Get plan */
      [JSON.stringify([samplePlan]), { status: 200 }],
      /** These calls are made by TeamAssignment */
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }]
    );

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

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

    // simulate to open modal
    wrapper.find('button').at(0).simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(toJson(wrapper.find('Modal'))).toBeTruthy();
    expect(wrapper.find('Modal').props()['open']).toBeTruthy();
    expect(wrapper.find('button').at(2).text()).toEqual('Cancel');
    wrapper.find('button').at(2).simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // check visibility is set to false
    expect(wrapper.find('Modal').props()['open']).toBeFalsy();
  });

  it('updates table when clicking on tree node', async () => {
    fetch.mockResponses(
      /** Get plan */
      [JSON.stringify([samplePlan]), { status: 200 }],
      /** These calls are made by TeamAssignment */
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }]
    );

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

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
    // click parent node
    expect(wrapper.find('span.ant-tree-title')).toHaveLength(1);
    wrapper.find('span.ant-tree-title').simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // length should be 3 children
    expect(toJson(wrapper.find('span.ant-tree-title'))).toHaveLength(8);
    wrapper.unmount();
  });

  it('handles save error', async () => {
    fetch.mockResponses(
      /** Get plan */
      [JSON.stringify([samplePlan]), { status: 200 }],
      /** These calls are made by TeamAssignment */
      // [JSON.stringify(20), { status: 200 }],
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }]
    );

    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

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
    // simulate to open modal
    wrapper.find('button').at(0).simulate('click');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    (wrapper.find('Modal Select').props() as Dictionary).onChange(
      ['4c506c98-d3a9-11e9-bb65-2a2ae2dbcce4'],
      [{ label: 'Demo Team', value: '4c506c98-d3a9-11e9-bb65-2a2ae2dbcce4' }]
    );
    fetch.mockRejectOnce(new Error('API is down'));
    wrapper.find('form').simulate('submit');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(mockNotificationError).toHaveBeenCalledWith('Error', 'API is down');
    wrapper.unmount();
  });

  it('filters select options by text', async () => {
    fetch.mockResponses(
      /** Get plan */
      [JSON.stringify([samplePlan]), { status: 200 }],
      /** These calls are made by TeamAssignment */
      [JSON.stringify(assignments), { status: 200 }],
      [JSON.stringify(organizations), { status: 200 }]
    );

    store.dispatch(fetchAssignments(assignments));
    store.dispatch(fetchOrganizationsAction(organizations));
    const hierarchy = generateJurisdictionTree(sampleHierarchy);
    store.dispatch(fetchAllHierarchies([hierarchy.model]));

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

    // simulate to open modal
    wrapper.find('button').at(0).simulate('click');

    wrapper.update();

    // find antd Select with id 'teamAssignment_assignTeams'
    const teamAssignmentSelect = wrapper.find('Select#teamAssignment_assignTeams');

    // simulate click on select - to show dropdown items
    teamAssignmentSelect.find('.ant-select-selector').simulate('mousedown');

    wrapper.update();

    // expect to see all options
    const teamAssignmentSelect2 = wrapper.find('Select#teamAssignment_assignTeams');
    // find antd select options
    const selectOptions = teamAssignmentSelect2.find('.ant-select-item-option-content');
    // expect all team options
    expect(selectOptions.map((opt) => opt.text())).toStrictEqual([
      'Team 1',
      'Team 2',
      'Team 3',
      'ANC Test Team',
      'team 2',
      'Test Demo Team',
      'TestTeam',
      'Team Blank test',
    ]);

    // find search input field
    const inputField = teamAssignmentSelect.find('input#teamAssignment_assignTeams');
    // simulate change (type search phrase)
    inputField.simulate('change', { target: { value: 'Demo' } });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // expect to see only filtered options
    const teamAssignmentSelect3 = wrapper.find('Select#teamAssignment_assignTeams');
    const selectOptions2 = teamAssignmentSelect3.find('.ant-select-item-option-content');
    expect(selectOptions2.map((opt) => opt.text())).toMatchInlineSnapshot(`
      Array [
        "Test Demo Team",
      ]
    `);
    wrapper.unmount();
  });
});
