/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TableActions } from '..';
import * as fixtures from './fixtures';
import { shallow, mount } from 'enzyme';
import { fireEvent, act } from '@testing-library/react';
import * as reactQuery from 'react-query';
import * as utils from '../utils';
import flushPromises from 'flush-promises';

jest.mock('react-query');

describe('components/UserList/TableActions', () => {
  const fetchUsersMock = jest.fn();
  const removeUsersMock = jest.fn();
  const props = {
    record: fixtures.keycloakUser,
    fetchKeycloakUsersCreator: fetchUsersMock,
    removeKeycloakUsersCreator: removeUsersMock,
    accessToken: 'sometoken',
    extraData: { user_id: 'e8b07278-c75b-4dc7-b1f4-bcbf01b7d353' },
    opensrpBaseURL: 'https://test.smartregister.org/opensrp/rest/',
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    setDetailsCallback: jest.fn(),
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

  it('shows delete element if entry is not logged in user', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    props.extraData = {
      user_id: 'e8b07278-c75b-4dc7-b1f4-bcbf01b7d353',
    };
    const queryInvalidatorMock = jest.fn().mockImplementation(() => {
      throw new Error('some error');
    });
    jest.spyOn(reactQuery, 'useQueryClient').mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { invalidateQueries: queryInvalidatorMock } as any;
    });

    const deleteUserSpy = jest.spyOn(utils, 'deleteUser').mockImplementation(async () => {
      return undefined;
    });

    const wrapper = mount(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>,
      { attachTo: div }
    );
    const tableActions = wrapper.find('TableActions');
    expect(tableActions.find('Dropdown').prop('overlay')).toMatchSnapshot('dots menu');

    // target the initial row view details
    const dropdown = document.querySelector('[data-testid="action-dropdown"]');
    fireEvent.click(dropdown);

    wrapper.update();
    const deleteBtn = document.querySelector('[data-testid="delete-user"]');
    fireEvent.click(deleteBtn);

    // confirm
    const yesBtn = document.querySelectorAll('.ant-popover-buttons button')[1];
    expect(yesBtn).toMatchSnapshot('yes button');
    fireEvent.click(yesBtn);

    await act(async () => {
      await flushPromises();
    });

    expect(deleteUserSpy).toHaveBeenCalled();
    expect(queryInvalidatorMock).toHaveBeenCalled();
    deleteUserSpy.mockRestore();
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
