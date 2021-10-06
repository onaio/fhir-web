import React from 'react';
import { ConnectedServicePointList } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { INVENTORY_SERVICE_POINT_LIST_VIEW, SEARCH_QUERY_PARAM } from '../../../constants';
import { Helmet } from 'react-helmet';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { deforest, removeLocationUnits } from '@opensrp/location-management';
import { fetchCalls, madagascar, madagascarTree, structure1, structures } from './fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import { getNodePath } from '../utils';
import { generateJurisdictionTree } from '@opensrp/location-management';
import * as notifications from '@opensrp/notifications';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

const props = {
  history,
  location: {
    hash: '',
    pathname: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: {},
    path: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
    url: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
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
    { api_token: 'hunter2', oAuth2Data: { access_token: 'iLoveOov', state: 'abcde' } }
  )
);

describe('List view Page', () => {
  afterEach(() => {
    fetch.resetMocks();
    store.dispatch(deforest());
    store.dispatch(removeLocationUnits());
  });

  it('renders correctly', async () => {
    fetch
      .once(JSON.stringify({ count: 0 }))
      .once(JSON.stringify([]))
      .once(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedServicePointList {...props}></ConnectedServicePointList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('Service point inventory (0)');

    // no data
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Service point inventory (0)+ Add service pointService pointtypeLocationService point IDActionsNo Data"`
    );

    expect(fetch.mock.calls.map((call) => call[0])).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/location/countAll?serverVersion=0&is_jurisdiction=false',
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/location/getAll?serverVersion=0&is_jurisdiction=false&limit=0',
    ]);

    wrapper.unmount();
  });

  it('renders when data is present', async () => {
    fetch
      .once(JSON.stringify({ count: structures.length }))
      .once(JSON.stringify([madagascar]))
      .once(JSON.stringify(structures))
      .once(JSON.stringify(madagascarTree));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedServicePointList {...props}></ConnectedServicePointList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // has data
    expect(wrapper.text()).toMatchSnapshot('full text snapshot');

    // check fetch calls made
    expect(fetch.mock.calls).toEqual(fetchCalls);

    // look for pagination
    expect(wrapper.find('Pagination').first().text()).toMatchInlineSnapshot(`"15 / page"`);

    wrapper.unmount();
  });

  it('filers data correctly', async () => {
    fetch
      .once(JSON.stringify({ count: structures.length }))
      .once(JSON.stringify([madagascar]))
      .once(JSON.stringify(structures))
      .once(JSON.stringify(madagascarTree));

    const props = {
      history,
      location: {
        hash: '',
        pathname: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
        search: `?${SEARCH_QUERY_PARAM}=mbodis`,
        state: {},
      },
      match: {
        isExact: true,
        params: {},
        path: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
        url: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedServicePointList {...props}></ConnectedServicePointList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // we should expect a single record for madagascar
    expect(wrapper.find('tbody tr')).toHaveLength(1);

    expect(wrapper.find('tbody').text()).toMatchSnapshot('full body has only one entry Madagascar');
  });

  it('shows broken page', async () => {
    const errorMessage = 'Coughid';
    fetch.mockReject(new Error(errorMessage));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedServicePointList {...props}></ConnectedServicePointList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

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
          <ConnectedServicePointList {...props}></ConnectedServicePointList>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(`""`);

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // no data
    expect(wrapper.text()).toMatchSnapshot('error broken page');
  });

  it('shows error message notification', async () => {
    const errorMessage = 'Coughid';
    fetch.once(JSON.stringify({ count: structures.length }));
    fetch.mockReject(new Error(errorMessage));

    const spy = jest.spyOn(notifications, 'sendErrorNotification');

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedServicePointList {...props}></ConnectedServicePointList>
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(spy).toHaveBeenCalledWith(errorMessage);
  });

  it('branch test for getNodePath', async () => {
    const sampleLocation = {
      ...structure1,
      properties: { ...structure1.properties, parentId: undefined },
    };
    const res = getNodePath(sampleLocation, [generateJurisdictionTree(madagascarTree)]);
    expect(res).toEqual('');
  });
});
