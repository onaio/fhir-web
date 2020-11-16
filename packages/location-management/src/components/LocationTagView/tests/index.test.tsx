import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { shallow } from 'enzyme';
import React from 'react';
import LocationTagView from '..';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';

describe('containers/pages/locations/LocationTagView', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LocationTagView />
      </Provider>
    );

    expect(wrapper.props()).toMatchSnapshot();
  });

  it('renders without crashing', async () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LocationTagView />
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.unmount();
  });
});
