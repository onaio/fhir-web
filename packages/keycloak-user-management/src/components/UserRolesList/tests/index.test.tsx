/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import fetch from 'jest-fetch-mock';
import { authenticateUser } from '@onaio/session-reducer';
import { mount, shallow } from 'enzyme';
import { UserRolesList } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as opensrpStore from '@opensrp/store';
import { Provider } from 'react-redux';
import * as notifications from '@opensrp/notifications';
import {
  reducerName as keycloakUserRolesReducerName,
  reducer as keycloakUserRolesReducer,
  removeKeycloakUserRoles,
} from '../../../ducks/userRoles';
import { userRoles } from '../../../ducks/tests/fixtures';
import { URL_USER_ROLES } from '../../../constants';

import { unorderedUserRoles } from './fixtures';
import { cleanup, render, waitFor, waitForElementToBeRemoved, screen } from '@testing-library/react';

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/store'),
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
    pathname: `${URL_USER_ROLES}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: {},
    path: `${URL_USER_ROLES}`,
    url: `${URL_USER_ROLES}`,
  },
};

reducerRegistry.register(keycloakUserRolesReducerName, keycloakUserRolesReducer);

describe('components/UserRolesList', () => {
  beforeEach(() => {
    fetch.resetMocks();
    opensrpStore.store.dispatch(removeKeycloakUserRoles());
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'simple-token', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    cleanup()
  })

  it('renders users table without crashing', () => {
    shallow(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList
            {...locationProps}
            keycloakBaseURL="https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage"
          />
        </Router>
      </Provider>
    );
  });
  it('works correctly with store', async () => {
    fetch.once(JSON.stringify(userRoles));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    render(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList {...props} />
        </Router>
      </Provider>
    );

    await waitForElementToBeRemoved(document.querySelector(".ant-spin"))

    await waitFor(() => {
      expect(screen.queryByText('User roles')).toBeInTheDocument()
    })

    // snapshot table text.
    const tableRowsText = [...document.querySelectorAll("table tr")].map(tr => tr.textContent)
    expect(tableRowsText).toEqual([
      "NameCompositeDescription",
      "ALL_EVENTSfalseAllows on to Download all Events",
      "EDIT_KEYCLOAK_USERStrueThe role allows one to edit other keycloak users",
      "offline_accessfalse${role_offline-access}",
      "OPENMRSfalseBasic Role for users, To be changed to User Or Provider",
      "PLANS_FOR_USERfalseAllows on to view plans for user",
    ]
    )

  });

  it('handles user role list fetch failure', async () => {
    fetch.mockReject(new Error('API is down'));
    const mockNotificationError = jest.spyOn(notifications, 'sendErrorNotification');
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList {...props} />
        </Router>
      </Provider>
    );

    // Loader should be displayed
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(mockNotificationError).toHaveBeenCalledWith('There was a problem fetching realm roles');
  });

  it('shows table with no data if user roles list from api is empty', async () => {
    fetch.once(JSON.stringify([]));
    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    render(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList {...props} />
        </Router>
      </Provider>
    );

    await waitForElementToBeRemoved(document.querySelector(".ant-spin"))

    await waitFor(() => {
      expect(screen.queryByText('User roles')).toBeInTheDocument()
    })

    // snapshot table text.
    const tableRowsText = [...document.querySelectorAll("table tr")].map(tr => tr.textContent)
    expect(tableRowsText).toEqual([
      "NameCompositeDescription",
      "No data"
    ]
    )
  });

  it('sorts by role name', async () => {
    fetch.once(JSON.stringify(unorderedUserRoles));

    const props = {
      ...locationProps,
      keycloakBaseURL:
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    };
    const wrapper = mount(
      <Provider store={opensrpStore.store}>
        <Router history={history}>
          <UserRolesList {...props} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    // Default order
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('ALL_EVENTS');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'PLANS_FOR_USER'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual(
      'EDIT_KEYCLOAK_USERS'
    );

    // Ascending
    wrapper.find('thead th').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual('ALL_EVENTS');
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'EDIT_KEYCLOAK_USERS'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual(
      'PLANS_FOR_USER'
    );

    //Descending
    wrapper.find('thead th').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(0).text()).toEqual(
      'PLANS_FOR_USER'
    );
    expect(wrapper.find('tbody').find('tr').at(1).find('td').at(0).text()).toEqual(
      'EDIT_KEYCLOAK_USERS'
    );
    expect(wrapper.find('tbody').find('tr').at(2).find('td').at(0).text()).toEqual('ALL_EVENTS');
    wrapper.unmount();
  });
});
