import * as fixtures from '../../forms/UserForm/tests/fixtures';
import { getTableColumns } from '../utils';
/* eslint-disable @typescript-eslint/camelcase */

describe('components/UserList/utils/getTableColumns', () => {
  it('builds table columns correctly', () => {
    const removeUsersMock = jest.fn();
    const isLoadingCallbackMock = jest.fn();
    const keycloakBaseURL =
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
    const fhirBaseURL = 'https://www.fhir.base.url';
    expect(
      getTableColumns(removeUsersMock, keycloakBaseURL, fhirBaseURL, isLoadingCallbackMock, {
        user_id: fixtures.keycloakUser.id,
      })
    ).toMatchSnapshot('table columns');
  });
});
