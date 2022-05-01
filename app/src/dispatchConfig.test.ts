import './dispatchConfig';
import { getAllConfigs } from '@opensrp/pkg-config';

it('can dispatch configs', () => {
  const configs = getAllConfigs();
  delete configs['i18n'];
  expect(getAllConfigs()).toMatchObject({
    appLoginURL: '/login',
    keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
    languageCode: 'en',
    opensrpBaseURL: 'https://some.opesrp.server/opensrp/rest/',
    projectCode: 'eusm',
  });
});
