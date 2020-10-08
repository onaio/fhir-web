import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import React from 'react';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import { UserForm, defaultInitialValues } from '..';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';
import { KeycloakService } from '@opensrp/keycloak-service';

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  /* eslint-disable react/prop-types */
  const Select = ({ children, onChange }) => {
    return <select onChange={(e) => onChange(e.target.value)}>{children}</select>;
  };

  const Option = ({ children, ...otherProps }) => {
    return <option {...otherProps}>{children}</option>;
  };
  /* eslint-disable react/prop-types */

  Select.Option = Option;

  return {
    __esModule: true,
    ...antd,
    Select,
  };
});

describe('src/components/UserForm', () => {
  const props = {
    initialValues: defaultInitialValues,
    serviceClass: KeycloakService,
    accessToken: 'hunter 2',
  };
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('renders without crashing', () => {
    shallow(<UserForm {...props} />);
  });

  it('renders correctly', async () => {
    // looking for each fields
    fetch.once(JSON.stringify(fixtures.userActions));
    const wrapper = mount(<UserForm {...props} />);
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/authentication/required-actions/',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter 2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    const form = wrapper.find('div.form-container');
    expect(form.find('Formik').prop('initialValues')).toMatchSnapshot('Initial Values');
    expect(form.find('Formik').prop('validationSchema')).toMatchSnapshot('Validation Schema');
    expect(form.find('FormItem').at(0).props()).toMatchSnapshot('First Name');
    expect(form.find('FormItem').at(1).props()).toMatchSnapshot('Last Name');
    expect(form.find('FormItem').at(2).props()).toMatchSnapshot('Username');
    expect(form.find('FormItem').at(3).props()).toMatchSnapshot('Email');
    expect(form.find('FormItem').at(4).props()).toMatchSnapshot('User Actions');
    expect(form.find('FormItem').at(5).props()).toMatchSnapshot('Submit');
    wrapper.unmount();
  });
  it('form validation works', async () => {
    const wrapper = mount(<UserForm {...props} />);
    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();

    expect(wrapper.find('small.name-error').text()).toEqual('Required');
  });

  it('creates object to send correctly for creating new user', async () => {
    fetch.once(JSON.stringify(fixtures.userActions));
    const wrapper = mount(<UserForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // set users's first name

    await act(async () => {
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

      const actionSelect = wrapper.find('select');
      actionSelect.simulate('change', {
        target: { value: ['UPDATE_PASSWORD'] },
      });
      wrapper.find('form').simulate('submit');
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();

    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/authentication/required-actions/',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter 2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    wrapper.unmount();
  });

  it('creates object to send correctly for editing user', async () => {
    // fetch.once(JSON.stringify(fixtures.userActions));
    fetch.once(JSON.stringify([fixtures.keycloakUser]));
    const propEdit = {
      ...props,
      initialValues: fixtures.keycloakUser,
    };
    const wrapper = mount(<UserForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // user's name
    await act(async () => {
      const nameInput = wrapper.find('input#firstName');
      nameInput.simulate('change', { target: { name: 'firstName', value: 'Test2' } });
    });
    wrapper.update();
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
    // expect(fetch.mock.calls).toEqual('');
    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/authentication/required-actions/',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter 2',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(fetch.mock.calls[1]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(payload),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hunter 2',
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
  it('user is not edited if api is down', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const propEdit = {
      ...props,
      initialValues: fixtures.keycloakUser,
    };
    const wrapper = mount(<UserForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // user's name
    const nameInput = wrapper.find('input#firstName');
    nameInput.simulate('change', { target: { name: 'firstName', value: 'Test22' } });

    expect(toJson(wrapper.find('input#username'))).toMatchSnapshot('readonly username edit');

    wrapper.find('form').simulate('submit');

    await act(async () => {
      wrapper.update();
    });
    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();
    expect(document.getElementsByClassName('ant-notification')).toHaveLength(1);
    wrapper.unmount();
  });
  it('cancel button returns user to admin page', async () => {
    const wrapper = mount(<UserForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();
    const button = wrapper.find('button.cancel-user');
    button.simulate('click');
    expect(history.location.pathname).toEqual('/admin');
    wrapper.unmount();
  });
});
