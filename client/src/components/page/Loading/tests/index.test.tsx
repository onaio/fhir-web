// test ExportModal
import { mount, shallow } from 'enzyme';
import React from 'react';

import Loading from '../index';

describe('components/Loading', () => {
  const props = {
    borderColor: '#ff0000',
    borderStyle: 'solid',
    borderWidth: '6px',
    height: '128px',
    minHeight: '70vh',
    width: '128px',
  };

  it('renders without crashing', () => {
    shallow(<Loading />);
  });

  it('should have props on calling loading component', () => {
    const wrapper = mount(<Loading {...props} />);
    expect(wrapper.props()).not.toBeNull();
  });

  it('check props passed in', () => {
    const wrapper = mount(<Loading {...props} />);
    expect(wrapper.props()).toEqual(props);
  });
});
