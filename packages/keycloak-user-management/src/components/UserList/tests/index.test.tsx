import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import fetch from 'jest-fetch-mock';
import { history } from '@onaio/connected-reducer-registry';
import * as fixtures from '../../forms/UserForm/tests/fixtures';
import { mount, shallow } from 'enzyme';
import { ConnectedUserList, UserList } from '..';
import { Router } from 'react-router';
import toJson from 'enzyme-to-json';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import * as opensrpStore from '@opensrp/store';
import { Provider } from 'react-redux';
import { KeycloakService } from '@opensrp/keycloak-service';
import {
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
  fetchKeycloakUsers,
  removeKeycloakUsers,
} from '../../../ducks/user';
import { keycloakUsersArray } from '../../forms/UserForm/tests/fixtures';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('@opensrp/store', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/store'),
}));

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

describe('components/UserList', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('renders users table without crashing', () => {
    shallow(<UserList />);
  });

  it('renders user list correctly', async () => {
    fetch.once(JSON.stringify(keycloakUsersArray));
    const wrapper = mount(
      <Router history={history}>
        <UserList />
      </Router>
    );
    // Loader should be displayed
    expect(toJson(wrapper.find('div.lds-ripple'))).toBeTruthy();

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // Loader should be hiddern
    expect(toJson(wrapper.find('div.lds-ripple'))).toBeFalsy();

    const userList = wrapper.find('UserList');

    expect(userList.props()).toMatchSnapshot('user list props');

    const headerRow = userList.find('Row').at(0);
    const tableRow = userList.find('Row').at(1);

    expect(headerRow.find('Col').at(0).props()).toMatchSnapshot('breadcrumb col props');
    expect(headerRow.find('Col').at(1).props()).toMatchSnapshot('header actions col props');
    expect(tableRow.find('Table').at(0).props()).toMatchSnapshot('table props');
    wrapper.unmount();
  });

  it('works correctly with store', async () => {
    fetch.once(JSON.stringify(fixtures.keycloakUsersArray));
    const getAccessTokenMock = jest.spyOn(opensrpStore, 'makeAPIStateSelector');
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

    const props = {
      accessToken: opensrpStore.makeAPIStateSelector()(opensrpStore.store.getState(), {
        accessToken: true,
      }),
      fetchKeycloakUsersCreator: opensrpStore.fetchKeycloakUsers,
      removeKeycloakUsersCreator: opensrpStore.removeKeycloakUsers,
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
    expect(getAccessTokenMock).toHaveBeenCalled();
    expect(wrapper.find('UserList').props()).toMatchSnapshot('user list props');
    wrapper.unmount();
  });
});
