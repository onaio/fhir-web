import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import LocationUnitDetail, { Props } from '..';
import { LocationUnitStatus, LocationUnitSyncStatus } from '../../../ducks/location-units';

describe('containers/pages/Home', () => {
  const props: Props = {
    parentId: '2',
    key: '0',
    name: 'Edrward 0',
    geographicLevel: 2,
    status: LocationUnitStatus.ACTIVE,
    type: 'Feautire',
    externalId: 'asdkjh1230',
    username: 'edward 0',
    version: 0,
    syncstatus: LocationUnitSyncStatus.SYNCED,
  };

  it('renders without crashing', () => {
    const wrapper = mount(<LocationUnitDetail {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('removes it self on close', () => {
    const wrapper = mount(<LocationUnitDetail {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(0);
  });
});
