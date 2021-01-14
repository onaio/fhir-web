import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import NotFound from '../';

describe('components/NotFount', () => {
  it('renders without crashing', () => {
    shallow(<NotFound />);
  });
  it('renders the NotFount component', () => {
    const wrapper = mount(<NotFound />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.unmount();
  });
});
