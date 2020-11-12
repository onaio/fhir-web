import { mount } from 'enzyme';
import React from 'react';

import { Loader } from '../Loader';

describe('components/Loaders/Ripple', () => {
  it('renders the Loader component', () => {
    const wrapper = mount(<Loader />);
    expect(wrapper.props()).toMatchSnapshot();
  });

  it('renders the Loader component when props are given', () => {
    const props = {
      borderColor: '#ff0000',
      borderStyle: 'solid',
      borderWidth: '6px',
      height: '128px',
      minHeight: '70vh',
      width: '128px',
    };
    const wrapper = mount(<Loader {...props} />);
    expect(wrapper.props()).toMatchSnapshot();
  });
});
