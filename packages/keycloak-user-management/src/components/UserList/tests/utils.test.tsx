import * as fixtures from '../../../forms/tests/fixtures';
import { getDataFilters, getTableColumns } from '../utils';

describe('components/UserList/utils/getDataFilters', () => {
  it('gets data for the filter menu', () => {
    expect(getDataFilters(fixtures.keycloakUsersArray, 'username')).toEqual([
      {
        text: 'mwalimu',
        value: 'mwalimu',
      },
      {
        text: 'ona',
        value: 'ona',
      },
      {
        text: 'ona-admin',
        value: 'ona-admin',
      },
      {
        text: 'opensrp',
        value: 'opensrp',
      },
    ]);
  });

  it('builds table columns correctly', () => {
    const fetcUsersMock = jest.fn();
    const removeUsersMock = jest.fn();
    const accessToken = 'sometoken';
    const keycloakBaseURL =
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';

    expect(
      getTableColumns(
        [fixtures.keycloakUsersArray[0], fixtures.keycloakUsersArray[1]],
        fetcUsersMock,
        removeUsersMock,
        accessToken,
        keycloakBaseURL
      )
    ).toMatchSnapshot('table columns');
  });
});
