import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { getRoutes } from './routes';
jest.mock('./configs/env');

describe('routes', () => {
  it('Test routes only return enabled values', () => {
    const routes = getRoutes([]);

    expect(routes).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [],
          "enabled": true,
          "key": "admin",
          "otherProps": Object {
            "icon": <ForwardRef(DashboardOutlined) />,
          },
          "title": "Admin",
          "url": "/admin",
        },
      ]
    `);
  });

  it('Test Enabled Routes', () => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );

    const envModule = require('./configs/env');
    envModule.ENABLE_LOCATIONS = 'true';
    envModule.ENABLE_TEAMS = 'true';
    envModule.ENABLE_INVENTORY = 'true';
    envModule.ENABLE_FORM_CONFIGURATION = 'true';
    envModule.ENABLE_PRODUCT_CATALOGUE = 'true';
    envModule.ENABLE_PLANS = 'true';
    envModule.ENABLE_CARD_SUPPORT = 'true';
    envModule.OPENSRP_ROLES = {
      USERS: 'ROLE_EDIT_KEYCLOAK_USERS',
      PLANS: 'ROLE_VIEW_KEYCLOAK_USERS',
      LOCATIONS: 'ROLE_VIEW_KEYCLOAK_USERS',
      CARD_SUPPORT: 'ROLE_VIEW_KEYCLOAK_USERS',
      INVENTORY: 'ROLE_VIEW_KEYCLOAK_USERS',
      TEAMS: 'ROLE_VIEW_KEYCLOAK_USERS',
      PRODUCT_CATALOGUE: 'ROLE_VIEW_KEYCLOAK_USERS',
      FORM_CONFIGURATION: 'ROLE_VIEW_KEYCLOAK_USERS',
    };
    const routes = getRoutes(['ROLE_EDIT_KEYCLOAK_USERS', 'ROLE_VIEW_KEYCLOAK_USERS']);

    expect(routes).toMatchSnapshot();
  });
});
