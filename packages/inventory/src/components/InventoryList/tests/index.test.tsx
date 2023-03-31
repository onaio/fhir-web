import React from 'react';
import { store } from '@opensrp/store';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import {
  fetchCalls,
  inventories,
  inventory1,
  inventory3,
  inventory4,
  inventory5,
  inventory6,
  opensrpBaseURL,
} from '../../../containers/ServicePointProfile/tests/fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import { InventoryList } from '..';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { fetchInventories } from '../../../ducks/inventory';

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
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual(fetchCalls[3]);

    wrapper.unmount();
  });

  it('renders correctly when no data is present', async () => {
    fetch.once(JSON.stringify([inventory1]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <InventoryList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Inventory items + Add new inventory itemProduct nameQtyPO no.Serial no.Delivery dt.Acct. end dt.Unicef sectionDonorActionsNo Data"`
    );
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
      await flushPromises();
      wrapper.update();
    });

    // check fetch calls made
    expect(fetch.mock.calls[0]).toEqual(fetchCalls[3]);

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Inventory items + Add new inventory itemProduct nameQtyPO no.Serial no.Delivery dt.Acct. end dt.Unicef sectionDonorActionsChange name Test1101123434Feb 02, 2020May 02, 2021HealthADBEditEmpty product test1057Feb 03, 2021May 03, 2021WASHADBEditEmpty product test1057Feb 03, 2021May 03, 2021WASHADBEditScale1101123434Jan 02, 2020May 02, 2021HealthADBEdit"`
    );

    expect(toJson(wrapper.find('.inventory-profile a'))).toMatchSnapshot(
      'link to add new inventory item'
    );

    store.dispatch(fetchInventories([], true));
    wrapper.update();

    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Inventory items + Add new inventory itemProduct nameQtyPO no.Serial no.Delivery dt.Acct. end dt.Unicef sectionDonorActionsNo Data"`
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
      await flushPromises();
      wrapper.update();
    });

    // no data
    expect(wrapper.text()).toMatchSnapshot('error broken page');
    wrapper.unmount();
  });

  it('sorts by file product name', async () => {
    fetch.once(JSON.stringify([inventory3, inventory4, inventory5, inventory6]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <InventoryList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    const heading = wrapper.find('thead');

    // Ascending is default
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual(
      'Change name Test'
    );
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'Empty product test'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual(
      'Empty product test'
    );
    expect(wrapper.find('tbody').find('tr').at(3).find('td').at(0).text()).toEqual('Scale');

    // Cancel sorting
    heading.find('th').at(0).children().simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('Scale');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'Change name Test'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual(
      'Empty product test'
    );
    // descending
    heading.find('th').at(0).children().simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('Scale');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'Empty product test'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual(
      'Empty product test'
    );
    expect(wrapper.find('tbody').find('tr').at(3).find('td').at(0).text()).toEqual(
      'Change name Test'
    );
  });
});
