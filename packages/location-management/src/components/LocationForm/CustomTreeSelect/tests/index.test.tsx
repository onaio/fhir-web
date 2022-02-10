import { mount } from 'enzyme';
import { CustomTreeSelect } from '..';
import React from 'react';
import * as notifications from '@opensrp/notifications';
import { act } from 'react-dom/test-utils';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { Form } from 'antd';
import { rootLocation, rootLocationHierarchy } from './fixtures';
import { TreeNode } from '../../../../ducks/locationHierarchy/types';

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

    await new Promise((resolve) => setTimeout(resolve, 0));
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
      await new Promise((resolve) => setTimeout(resolve, 0));
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
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    // error notification is sent
    expect(errorMock).toHaveBeenCalledWith(errorMessage);
    errorMock.mockRestore();
  });

  it('disables certain tree nodes', async () => {
    fetch.once(JSON.stringify([rootLocation]));
    fetch.once(JSON.stringify(rootLocationHierarchy));

    const disabledTreeNodesCallback = (node: TreeNode) => {
      // disable root parent node
      return node.model.id === '95310ca2-02df-47ba-80fc-bf31bfaa88d7';
    };

    const wrapper = mount(
      <Form>
        <CustomTreeSelect disabledTreeNodesCallback={disabledTreeNodesCallback} />
      </Form>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.find('Select').props() as any).options).toEqual([
      {
        children: [
          {
            disabled: false,
            key: '421fe9fe-e48f-4052-8491-24d1e548daee',
            title: 'bbb',
            value: '421fe9fe-e48f-4052-8491-24d1e548daee',
          },
          {
            disabled: false,
            key: '0836e054-30b1-4690-985c-b729aa5fcc53',
            title: 'aa',
            value: '0836e054-30b1-4690-985c-b729aa5fcc53',
          },
        ],
        // on parent id is disabled
        disabled: true,
        key: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
        title: 'The Root Location',
        value: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
      },
    ]);
  });
});
