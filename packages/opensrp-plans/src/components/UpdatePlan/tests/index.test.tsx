import React from 'react';
import { ConnectedEditPlanView } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { eusmPlans } from '../../../ducks/tests/fixtures';
import { PLANS_LIST_VIEW_URL } from '../../../constants';
import { mount } from 'enzyme';
import { Helmet } from 'react-helmet';
import { PlanForm } from '@opensrp/plan-form';
import { act } from 'react-dom/test-utils';
import { removePlanDefinitions } from '../../../ducks';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const mission1 = eusmPlans[0];

const history = createBrowserHistory();

describe('CreateEditProduct Page', () => {
  beforeEach(() => {
    store.dispatch(removePlanDefinitions());
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('renders correctly with store(for editing plans)', async () => {
    fetch.mockResponse(JSON.stringify([mission1]));

    const props = {
      history,
      location: {
        hash: '',
        pathname: `${PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: mission1.identifier },
        path: `${PLANS_LIST_VIEW_URL}/:planId`,
        url: `${PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedEditPlanView {...props}></ConnectedEditPlanView>
        </Router>
      </Provider>
    );

    // loading
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching planPlease wait, as we fetch the plan."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('full text snapshot');

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Edit > Scale');

    // check if form is rendered on the page
    expect(wrapper.find('form')).toHaveLength(1);

    expect(wrapper.find(PlanForm).props()).toMatchSnapshot('edit form props');
  });

  it('shows broken page', async () => {
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: mission1.identifier },
        path: `${PLANS_LIST_VIEW_URL}/:planId`,
        url: `${PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
      },
    };

    fetch.mockReject(new Error('Could not pull data'));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedEditPlanView {...props}></ConnectedEditPlanView>
        </Router>
      </Provider>
    );

    // show loading screen
    expect(wrapper.text()).toMatchSnapshot('full page text');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // should be in error page
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorCould not pull dataGo BackBack Home"`);
  });

  it('handles missing plan', async () => {
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: mission1.identifier },
        path: `${PLANS_LIST_VIEW_URL}/:planId`,
        url: `${PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
      },
    };

    fetch.mockResponse(JSON.stringify([mission1]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedEditPlanView {...props}></ConnectedEditPlanView>
        </Router>
      </Provider>
    );

    // should be in loading screen
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching planPlease wait, as we fetch the plan."`
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
