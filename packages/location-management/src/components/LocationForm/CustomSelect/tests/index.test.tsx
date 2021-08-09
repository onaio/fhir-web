import { mount } from 'enzyme';
import { CustomSelect } from '..';
import React from 'react';
import * as notifications from '@opensrp/notifications';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { Form } from 'antd';
import { locationTags } from '../../tests/fixtures';
import { getLocationTagOptions } from '../../utils';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('FormComponents/CustomSelect', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('exercise default props', async () => {
    mount(
      <Form>
        <CustomSelect />
      </Form>
    );
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
  });

  it('sends an error notification', async () => {
    const errorMessage = 'coughid';
    const props = {
      loadData: () => Promise.reject(new Error(errorMessage)),
    };

    const errorMock = jest.spyOn(notifications, 'sendErrorNotification');
    const wrapper = mount(
      <Form>
        <CustomSelect {...props} />
      </Form>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    // error notification is sent
    expect(errorMock).toHaveBeenCalledWith(errorMessage);
    wrapper.unmount();
  });

  it('filter options works ok', async () => {
    const props = {
      loadData: async (setData) => {
        setData(locationTags);
      },
      getOptions: getLocationTagOptions,
    };

    const wrapper = mount(
      <Form>
        <CustomSelect {...props} id="sample" />
      </Form>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // find antd Select with id 'practitioners' in the 'Form' component
    const Select = wrapper.find('Select');

    // simulate click on select - to show dropdown items
    Select.find('.ant-select-selector').simulate('mousedown');
    wrapper.update();

    // find antd select options
    const selectOptions = wrapper.find('.ant-select-item-option-content');

    // expect all groups options
    expect(selectOptions.map((opt) => opt.text())).toStrictEqual([
      'Sample 2',
      'Sample 3',
      'CHW ',
      'testing',
      'Demo Test',
      'ANC',
      'CHW - PATH',
      'HF- CHW',
      'Nairobi West CHW Team',
      'Madaraka CHW team',
      'Sample test edit 1',
      'Test',
    ]);

    // find search input field
    const inputField = Select.find('input#sample');
    // simulate change (type search phrase)
    inputField.simulate('change', { target: { value: 'samp' } });

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // expect to see only filtered options
    const selectOptions2 = wrapper.find('.ant-select-item-option-content');
    expect(selectOptions2.map((opt) => opt.text())).toStrictEqual([
      'Sample 2',
      'Sample 3',
      'Sample test edit 1',
    ]);
    wrapper.unmount();
  });
});
