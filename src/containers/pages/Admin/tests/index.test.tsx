import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import * as keycloakUserDucks from '../../../../store/ducks/keycloak';
import * as fixtures from '../../../../store/ducks/keycloak/tests/fixtures';
import { before } from 'lodash';
import { mount, shallow } from 'enzyme';
import ConnectedAdminView, { Admin, Props } from '..';
import { Router } from 'react-router';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import store from '../../../../store';
import { Provider } from 'react-redux';
import { KeycloakService } from '../../../../services';

reducerRegistry.register(keycloakUserDucks.reducerName, keycloakUserDucks.default);

jest.mock('../../../../configs/env');

describe('src/containers/pages/Admin', () => {
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
});
