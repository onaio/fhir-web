import { mount, shallow } from 'enzyme';
import React from 'react';
import Fallback from '..';

describe('/components/Fallback', () => {
  it('renders without crasshing', () => {
    shallow(<Fallback />);
  });

  it('render correctly', () => {
    const wrapper = mount(<Fallback />);
    expect(wrapper.find('Result')).toHaveLength(1);
    expect(wrapper.find('Result').prop('status')).toBe('error');
    expect(wrapper.find('Result').prop('title')).toBe('An Error Occurred');
    expect(wrapper.find('Result').prop('subTitle')).toBe(
      'There has been an error. It’s been reported to the site administrators via email and should be fixed shortly. Thanks for your patience.'
    );
  });
});
