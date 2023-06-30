import { mount, shallow } from 'enzyme';
import dayjs from 'dayjs';
import React from 'react';
import { store } from '@opensrp/store';
import {
  fetchLocationUnits,
  removeLocationUnits,
  LocationUnit,
} from '@opensrp/location-management';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { ConnectedInventoryAddEdit, InventoryAddEdit } from '..';
import { fetchInventories, removeInventories } from '../../../ducks/inventory';
import * as fixtures from './fixtures';
import {
  products,
  donors,
  unicefSections,
  product4,
  product2,
  product3,
  product1,
} from '../../../components/InventoryItemForm/tests/fixtures';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import toJson from 'enzyme-to-json';
import { authenticateUser } from '@onaio/session-reducer';
/* eslint-disable react/prop-types */

const history = createBrowserHistory();
jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  const DatePicker = ({ children, onChange, ...otherProps }) => {
    return (
      <select {...otherProps} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    );
  };

  const Select = ({ children, onChange, ...otherProps }) => {
    return (
      <select {...otherProps} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    );
  };

  const Option = ({ children, ...otherProps }) => {
    return <option {...otherProps}>{children}</option>;
  };

  Select.Option = Option;

  return {
    __esModule: true,
    ...antd,
    DatePicker,
    Select,
  };
});

