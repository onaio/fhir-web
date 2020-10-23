import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import LocationDetail, { Props } from '..';

describe('containers/pages/Home', () => {
  it('renders without crashing', () => {
    let props: Props = {
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
    let wrapper = mount(<LocationDetail {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('removes it self on close', () => {
    let props: Props = {
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
      onClose: () => wrapper.unmount(),
    };
    let wrapper = mount(<LocationDetail {...props} />);
    expect(wrapper.children().length).toBe(1);
    wrapper.find('button').simulate('click');
    expect(wrapper.length).toBe(0);
  });
});
