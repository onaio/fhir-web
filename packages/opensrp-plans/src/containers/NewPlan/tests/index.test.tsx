import React from 'react';
import { CreatePlanView } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Helmet } from 'react-helmet';
import { act } from 'react-dom/test-utils';

import { PlanFormFieldsKeys } from '@opensrp/plan-form';
import { DRAFT_PLANS_LIST_VIEW_URL } from '../../../constants';
import flushPromises from 'flush-promises';
import { wrap } from 'module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

describe('Create Plan Page', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('renders correctly with store(for new product)', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreatePlanView></CreatePlanView>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Create new mission');

    // check if form is rendered on the page
    expect(wrapper.find('form')).toHaveLength(1);

    wrapper.find('button#planform-cancel-button').simulate('click');

    wrapper.update();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.find('Router').props() as any).history.location.pathname).toEqual(
      DRAFT_PLANS_LIST_VIEW_URL
    );
  });

  it('planForm gets configured', async () => {
    const props = {
      hiddenFields: ['interventionType', 'title'] as PlanFormFieldsKeys[],
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CreatePlanView {...props}></CreatePlanView>
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Create new mission');

    // testing implementation details at its best.
    // date range field has not initial value

    console.log("Question! does this work")
    // expect(wrapper.find('.ant-form-item #dateRange').props().value).toEqual([
    //   undefined,
    //   undefined,
    // ]); 
    expect(wrapper.find('.ant-form-item #dateRange').first().props().value).toEqual(undefined);
    expect(wrapper.find('.ant-form-item #dateRange').last().props().value).toEqual(undefined);

    // check interventionType hidden
    expect(wrapper.find('.ant-form-item #interventionType').first().props().hidden).toBeTruthy();

    // check title are hidden
    expect(wrapper.find('.ant-form-item #title').first().props().hidden).toBeTruthy();

    // name is hidden by default
    expect(wrapper.find('.ant-form-item #name').first().props().hidden).toBeTruthy();

    // identifier is hidden by default
    expect(wrapper.find('.ant-form-item #identifier').first().props().hidden).toBeTruthy();

    // version is hidden by default
    expect(wrapper.find('.ant-form-item #version').first().props().hidden).toBeTruthy();

    // taskGenerationStatus is hidden by default
    expect(wrapper.find('.ant-form-item #taskGenerationStatus').first().props().hidden).toBeTruthy();

    // status is not hidden
    expect(wrapper.find('.ant-form-item #status').first().props().hidden).toBeFalsy();

    // dateRange is not hidden
    expect(wrapper.find('.ant-form-item #dateRange').first().props().hidden).toBeFalsy();

    // date is  hidden by default
    expect(wrapper.find('.ant-form-item #date').first().props().hidden).toBeTruthy();

    // date is  hidden by default
    expect(wrapper.find('.ant-form-item #description').first().props().hidden).toBeFalsy();
  });
});
