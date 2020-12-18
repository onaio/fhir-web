import React from 'react';
import { ConnectedPlanAssignment } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { eusmPlans } from '../../../ducks/tests/fixtures';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { removePlanDefinitions } from '../../../ducks';
import { ACTIVE_PLANS_LIST_VIEW_URL } from '../../../constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

describe('PlanAssignment Page', () => {
  beforeEach(() => {
    store.dispatch(removePlanDefinitions());
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
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching PlansPlease wait, as we fetch the plans."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('full text snapshot');
    expect(wrapper.find('PlanInfo')).toHaveLength(1);
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
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching PlansPlease wait, as we fetch the plans."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
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
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching PlansPlease wait, as we fetch the plans."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    /** resource404 info page */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo BackBack Home"`
    );
  });
});
