import React from 'react';
import dayjs from 'dayjs';
import { createBrowserHistory } from 'history';
import fetch from 'jest-fetch-mock';
import * as notifications from '@opensrp/notifications';
import { store } from '@opensrp/store';
import flushPromises from 'flush-promises';
import { authenticateUser } from '@onaio/session-reducer';
import { mount, shallow } from 'enzyme';
import { Router } from 'react-router';
import { InventoryItemForm, defaultInitialValues } from '..';
import * as fixtures from './fixtures';
import { ProductCatalogue } from '@opensrp/product-catalogue';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';
import * as opensrpReactUtils from '@opensrp/react-utils';

/* eslint-disable react/prop-types */

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('@opensrp/react-utils', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/react-utils')),
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

describe('components/InventoryItemForm', () => {
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
    jest.restoreAllMocks();
  });

  const props = {
    openSRPBaseURL: 'https://mg-eusm-staging.smartregister.org/opensrp/rest/',
    cancelURL: '/inventory-items',
    redirectURL: 'inventory-items-done',
    products: fixtures.products as ProductCatalogue[],
    UNICEFSections: fixtures.unicefSections,
    donors: fixtures.donors,
    servicePointId: '03176924-6b3c-4b74-bccd-32afcceebabd',
    initialValues: defaultInitialValues,
  };

  it('renders without crashing', () => {
    shallow(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );
  });

  it('renders correctly', () => {
    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );

    expect(wrapper.find('Form')).toBeTruthy();
    wrapper.unmount();
  });

  it('form validation works for required fields', async () => {
    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('FormItemInput').at(0).prop('errors')).toEqual(['Product is required']);
    expect(wrapper.find('FormItemInput').at(1).prop('errors')).toEqual([]);
    expect(wrapper.find('FormItemInput').at(2).prop('errors')).toEqual([
      'Delivery date is required',
    ]);
    expect(wrapper.find('FormItemInput').at(3).prop('errors')).toEqual([
      'Accountability end date is required',
    ]);
    expect(wrapper.find('FormItemInput').at(4).prop('errors')).toEqual([
      'UNICEF section is required',
    ]);
    expect(wrapper.find('FormItemInput').at(5).prop('errors')).toEqual([]);
    expect(wrapper.find('FormItemInput').at(6).prop('errors')).toEqual(['PO number is required']);
    wrapper.unmount();
  });

  it('adds inventory item', async () => {
    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );

    wrapper.find('select#productName').simulate('change', {
      target: { value: fixtures.products[0].productName },
    });
    // product should be editable when adding a new inventory item
    expect(wrapper.find('select#productName').get(0).props.disabled).toEqual(false);
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: fixtures.unicefSections[0].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: fixtures.donors[0].value },
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
      servicePointId: '03176924-6b3c-4b74-bccd-32afcceebabd',
      quantity: 10,
    };

    expect(fetch.mock.calls[0]).toEqual([
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
    expect(history.location.pathname).toEqual('/inventory-items-done');
    wrapper.unmount();
  });

  it('auto-calculates accountability end date', () => {
    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );
    /**
     * Auto-calculate accountability end date by adding the product
     * accountability period (in months) to the entered delivery date
     */
    wrapper.find('select#productName').simulate('change', {
      target: { value: fixtures.products[0].productName },
    });
    const deliveryDate = dayjs('2021-02-09');
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: deliveryDate },
    });

    wrapper.update();
    const expected = dayjs(deliveryDate.format('YYYY-MM-DD')).add(
      fixtures.products[0].accountabilityPeriod,
      'months'
    );
    expect(wrapper.find('select#accountabilityEndDate').get(0).props.value).toEqual(expected);
    wrapper.unmount();
  });

  it('renders serial number field if product selected is an attractive item', async () => {
    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );
    expect(toJson(wrapper.find('#serialNumber'))).toBeFalsy();

    wrapper.find('select#productName').simulate('change', {
      target: { value: fixtures.products[3].productName },
    });
    expect(toJson(wrapper.find('#serialNumber'))).toBeTruthy();

    wrapper.find('input#serialNumber').simulate('change', { target: { value: '12345' } });
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: fixtures.unicefSections[0].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: fixtures.donors[0].value },
    });
    wrapper.find('input#poNumber').simulate('change', { target: { value: 89 } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    const payload = {
      productName: 'Motorbyke',
      deliveryDate: '2021-02-08',
      accountabilityEndDate: '2021-04-08',
      unicefSection: 'Health',
      donor: 'ADB',
      poNumber: 89,
      servicePointId: '03176924-6b3c-4b74-bccd-32afcceebabd',
      serialNumber: '12345',
      quantity: 10,
    };

    expect(fetch.mock.calls[0]).toEqual([
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
    wrapper.unmount();
  });

  it('handles error when adding item', async () => {
    fetch.mockResponse('Server error here', { status: 500 });
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );

    wrapper.find('select#productName').simulate('change', {
      target: { value: fixtures.products[0].productName },
    });
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: fixtures.unicefSections[0].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: fixtures.donors[0].value },
    });
    wrapper.find('input#poNumber').simulate('change', { target: { value: 89 } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
    wrapper.unmount();
  });

  it('edits inventory item', async () => {
    const stockId = '69227a92-7979-490c-b149-f28669c6b760';
    const editProps = {
      ...props,
      inventoryID: stockId,
      initialValues: {
        productName: fixtures.products[0].productName,
        quantity: 78,
        deliveryDate: dayjs('2021-02-02'),
        accountabilityEndDate: dayjs('2022-02-02'),
        unicefSection: fixtures.unicefSections[0].value,
        donor: fixtures.donors[0].value,
        poNumber: 90,
      },
    };

    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...editProps} />
      </Router>
    );

    // Form is initialized with initial values
    // product should not be editable when editing an inventory item
    expect(wrapper.find('select#productName').get(0).props.disabled).toEqual(true);
    expect(wrapper.find('select#productName').get(0).props.value).toEqual(
      fixtures.products[0].productName
    );
    expect(wrapper.find('input#quantity').get(0).props.value).toMatchInlineSnapshot(`"78"`);
    expect(wrapper.find('select#deliveryDate').get(0).props.value).toEqual(dayjs('2021-02-02'));
    expect(wrapper.find('select#accountabilityEndDate').get(0).props.value).toEqual(
      dayjs('2022-02-02')
    );
    expect(wrapper.find('select#unicefSection').get(0).props.value).toEqual(
      fixtures.unicefSections[0].value
    );
    expect(wrapper.find('select#donor').get(0).props.value).toEqual(fixtures.donors[0].value);
    expect(wrapper.find('input#poNumber').get(0).props.value).toMatchInlineSnapshot(`"90"`);

    // Make edits
    wrapper.find('select#productName').simulate('change', {
      target: { value: fixtures.products[0].productName },
    });
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: fixtures.unicefSections[1].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: fixtures.donors[1].value },
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
      unicefSection: 'WASH',
      donor: 'NatCom Belgium',
      poNumber: 89,
      servicePointId: '03176924-6b3c-4b74-bccd-32afcceebabd',
      quantity: 10,
      stockId,
    };

    expect(fetch.mock.calls[0]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/${stockId}`,
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
    expect(history.location.pathname).toEqual('/inventory-items-done');
    wrapper.unmount();
  });

  it('handles error when editing item', async () => {
    fetch.mockResponse('Server error here', { status: 500 });
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    const stockId = '69227a92-7979-490c-b149-f28669c6b760';
    const editProps = {
      ...props,
      inventoryID: stockId,
      initialValues: {
        productName: fixtures.products[0].productName,
        quantity: 78,
        deliveryDate: dayjs('2021-02-02'),
        accountabilityEndDate: dayjs('2022-02-02'),
        unicefSection: fixtures.unicefSections[0].value,
        donor: fixtures.donors[0].value,
        poNumber: 90,
      },
    };

    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...editProps} />
      </Router>
    );

    wrapper.find('select#productName').simulate('change', {
      target: { value: fixtures.products[0].productName },
    });
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: fixtures.unicefSections[0].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: fixtures.donors[0].value },
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
      servicePointId: '03176924-6b3c-4b74-bccd-32afcceebabd',
      quantity: 10,
      stockId,
    };

    expect(fetch.mock.calls[0]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/${stockId}`,
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
    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
    wrapper.unmount();
  });

  it('calls API without optional payload fields if fields are empty', async () => {
    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );

    wrapper.find('select#productName').simulate('change', {
      target: { value: fixtures.products[0].productName },
    });
    wrapper.find('input#quantity').simulate('change', { target: { value: '' } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: fixtures.unicefSections[0].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: undefined },
    });
    wrapper.find('input#poNumber').simulate('change', { target: { value: 89 } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    // `quantity` and `donor` should not be in the payload
    const payload = {
      productName: 'Test optional Fields',
      deliveryDate: '2021-02-08',
      accountabilityEndDate: '2021-04-08',
      unicefSection: 'Health',
      poNumber: 89,
      servicePointId: '03176924-6b3c-4b74-bccd-32afcceebabd',
    };

    expect(fetch.mock.calls[0]).toEqual([
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
    wrapper.unmount();
  });

  it('handles non-API error during submission', async () => {
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    jest
      .spyOn(opensrpReactUtils, 'handleSessionOrTokenExpiry')
      .mockImplementation(() => Promise.reject('Error'));
    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );

    wrapper.find('select#productName').simulate('change', {
      target: { value: fixtures.products[0].productName },
    });
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: fixtures.unicefSections[0].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: fixtures.donors[0].value },
    });
    wrapper.find('input#poNumber').simulate('change', { target: { value: 89 } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls).toHaveLength(0);
    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
    wrapper.unmount();
  });

  it('returns user to cancel URL', () => {
    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...props} />
      </Router>
    );

    wrapper.find('button').at(1).simulate('click');
    expect(history.location.pathname).toEqual('/inventory-items');
    wrapper.unmount();
  });

  it('edits an attractive product', async () => {
    const stockId = '69227a92-7979-490c-b149-f28669c6b760';
    const editProps = {
      ...props,
      inventoryID: stockId,
      initialValues: {
        productName: fixtures.product4.productName,
        quantity: 78,
        deliveryDate: dayjs('2021-02-16'),
        accountabilityEndDate: dayjs('2022-02-17'),
        unicefSection: fixtures.unicefSections[0].value,
        donor: fixtures.donors[0].value,
        poNumber: 90,
        serialNumber: '1245',
      },
    };

    const wrapper = mount(
      <Router history={history}>
        <InventoryItemForm {...editProps} />
      </Router>
    );

    // Form is initialized with initial values
    // product should not be editable when editing an inventory item
    expect(wrapper.find('select#productName').get(0).props.disabled).toEqual(true);
    expect(wrapper.find('select#productName').get(0).props.value).toMatch(
      fixtures.product4.productName
    );
    expect(wrapper.find('input#quantity').get(0).props.value).toMatchInlineSnapshot(`"78"`);
    expect(wrapper.find('select#deliveryDate').get(0).props.value).toEqual(dayjs('2021-02-16'));
    expect(wrapper.find('select#accountabilityEndDate').get(0).props.value).toEqual(
      dayjs('2022-02-17')
    );
    expect(wrapper.find('select#unicefSection').get(0).props.value).toEqual(
      fixtures.unicefSections[0].value
    );
    expect(wrapper.find('select#donor').get(0).props.value).toEqual(fixtures.donors[0].value);
    expect(wrapper.find('input#poNumber').get(0).props.value).toMatchInlineSnapshot(`"90"`);
    expect(wrapper.find('input#serialNumber').get(0).props.value).toEqual('1245');

    // It autocalculates accountability end date if delivery date is touched
    const deliveryDate = dayjs('2021-02-14');
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: deliveryDate },
    });

    wrapper.update();
    const expected = dayjs(deliveryDate.format('YYYY-MM-DD')).add(
      fixtures.product4.accountabilityPeriod,
      'months'
    );
    expect(wrapper.find('select#accountabilityEndDate').get(0).props.value).toEqual(expected);

    // Make edits
    wrapper.find('input#quantity').simulate('change', { target: { value: 10 } });
    wrapper.find('select#deliveryDate').simulate('change', {
      target: { value: dayjs('2021-02-08') },
    });
    wrapper.find('select#accountabilityEndDate').simulate('change', {
      target: { value: dayjs('2021-04-08') },
    });
    wrapper.find('select#unicefSection').simulate('change', {
      target: { value: fixtures.unicefSections[1].value },
    });
    wrapper.find('select#donor').simulate('change', {
      target: { value: fixtures.donors[1].value },
    });
    wrapper.find('input#poNumber').simulate('change', { target: { value: 89 } });
    wrapper.find('input#serialNumber').simulate('change', { target: { value: 9999 } });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    const payload = {
      productName: fixtures.product4.productName,
      deliveryDate: '2021-02-08',
      accountabilityEndDate: '2021-04-08',
      unicefSection: 'WASH',
      donor: 'NatCom Belgium',
      poNumber: 89,
      servicePointId: '03176924-6b3c-4b74-bccd-32afcceebabd',
      serialNumber: 9999,
      quantity: 10,
      stockId,
    };

    expect(fetch.mock.calls[0]).toEqual([
      `https://mg-eusm-staging.smartregister.org/opensrp/rest/stockresource/${stockId}`,
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
    expect(history.location.pathname).toEqual('/inventory-items-done');
    wrapper.unmount();
  });
});
