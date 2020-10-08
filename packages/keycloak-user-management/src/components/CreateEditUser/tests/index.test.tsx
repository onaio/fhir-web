import reducerRegistry from '@onaio/redux-reducer-registry';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';
import fetch from 'jest-fetch-mock';
import * as keycloakUserDucks from '@opensrp/store';
import * as fixtures from '../../../forms/tests/fixtures';
import { CreateEditUsers, EditUserProps, ConnectedCreateEditUsers } from '..';
import flushPromises from 'flush-promises';
import { KeycloakService } from '@opensrp/keycloak-service';
import { fetchKeycloakUsers } from '@opensrp/store';

reducerRegistry.register(keycloakUserDucks.reducerName, keycloakUserDucks.reducer);

describe('components/CreateEditUser', () => {
  const props = {
    history,
    keycloakUser: fixtures.keycloakUser,
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    serviceClass: KeycloakService,
    fetchKeycloakUsersCreator: fetchKeycloakUsers,
    accessToken: 'access token',
    location: {
      hash: '',
      pathname: '/somewhere',
      search: '',
      state: '',
    },
    match: {
      isExact: true,
      params: { userId: fixtures.keycloakUser.id },
      path: `/users/edit/:id`,
      url: `/users/edit/${fixtures.keycloakUser.id}`,
    },
  };

  beforeEach(() => {
    fetch.resetMocks();
    store.dispatch(keycloakUserDucks.removeKeycloakUsers());
  });

  it('renders CreateEditUsersView without crashing', () => {
    fetch.once(JSON.stringify([]));

    act(() => {
      shallow(
        <Router history={history}>
          <CreateEditUsers {...props} />
        </Router>
      );
    });
  });

  it('renders CreateEditUser view correctly', async () => {
    fetch.once(JSON.stringify([]));
    store.dispatch(keycloakUserDucks.fetchKeycloakUsers([fixtures.keycloakUser]));

    const wrapper = mount(
      <Router history={history}>
        <CreateEditUsers {...props} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // look for crucial components or pages that should be displayed

    // expect a form
    expect(wrapper.find('form')).toHaveLength(1);

    // breadcrumb
    const breadcrumbWrapper = wrapper.find('HeaderBreadCrumb');
    expect(breadcrumbWrapper).toHaveLength(1);

    // and the form?
    const form = wrapper.find('UserForm');
    expect(form).toHaveLength(1);

    wrapper.unmount();
  });

  it('Calls the correct endpoints', async () => {
    const mockRead = jest.fn().mockImplementation(async () => fixtures.keycloakUser);
    const serviceMock = jest.fn().mockImplementation(() => {
      return {
        read: mockRead,
      };
    });
    // loads a single user,
    store.dispatch(keycloakUserDucks.fetchKeycloakUsers([fixtures.keycloakUser]));
    const mock = jest.fn();
    const customProps = {
      ...props,
      accessToken: 'hunter 2',
      history,
      location: mock,
      match: {
        isExact: true,
        params: { userId: fixtures.keycloakUser.id },
        path: `/user/edit/:id`,
        url: `/user/edit/${fixtures.keycloakUser.id}`,
      },
      keycloakUser: fixtures.keycloakUser,
      serviceClass: serviceMock,
    };
    const wrapper = mount(
      <Router history={history}>
        <CreateEditUsers {...customProps} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(serviceMock).toHaveBeenCalled();
    expect(serviceMock).toHaveBeenCalledWith(
      'hunter 2',
      '/users',
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage'
    );
  });

  it('works correctly with the store', async () => {
    // check after connection if props are as they should be
    fetch.once(JSON.stringify([]));
    store.dispatch(keycloakUserDucks.fetchKeycloakUsers([fixtures.keycloakUser]));
    const mock = jest.fn();
    const props = {
      history,
      location: mock,
      match: {
        isExact: true,
        params: { userId: fixtures.keycloakUser.id },
        path: `/user/edit/:id`,
        url: `/user/edit/${fixtures.keycloakUser.id}`,
      },
      keycloakUser: fixtures.keycloakUser,
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUsers {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const connectedProps = wrapper.find('CreateEditUsers').props();
    expect((connectedProps as Partial<EditUserProps>).keycloakUser).toEqual(fixtures.keycloakUser);
  });
});

describe('src/containers/Admin/createEditview.createUserView', () => {
  it('renders page correctly on create new user view', async () => {
    // see it renders form when user is null
    const mock = jest.fn();
    const props = {
      history,
      location: mock,
      match: {
        isExact: true,
        params: {},
        path: `/user/new`,
        url: `/user/new`,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedCreateEditUsers {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // look for crucial components or pages that should be displayed

    // expect a form
    expect(wrapper.find('form')).toHaveLength(1);

    // breadcrumb
    const breadcrumbWrapper = wrapper.find('HeaderBreadCrumb');
    expect(breadcrumbWrapper).toHaveLength(1);

    // and the form?
    const form = wrapper.find('UserForm');
    expect(form).toHaveLength(1);

    wrapper.unmount();
  });
});
