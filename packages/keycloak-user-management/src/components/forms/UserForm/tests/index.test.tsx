import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import React from 'react';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { commonFhirFields, defaultUserFormInitialValues, UserForm } from '..';
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
import { fhirCoreAppIdField, URL_USER } from '../../../../constants';
import { UserFormProps } from '../types';
import { getFormValues, postPutPractitioner } from '../utils';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Dictionary } from '@onaio/utils/dist/types/types';
import { render, waitFor, screen } from '@testing-library/react';

/* eslint-disable @typescript-eslint/naming-convention */

const client = new QueryClient();

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
  const nonFhirFields = commonFhirFields.filter((field) => field !== fhirCoreAppIdField);
  const props: UserFormProps = {
    renderFields: nonFhirFields,
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

  it('renders correctly', async () => {
    const wrapper = mount(
      <QueryClientProvider client={client}>
        <UserForm {...props} />
      </QueryClientProvider>
    );
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

    wrapper.unmount();
  });

  it('form validation works for required fields', async () => {
    const wrapper = mount(
      <QueryClientProvider client={client}>
        <UserForm {...props} />
      </QueryClientProvider>
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('FormItemInput#firstName').prop('errors')).toEqual([
      'First Name is required',
    ]);
    expect(wrapper.find('FormItemInput#lastName').prop('errors')).toEqual([
      'Last Name is required',
    ]);
    expect(wrapper.find('FormItemInput#email').prop('errors')).toEqual([]);
    expect(wrapper.find('FormItemInput#username').prop('errors')).toEqual(['Username is required']);
    expect(wrapper.find('FormItemInput#userGroups').prop('errors')).toEqual([]);
    expect(wrapper.find('FormItemInput#enabled').prop('errors')).toEqual([]);
    wrapper.unmount();
  });

  it('adds user', async () => {
    const wrapper = mount(
      <QueryClientProvider client={client}>
        {' '}
        <UserForm {...{ ...props }} />
      </QueryClientProvider>
    );

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

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

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
    const wrapper = mount(
      <QueryClientProvider client={client}>
        <UserForm {...propEdit} />
      </QueryClientProvider>
    );

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

  it('user is not created if api is down', async () => {
    fetch.mockReject(new Error('API is down'));
    const wrapper = mount(
      <QueryClientProvider client={client}>
        <UserForm {...props} />
      </QueryClientProvider>
    );

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
    const wrapper = mount(
      <QueryClientProvider client={client}>
        <UserForm {...propEdit} />
      </QueryClientProvider>
    );

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
        <QueryClientProvider client={client}>
          <UserForm {...props} />
        </QueryClientProvider>
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
    const wrapper = mount(
      <QueryClientProvider client={client}>
        <UserForm {...propEdit} />
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('RichPageHeader').text()).toEqual(`Edit User | ${keycloakUser.username}`);
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
        <QueryClientProvider client={client}>
          <UserForm {...propsPractitionerNull} />
        </QueryClientProvider>
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
        <QueryClientProvider client={client}>
          <UserForm {...propsPractitioner} />
        </QueryClientProvider>
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
        <QueryClientProvider client={client}>
          <UserForm {...propsOwn} />
        </QueryClientProvider>
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('#practitionerToggle')).toHaveLength(0);
  });

  it('updates form data when user to edit changes', async () => {
    // Start with first user
    const propsFirstUser = {
      ...props,
      initialValues: getFormValues(FirstUser),
    };

    const { rerender } = render(
      <QueryClientProvider client={client}>
        <UserForm {...propsFirstUser} />
      </QueryClientProvider>
    );

    // Wait for initial render and check initial values
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue(FirstUser.firstName);
      expect(screen.getByLabelText(/email/i)).toHaveValue(FirstUser.email);
      expect(screen.getByLabelText(/username/i)).toHaveValue(FirstUser.username);
    });

    // Update props with the new user data and rerender
    const propsUpdatedUser = {
      ...props,
      initialValues: getFormValues(keycloakUser),
    };

    rerender(
      <QueryClientProvider client={client}>
        <UserForm {...propsUpdatedUser} />
      </QueryClientProvider>
    );

    // Wait for the form to update with the new values
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue(keycloakUser.firstName);
      expect(screen.getByLabelText(/email/i)).toHaveValue(keycloakUser.email);
      expect(screen.getByLabelText(/username/i)).toHaveValue(keycloakUser.username);
    });
  });
});
