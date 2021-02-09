import { mount } from 'enzyme';
import { CustomTreeSelect } from '..';
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders without crashing', async () => {
    fetch.once(JSON.stringify(undefined));
    fetch.once(JSON.stringify([]));
    mount(
      <Form>
        <CustomTreeSelect />
      </Form>
    );

    await new Promise((resolve) => setImmediate(resolve));
  });

  it('sends an error notification', async () => {
    const errorMessage = 'coughid';
    fetch.mockReject(new Error(errorMessage));
    const errorMock = jest.spyOn(notifications, 'sendErrorNotification');
    const wrapper = mount(
      <Form>
        <CustomTreeSelect />
      </Form>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // error notification is sent
    expect(errorMock).toHaveBeenCalledWith(errorMessage);
    errorMock.mockRestore();
  });

  it('error notification during tree hierarchy call', async () => {
    const errorMessage = 'another coughid';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockLocation = { id: 'sampleID' } as any;
    fetch.once(JSON.stringify([mockLocation]));
    fetch.mockReject(new Error(errorMessage));
    const errorMock = jest.spyOn(notifications, 'sendErrorNotification');
    const wrapper = mount(
      <Form>
        <CustomTreeSelect />
      </Form>
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // error notification is sent
    expect(errorMock).toHaveBeenCalledWith(errorMessage);
    errorMock.mockRestore();
  });
});
