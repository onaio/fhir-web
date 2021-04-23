import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import LocationUnitDetail, { Props } from '..';
import { LocationUnitStatus, LocationUnitSyncStatus } from '../../../ducks/location-units';

describe('location-management/src/components/LocationUnitDetail', () => {
  const props: Props = {
    id: '6y66ggde',
    type: 'Feautire',
    properties: {
      parentId: '2',
      name: 'test',
      status: LocationUnitStatus.ACTIVE,
      externalId: 'asdkjh1230',
      username: 'edward 0',
      version: 0,
      geographicLevel: 2,
    },
    syncStatus: LocationUnitSyncStatus.SYNCED,
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<LocationUnitDetail {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('removes it self on close', () => {
    const wrapper = mount(<LocationUnitDetail {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');

    wrapper.update();
    expect(wrapper).toHaveLength(0);
  });

  it('doesnt remove itself if onclose is not provided', () => {
    const wrapper = mount(<LocationUnitDetail {...props} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(1);
  });
});
