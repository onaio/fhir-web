import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import React from 'react';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { defaultUserFormInitialValues, UserForm } from '..';
import {
  keycloakUser,
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
import { UserFormProps } from '../types';
import { getFormValues, postPutPractitioner } from '../utils';
import { Dictionary } from '@onaio/utils/dist/types/types';

/* eslint-disable @typescript-eslint/naming-convention */

const mockId = '0b3a3311-6f5a-40dd-95e5-008001acebe1';

jest.mock('uuid', () => {
  const actualUUID = jest.requireActual('uuid');
  const mockV4Function = jest.fn().mockImplementation(() => mockId);
  return { __esModule: true, ...actualUUID, v4: mockV4Function };
});

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
    initialValues: defaultUserFormInitialValues,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    baseUrl: OPENSRP_API_BASE_URL,
    extraData: {},
    userGroups: userGroup,
    practitionerUpdaterFactory: postPutPractitioner,
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'access token', state: 'abcde' } }
      )
    );
  });

  beforeEach(() => {
    history.push('/admin/users');
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

    expect(toJson(wrapper.find('#firstName label'))).toMatchSnapshot(`firstName label`);
    expect(toJson(wrapper.find('#firstName input'))).toMatchSnapshot(`firstName input`);
    expect(toJson(wrapper.find('#lastName label'))).toMatchSnapshot(`lastName label`);
    expect(toJson(wrapper.find('#lastName input'))).toMatchSnapshot(`lastName input`);
    expect(toJson(wrapper.find('#email label'))).toMatchSnapshot(`email label`);
    expect(toJson(wrapper.find('#email input'))).toMatchSnapshot(`email input`);
    expect(toJson(wrapper.find('#username label'))).toMatchSnapshot(`username label`);
    expect(toJson(wrapper.find('#username input'))).toMatchSnapshot(`username input`);
    expect(toJson(wrapper.find('#enabled input'))).toMatchSnapshot(`enabled input`);
    expect(toJson(wrapper.find('#practitionerToggle label'))).toMatchSnapshot(
      `practitionerToggle label`
    );
    expect(toJson(wrapper.find('#practitionerToggle input'))).toMatchSnapshot(
      `practitionerToggle input`
    );
    expect(toJson(wrapper.find('#userGroups label'))).toMatchSnapshot(`userGroups label`);
    expect(toJson(wrapper.find('#userGroups input'))).toMatchSnapshot(`userGroups input`);

    // not found, not rendered in props
    expect(toJson(wrapper.find('#contact label'))).toMatchInlineSnapshot(`null`);
    expect(toJson(wrapper.find('#contact input'))).toMatchInlineSnapshot(`null`);
    wrapper.unmount();
  });

  it('hidden fields', async () => {
    const wrapper = mount(
      <UserForm {...{ ...props, renderFields: ['contact'], hiddenFields: ['contact'] }} />
    );

    expect(wrapper.find('FormItemInput#contact').prop('hidden')).toBeTruthy();
    wrapper.unmount();
  });

  it('adds user', async () => {
    const wrapper = mount(<UserForm {...{ ...props, renderFields: ['contact'] }} />);

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

    wrapper
      .find('input#contact')
      .simulate('change', { target: { name: 'contact', value: '0123456789' } });

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(JSON.parse((fetch.mock.calls[0][1] as Dictionary).body)).toEqual({
      firstName: 'Test',
      id: '',
      lastName: 'One',
      username: 'TestOne',
      email: 'testone@gmail.com',
      enabled: true,
      attributes: {
        contact: ['0123456789'],
      },
    });
    expect(fetch.mock.calls[0]).toMatchObject([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: expect.any(String),
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
      initialValues: getFormValues(keycloakUser),
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

    await flushPromises();

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
    fetch.mockReject(new Error('API is down'));
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

    await flushPromises();
    wrapper.update();
    expect(document.getElementsByClassName('ant-notification')).toHaveLength(1);
  });

  it('user is not edited if api is down', async () => {
    fetch.mockReject(new Error('API is down'));
    const propEdit = {
      ...props,
      initialValues: getFormValues(keycloakUser),
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
    await flushPromises();
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

    await flushPromises();
    wrapper.update();
    const button = wrapper.find('button.cancel-user');
    button.simulate('click');
    expect(history.location.pathname).toEqual(URL_USER);
  });

  it('render correct user name in header', async () => {
    fetch.mockReject(new Error('API is down'));
    const propEdit = {
      ...props,
      initialValues: keycloakUser,
    };
    const wrapper = mount(<UserForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('PageHeader').text()).toEqual(`Edit User | ${keycloakUser.username}`);
  });

  it('show practitioner toggle when editing user and practitioner is null', async () => {
    // practitioner is null
    const propsPractitionerNull = {
      ...props,
      practitioner: undefined,
      initialValues: getFormValues(keycloakUser),
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
      initialValues: getFormValues(keycloakUser, practitioner1),
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
      initialValues: getFormValues(keycloakUser),
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
      initialValues: getFormValues(FirstUser),
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

  it('disables and toggles practitioner off when toggling active user off', async () => {
    const propsOwn = {
      ...props,
      practitioner: practitioner1,
      // mount with both user and practitioner enabled
      initialValues: getFormValues(
        { ...keycloakUser, enabled: true },
        { ...practitioner1, active: true }
      ),
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

    // user enabled checkbox
    const userEnabled = wrapper.find('input[name="enabled"]');
    // expect 'yes' and 'no' options
    expect(userEnabled).toHaveLength(2);
    // 'yes' to be checked and 'no' to be unchecked (active user)
    expect(userEnabled.at(0).props().checked).toEqual(true);
    expect(userEnabled.at(1).props().checked).toEqual(false);

    // practitioner active checkbox
    const practitionerActive = wrapper.find('input[name="active"]');
    // 'yes' and 'no' options
    expect(practitionerActive).toHaveLength(2);
    // 'yes' to be checked and 'no' to be unchecked (practitioner active)
    expect(practitionerActive.at(0).props().checked).toEqual(true);
    expect(practitionerActive.at(1).props().checked).toEqual(false);
    // practitioner not disabled
    wrapper.find('Radio[name="active"]').forEach((node) => {
      expect(node.props().disabled).toBe(false);
    });

    // simulate toggle user off
    userEnabled.at(1).simulate('change', { target: { checked: true } });

    // re-select
    const userEnabled2 = wrapper.find('input[name="enabled"]');
    const practitionerActive2 = wrapper.find('input[name="active"]');

    // expect user toggled off
    expect(userEnabled2.at(0).props().checked).toEqual(false);
    expect(userEnabled2.at(1).props().checked).toEqual(true);
    // expect practitioner toggle off and disabled
    expect(practitionerActive2.at(0).props().checked).toEqual(false);
    expect(practitionerActive2.at(1).props().checked).toEqual(true);
    wrapper.find('Radio[name="active"]').forEach((node) => {
      expect(node.props().disabled).toBe(true);
    });
  });
});
