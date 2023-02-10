import React from 'react';
import { ConnectedPlansList } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { eusmPlans } from '../../../ducks/planDefinitions/tests/fixtures';
import { ACTIVE_PLANS_LIST_VIEW_URL } from '../../../constants';
import { Helmet } from 'react-helmet';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { removePlanDefinitions } from '../../../ducks/planDefinitions';
import { getColumns, pageTitleBuilder } from '../utils';
import { authenticateUser } from '@onaio/session-reducer';
import { PlanStatus } from '@opensrp/plan-form-core';
import flushPromises from 'flush-promises';
import toJson from 'enzyme-to-json';

const defaultT = (t: string) => t;
const columns = getColumns(defaultT);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

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
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
      },
      allowedPlanStatus: 'active',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).not.toBeNull();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Active Missions + New MissionNameDate createdEnd DateActionsNo Data"`
    );
  });
  it('renders Draft Missions Title', async () => {
    const plan3 = { ...eusmPlans[0], title: 'Draft Plan', identifier: '300', status: 'draft' };
    fetch.mockResponse(JSON.stringify([...eusmPlans, plan3]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
      },
      allowedPlanStatus: 'draft',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Draft Missions + New MissionNameDate createdEnd DateActionsDraft Plan2020-11-172021-12-24View15 / page"`
    );
  });
  it('renders Complete Missions Title', async () => {
    const plan3 = {
      ...eusmPlans[0],
      title: 'Complete Plan',
      identifier: '300',
      status: 'complete',
    };
    fetch.mockResponse(JSON.stringify([...eusmPlans, plan3]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
      },
      allowedPlanStatus: 'complete',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Complete Missions + New MissionNameDate createdEnd DateActionsComplete Plan2020-11-172021-12-24View15 / page"`
    );
  });

  it('renders Retired Missions Title', async () => {
    const plan3 = { ...eusmPlans[0], title: 'Retired Plan', identifier: '300', status: 'retired' };
    fetch.mockResponse(JSON.stringify([...eusmPlans, plan3]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
      },
      allowedPlanStatus: 'retired',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Retired Missions + New MissionNameDate createdEnd DateActionsRetired Plan2020-11-172021-12-24View15 / page"`
    );
  });

  it('sort works', async () => {
    const plan3 = { ...eusmPlans[0], title: 'Simple Plan', identifier: '300' };
    fetch.mockResponse(JSON.stringify([...eusmPlans, plan3]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
      },
      allowedPlanStatus: 'active',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
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

  it('sort works on date', async () => {
    const plan3 = { ...eusmPlans[0], title: 'Simple Plan', identifier: '300' };
    fetch.mockResponse(JSON.stringify([...eusmPlans, plan3]));
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
      },
      allowedPlanStatus: 'active',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Active Missions');

    // find ant table
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`table rows ${index}`);
    });

    // click on sort twice to change the order if its date col
    expect(wrapper.find('thead tr th').at(1).text()).toEqual('Date created');

    wrapper.find('thead tr th').at(1).simulate('click');
    wrapper.update();

    // click on sort twice to change the order
    wrapper.find('thead tr th').at(1).simulate('click');
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
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
      },
      allowedPlanStatus: 'active',
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedPlansList {...props}></ConnectedPlansList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).not.toBeNull();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorSomething went wrongGo backGo home"`);
  });

  // test column sorter method
  // eslint-disable-next-line @typescript-eslint/ban-types
  const columnsSorter = columns[0].sorter as Function;
  expect(columnsSorter({ title: 4 }, { title: 1 })).toBe(-1);
  expect(columnsSorter({ title: 1 }, { title: 4 })).toBe(1);
  expect(columnsSorter({ title: 0 }, { title: 0 })).toBe(0);

  // test pageTitleBuilder

  expect(pageTitleBuilder(defaultT, PlanStatus.ACTIVE)).toEqual('Active Missions');
  expect(pageTitleBuilder(defaultT, PlanStatus.DRAFT)).toEqual('Draft Missions');
  expect(pageTitleBuilder(defaultT, PlanStatus.COMPLETE)).toEqual('Complete Missions');
  expect(pageTitleBuilder(defaultT, PlanStatus.RETIRED)).toEqual('Retired Missions');
  expect(pageTitleBuilder(defaultT)).toEqual('');
});
