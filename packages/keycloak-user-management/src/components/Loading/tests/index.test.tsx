// test ExportModal
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Loading from '../index';

describe('components/Loading', () => {
  it('renders without crashing', () => {
    shallow(<Loading />);
  });
  it('renders the Loading component', () => {
    const wrapper = mount(<Loading />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.unmount();
  });

  it('renders the Loading component when props are given', () => {
    const props = {
      borderColor: '#ff0000',
      borderStyle: 'solid',
      borderWidth: '6px',
      height: '128px',
      minHeight: '70vh',
      width: '128px',
    };
    const wrapper = mount(<Loading {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.props()).toMatchSnapshot();
    wrapper.unmount();
  });
});
