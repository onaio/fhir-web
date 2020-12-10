import { mount } from 'enzyme';
import React from 'react';
import LocationUnitGroupDetail, { LocationUnitGroupDetailProps } from '..';

describe('location-management/src/components/LocationTagDetail', () => {
  const props: LocationUnitGroupDetailProps = {
    id: 123123,
    name: 'Edrward 0',
    active: true,
    description: 'this is th description',
  };

  it('renders without crashing', () => {
    const wrapper = mount(<LocationUnitGroupDetail {...props} />);
    expect(wrapper.find('#LocationUnitGroupDetail')).toHaveLength(1);
  });

  it('removes it self on close', () => {
    const wrapper = mount(<LocationUnitGroupDetail {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(0);
  });
  it('doesnt close if onClose prop is not set', () => {
    const wrapper = mount(<LocationUnitGroupDetail {...props} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(1);
  });
});
