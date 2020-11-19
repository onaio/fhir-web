import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import { mount, shallow } from 'enzyme';
import fetch from 'jest-fetch-mock';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import LocationUnitView from '..';
import { sampleHierarchiesList, sampleLocationUnit } from '../../LocationUnitAdd/tests/fixtures';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { sampleHierarchy } from './fixtures';
import toJson from 'enzyme-to-json';

describe('containers/pages/locations/locationunit', () => {
  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <LocationUnitView />
      </Provider>
    );
  });
  it('location unit table renders correctly', async () => {
    fetch.once(JSON.stringify(sampleHierarchiesList)).once(JSON.stringify(sampleHierarchy));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <LocationUnitView />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('Table').first().props()).toMatchSnapshot();
    wrapper.unmount();
  });
});
