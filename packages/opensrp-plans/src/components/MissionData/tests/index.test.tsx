import React from 'react';
import { shallow } from 'enzyme';
import { MissionData } from '..';
import { eusmPlans } from '../../../ducks/planDefinitions/tests/fixtures';
import { PlanDefinition } from '@opensrp/plan-form-core';

const plan = eusmPlans[0] as PlanDefinition;

describe('mission data download', () => {
  it('renders without crashing', () => {
    const props = {
      plan,
    };
    shallow(<MissionData {...props} />);
  });
});
