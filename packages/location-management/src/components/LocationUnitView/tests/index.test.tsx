import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import React from 'react';
import LocationUnit from '..';

describe('containers/pages/locations/locationunit', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LocationUnit />
      </Provider>
    );

    expect(wrapper.props()).toMatchSnapshot();
  });
});
