import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import React from 'react';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { UserForm, UserFormProps } from '..';
import {
  keycloakUser,
  defaultInitialValue,
  practitioner1,
  requiredActions,
  userGroup,
  value as FirstUser,
} from './fixtures';
import { act } from 'react-dom/test-utils';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { Router } from 'react-router';
import { Form } from 'antd';
import { URL_USER } from '../../../../constants';

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
  const props: UserFormProps = {
    initialValues: defaultInitialValue,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    opensrpBaseURL: OPENSRP_API_BASE_URL,
    extraData: {},
    userGroups: userGroup,
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

  beforeEach(() => {
    fetch.once(JSON.stringify(requiredActions));
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

    expect(wrapper.find('FormItem').at(0).prop('name')).toEqual('firstName');
    expect(wrapper.find('FormItem').at(1).prop('name')).toEqual('lastName');
    expect(wrapper.find('FormItem').at(2).prop('name')).toEqual('email');
    expect(wrapper.find('FormItem').at(3).prop('name')).toEqual('username');
    expect(wrapper.find('FormItem').at(4).prop('name')).toEqual('enabled');
    expect(wrapper.find('FormItem').at(5).prop('name')).toEqual('userGroup');
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
    expect(wrapper.find('FormItemInput').at(2).prop('errors')).toEqual([]);
    expect(wrapper.find('FormItemInput').at(3).prop('errors')).toEqual(['Username is required']);
    expect(wrapper.find('FormItemInput').at(4).prop('errors')).toEqual([]);
    expect(wrapper.find('FormItemInput').at(5).prop('errors')).toEqual([]);
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
    actionSelect.first().simulate('change', {
      target: { value: ['UPDATE_PASSWORD'] },
    });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls[0]).toMatchObject([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          firstName: 'Test',
          id: '',
          lastName: 'One',
          username: 'TestOne',
          email: 'testone@gmail.com',
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer access token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
  });

  it('edits user', async () => {
    const propEdit = {
      ...props,
      initialValues: keycloakUser,
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

    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({ ...keycloakUser, firstName: 'Test2' }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer access token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
  });

  it('render correct value for enabled when set to true', async () => {
    const wrapper = mount(<UserForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await act(async () => {
      wrapper
        .find('input[name="enabled"]')
        .first()
        .simulate('change', { target: { name: 'enabled', checked: true } });
    });
    wrapper.update();
    wrapper.find('form').simulate('submit');

    await act(async () => {
      wrapper.update();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    expect(formInstance.getFieldsValue().enabled).toEqual(true);
    wrapper.unmount();
  });

  it('render correct value for enabled when set to false', async () => {
    const wrapper = mount(<UserForm {...props} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    await act(async () => {
      wrapper
        .find('input[name="enabled"]')
        .last()
        .simulate('change', { target: { name: 'enabled', checked: false } });
    });
    wrapper.update();
    wrapper.find('form').simulate('submit');

    await act(async () => {
      wrapper.update();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formInstance = (wrapper.find(Form).props() as any).form;

    expect(formInstance.getFieldsValue().enabled).toEqual(false);
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
  });

  it('user is not edited if api is down', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const propEdit = {
      ...props,
      initialValues: keycloakUser,
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
    expect(history.location.pathname).toEqual(URL_USER);
  });

  it('render correct user name in header', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const propEdit = {
      ...props,
      initialValues: keycloakUser,
    };
    const wrapper = mount(<UserForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('.mb-3.header-title').text()).toEqual(
      `Edit User | ${keycloakUser.username}`
    );
  });

  it('show practitioner toggle when editing user and practitioner is null', async () => {
    // practitioner is null
    const propsPractitionerNull = {
      ...props,
      practitioner: undefined,
      initialValues: keycloakUser,
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
    const toggleWrapper = wrapper.find('#practitionerToggle');
    expect(toggleWrapper).toBeTruthy();
    expect(toggleWrapper.at(0).props()).toMatchSnapshot('practitionerToggle');
  });

  it('show practitioner toggle when editing user and practitioner is provided', async () => {
    // practitioner is null
    const propsPractitioner = {
      ...props,
      practitioner: practitioner1,
      initialValues: keycloakUser,
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
    const toggleWrapper = wrapper.find('#practitionerToggle');
    expect(toggleWrapper).toBeTruthy();
    expect(toggleWrapper.at(0).props()).toMatchSnapshot('practitionerToggle');
  });

  it('hides practitioner toggle if user is editing their own profile', async () => {
    const propsOwn = {
      ...props,
      practitioner: undefined,
      initialValues: keycloakUser,
      extraData: { user_id: keycloakUser.id },
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

  it('updates form data when user to edit changes', async () => {
    // start with first user
    const propsFirstUser = {
      ...props,
      initialValues: FirstUser,
    };

    const wrapper = mount(<UserForm {...propsFirstUser} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('input#firstName').props().value).toEqual(FirstUser.firstName);
    expect(wrapper.find('input#email').props().value).toEqual(FirstUser.email);
    expect(wrapper.find('input#username').props().value).toEqual(FirstUser.username);

    // update user
    wrapper.setProps({ initialValues: keycloakUser });
    // re-render
    wrapper.update();

    expect(wrapper.find('input#firstName').props().value).toEqual(keycloakUser.firstName);
    expect(wrapper.find('input#email').props().value).toEqual(keycloakUser.email);
    expect(wrapper.find('input#username').props().value).toEqual(keycloakUser.username);
  });
});
