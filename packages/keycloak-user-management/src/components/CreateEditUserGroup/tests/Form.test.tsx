import { mount, shallow } from 'enzyme';
import flushPromises from 'flush-promises';
import React from 'react';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import * as fixtures from './fixtures';
import {
  userRoles,
  assignedRoles,
  availableRoles,
  effectiveRoles,
} from '../../../ducks/tests/fixtures';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import { UserGroupForm, defaultInitialValues } from '../Form';
import toJson from 'enzyme-to-json';
import lang from '../../../lang';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('components/forms/UserFroupForm', () => {
  const props = {
    initialValues: defaultInitialValues,
    allRoles: userRoles,
    availableRoles,
    assignedRoles,
    effectiveRoles,
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
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    shallow(<UserGroupForm {...props} />);
  });

  it('renders correctly', async () => {
    const wrapper = mount(<UserGroupForm {...props} />);
    expect(wrapper.find('Row').at(0).text()).toMatchSnapshot();
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
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
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
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
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
    wrapper.unmount();
  });

  it('renders transfer component on edit', async () => {
    const propEdit = {
      ...props,
      initialValues: fixtures.userGroup,
    };
    const wrapper = mount(<UserGroupForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(toJson(wrapper.find('Transfer'))).toBeTruthy();
    wrapper.unmount();
  });

  it('Test transfering role from source to target', async () => {
    const propEdit = {
      ...props,
      initialValues: fixtures.userGroup,
    };
    const wrapper = mount(<UserGroupForm {...propEdit} />);

    const transferComponent = wrapper.find('Transfer');
    const transferSource = transferComponent.find('TransferList').at(0);
    const transferTarget = transferComponent.find('TransferList').at(1);

    // check length of source and target choice boxes
    expect(toJson(transferSource.find('.ant-transfer-list-content-item'))).toHaveLength(2);
    expect(toJson(transferTarget.find('.ant-transfer-list-content-item'))).toHaveLength(6);

    // check labels for source transfer box
    expect(transferSource.find('.ant-transfer-list-content-item').at(0).text()).toEqual(
      'EDIT_KEYCLOAK_USERS'
    );
    expect(transferSource.find('.ant-transfer-list-content-item').at(1).text()).toEqual(
      'VIEW_KEYCLOAK_USERS'
    );

    // check labels for target transfer box
    expect(transferTarget.find('.ant-transfer-list-content-item').at(0).text()).toEqual('OPENMRS');
    expect(transferTarget.find('.ant-transfer-list-content-item').at(1).text()).toEqual(
      'ALL_EVENTS'
    );
    expect(transferTarget.find('.ant-transfer-list-content-item').at(2).text()).toEqual(
      'PLANS_FOR_USER'
    );
    expect(transferTarget.find('.ant-transfer-list-content-item').at(3).text()).toEqual(
      'realm-admin'
    );
    expect(transferTarget.find('.ant-transfer-list-content-item').at(4).text()).toEqual(
      'offline_access'
    );
    expect(transferTarget.find('.ant-transfer-list-content-item').at(5).text()).toEqual(
      'uma_authorization'
    );

    // trigger change on source transfer box
    wrapper
      .find('.ant-checkbox-input')
      .at(0)
      .simulate('change', { target: { checked: true } });
    wrapper.update();
    // move role to target transfer box
    expect(toJson(wrapper.find('.ant-transfer-operation button'))).toHaveLength(2);
    wrapper.find('.ant-transfer-operation button').at(0).simulate('click');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    // const source = wrapper.find('Transfer').find('TransferList').at(0);
    // const target = wrapper.find('Transfer').find('TransferList').at(1);

    // confirm that the roles have been transfered to target box
    expect(
      wrapper.find('Transfer').find('TransferList').at(0).find('.ant-transfer-list-content-item')
    ).toHaveLength(0);
    // check length of target choice box
    expect(
      wrapper.find('Transfer').find('TransferList').at(1).find('.ant-transfer-list-content-item')
    ).toHaveLength(8);
    wrapper.unmount();
  });

  it('Test trasnfering role from target to source', async () => {
    const propEdit = {
      ...props,
      initialValues: fixtures.userGroup,
    };
    const wrapper = mount(<UserGroupForm {...propEdit} />);

    const transferComponent = wrapper.find('Transfer');
    const transferSource = transferComponent.find('TransferList').at(0);
    const transferTarget = transferComponent.find('TransferList').at(1);

    // check length of source and target choice boxes
    expect(toJson(transferSource.find('.ant-transfer-list-content-item'))).toHaveLength(2);
    expect(toJson(transferTarget.find('.ant-transfer-list-content-item'))).toHaveLength(6);

    // check labels for source transfer box
    expect(transferSource.find('.ant-transfer-list-content-item').at(0).text()).toEqual(
      'EDIT_KEYCLOAK_USERS'
    );
    expect(transferSource.find('.ant-transfer-list-content-item').at(1).text()).toEqual(
      'VIEW_KEYCLOAK_USERS'
    );

    // check labels for target transfer box
    expect(transferTarget.find('.ant-transfer-list-content-item').at(0).text()).toEqual('OPENMRS');
    expect(transferTarget.find('.ant-transfer-list-content-item').at(1).text()).toEqual(
      'ALL_EVENTS'
    );
    expect(transferTarget.find('.ant-transfer-list-content-item').at(2).text()).toEqual(
      'PLANS_FOR_USER'
    );
    expect(transferTarget.find('.ant-transfer-list-content-item').at(3).text()).toEqual(
      'realm-admin'
    );
    expect(transferTarget.find('.ant-transfer-list-content-item').at(4).text()).toEqual(
      'offline_access'
    );
    expect(transferTarget.find('.ant-transfer-list-content-item').at(5).text()).toEqual(
      'uma_authorization'
    );

    // trigger change on targer transfer box
    wrapper
      .find('.ant-checkbox-input')
      .at(3)
      .simulate('change', { target: { checked: true } });
    wrapper.update();
    // move role to target transfer box
    wrapper.find('.ant-transfer-operation .ant-btn').at(1).simulate('click');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    expect(
      toJson(
        wrapper.find('Transfer').find('TransferList').at(0).find('.ant-transfer-list-content-item')
      )
    ).toHaveLength(2);
    // check length of target choice box
    expect(
      wrapper.find('Transfer').find('TransferList').at(1).find('.ant-transfer-list-content-item')
    ).toHaveLength(6);
    wrapper.unmount();
  });

  it('doesnt show transfer component on new user group creation', async () => {
    const wrapper = mount(<UserGroupForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(toJson(wrapper.find('Transfer'))).toBeFalsy();
    wrapper.unmount();
  });
});
