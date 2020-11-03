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
    accessToken: 'sometoken',
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
    expect(tableActions.find('Space').props()).toMatchSnapshot('space props');
  });
});
