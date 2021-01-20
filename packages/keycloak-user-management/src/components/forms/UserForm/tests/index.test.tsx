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
import { OpenSRPService, OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { Router } from 'react-router';

/* eslint-disable @typescript-eslint/camelcase */

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

describe('components/forms/UserForm', () => {
  const props = {
    initialValues: defaultInitialValues,
    serviceClass: KeycloakService,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    accessToken: 'access token',
    opensrpServiceClass: OpenSRPService,
    opensrpBaseURL: OPENSRP_API_BASE_URL,
    practitioner: null,
    extraData: {},
  };

  beforeEach(() => {
    fetch.once(JSON.stringify(fixtures.userActions));
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('renders without crashing', () => {
    shallow(<UserForm {...props} />);
  });

  it('renders correctly', async () => {
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
          authorization: 'Bearer access token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    expect(wrapper.find('Row').at(0).props()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('form validation works for required fields', async () => {
    const wrapper = mount(<UserForm {...props} />);

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('FormItemInput').at(0).prop('errors')).toEqual(['First Name is required']);
    expect(wrapper.find('FormItemInput').at(1).prop('errors')).toEqual(['Last Name is required']);
    expect(wrapper.find('FormItemInput').at(2).prop('errors')).toEqual(['Email is required']);
    expect(wrapper.find('FormItemInput').at(3).prop('errors')).toEqual(['Username is required']);
    expect(wrapper.find('FormItemInput').at(4).prop('errors')).toEqual([]);

    wrapper.unmount();
  });

  it('adds user', async () => {
    const wrapper = mount(<UserForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

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

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/authentication/required-actions/',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer access token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
    wrapper.unmount();
  });

  it('edits user', async () => {
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
      firstName: 'Test2',
      lastName: 'kenya',
      email: 'test@onatest.com',
      username: 'opensrp',
      requiredActions: [],
    };

    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/authentication/required-actions/',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer access token',
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
          authorization: 'Bearer access token',
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
    const wrapper = mount(
      <Router history={history}>
        <UserForm {...props} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();
    const button = wrapper.find('button.cancel-user');
    button.simulate('click');
    expect(history.location.pathname).toEqual('/admin/users/list');
    wrapper.unmount();
  });

  it('render correct user name in header', async () => {
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

    expect(wrapper.find('.mb-3.header-title').text()).toEqual(
      `Edit User | ${fixtures.keycloakUser.username}`
    );
  });

  it('show practitioner toggle when editing user and practitioner is null', async () => {
    // practitioner is null
    const propsPractitionerNull = {
      ...props,
      practitioner: undefined,
      initialValues: fixtures.keycloakUser,
    };

    const wrapper = mount(
      <Router history={history}>
        <UserForm {...propsPractitionerNull} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('FormItemInput').at(4).prop('id')).toEqual('practitionerToggle');
    expect(wrapper.find('FormItemInput').at(4).props()).toMatchSnapshot('practitionerToggle');
  });

  it('show practitioner toggle when editing user and practitioner is provided', async () => {
    // practitioner is null
    const propsPractitioner = {
      ...props,
      practitioner: fixtures.practitioner1,
      initialValues: fixtures.keycloakUser,
    };

    const wrapper = mount(
      <Router history={history}>
        <UserForm {...propsPractitioner} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('FormItemInput').at(4).prop('id')).toEqual('practitionerToggle');
    expect(wrapper.find('FormItemInput').at(4).props()).toMatchSnapshot('practitionerToggle');
  });

  it('hides practitioner toggle if user is editing their own profile', async () => {
    const propsOwn = {
      ...props,
      practitioner: undefined,
      initialValues: fixtures.keycloakUser,
      extraData: { user_id: fixtures.keycloakUser.id },
    };

    const wrapper = mount(
      <Router history={history}>
        <UserForm {...propsOwn} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('#practitionerToggle')).toHaveLength(0);
  });

  it('hides `requiredActions` field if user is editing their own profile', async () => {
    const propsOwn = {
      ...props,
      initialValues: fixtures.keycloakUser,
      extraData: { user_id: fixtures.keycloakUser.id },
    };

    const wrapper = mount(
      <Router history={history}>
        <UserForm {...propsOwn} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('#requiredActions')).toHaveLength(0);
  });
});
