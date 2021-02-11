import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { ServicePointProfile } from '..';
import { store } from '@opensrp/store';
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
} from '@opensrp/location-management';
import {
  fetchCalls,
  inventories,
  madagascar,
  madagascarTree,
  opensrpBaseURL,
  structures,
} from './fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import toJson from 'enzyme-to-json';
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
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
    fetch.once(JSON.stringify([])).once(JSON.stringify([])).once(JSON.stringify([]));

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
    expect(fetch.mock.calls[2]).toEqual(fetchCalls[2]);

    wrapper.unmount();
  });

  it('renders when data is present', async () => {
    fetch
      .once(JSON.stringify(structures))
      .once(JSON.stringify([madagascar]))
      .once(JSON.stringify(inventories))
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
    expect(fetch.mock.calls[3]).toEqual(fetchCalls[3]);

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Back to the list of service pointsAmbatoharananaRegion: District: Commune: Type: Water PointLatitude/longitude: Service point ID: b8a7998c-5df6-49eb-98e6-f0675db71848Edit service pointInventory items+ Add new inventory itemProduct nameQtyPO no.Serial no.Delivery dt.Acct. end dt.Unicef sectionDonorActions1101123434Jan 2, 2020, 3:00:00 AMMay 2, 2021, 3:00:00 AMHealthADBEdit1101123434Feb 2, 2020, 3:00:00 AMMay 2, 2021, 3:00:00 AMHealthADBEdit1"`
    );
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
  });

  it('shows broken page when jurisdiction request errors out', async () => {
    const errorMessage = 'Coughid';
    fetch.once(JSON.stringify({ count: structures.length })).once(JSON.stringify([madagascar]));
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
});
