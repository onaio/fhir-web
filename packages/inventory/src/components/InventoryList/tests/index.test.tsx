import React from 'react';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import {
  fetchCalls,
  inventories,
  opensrpBaseURL,
} from '../../../containers/ServicePointProfile/tests/fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import { InventoryList } from '..';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');
const history = createBrowserHistory();
const props = {
  opensrpBaseURL,
  servicePointId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
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

describe('Inventory list Page', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <InventoryList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual(fetchCalls[3]);

    wrapper.unmount();
  });

  it('renders when data is present', async () => {
    fetch.once(JSON.stringify(inventories));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <InventoryList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // check fetch calls made
    expect(fetch.mock.calls[0]).toEqual(fetchCalls[3]);

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Inventory items+ Add new inventory itemProduct nameQtyPO no.Serial no.Delivery dt.Acct. end dt.Unicef sectionDonorActions1101123434Jan 2, 2020, 3:00:00 AMMay 2, 2021, 3:00:00 AMHealthADBEdit1101123434Feb 2, 2020, 3:00:00 AMMay 2, 2021, 3:00:00 AMHealthADBEdit1"`
    );
    wrapper.unmount();
  });

  it('shows broken page', async () => {
    const errorMessage = 'Coughid';
    fetch.mockReject(new Error(errorMessage));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <InventoryList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // no data
    expect(wrapper.text()).toMatchSnapshot('error broken page');
    wrapper.unmount();
  });
});
