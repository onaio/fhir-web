import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import React from 'react';
import fetch from 'jest-fetch-mock';
import { UserForm, defaultInitialValues } from '..';
import * as fixtures from '../../../../store/ducks/keycloak/tests/fixtures';
import { act } from 'react-dom/test-utils';
import { KeycloakService } from '../../../../services';

jest.mock('../../../../configs/env');
/*jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  const Select = ({ children, onChange }) => {
    return <select onChange={(e) => onChange(e.target.value)}>{children}</select>;
  };

  const Option = ({ children, ...otherProps }) => {
    return <option {...otherProps}>{children}</option>;
  };

  Select.Option = Option;

  return {
    __esModule: true,
    ...antd,
    Select,
  };
});*/

describe('src/components/UserForm', () => {
  const props = {
    initialValues: defaultInitialValues,
    serviceClass: KeycloakService,
  };
  beforeEach(() => {
    fetch.once(JSON.stringify([fixtures.userActions]));
    fetch.resetMocks();
  });
  it('renders without crashing', () => {
    shallow(<UserForm {...props} />);
  });

  it('renders correctly', () => {
    // looking for each fields
    const wrapper = mount(<UserForm {...props} />);

    // user's first name
    const userInput = wrapper.find('input#firstName');
    expect(userInput).toHaveLength(1);
    expect(toJson(userInput)).toMatchSnapshot('first name input');
    wrapper.unmount();
  });

  it('creates object to send correctly for creating new user', async () => {
    const wrapper = mount(<UserForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // set users's first name
    const nameInput = wrapper.find('input#firstName');
    nameInput.simulate('change', { target: { name: 'firstName', value: 'Test' } });

    // set users last name
    const lastNameInput = wrapper.find('input#lastName');
    lastNameInput.simulate('change', { target: { name: 'lastName', value: 'One' } });

    // set username
    const usernameInput = wrapper.find('input#username');
    usernameInput.simulate('change', { target: { name: 'username', value: 'TestOne' } });

    // set user email
    const emailInput = wrapper.find('input#email');
    emailInput.simulate('change', { target: { name: 'email', value: 'testone@gmail.com' } });

    /*const actionSelect = wrapper.find('select');
    actionSelect.simulate('change', {
      target: { value: ['UPDATE_PASSWORD'] },
    });*/

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('form').simulate('submit');
    await act(async () => {
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();

    const payload = {
      access: {
        manageGroupMembership: false,
        view: false,
        mapRoles: false,
        impersonate: false,
        manage: false,
      },
      disableableCredentialTypes: [],
      email: 'testone@gmail.com',
      emailVerified: false,
      enabled: true,
      firstName: 'Test',
      id: '',
      lastName: 'One',
      notBefore: 0,
      requiredActions: [],
      totp: false,
      username: 'TestOne',
    };

    expect(fetch.mock.calls[1]).toEqual([
      'https://keycloak-test.smartregister.org/auth/realms//users',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
    wrapper.unmount();
  });

  it('creates object to send correctly for editing user', async () => {
    const propEdit = {
      ...props,
      initialValues: fixtures.keycloakUser,
    };
    const wrapper = mount(<UserForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // practitioner's name
    const nameInput = wrapper.find('input#firstName');
    nameInput.simulate('change', { target: { name: 'firstName', value: 'Test2' } });

    expect(toJson(wrapper.find('input#username'))).toMatchSnapshot('readonly username edit');

    wrapper.find('form').simulate('submit');

    await act(async () => {
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));

    const payload = {
      id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      createdTimestamp: 1600156317992,
      username: 'opensrp',
      enabled: true,
      totp: false,
      emailVerified: false,
      firstName: 'Test2',
      lastName: 'kenya',
      email: 'test@onatest.com',
      disableableCredentialTypes: [],
      requiredActions: [],
      notBefore: 0,
      access: {
        manageGroupMembership: true,
        view: true,
        mapRoles: true,
        impersonate: false,
        manage: true,
      },
    };

    expect(fetch.mock.calls[1]).toEqual([
      'https://keycloak-test.smartregister.org/auth/realms//users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    wrapper.unmount();
  });
  it('user is not created if api is down', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const wrapper = mount(<UserForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // set users's first name
    const nameInput = wrapper.find('input#firstName');
    nameInput.simulate('change', { target: { name: 'firstName', value: 'Test' } });

    // set users last name
    const lastNameInput = wrapper.find('input#lastName');
    lastNameInput.simulate('change', { target: { name: 'lastName', value: 'One' } });

    // set username
    const usernameInput = wrapper.find('input#username');
    usernameInput.simulate('change', { target: { name: 'username', value: 'TestOne' } });

    // set user email
    const emailInput = wrapper.find('input#email');
    emailInput.simulate('change', { target: { name: 'email', value: 'testone@gmail.com' } });

    wrapper.find('form').simulate('submit');
    await act(async () => {
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();
    expect(document.getElementsByClassName('ant-notification')).toHaveLength(1);
    wrapper.unmount();
  });
});
