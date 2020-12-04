import React from 'react';
import { ConnectedPlansList } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { eusmPlans } from '../../../ducks/tests/fixtures';
import { PLANS_LIST_VIEW_URL } from '../../../constants';
import { Helmet } from 'react-helmet';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { removePlanDefinitions } from '../../../ducks';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

describe('List view Page', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  beforeEach(() => {
    store.dispatch(removePlanDefinitions());
  });

  it('renders correctly', async () => {
    fetch.mockResponse(JSON.stringify([]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${PLANS_LIST_VIEW_URL}`,
        url: `${PLANS_LIST_VIEW_URL}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching PlansPlease wait, as we fetch the plans."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorNo data foundGo BackBack Home"`);
  });

  it('sort works', async () => {
    const plan3 = { ...eusmPlans[0], name: 'Simple Plan', identifier: '300' };
    fetch.mockResponse(JSON.stringify([...eusmPlans, plan3]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${PLANS_LIST_VIEW_URL}`,
        url: `${PLANS_LIST_VIEW_URL}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Active Missions');

    // find ant table
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`table rows ${index}`);
    });

    // click on sort twice to change the order
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // click on sort twice to change the order
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // check new sort order
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows ${index}`);
    });
  });

  it('shows broken page', async () => {
    fetch.mockReject(new Error('Something went wrong'));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { productId: '1' },
        path: `${PLANS_LIST_VIEW_URL}`,
        url: `${PLANS_LIST_VIEW_URL}`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Loading...Fetching PlansPlease wait, as we fetch the plans."`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo BackBack Home"`);
  });
});
