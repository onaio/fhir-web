import { mount } from 'enzyme';
import { ExtraFields } from '..';
import React from 'react';
import * as notifications from '@opensrp/notifications';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { Form } from 'antd';
import flushPromises from 'flush-promises';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('FormComponents/ExtraFields', () => {
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

  it('sends an error notification', async () => {
    const errorMessage = 'coughid';
    fetch.mockReject(new Error(errorMessage));
    const errorMock = jest.spyOn(notifications, 'sendErrorNotification');
    mount(
      <Form>
        <ExtraFields />
      </Form>
    );

    await act(async () => {
      await flushPromises();
    });

    // error notification is sent
    expect(errorMock).toHaveBeenCalledWith(errorMessage);
  });
});
