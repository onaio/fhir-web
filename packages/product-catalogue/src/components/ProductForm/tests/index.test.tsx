/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, shallow } from 'enzyme';
import React from 'react';
import { ProductForm } from '..';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';
import { product1 } from '../../../ducks/productCatalogue/tests/fixtures';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('productForm', () => {
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter>
        <ProductForm />
      </MemoryRouter>
    );
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

    expect(wrapper.find('#productName label').text()).toMatchInlineSnapshot(`"Product name"`);
    expect(wrapper.find('#materialNumber label').text()).toMatchInlineSnapshot(`"Material number"`);
    wrapper.find('#isAttractiveItem label').forEach((radio, index) => {
      expect(radio.text()).toMatchSnapshot(`radio ${index}`);
    });

    expect(wrapper.find('#availability label').text()).toMatchInlineSnapshot(`"Is it there?"`);
    expect(wrapper.find('#condition label').text()).toMatchInlineSnapshot(
      `"Is it in good condition?"`
    );
    expect(wrapper.find('#appropriateUsage label').text()).toMatchInlineSnapshot(
      `"Is it being used appropriately?"`
    );
    expect(wrapper.find('#accountabilityPeriod label').text()).toMatchInlineSnapshot(
      `"Accountability period (in months)"`
    );
    expect(wrapper.find('#productPhoto label').text()).toMatchInlineSnapshot(
      `"Photo of the product"`
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
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect((wrapper.find('FormItem#productName').props() as any).validateStatus).toEqual('error');
    expect(toJson((wrapper.find('FormItem#productName').props() as any).help)).toMatchSnapshot(
      `"Product name"`
    );

    expect((wrapper.find('FormItem#materialNumber').props() as any).validateStatus).toEqual(
      'error'
    );
    expect(toJson((wrapper.find('FormItem#materialNumber').props() as any).help)).toMatchSnapshot(
      `material number`
    );

    expect((wrapper.find('FormItem#isAttractiveItem').props() as any).validateStatus).toEqual(
      'error'
    );
    expect(toJson((wrapper.find('FormItem#isAttractiveItem').props() as any).help)).toMatchSnapshot(
      `isAttractive`
    );

    expect((wrapper.find('FormItem#availability').props() as any).validateStatus).toEqual('error');
    expect(toJson((wrapper.find('FormItem#availability').props() as any).help)).toMatchSnapshot(
      `availability`
    );

    expect((wrapper.find('FormItem#availability').props() as any).validateStatus).toEqual('error');
    expect(toJson((wrapper.find('FormItem#availability').props() as any).help)).toMatchSnapshot(
      `availability`
    );

    expect((wrapper.find('FormItem#condition').props() as any).validateStatus).toEqual(undefined);
    expect(toJson((wrapper.find('FormItem#condition').props() as any).help)).toMatchSnapshot(
      `condition`
    );

    expect((wrapper.find('FormItem#appropriateUsage').props() as any).validateStatus).toEqual(
      undefined
    );
    expect(toJson((wrapper.find('FormItem#appropriateUsage').props() as any).help)).toMatchSnapshot(
      `appropriateUsage`
    );

    expect((wrapper.find('FormItem#accountabilityPeriod').props() as any).validateStatus).toEqual(
      'error'
    );
    expect(
      toJson((wrapper.find('FormItem#accountabilityPeriod').props() as any).help)
    ).toMatchSnapshot(`accountability period`);

    expect((wrapper.find('FormItem#productPhoto').props() as any).validateStatus).toEqual(
      undefined
    );
    expect(toJson((wrapper.find('FormItem#productPhoto').props() as any).help)).toMatchSnapshot(
      `"productPhoto"`
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
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    // check again for errors

    expect((wrapper.find('FormItem#productName').props() as any).validateStatus).toEqual(undefined);

    expect((wrapper.find('FormItem#materialNumber').props() as any).validateStatus).toEqual(
      undefined
    );

    expect((wrapper.find('FormItem#isAttractiveItem').props() as any).validateStatus).toEqual(
      undefined
    );

    expect((wrapper.find('FormItem#availability').props() as any).validateStatus).toEqual(
      undefined
    );

    expect((wrapper.find('FormItem#availability').props() as any).validateStatus).toEqual(
      undefined
    );

    expect((wrapper.find('FormItem#condition').props() as any).validateStatus).toEqual(undefined);

    expect((wrapper.find('FormItem#appropriateUsage').props() as any).validateStatus).toEqual(
      undefined
    );

    expect((wrapper.find('FormItem#accountabilityPeriod').props() as any).validateStatus).toEqual(
      undefined
    );

    expect((wrapper.find('FormItem#productPhoto').props() as any).validateStatus).toEqual(
      undefined
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

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    const fd = fetch.mock.calls[0][1].body;

    const data = (Object as any).fromEntries(fd);

    expect(data).toEqual({
      productName: 'MotorCycle',
      materialNumber: 'MK-124',
      isAttractiveItem: 'true',
      condition: 'MotorCycle',
      appropriateUsage: 'MotorCycle',
      accountabilityPeriod: '6',
      availability: 'Is available',
      productPhoto: '',
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
    expect(wrapper.find('input[name="uniqueId"]').props().value).toEqual(1);

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
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    const fd = fetch.mock.calls[0][1].body;

    const data = (Object as any).fromEntries(fd);

    expect(data).toEqual({
      productName: 'MotorCycle',
      materialNumber: 'MK-124',
      isAttractiveItem: 'true',
      condition: 'MotorCycle',
      appropriateUsage: 'MotorCycle',
      accountabilityPeriod: '6',
      availability: 'Is available',
      productPhoto: '',
    });
  });
});
