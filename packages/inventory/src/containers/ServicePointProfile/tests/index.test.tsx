import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { findPath, ServicePointProfile } from '..';
import { store } from '@opensrp-web/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import {
  INVENTORY_SERVICE_POINT_PROFILE_PARAM,
  INVENTORY_SERVICE_POINT_PROFILE_VIEW,
} from '../../../constants';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import {
  deforest,
  hierarchyReducer,
  hierarchyReducerName,
  removeLocationUnits,
} from '@opensrp-web/location-management';
import {
  fetchCalls,
  geographicHierarchy,
  madagascar,
  madagascarTree,
  opensrpBaseURL,
  structure2,
} from './fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import toJson from 'enzyme-to-json';
import { Helmet } from 'react-helmet';
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);

jest.mock('@opensrp-web/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp-web/notifications')),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    servicePointId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

const props = {
  opensrpBaseURL,
  history,
  location: {
    hash: '',
    pathname: `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: { [INVENTORY_SERVICE_POINT_PROFILE_PARAM]: 'b8a7998c-5df6-49eb-98e6-f0675db71848' },
    path: `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}`,
    url: `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}`,
  },
};

store.dispatch(
  authenticateUser(
    true,
    {
      email: 'bob@example.com',
      name: 'Bobbie',
      username: 'RobertBaratheon',
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
  )
);

describe('Profile view Page', () => {
  afterEach(() => {
    fetch.resetMocks();
    store.dispatch(deforest());
    store.dispatch(removeLocationUnits());
  });

  it('renders correctly', async () => {
    fetch.once(null).once(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointProfile {...props}></ServicePointProfile>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual(fetchCalls[0]);
    expect(fetch.mock.calls[1]).toEqual(fetchCalls[1]);

    wrapper.unmount();
  });

  it('renders correctly when data is present', async () => {
    fetch
      .once(JSON.stringify(structure2))
      .once(JSON.stringify([madagascar]))
      .once(JSON.stringify(madagascarTree));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointProfile {...props}></ServicePointProfile>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // check fetch calls made
    expect(fetch.mock.calls[0]).toEqual(fetchCalls[0]);
    expect(fetch.mock.calls[1]).toEqual(fetchCalls[1]);
    expect(fetch.mock.calls[2]).toEqual(fetchCalls[2]);

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Back to the list of service pointsAmbatoharanana InventoryRegion: ANALANJIROFODistrict: MANANARA AVARATRACommune: AMBATOHARANANAType: Water PointLatitude/longitude: -16.78147, 49.52125Service point ID: b8a7998c-5df6-49eb-98e6-f0675db71848Edit service pointUnable to fetch inventories for service point"`
    );
    expect(wrapper.find('.title').text()).toEqual('Ambatoharanana Inventory');

    wrapper.find('GeographyItem').forEach((item) => {
      expect(toJson(item)).toMatchSnapshot('geographic item key value');
    });

    expect(toJson(wrapper.find('div.flex-center-right'))).toMatchSnapshot(
      'contains button to edit service point'
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Ambatoharanana Inventory');

    wrapper.unmount();
  });

  it('shows broken page', async () => {
    const errorMessage = 'Coughid';
    fetch.mockReject(new Error(errorMessage));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointProfile {...props}></ServicePointProfile>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // no data
    expect(wrapper.text()).toMatchSnapshot('error broken page');
    wrapper.unmount();
  });

  it('shows broken page when jurisdiction request errors out', async () => {
    const errorMessage = 'Coughid';
    fetch.once(structure2).once(JSON.stringify([madagascar]));
    fetch.mockReject(new Error(errorMessage));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointProfile {...props}></ServicePointProfile>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // no data
    expect(wrapper.text()).toMatchSnapshot('error broken page');
  });

  it('should return correct geographic location', async () => {
    expect(findPath(geographicHierarchy, 1)).toEqual(geographicHierarchy[1]);
  });

  it('render correct formatted value with lat long', async () => {
    fetch
      .once(JSON.stringify(structure2))
      .once(JSON.stringify([madagascar]))
      .once(JSON.stringify(madagascarTree));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointProfile {...props}></ServicePointProfile>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.find('.geography-item').at(8).text()).toEqual(
      'Latitude/longitude: -16.78147, 49.52125'
    );

    wrapper.unmount();
  });
});
