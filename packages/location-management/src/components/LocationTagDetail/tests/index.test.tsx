import { mount } from 'enzyme';
import React from 'react';
import LocationTagDetail, { LocationTagDetailProps } from '..';

describe('location-management/src/components/LocationTagDetail', () => {
  const props: LocationTagDetailProps = {
    id: 123123,
    name: 'Edrward 0',
    active: true,
    description: 'this is th description',
  };

  it('renders without crashing', () => {
    const wrapper = mount(<LocationTagDetail {...props} />);
    expect(wrapper.find('#LocationTagDetail')).toHaveLength(1);
  });

  it('removes it self on close', () => {
    const wrapper = mount(<LocationTagDetail {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(0);
  });
  it('doesnt close if onClose prop is not set', () => {
    const wrapper = mount(<LocationTagDetail {...props} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(1);
  });
});
