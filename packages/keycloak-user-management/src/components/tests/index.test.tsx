import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { waitFor } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import * as keycloakUserDucks from '@opensrp/store';
import * as fixtures from '../../forms/tests/fixtures';
import { mount, shallow } from 'enzyme';
import { ConnectedAdminView, Admin, Props, deleteUser } from '..';
import { Router } from 'react-router';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import store from '../../../../../client/src/store';
import { Provider } from 'react-redux';
import { KeycloakService } from '@opensrp/keycloak-service';
import { fetchKeycloakUsers, removeKeycloakUsers } from '@opensrp/store';

reducerRegistry.register(keycloakUserDucks.reducerName, keycloakUserDucks.reducer);

describe('src/components/Admin', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('renders users table without crashing', () => {
    shallow(<Admin />);
  });
  it('renders Admin table correctly', async () => {
    fetch.once(JSON.stringify([]));
    const wrapper = mount(
      <Router history={history}>
        <Admin />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // breadcrumb
    const breadcrumbWrapper = wrapper.find('HeaderBreadCrumb');
    expect(breadcrumbWrapper).toHaveLength(1);

    // table
    expect(toJson(wrapper.find('Table'))).toHaveLength(2);
    wrapper.unmount();
  });
  it('works correctly with store', async () => {
    fetch.once(JSON.stringify([]));
    store.dispatch(keycloakUserDucks.fetchKeycloakUsers(fixtures.keycloakUsersArray));

    const props = {
      fetchKeycloakUsersCreator: keycloakUserDucks.fetchKeycloakUsers,
      keycloakUsers: fixtures.keycloakUsersArray,
      removeKeycloakUsersCreator: keycloakUserDucks.removeKeycloakUsers,
      serviceClass: KeycloakService,
    };
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedAdminView {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    const connectedProps = wrapper.find('Admin').props();
    expect((connectedProps as Partial<Props>).keycloakUsers).toHaveLength(4);
    wrapper.unmount();
  });
  it('deletUser deletes a user', async () => {
    fetch.once(JSON.stringify([fixtures.keycloakUser]));
    const mockedKeycloakservice = jest.fn().mockImplementation(() => {
      return {
        delete: () => {
          return Promise.resolve({});
        },
      };
    });
    const props = {
      serviceClass: mockedKeycloakservice,
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      accessToken: 'hunter2',
    };
    deleteUser(props, fixtures.keycloakUser.id);
    await waitFor(() => {
      expect(mockedKeycloakservice).toHaveBeenCalled();
    });
    fetch.mockClear();
  });
});
