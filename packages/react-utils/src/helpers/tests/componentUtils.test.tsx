/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from '@opensrp/store';
import * as componentUtils from '../componentUtils';
import { UserList } from '@opensrp/user-management';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Resource404 } from '../../components/Resource404';
import { KEYCLOAK_API_BASE_URL } from '@opensrp/keycloak-service';
import { authenticateUser } from '@onaio/session-reducer';
import flushPromises from 'flush-promises';

const { PublicComponent, PrivateComponent, isAuthorized } = componentUtils;

const realLocation = window.location;

// tslint:disable-next-line: no-var-requires

describe('componentUtils', () => {
  beforeEach(() => {
    window.location = realLocation;
    // Reset history
    history.push('/');
  });

  it('PublicComponent Renders correctly', () => {
    const MockComponent = () => {
      return <Resource404 />;
    };
    const props = { exact: true, path: '/unknown', authenticated: false };
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: `/unknown`, hash: '', search: '', state: {} }]}>
        <PublicComponent {...props} component={MockComponent} />
      </MemoryRouter>
    );

    expect(wrapper.exists(MockComponent)).toBeTruthy();
    wrapper.unmount();
  });

  it('PrivateComponent Renders correctly', async () => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'test@gmail.com',
          name: 'This Name',
          username: 'tHat Part',
        },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const MockComponent = (props: any) => {
      return <UserList {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />;
    };
    const props = {
      exact: true,
      redirectPath: '/login',
      disableLoginProtection: false,
      path: '/admin',
      authenticated: true,
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/admin`, hash: '', search: '', state: {} }]}>
          <PrivateComponent
            {...props}
            component={MockComponent}
            activeRoles={['ROLE_VIEW_KEYCLOAK_USERS']}
          />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();
    // test if isAuthorized is called
    expect(wrapper.exists(MockComponent)).toBeTruthy();
    wrapper.unmount();
  });

  it('should not redirect to unauthorized page if not autenticated', async () => {
    const MockComponent = (props: any) => {
      return <UserList {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />;
    };
    const props = {
      exact: true,
      redirectPath: '/login',
      disableLoginProtection: false,
      path: '/admin',
      authenticated: false,
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/admin`, hash: '', search: '', state: {} }]}>
          <PrivateComponent
            {...props}
            component={MockComponent}
            activeRoles={['ROLE_VIEW_KEYCLOAK_USERS']}
          />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();
    expect(wrapper.exists(MockComponent)).toBeFalsy();
    expect(toJson(wrapper.find('UnauthorizedPage'))).toBeFalsy();
    wrapper.unmount();
  });

  it('Show Unauthorized Page if role doesnt have sufficient permissions', async () => {
    const MockComponent = (props: any) => {
      return <UserList {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />;
    };
    const props = {
      exact: true,
      redirectPath: '/login',
      disableLoginProtection: false,
      path: '/admin',
      authenticated: true,
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/admin`, hash: '', search: '', state: {} }]}>
          <PrivateComponent {...props} component={MockComponent} activeRoles={['unauthorized']} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });
    expect(wrapper.exists(MockComponent)).toBeFalsy();
    // test if UnauthorizedPage is rendered
    expect(wrapper.find('UnauthorizedPage').text()).toMatchInlineSnapshot(
      `"403Sorry, you are not authorized to access this pageGo backGo home"`
    );
    expect(toJson(wrapper.find('UnauthorizedPage'))).toBeTruthy();
    wrapper.unmount();
  });

  it('isAuthorized works correctly', async () => {
    let isUserAuthorized = isAuthorized(
      ['ROLE_VIEW_KEYCLOAK_USERS', 'ROLE_EDIT_KEYCLOAK_USERS'],
      ['ROLE_VIEW_KEYCLOAK_USERS']
    );
    expect(isUserAuthorized).toBeTruthy();
    isUserAuthorized = isAuthorized(
      ['ROLE_VIEW_KEYCLOAK_USERS', 'ROLE_EDIT_KEYCLOAK_USERS'],
      ['unauthorized']
    );
    expect(isUserAuthorized).toBeFalsy();
  });
});
