import * as fixtures from '../../forms/UserForm/tests/fixtures';
import { getTableColumns } from '../utils';
/* eslint-disable @typescript-eslint/camelcase */

describe('components/UserList/utils/getTableColumns', () => {
  it('builds table columns correctly', () => {
    const removeUsersMock = jest.fn();
    const isLoadingCallbackMock = jest.fn();
    const keycloakBaseURL =
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';

    expect(
      getTableColumns(removeUsersMock, keycloakBaseURL, isLoadingCallbackMock, {
        user_id: fixtures.keycloakUser.id,
      })
    ).toMatchSnapshot('table columns');
  });
});
