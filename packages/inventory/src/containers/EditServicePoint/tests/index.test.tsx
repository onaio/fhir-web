import { shallow } from 'enzyme';
import { ServicePointEdit } from '..';
import React from 'react';
import { createBrowserHistory } from 'history';
import { INVENTORY_ADD_SERVICE_POINT } from '../../../constants';

const history = createBrowserHistory();

it('passes the correct values to form', async () => {
  const props = {
    history,
    location: {
      hash: '',
      pathname: `${INVENTORY_ADD_SERVICE_POINT}`,
      search: '',
      state: {},
    },
    match: {
      isExact: true,
      params: {},
      path: `${INVENTORY_ADD_SERVICE_POINT}`,
      url: `${INVENTORY_ADD_SERVICE_POINT}`,
    },
  };
  const wrapper = shallow(<ServicePointEdit {...props} />);

  expect(wrapper.props().hiddenFields).toEqual([
    'extraFields',
    'status',
    'isJurisdiction',
    'type',
    'locationTags',
    'externalId',
  ]);
  expect(wrapper.props().instance).toEqual('eusm');
});
