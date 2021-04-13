/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TableActions } from '..';
import * as fixtures from './fixtures';
import { shallow, mount } from 'enzyme';

describe('components/UserList/TableActions', () => {
  const fetchUsersMock = jest.fn();
  const removeUsersMock = jest.fn();
  const props = {
    record: fixtures.keycloakUser,
    fetchKeycloakUsersCreator: fetchUsersMock,
    removeKeycloakUsersCreator: removeUsersMock,
    isLoadingCallback: jest.fn(),
    accessToken: 'sometoken',
    extraData: { user_id: 'e8b07278-c75b-4dc7-b1f4-bcbf01b7d353' },
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
  };

  it('does not crash', () => {
    shallow(<TableActions {...props} />);
  });

  it('renders correctly', () => {
    const wrapper = mount(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>
    );
    const tableActions = wrapper.find('TableActions');
    expect(tableActions.props()).toEqual(props);
    expect(tableActions.find('Link').props()).toMatchSnapshot('edit');
    expect(tableActions.find('Divider').props()).toMatchSnapshot('divider');
    expect(tableActions.find('Dropdown').props()).toMatchSnapshot('dots menu');
  });

  it('shows delete element if entry is not logged in user', () => {
    props.extraData = {
      user_id: 'e8b07278-c75b-4dc7-b1f4-bcbf01b7d353',
    };
    const wrapper = mount(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>
    );
    const tableActions = wrapper.find('TableActions');
    expect(tableActions.find('Dropdown').prop('overlay')).toMatchSnapshot('dots menu');
  });

  it('hides delete element if entry is logged in user', () => {
    props.extraData = {
      user_id: fixtures.keycloakUser.id,
    };
    const wrapper = mount(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>
    );
    const tableActions = wrapper.find('TableActions');
    expect(tableActions.find('Dropdown').prop('overlay')).toMatchSnapshot('dots menu');
  });
});
