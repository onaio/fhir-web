import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import { Ripple } from '../';

describe('components/Loaders/Ripple', () => {
  it('renders without crashing', () => {
    shallow(<Ripple />);
  });
  it('renders the Ripple component', () => {
    const wrapper = mount(<Ripple />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.unmount();
  });

  it('renders the Ripple component when props are given', () => {
    const props = {
      borderColor: '#ff0000',
      borderStyle: 'solid',
      borderWidth: '6px',
      height: '128px',
      minHeight: '70vh',
      width: '128px',
    };
    const wrapper = mount(<Ripple {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.props()).toMatchSnapshot();
    wrapper.unmount();
  });
});
