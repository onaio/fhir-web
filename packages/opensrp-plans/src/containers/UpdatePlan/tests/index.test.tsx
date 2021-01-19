import React from 'react';
import { ConnectedEditPlanView } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { eusmPlans } from '../../../ducks/planDefinitions/tests/fixtures';
import { ACTIVE_PLANS_LIST_VIEW_URL } from '../../../constants';
import { mount } from 'enzyme';
import { Helmet } from 'react-helmet';
import { act } from 'react-dom/test-utils';
import { removePlanDefinitions } from '../../../ducks/planDefinitions';
import { PlanFormFieldsKeys } from '@opensrp/plan-form';
import lang from '../../../lang';

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
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: mission1.identifier },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}/:planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
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
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('full text snapshot');

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual(lang.EDIT_PLAN);

    // check if form is rendered on the page
    expect(wrapper.find('form')).toHaveLength(1);

    wrapper.find('button#planform-cancel-button').simulate('click');

    wrapper.update();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.find('Router').props() as any).history.location.pathname).toEqual(
      ACTIVE_PLANS_LIST_VIEW_URL
    );
  });

  it('planform is configured correctly', async () => {
    fetch.mockResponse(JSON.stringify([mission1]));

    const props = {
      hiddenFields: ['interventionType'] as PlanFormFieldsKeys[],
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: mission1.identifier },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}/:planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
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
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // additional confirmation plan form is loaded on page
    expect(wrapper.text()).toMatchSnapshot('full text snapshot');

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual(lang.EDIT_PLAN);

    // check if form is rendered on the page
    expect(wrapper.find('form')).toHaveLength(1);

    // check interventionType hidden
    expect(wrapper.find('FormItem#interventionType').props().hidden).toBeTruthy();

    // check title is shown
    expect(wrapper.find('FormItem#title').props().hidden).toBeFalsy();

    // name is hidden by default
    expect(wrapper.find('FormItem#name').props().hidden).toBeTruthy();

    // identifier is hidden by default
    expect(wrapper.find('FormItem#identifier').props().hidden).toBeTruthy();

    // version is hidden by default
    expect(wrapper.find('FormItem#version').props().hidden).toBeTruthy();

    // taskGenerationStatus is hidden by default
    expect(wrapper.find('FormItem#taskGenerationStatus').props().hidden).toBeTruthy();

    // status is not hidden
    expect(wrapper.find('FormItem#status').props().hidden).toBeFalsy();

    // dateRange is not hidden
    expect(wrapper.find('FormItem#dateRange').props().hidden).toBeFalsy();

    // date is  hidden by default
    expect(wrapper.find('FormItem#date').props().hidden).toBeTruthy();

    // date is  hidden by default
    expect(wrapper.find('FormItem#description').props().hidden).toBeFalsy();
  });

  it('shows broken page', async () => {
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: mission1.identifier },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}/:planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/${mission1.identifier}`,
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
    expect(wrapper.text()).toMatchSnapshot('show loader');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // should be in error page
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorCould not pull dataGo backGo home"`);
  });

  it('handles missing plan', async () => {
    const props = {
      history,
      location: {
        hash: '',
        pathname: `${ACTIVE_PLANS_LIST_VIEW_URL}/${'missingPlan'}`,
        search: '',
        state: {},
      },
      match: {
        isExact: true,
        params: { planId: 'missingPlan' },
        path: `${ACTIVE_PLANS_LIST_VIEW_URL}/:planId`,
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}/${'missingPlan'}`,
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
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    /** resource404 info page */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );
  });

  it('wrong route congiguration', async () => {
    // such that we do not have a plan Id
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
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    /** should still be loading page */
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    expect(fetch).not.toHaveBeenCalled();
  });
});
