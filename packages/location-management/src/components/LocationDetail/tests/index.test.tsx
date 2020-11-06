import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import LocationDetail, { LocationDetailProps } from '..';

describe('containers/pages/Home', () => {
  const props: LocationDetailProps = {
    id: 0,
    active: true,
    name: 'Asda',
    description: 'this is the description',
  };

  it('renders without crashing', () => {
    const wrapper = mount(<LocationDetail {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('removes it self on close', () => {
    const wrapper = mount(<LocationDetail {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(0);
  });
});
