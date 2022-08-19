import React from 'react';
import { ConnectedPlanAssignment } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { eusmPlans } from '../../../ducks/planDefinitions/tests/fixtures';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ACTIVE_PLANS_LIST_VIEW_URL } from '../../../constants';
import { PlanStatus } from '@opensrp/plan-form-core';
import * as planDux from '../../../ducks/planDefinitions';
import flushPromises from 'flush-promises';
import toJson from 'enzyme-to-json';
import { authenticateUser } from '@onaio/session-reducer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

describe('PlanAssignment Page', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    store.dispatch(planDux.removePlanDefinitions());
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('renders correctly with store(single plan)', async () => {
    fetch.mockResponse(JSON.stringify([eusmPlans[0]]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/335ef7a3-7f35-58aa-8263-4419464946d8`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: `335ef7a3-7f35-58aa-8263-4419464946d8` },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}/:planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/335ef7a3-7f35-58aa-8263-4419464946d8`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlanAssignment {...props}></ConnectedPlanAssignment>
        </Router>
      </Provider>
    );

    // loading
    expect(toJson(wrapper.find('.ant-spin'))).not.toBeNull();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('full text snapshot');
    expect(wrapper.find('PlanInfo')).toHaveLength(1);
  });

  it('shows activate mission', async () => {
    const draftMission = {
      ...eusmPlans[0],
      status: PlanStatus.DRAFT,
    };
    fetch.mockResponse(JSON.stringify([draftMission]));
    const props = {
      showActivateMission: true,
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/${draftMission.identifier}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: draftMission.identifier },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}/:planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/${draftMission.identifier}`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlanAssignment {...props}></ConnectedPlanAssignment>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('.activate-plan button').simulate('click');

    // activate mission is on the page
    expect(wrapper.find('.activate-plan')).toHaveLength(2);
    expect(wrapper.find('.activate-plan button')).toHaveLength(1);
  });

  it('shows broken page', async () => {
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/335ef7a3-7f35-58aa-8263-4419464946d8`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: `335ef7a3-7f35-58aa-8263-4419464946d8` },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/335ef7a3-7f35-58aa-8263-4419464946d8`,
      },
    };

    fetch.mockReject(new Error('Could not pull data'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlanAssignment {...props}></ConnectedPlanAssignment>
        </Router>
      </Provider>
    );

    // loading
    expect(toJson(wrapper.find('.ant-spin'))).not.toBeNull();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // should be in error page
    expect(wrapper.text()).toMatchSnapshot('broken page error');
  });

  it('handles missing plan', async () => {
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/7`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: `7` },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}/:planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/7`,
      },
    };

    fetch.mockResponse(JSON.stringify([eusmPlans[0]]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlanAssignment {...props}></ConnectedPlanAssignment>
        </Router>
      </Provider>
    );

    // should be in loading screen
    expect(toJson(wrapper.find('.ant-spin'))).not.toBeNull();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    /** resource404 info page */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );
  });
  it('renders mission data and mission table)', async () => {
    fetch.mockResponse(JSON.stringify([eusmPlans[0]]));
    const props = {
      showAssignmentTable: true,
      showMissionData: true,
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/335ef7a3-7f35-58aa-8263-4419464946d8`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: `335ef7a3-7f35-58aa-8263-4419464946d8` },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}/:planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/335ef7a3-7f35-58aa-8263-4419464946d8`,
      },
    };

    const wrapper = shallow(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlanAssignment {...props}></ConnectedPlanAssignment>
        </Router>
      </Provider>
    );
    // should be in loading screen
    expect(wrapper.text()).toMatchInlineSnapshot(`"<Router />"`);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('MissionData')).not.toBeNull();
    expect(wrapper.find('AssignmentTable')).not.toBeNull();
  });
});
