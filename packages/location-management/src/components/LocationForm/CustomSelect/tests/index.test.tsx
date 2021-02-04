import { mount } from 'enzyme';
import { CustomSelect } from '..';
import React from 'react';
import * as notifications from '@opensrp/notifications';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { Form } from 'antd';

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
    mount(
      <Form>
        <CustomSelect {...props} />
      </Form>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    // error notification is sent
    expect(errorMock).toHaveBeenCalledWith(errorMessage);
  });
});
