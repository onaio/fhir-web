import { shallow } from 'enzyme';
import React from 'react';
import { LocationUnitGroup } from '..';

describe('containers/pages/locations/locationunitgroup', () => {
  it('renders without crashing', () => {
    shallow(<LocationUnitGroup />);
  });
});
