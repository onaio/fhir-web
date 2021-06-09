import React from 'react';
import PlanInfo from '..';
import { eusmPlans } from '../../../ducks/planDefinitions/tests/fixtures';
import { mount, shallow } from 'enzyme';
import { PlanDefinition } from '@opensrp/plan-form-core';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import toJson from 'enzyme-to-json';

describe('/components/PlanInfo', () => {
  const history = createBrowserHistory();
  const props = {
    plan: eusmPlans[0] as PlanDefinition,
    planId: `335ef7a3-7f35-58aa-8263-4419464946d8`,
  };
  it('renders without crashing', () => {
    shallow(<PlanInfo {...props} />);
  });
  it('renders and passes props correctly)', async () => {
    const wrapper = mount(
      <Router history={history}>
        <PlanInfo {...props} />{' '}
      </Router>
    );
    const planInfo = wrapper.find('PlanInfo');
    expect(planInfo.props()).toEqual(props);
    expect(planInfo.find('Link').first().props()).toMatchSnapshot('edit link');
    expect(planInfo.find('Link').last().props()).toMatchSnapshot('activate link');
    expect(planInfo.find('Divider')).toHaveLength(3);
    expect(planInfo.find('Avatar').props()).toMatchSnapshot('avatar props');
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Missions/Active/EUSM Mission 2020-11-17/EUSM Mission 2020-11-17EditActiveStart Date2020-11-17End Date2021-12-24 "`
    );
    wrapper.find('.site-page-header-responsive span.ant-breadcrumb-link').forEach((span, index) => {
      expect(toJson(span)).toMatchSnapshot(`links in breadcrumb ${index}`);
    });
  });
});
