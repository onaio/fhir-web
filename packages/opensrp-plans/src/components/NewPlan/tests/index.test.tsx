import React from 'react';
import { CreatePlanView } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Helmet } from 'react-helmet';
import { act } from 'react-dom/test-utils';
import { CREATE_PLAN } from '../../../lang';
import { PlanFormFieldsKeys } from '@opensrp/plan-form';

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
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual(CREATE_PLAN);

    // check if form is rendered on the page
    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('planForm gets configured', () => {
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

    // check if page title is correct
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual(CREATE_PLAN);

    // check interventionType hidden
    expect(wrapper.find('FormItem#interventionType').props().hidden).toBeTruthy();

    // check title are hidden
    expect(wrapper.find('FormItem#title').props().hidden).toBeTruthy();

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
});