describe('containers/InventoryAddEdit', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });
  beforeEach(() => {
    store.dispatch(removeLocationUnits());
    store.dispatch(removeInventories());
  });

  const props = {
    openSRPBaseURL: 'https://mg-eusm-staging.smartregister.org/opensrp/rest/',
    servicePointProfileURL: '/inventory/profile',
    fetchLocationUnitsCreator: fetchLocationUnits,
    fetchInventoriesCreator: fetchInventories,
    servicePoint: null,
    location: {
      hash: '',
      pathname: `/service-point/${fixtures.servicePoint2.id}/inventory-item/add`,
      search: '',
      state: '',
    },
    match: {
      isExact: true,
      params: { servicePointId: fixtures.servicePoint2.id },
      path: `/service-point/:servicePointId/ineventory-item/add`,
      url: `/service-point/${fixtures.servicePoint2.id}/inventory-item/add`,
    },
    history,
  };
  it('does not crash', () => {
    shallow(<InventoryAddEdit {...props} />);
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify(fixtures.servicePoint2));
    fetch.once(JSON.stringify(products));
    fetch.once(JSON.stringify(donors));
    fetch.once(JSON.stringify(unicefSections));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedInventoryAddEdit {...props} />
        </Router>
      </Provider>
    );
    // Spinner is displayed before we get the service point
    expect(wrapper.find('Spin').first().prop('size')).toEqual('large');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // Spinner has stopped
    expect(toJson(wrapper.find('Spin'))).toBeFalsy();

    expect(fetch.mock.calls[0]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/location/${fixtures.servicePoint2.id}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(fetch.mock.calls[1]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/product-catalogue',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[2]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_donors',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[3]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_unicef_sections',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    const content = wrapper.find('div.content-section');
    expect(document.title).toEqual('Add inventory item');
    expect(content.find('PageHeader').text()).toMatchSnapshot('heading');
    expect(content.find('InventoryItemForm').props()).toEqual({
      UNICEFSections: unicefSections,
      donors: donors,
      products: [product4, product2, product3, product1], //products should be in alpahabetical order,
      cancelURL: `/inventory/profile/${fixtures.servicePoint2.id}`,
      openSRPBaseURL: 'https://mg-eusm-staging.smartregister.org/opensrp/rest/',
      redirectURL: `/inventory/profile/${fixtures.servicePoint2.id}`,
      servicePointId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
      initialValues: {
        accountabilityEndDate: null,
        deliveryDate: null,
        donor: undefined,
        poNumber: '',
        productName: undefined,
        quantity: '',
        unicefSection: undefined,
        serialNumber: undefined,
      },
      inventoryID: undefined,
    });
    wrapper.unmount();
  });

  it('adds inventory item', async () => {
    fetch.once(JSON.stringify(fixtures.servicePoint2));
    fetch.once(JSON.stringify(products));
    fetch.once(JSON.stringify(donors));
    fetch.once(JSON.stringify(unicefSections));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedInventoryAddEdit {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    wrapper.find('select#productName').simulate('change', {
      target: { value: products[0].productName },
    });
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: unicefSections[0].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: donors[0].value },
    });
    wrapper.find('input#poNumber').simulate('change', { target: { value: 89 } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    const payload = {
      productName: 'Test optional Fields',
      deliveryDate: '2021-02-08',
      accountabilityEndDate: '2021-04-08',
      unicefSection: 'Health',
      donor: 'ADB',
      poNumber: 89,
      servicePointId: fixtures.servicePoint2.id,
      quantity: 10,
    };
    expect(fetch.mock.calls[0]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/location/${fixtures.servicePoint2.id}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(fetch.mock.calls).toHaveLength(5);
    expect(fetch.mock.calls[1]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/product-catalogue',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[2]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_donors',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[3]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_unicef_sections',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[4]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: '*/*',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json',
        },
        method: 'POST',
      },
    ]);
    // When submitting  the submit button text changes
    expect(wrapper.find('button').at(0).text()).toEqual('Saving');
    // Redirect to redirect URL
    expect(history.location.pathname).toEqual(`/inventory/profile/${fixtures.servicePoint2.id}`);
    wrapper.unmount();
  });

  it('edits inventory item', async () => {
    fetch.once(JSON.stringify(fixtures.servicePoint2));
    fetch.once(JSON.stringify(products));
    fetch.once(JSON.stringify(donors));
    fetch.once(JSON.stringify(unicefSections));
    fetch.once(JSON.stringify(fixtures.inventories));

    const editProps = {
      ...props,
      location: {
        hash: '',
        pathname: `/service-point/${fixtures.servicePoint2.id}/inventory-item/edit/${fixtures.inventories[0]._id}`,
        search: '',
        state: '',
      },
      match: {
        isExact: true,
        params: {
          servicePointId: fixtures.servicePoint2.id,
          inventoryId: fixtures.inventories[0]._id,
        },
        path: `/service-point/:servicePointId/ineventory-item/edit:inventoryId`,
        url: `/service-point/${fixtures.servicePoint2.id}/inventory-item/edit/${fixtures.inventories[0]._id}`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedInventoryAddEdit {...editProps} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // Form is initialized with initial values
    expect(wrapper.find('select#productName').get(0).props.value).toEqual(
      fixtures.inventories[0].product.productName
    );
    expect(wrapper.find('input#quantity').get(0).props.value).toMatchInlineSnapshot(`"1"`);
    expect(wrapper.find('select#deliveryDate').get(0).props.value).toEqual(
      dayjs(fixtures.inventories[0].deliveryDate)
    );
    expect(wrapper.find('select#accountabilityEndDate').get(0).props.value).toEqual(
      dayjs(fixtures.inventories[0].accountabilityEndDate)
    );
    expect(wrapper.find('select#unicefSection').get(0).props.value).toEqual(
      fixtures.inventories[0].customProperties['UNICEF section']
    );
    expect(wrapper.find('select#donor').get(0).props.value).toEqual(fixtures.inventories[0].donor);
    expect(wrapper.find('input#poNumber').get(0).props.value).toEqual(
      fixtures.inventories[0].customProperties['PO Number']
    );

    // Make edits
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: unicefSections[1].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: donors[1].value },
    });
    wrapper.find('input#poNumber').simulate('change', { target: { value: 89 } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    expect(document.title).toEqual('Edit inventory item');
    expect(wrapper.find('PageHeader').text()).toMatchInlineSnapshot(`"Edit > Scale"`);

    const payload = {
      productName: fixtures.inventories[0].product.productName,
      deliveryDate: '2021-02-08',
      accountabilityEndDate: '2021-04-08',
      unicefSection: 'WASH',
      donor: 'NatCom Belgium',
      poNumber: 89,
      servicePointId: fixtures.servicePoint2.id,
      quantity: 10,
      stockId: fixtures.inventories[0]._id,
    };
    expect(wrapper.find('InventoryItemForm').props()).toEqual({
      UNICEFSections: unicefSections,
      donors: donors,
      products: [product4, product2, product3, product1], //products should be in alpahabetical order,
      cancelURL: `/inventory/profile/${fixtures.servicePoint2.id}`,
      openSRPBaseURL: 'https://mg-eusm-staging.smartregister.org/opensrp/rest/',
      redirectURL: `/inventory/profile/${fixtures.servicePoint2.id}`,
      servicePointId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
      initialValues: {
        accountabilityEndDate: dayjs(fixtures.inventories[0].accountabilityEndDate),
        deliveryDate: dayjs(fixtures.inventories[0].deliveryDate),
        donor: fixtures.inventories[0].donor,
        poNumber: fixtures.inventories[0].customProperties['PO Number'],
        productName: fixtures.inventories[0].product.productName,
        quantity: 1,
        serialNumber: fixtures.inventories[0].serialNumber,
        unicefSection: fixtures.inventories[0].customProperties['UNICEF section'],
      },
      inventoryID: fixtures.inventories[0]._id,
    });

    expect(fetch.mock.calls).toHaveLength(6);
    expect(fetch.mock.calls[0]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/location/${fixtures.servicePoint2.id}`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(fetch.mock.calls[1]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/product-catalogue',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[2]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_donors',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[3]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_unicef_sections',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[4]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/servicePointId/${fixtures.servicePoint2.id}?returnProduct=true`,
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[5]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/${fixtures.inventories[0]._id}`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: '*/*',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json',
        },
        method: 'PUT',
      },
    ]);
    // Redirect to redirect URL
    expect(history.location.pathname).toEqual(`/inventory/profile/${fixtures.servicePoint2.id}`);

    wrapper.unmount();
  });

  it('displays 404 page if sevice point is not found', async () => {
    fetch.once('Error fetching service point', { status: 500 });
    fetch.once(JSON.stringify(products));
    fetch.once(JSON.stringify(donors));
    fetch.once(JSON.stringify(unicefSections));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedInventoryAddEdit {...props} />
        </Router>
      </Provider>
    );
    // Spinner is displayed before we get the service point
    expect(wrapper.find('Spin').first().prop('size')).toEqual('large');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    // Spinner has stopped
    expect(toJson(wrapper.find('Spin'))).toBeFalsy();

    // 404 page is displayed
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo backGo home"`
    );

    wrapper.unmount();
  });

  it('renders form when data is already in the redux store', async () => {
    store.dispatch(fetchLocationUnits([fixtures.servicePoint2] as LocationUnit[]));
    store.dispatch(fetchInventories(fixtures.inventories));
    fetch.once(JSON.stringify(products));
    fetch.once(JSON.stringify(donors));
    fetch.once(JSON.stringify(unicefSections));

    const editProps = {
      ...props,
      location: {
        hash: '',
        pathname: `/service-point/${fixtures.servicePoint2.id}/inventory-item/edit/${fixtures.inventories[0]._id}`,
        search: '',
        state: '',
      },
      match: {
        isExact: true,
        params: {
          servicePointId: fixtures.servicePoint2.id,
          inventoryId: fixtures.inventories[0]._id,
        },
        path: `/service-point/:servicePointId/ineventory-item/edit:inventoryId`,
        url: `/service-point/${fixtures.servicePoint2.id}/inventory-item/edit/${fixtures.inventories[0]._id}`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedInventoryAddEdit {...editProps} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetch.mock.calls).toHaveLength(3);
    expect(fetch.mock.calls[0]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/product-catalogue',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[1]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_donors',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(fetch.mock.calls[2]).toEqual([
      'https://mg-eusm-staging.smartregister.org/opensrp/rest/v2/settings?serverVersion=0&identifier=inventory_unicef_sections',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(wrapper.find('InventoryItemForm').props()).toEqual({
      UNICEFSections: unicefSections,
      donors: donors,
      products: [product4, product2, product3, product1], //products should be in alpahabetical order,
      cancelURL: `/inventory/profile/${fixtures.servicePoint2.id}`,
      openSRPBaseURL: 'https://mg-eusm-staging.smartregister.org/opensrp/rest/',
      redirectURL: `/inventory/profile/${fixtures.servicePoint2.id}`,
      servicePointId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
      initialValues: {
        accountabilityEndDate: dayjs(fixtures.inventories[0].accountabilityEndDate),
        deliveryDate: dayjs(fixtures.inventories[0].deliveryDate),
        donor: fixtures.inventories[0].donor,
        poNumber: fixtures.inventories[0].customProperties['PO Number'],
        productName: fixtures.inventories[0].product.productName,
        quantity: 1,
        serialNumber: fixtures.inventories[0].serialNumber,
        unicefSection: fixtures.inventories[0].customProperties['UNICEF section'],
      },
      inventoryID: fixtures.inventories[0]._id,
    });
    wrapper.unmount();
  });

  it('renders heading correctly when editing and product name not present', async () => {
    fetch.once(JSON.stringify(fixtures.servicePoint2));
    fetch.once(JSON.stringify(products));
    fetch.once(JSON.stringify(donors));
    fetch.once(JSON.stringify(unicefSections));
    fetch.once(JSON.stringify([fixtures.inventoryNoProduct]));

    const editProps = {
      ...props,
      location: {
        hash: '',
        pathname: `/service-point/${fixtures.servicePoint2.id}/inventory-item/edit/${fixtures.inventoryNoProduct._id}`,
        search: '',
        state: '',
      },
      match: {
        isExact: true,
        params: {
          servicePointId: fixtures.servicePoint2.id,
          inventoryId: fixtures.inventoryNoProduct._id,
        },
        path: `/service-point/:servicePointId/ineventory-item/edit:inventoryId`,
        url: `/service-point/${fixtures.servicePoint2.id}/inventory-item/edit/${fixtures.inventoryNoProduct._id}`,
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedInventoryAddEdit {...editProps} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    expect(wrapper.find('PageHeader').text()).toEqual(`Edit`);
    wrapper.unmount();
  });
});
