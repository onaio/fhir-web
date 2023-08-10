/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, shallow } from 'enzyme';
import React from 'react';
import { ProductForm } from '..';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';
import { product1 } from '../../../ducks/productCatalogue/tests/fixtures';
import { sendErrorNotification } from '@opensrp/notifications';
import { CATALOGUE_LIST_VIEW_URL } from '../../../constants';
import { product2, product3 } from './fixtures';
import * as opensrpReactUtils from '@opensrp/react-utils';
import flushPromises from 'flush-promises';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('@opensrp/notifications', () => {
  return { sendSuccessNotification: jest.fn(), sendErrorNotification: jest.fn() };
});

jest.mock('@opensrp/react-utils', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/react-utils')),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

jest.setTimeout(10000);

describe('productForm', () => {
  global.URL.revokeObjectURL = jest.fn();
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders without crashing', async () => {
    const wrapper = shallow(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify({ message: 'success' }));
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>,
      { attachTo: div }
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('#productName label').text()).toMatchInlineSnapshot(`"Product name"`);
    expect(wrapper.find('#materialNumber label').text()).toMatchInlineSnapshot(`"Material number"`);
    wrapper.find('#isAttractiveItem label').forEach((radio, index) => {
      expect(radio.text()).toMatchSnapshot(`radio ${index}`);
    });

    expect(wrapper.find('#availability label').text()).toMatchInlineSnapshot(`"Is it there?"`);
    expect(wrapper.find('#condition label').text()).toMatchInlineSnapshot(
      `"Is it in good condition? (optional)"`
    );
    expect(wrapper.find('#appropriateUsage label').text()).toMatchInlineSnapshot(
      `"Is it being used appropriately? (optional)"`
    );
    expect(wrapper.find('#accountabilityPeriod label').text()).toMatchInlineSnapshot(
      `"Accountability period (in months)"`
    );
    expect(wrapper.find('#photoURL label').text()).toMatchInlineSnapshot(
      `"Photo of the product (optional)"`
    );
    expect(wrapper.find('#submit button').text()).toMatchInlineSnapshot(`"Submit"`);
  });

  it('validation works', async () => {
    fetch.once(JSON.stringify({ message: 'success' }));
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>,
      { attachTo: div }
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(
      (wrapper.find('#productName .ant-form-item FormItemInput').props() as any).validateStatus
    ).toEqual('error');
    expect(
      toJson((wrapper.find('#productName .ant-form-item').props() as any).help)
    ).toMatchSnapshot(`"Product name"`);

    expect(
      (wrapper.find('#materialNumber .ant-form-item FormItemInput').props() as any).validateStatus
    ).toEqual('error');
    expect(
      toJson((wrapper.find('#materialNumber .ant-form-item').props() as any).help)
    ).toMatchSnapshot(`material number`);

    expect(
      (wrapper.find('#isAttractiveItem .ant-form-item FormItemInput').props() as any).validateStatus
    ).toEqual('error');
    expect(
      toJson((wrapper.find('#isAttractiveItem .ant-form-item').props() as any).help)
    ).toMatchSnapshot(`isAttractive`);

    expect(
      (wrapper.find('#availability .ant-form-item FormItemInput').props() as any).validateStatus
    ).toEqual('error');
    expect(
      toJson((wrapper.find('#availability .ant-form-item').props() as any).help)
    ).toMatchSnapshot(`availability`);

    expect(
      (wrapper.find('#availability .ant-form-item FormItemInput').props() as any).validateStatus
    ).toEqual('error');
    expect(
      toJson((wrapper.find('#availability .ant-form-item').props() as any).help)
    ).toMatchSnapshot(`availability`);

    expect((wrapper.find('#condition .ant-form-item').props() as any).validateStatus).toEqual(
      undefined
    );
    expect(toJson((wrapper.find('#condition .ant-form-item').props() as any).help)).toMatchSnapshot(
      `condition`
    );

    expect(
      (wrapper.find('#appropriateUsage .ant-form-item').props() as any).validateStatus
    ).toEqual(undefined);
    expect(
      toJson((wrapper.find('#appropriateUsage .ant-form-item').props() as any).help)
    ).toMatchSnapshot(`appropriateUsage`);

    expect(
      (wrapper.find('#accountabilityPeriod .ant-form-item FormItemInput').props() as any)
        .validateStatus
    ).toEqual('error');
    expect(
      toJson((wrapper.find('#accountabilityPeriod .ant-form-item').props() as any).help)
    ).toMatchSnapshot(`accountability period`);

    expect((wrapper.find('#photoURL .ant-form-item').props() as any).validateStatus).toEqual(
      undefined
    );
    expect(toJson((wrapper.find('#photoURL .ant-form-item').props() as any).help)).toMatchSnapshot(
      `"photoURL"`
    );

    // fill form

    wrapper
      .find('input[name="productName"]')
      .simulate('change', { target: { name: 'productName', value: 'MotorCycle' } });

    wrapper
      .find('input[name="materialNumber"]')
      .simulate('change', { target: { name: 'materialNumber', value: 'MK-124' } });

    wrapper
      .find('input[type="radio"]')
      .first()
      .simulate('change', { target: { name: 'isAttractiveItem', checked: true } });

    wrapper
      .find('textarea[name="availability"]')
      .simulate('change', { target: { name: 'availability', value: 'Is available' } });

    wrapper
      .find('input[name="accountabilityPeriod"]')
      .simulate('change', { target: { name: 'accountabilityPeriod', value: '6' } });

    wrapper
      .find('textarea[name="condition"]')
      .simulate('change', { target: { name: 'condition', value: 'MotorCycle' } });

    wrapper
      .find('textarea[name="appropriateUsage"]')
      .simulate('change', { target: { name: 'appropriateUsage', value: 'MotorCycle' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // no errors, form submission completed, location changed to redirect url
    expect((wrapper.find('Router').props() as any).history.location.pathname).toEqual(
      CATALOGUE_LIST_VIEW_URL
    );
  });

  it('new form submission', async () => {
    fetch.once(JSON.stringify({ message: 'success' }));
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>,
      { attachTo: div }
    );

    wrapper
      .find('input[name="productName"]')
      .simulate('change', { target: { name: 'productName', value: 'MotorCycle' } });

    wrapper
      .find('input[name="materialNumber"]')
      .simulate('change', { target: { name: 'materialNumber', value: 'MK-124' } });

    wrapper
      .find('input[type="radio"]')
      .first()
      .simulate('change', { target: { name: 'isAttractiveItem', checked: true } });

    wrapper
      .find('textarea[name="availability"]')
      .simulate('change', { target: { name: 'availability', value: 'Is available' } });

    wrapper
      .find('input[name="accountabilityPeriod"]')
      .simulate('change', { target: { name: 'accountabilityPeriod', value: '6' } });

    wrapper
      .find('textarea[name="condition"]')
      .simulate('change', { target: { name: 'condition', value: 'MotorCycle' } });

    wrapper
      .find('textarea[name="appropriateUsage"]')
      .simulate('change', { target: { name: 'appropriateUsage', value: 'MotorCycle' } });

    const file = new File([new ArrayBuffer(1)], 'file.jpg');
    wrapper.find('input[type="file"]').simulate('change', { target: { files: [file] } });
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const fd = fetch.mock.calls[0][1].body;
    const data = (Object as any).fromEntries(fd);

    // TODO - product photo does not update in setFieldValue call.

    const formFields = {
      productName: 'MotorCycle',
      materialNumber: 'MK-124',
      isAttractiveItem: true,
      condition: 'MotorCycle',
      appropriateUsage: 'MotorCycle',
      accountabilityPeriod: 6,
      availability: 'Is available',
    };
    expect(data).toMatchObject({
      file: expect.any(File),
      productCatalogue: expect.any(File),
    });

    const reader = new FileReader();
    reader.readAsText(data.productCatalogue);

    reader.addEventListener('load', function () {
      try {
        const result = reader.result;
        expect(JSON.parse(result as string)).toEqual(formFields);
      } catch (_) {
        // eslint-disable-next-line no-empty
      }
    });
  });

  it('edit form submission', async () => {
    fetch.once(JSON.stringify({ message: 'success' }));
    const div = document.createElement('div');
    document.body.appendChild(div);

    const props = {
      initialValues: product1,
    };

    const wrapper = mount(
      <MemoryRouter>
        <ProductForm {...props} />
      </MemoryRouter>,
      { attachTo: div }
    );

    // check that it has the initial correct values
    expect(toJson(wrapper.find('input[name="uniqueId"]'))).toMatchSnapshot('uniqueId');
    expect(wrapper.find('input[name="uniqueId"]').props().value).toMatchInlineSnapshot(`"1"`);

    expect(toJson(wrapper.find('input[name="productName"]'))).toMatchSnapshot('productName');
    expect(wrapper.find('input[name="productName"]').props().value).toEqual('Scale');

    expect(toJson(wrapper.find('input[name="materialNumber"]'))).toMatchSnapshot('materialNumber');
    expect(wrapper.find('input[name="materialNumber"]').props().value).toEqual('MT-123');

    expect(toJson(wrapper.find('input[type="radio"]').first())).toMatchSnapshot(
      'isAttractive radio1'
    );
    expect(toJson(wrapper.find('input[type="radio"]').last())).toMatchSnapshot(
      'isAttractive radio2'
    );

    expect(toJson(wrapper.find('textarea[name="availability"]'))).toMatchSnapshot('availability');
    expect(wrapper.find('textarea[name="availability"]').props().value).toEqual('available');

    expect(toJson(wrapper.find('input[name="accountabilityPeriod"]'))).toMatchSnapshot(
      'accountabilityPeriod'
    );
    expect(wrapper.find('input[name="accountabilityPeriod"]').props().value).toEqual('1');

    expect(toJson(wrapper.find('textarea[name="condition"]'))).toMatchSnapshot('condition');
    expect(wrapper.find('textarea[name="condition"]').props().value).toEqual('good condition');

    expect(toJson(wrapper.find('textarea[name="appropriateUsage"]'))).toMatchSnapshot(
      'appropriateUsage'
    );
    expect(wrapper.find('textarea[name="appropriateUsage"]').props().value).toEqual(
      'staff is trained to use it appropriately'
    );

    expect(wrapper.find('input[type="file"]')).toHaveLength(1);
    expect(wrapper.find('.upload-button').text()).toMatchSnapshot('Upload button');

    // change a few fields
    wrapper
      .find('input[name="productName"]')
      .simulate('change', { target: { name: 'productName', value: 'MotorCycle' } });

    wrapper
      .find('input[name="materialNumber"]')
      .simulate('change', { target: { name: 'materialNumber', value: 'MK-124' } });

    wrapper
      .find('input[type="radio"]')
      .first()
      .simulate('change', { target: { name: 'isAttractiveItem', checked: true } });

    wrapper
      .find('textarea[name="availability"]')
      .simulate('change', { target: { name: 'availability', value: 'Is available' } });

    wrapper
      .find('input[name="accountabilityPeriod"]')
      .simulate('change', { target: { name: 'accountabilityPeriod', value: '6' } });

    wrapper
      .find('textarea[name="condition"]')
      .simulate('change', { target: { name: 'condition', value: 'MotorCycle' } });

    wrapper
      .find('textarea[name="appropriateUsage"]')
      .simulate('change', { target: { name: 'appropriateUsage', value: 'MotorCycle' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const fd = fetch.mock.calls[0][1].body;

    const data = (Object as any).fromEntries(fd);

    const formFields = {
      productName: 'MotorCycle',
      materialNumber: 'MK-124',
      isAttractiveItem: true,
      condition: 'MotorCycle',
      appropriateUsage: 'MotorCycle',
      accountabilityPeriod: 6,
      availability: 'Is available',
      serverVersion: 123456,
      uniqueId: 1,
    };

    expect(data).toMatchObject({
      productCatalogue: expect.any(File),
    });

    const reader = new FileReader();
    reader.readAsText(data.productCatalogue);

    reader.addEventListener('load', function () {
      try {
        const result = reader.result;
        expect(JSON.parse(result as string)).toEqual(formFields);
      } catch (_) {
        // eslint-disable-next-line no-empty
      }
    });
  });

  it('Retest form submission formdata append error', async () => {
    // investigating formData.append: argument 2 is not an object error
    fetch.once(JSON.stringify({ message: 'success' }));
    const div = document.createElement('div');
    document.body.appendChild(div);

    const props = {
      initialValues: product2,
    };

    const wrapper = mount(
      <MemoryRouter>
        <ProductForm {...props} />
      </MemoryRouter>,
      { attachTo: div }
    );

    // change is it in good condition
    wrapper
      .find('textarea[name="condition"]')
      .simulate('change', { target: { name: 'condition', value: 'well maintained' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const fd = fetch.mock.calls[0][1].body;

    const data = (Object as any).fromEntries(fd);

    const formFields = {
      accountabilityPeriod: 2,
      appropriateUsage: 'this should be optional',
      availability: 'yeah',
      condition: 'well maintained',
      isAttractiveItem: false,
      materialNumber: 'asd',
      productName: 'Change name',
      uniqueId: 4,
    };

    expect(data).toMatchObject({
      productCatalogue: expect.any(File),
    });

    const reader = new FileReader();
    reader.readAsText(data.productCatalogue);

    reader.addEventListener('load', function () {
      try {
        const result = reader.result;
        expect(JSON.parse(result as string)).toEqual(formFields);
      } catch (_) {
        // eslint-disable-next-line no-empty
      }
    });
  });

  it('errors during edit form submission', async () => {
    const errorMessage = 'network error';
    fetch.mockReject(new Error(errorMessage));
    const div = document.createElement('div');
    document.body.appendChild(div);

    const errorNotificationSMock = jest.fn();
    (sendErrorNotification as jest.Mock).mockImplementation((...args) =>
      errorNotificationSMock(...args)
    );

    const props = {
      initialValues: product1,
    };

    const wrapper = mount(
      <MemoryRouter>
        <ProductForm {...props} />
      </MemoryRouter>,
      { attachTo: div }
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(errorNotificationSMock).toHaveBeenCalledWith('Error', errorMessage);
    (sendErrorNotification as jest.Mock).mockReset();
  });

  it('errors during new form submission', async () => {
    const otherErrorMessage = 'other network error';
    fetch.mockReject(new Error(otherErrorMessage));
    const div = document.createElement('div');
    document.body.appendChild(div);

    const errorNotificationSMock = jest.fn();
    (sendErrorNotification as jest.Mock).mockImplementation((...args) =>
      errorNotificationSMock(...args)
    );

    const wrapper = mount(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>,
      { attachTo: div }
    );

    wrapper
      .find('input[name="productName"]')
      .simulate('change', { target: { name: 'productName', value: 'MotorCycle' } });

    wrapper
      .find('input[name="materialNumber"]')
      .simulate('change', { target: { name: 'materialNumber', value: 'MK-124' } });

    wrapper
      .find('input[type="radio"]')
      .first()
      .simulate('change', { target: { name: 'isAttractiveItem', checked: true } });

    wrapper
      .find('textarea[name="availability"]')
      .simulate('change', { target: { name: 'availability', value: 'Is available' } });

    wrapper
      .find('input[name="accountabilityPeriod"]')
      .simulate('change', { target: { name: 'accountabilityPeriod', value: '6' } });

    wrapper
      .find('textarea[name="condition"]')
      .simulate('change', { target: { name: 'condition', value: 'MotorCycle' } });

    wrapper
      .find('textarea[name="appropriateUsage"]')
      .simulate('change', { target: { name: 'appropriateUsage', value: 'MotorCycle' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(errorNotificationSMock).toHaveBeenCalledWith('Error', otherErrorMessage);
    (sendErrorNotification as jest.Mock).mockReset();
  });

  it('fetches image if photoURL is given', async () => {
    const fetchProtectedImageMock = jest
      .spyOn(opensrpReactUtils, 'fetchProtectedImage')
      .mockImplementation(() => Promise.resolve('hello'));

    const props = {
      initialValues: product3,
    };

    const wrapper = mount(
      <MemoryRouter>
        <ProductForm {...props} />
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetchProtectedImageMock).toHaveBeenCalledWith(
      'https://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/4'
    );
    expect(wrapper.find('img').get(0).props.src).toEqual('hello');
    wrapper.unmount();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('hello');
  });

  it('does not display image if fetch image fails', async () => {
    const fetchProtectedImageMock = jest
      .spyOn(opensrpReactUtils, 'fetchProtectedImage')
      .mockImplementation(() => Promise.resolve(null));

    const props = {
      initialValues: product3,
    };

    const wrapper = mount(
      <MemoryRouter>
        <ProductForm {...props} />
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetchProtectedImageMock).toHaveBeenCalledWith(
      'https://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/4'
    );
    expect(toJson(wrapper.find('img'))).toBeFalsy();

    wrapper.unmount();
  });

  it('display error toast if fetching image fails', async () => {
    const fetchProtectedImageMock = jest
      .spyOn(opensrpReactUtils, 'fetchProtectedImage')
      .mockImplementation(() => Promise.reject('error'));

    const props = {
      initialValues: product3,
    };

    const wrapper = mount(
      <MemoryRouter>
        <ProductForm {...props} />
      </MemoryRouter>
    );

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(fetchProtectedImageMock).toHaveBeenCalledWith(
      'https://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/4'
    );
    expect(toJson(wrapper.find('img'))).toBeFalsy();
    expect(sendErrorNotification).toHaveBeenCalledWith('Image could not be loaded');

    wrapper.unmount();
  });
});
