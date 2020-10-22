import { shallow } from 'enzyme';
import React from 'react';
import LocationDetail, { Props } from '..';

const props: Props = {
  key: '0',
  name: 'Edrward 0',
  level: 2,
  lastupdated: new Date(),
  status: 'Alive',
  type: 'Feautire',
  created: new Date(),
  externalid: 'asdkjh1230',
  openmrsid: 'asdasdasdkjh1230',
  username: 'edward 0',
  version: '0',
  syncstatus: 'Synced',
};

describe('component/locations/LocationDetail', () => {
  it('renders without crashing', () => {
    shallow(<LocationDetail {...props} />);
  });
});
