import React from 'react';
import PlanInfo from '..';
import { eusmPlans } from '../../../ducks/tests/fixtures';
import { mount, shallow } from 'enzyme';
import { PlanDefinition } from '@opensrp/plan-form-core/dist/types';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

describe('/components/PlanInfo', () => {
  const history = createBrowserHistory();
  const props = {
    plan: eusmPlans[0] as PlanDefinition,
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
      `"Missions/Active Missions/EUSM Mission 2020-11-17/EUSM Mission 2020-11-17EditactiveStart Date2020-11-17End Date2021-12-24 "`
    );
  });
});
