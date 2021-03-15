import './dispatchConfig';
import { getAllConfigs } from '@opensrp/pkg-config';

jest.mock('./configs/env');

it('can dispatch configs', () => {
  expect(getAllConfigs()).toEqual({
    appLoginURL: '/login',
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    languageCode: 'en',
    opensrpBaseURL: 'https://test.smartregister.org/opensrp/rest/',
    projectLanguageCode: 'eusm',
  });
});
