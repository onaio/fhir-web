import { mount, shallow } from 'enzyme';
import flushPromises from 'flush-promises';
import React from 'react';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import { UserGroupForm, defaultInitialValues } from '../Form';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('components/forms/UserFroupForm', () => {
  const props = {
    initialValues: defaultInitialValues,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
  };

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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'access token', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(<UserGroupForm {...props} />);
  });

  it('renders correctly', async () => {
    const wrapper = mount(<UserGroupForm {...props} />);
    expect(wrapper.find('Row').at(0).props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('form validation works for required fields', async () => {
    const wrapper = mount(<UserGroupForm {...props} />);

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('FormItemInput').at(0).prop('errors')).toEqual(['Name is required']);

    wrapper.unmount();
  });

  it('adds new user group successfully', async () => {
    const wrapper = mount(<UserGroupForm {...props} />);
    const mockNotificationSuccess = jest.spyOn(notifications, 'sendSuccessNotification');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const nameInput = wrapper.find('input#name');
    nameInput.simulate('change', { target: { name: 'name', value: 'Test' } });
    wrapper.update();

    wrapper.find('form').simulate('submit');
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(mockNotificationSuccess).toHaveBeenCalledWith('User Group created successfully');
    wrapper.unmount();
  });

  it('edits user group', async () => {
    const propEdit = {
      ...props,
      initialValues: fixtures.userGroup,
    };
    const wrapper = mount(<UserGroupForm {...propEdit} />);

    // usergroup name
    await act(async () => {
      const nameInput = wrapper.find('input#name');
      nameInput.simulate('change', { target: { name: 'name', value: 'Test1' } });
    });
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));

    const payload = {
      name: 'Test1',
    };

    expect(fetch.mock.calls[0]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/groups/${fixtures.userGroup.id}`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer access token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    wrapper.unmount();
  });

  it('usergroup is not created if api is down', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    const wrapper = mount(<UserGroupForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // set usersgroup  name
    const nameInput = wrapper.find('input#name');
    nameInput.simulate('change', { target: { name: 'name', value: 'Test' } });

    wrapper.find('form').simulate('submit');
    await act(async () => {
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();
    expect(mockNotificationError).toHaveBeenCalledWith('API is down');
    wrapper.unmount();
  });

  it('usergroup is not edited if api is down', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    const propEdit = {
      ...props,
      initialValues: fixtures.userGroup,
    };
    const wrapper = mount(<UserGroupForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // usergrop name
    const nameInput = wrapper.find('input#name');
    nameInput.simulate('change', { target: { name: 'name', value: 'Test2' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      wrapper.update();
    });
    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();
    expect(mockNotificationError).toHaveBeenCalledWith('API is down');
    wrapper.unmount();
  });

  it('cancel button returns user to groups list view  page', async () => {
    const wrapper = mount(
      <Router history={history}>
        <UserGroupForm {...props} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();
    const button = wrapper.find('button.cancel-group');
    button.simulate('click');
    expect(history.location.pathname).toEqual('/admin/users/groups');
    wrapper.unmount();
  });

  it('render correct user group name in header', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const propEdit = {
      ...props,
      initialValues: fixtures.userGroup,
    };
    const wrapper = mount(<UserGroupForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('.mb-3.header-title').text()).toEqual(
      `Edit User Group | ${fixtures.userGroup.name}`
    );
  });
});
