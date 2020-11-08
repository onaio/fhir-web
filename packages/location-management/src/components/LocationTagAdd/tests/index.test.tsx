import { mount } from 'enzyme';
import React from 'react';
import LocationUnitGroupAdd from '..';

describe('containers/pages/locations/LocationTagAddition', () => {
  it('renders without crashing', () => {
    const wrapper = mount(<LocationUnitGroupAdd />);
    expect(wrapper.find('section').props()).toMatchSnapshot();
  });

  it('tests filter function', () => {
    const wrapper = mount(<LocationUnitGroupAdd />);
    wrapper.find('input#location-add_name').simulate('change', { target: { value: 'Option 3' } });
    expect(wrapper.find('div.rc-virtual-list-holder-inner')).toHaveLength(1);
    expect(wrapper.find('div.rc-virtual-list-holder-inner').children()).toHaveLength(1);
    expect(wrapper.find('div.rc-virtual-list-holder-inner').children().text()).toBe('Option 3');
  });
});
