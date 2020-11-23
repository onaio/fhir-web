import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import LocationGroupDetail, { Props } from '..';

describe('containers/pages/Home', () => {
  const props: Props = {
    key: '0',
    name: 'Edrward 0',
    level: 2,
    lastupdated: new Date(`Thu Oct 22 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
    status: 'Alive',
    type: 'Feautire',
    created: new Date(`Thu Oct 22 2020 14:15:56 GMT+0500 (Pakistan Standard Time)`),
    externalid: 'asdkjh1230',
    openmrsid: 'asdasdasdkjh1230',
    username: 'edward 0',
    version: '0',
    syncstatus: 'Synced',
  };

  it('renders without crashing', () => {
    const wrapper = mount(<LocationGroupDetail {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('removes it self on close', () => {
    const wrapper = mount(<LocationGroupDetail {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(0);
  });
  it('doesnt close if onClose prop is not set', () => {
    const wrapper = mount(<LocationGroupDetail {...props} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(1);
  });
});
