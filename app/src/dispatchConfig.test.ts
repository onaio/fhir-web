import './dispatchConfig';
import { getAllConfigs } from '@opensrp/pkg-config';
import i18n from './mls';

jest.mock('./configs/env');

it('can dispatch configs', () => {
  expect(getAllConfigs()).toMatchObject({
    appLoginURL: '/login',
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    languageCode: 'en',
    opensrpBaseURL: 'https://test.smartregister.org/opensrp/rest/',
    projectCode: 'core',
    i18n,
  });
});
