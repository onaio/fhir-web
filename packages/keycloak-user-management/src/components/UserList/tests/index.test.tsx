/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import fetch from 'jest-fetch-mock';
import * as fixtures from '../../forms/UserForm/tests/fixtures';
import { mount, shallow } from 'enzyme';
import { ConnectedUserList, UserList } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as opensrpStore from '@opensrp/store';
import { Provider } from 'react-redux';
import { KeycloakService } from '@opensrp/keycloak-service';
import * as notifications from '@opensrp/notifications';
import {
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
  fetchKeycloakUsers,
  removeKeycloakUsers,
} from '../../../ducks/user';
import { keycloakUsersArray } from '../../forms/UserForm/tests/fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import { URL_USER } from '../../../constants';
import lang from '../../../lang';

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/store')),
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const history = createBrowserHistory();

const locationProps = {
  history,
  location: {
    hash: '',
    pathname: `${URL_USER}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: {},
    path: `${URL_USER}`,
    url: `${URL_USER}`,
  },
};

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

describe('components/UserList', () => {
  beforeEach(() => {
    fetch.resetMocks();
    opensrpStore.store.dispatch(removeKeycloakUsers());
  });

  beforeAll(() => {
    opensrpStore.store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'simple-token', state: 'abcde' } }
      )
    );
  });

  it('renders users table without crashing', () => {
    shallow(<UserList {...locationProps} />);
  });
  it('works correctly with store', async () => {
    fetch.once(JSON.stringify(fixtures.keycloakUsersArray));
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.find('Table')).toBeTruthy();
    expect(wrapper.text()).toMatchSnapshot('full rendered text');
    wrapper.unmount();
  });

  it('renders user list correctly', async () => {
    fetch.once(JSON.stringify(keycloakUsersArray));
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
        </Router>
      </Provider>
    );
    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // Loader should be hiddern
    expect(toJson(wrapper.find('.ant-spin'))).toBeFalsy();

    const userList = wrapper.find('UserList');
    const headerRow = userList.find('Row').at(0);

    expect(headerRow.find('Col').at(0).text()).toMatchSnapshot('header actions col props');
    expect(headerRow.find('Table').first().text()).toMatchSnapshot('table text');
    wrapper.unmount();
  });

  it('handles user list fetch failure', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
        </Router>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    /**
     * Loader should not be displayed
     * since we've set loading to false
     * on the final block
     */
    expect(toJson(wrapper.find('div.lds-ripple'))).toBeFalsy();
    expect(toJson(wrapper.find('Table'))).toBeFalsy();
    expect(mockNotificationError).toHaveBeenCalledWith(lang.ERROR_OCCURED);
  });

  it('sort works correctly', async () => {
    fetch.once(JSON.stringify(keycloakUsersArray));
    const props = {
      ...locationProps,
      extraData: {
        user_id: fixtures.keycloakUser.id,
      },
      fetchKeycloakUsersCreator: fetchKeycloakUsers,
      removeKeycloakUsersCreator: removeKeycloakUsers,
      serviceClass: KeycloakService,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <ConnectedUserList {...props} />
        </Router>
      </Provider>
    );
    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // Loader should be hidden
    expect(toJson(wrapper.find('.ant-spin'))).toBeFalsy();
    // find table (sorted by default order)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`table rows - default order ${index}`);
    });

    // sort by username
    // click on sort to change the order (ascending)
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // check new sort order by username (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by username - ascending ${index}`);
    });

    // click on sort to change the order (descending)
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // check new sort order by username (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by username - descending ${index}`);
    });

    // cancel sort
    // click on sort to change the order (descending)
    wrapper.find('thead tr th').first().simulate('click');
    wrapper.update();

    // sort by email
    // click on sort to change the order (ascending)
    expect(wrapper.find('thead tr th').at(1).text()).toEqual('Email');
    wrapper.find('thead tr th').at(1).simulate('click');
    wrapper.update();
    // check new sort order by email (ascending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by email - ascending ${index}`);
    });

    // click on sort to change the order (descending)
    wrapper.find('thead tr th').at(1).simulate('click');
    wrapper.update();

    // check new sort order by email (descending)
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`sorted table rows by email - descending ${index}`);
    });
    wrapper.unmount();
  });
});
