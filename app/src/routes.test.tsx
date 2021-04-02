import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { filterFalsyRoutes, getRoutes } from './routes';
jest.mock('./configs/env');

describe('routes', () => {
  it('Test routes only return enabled values', () => {
    const routes = filterFalsyRoutes([
      {
        children: [
          { key: 'child-x-a', title: 'a', url: '/child-x/a' },
          { key: 'child-x-t', title: 't', url: '/child-x/t' },
        ],
        key: 'child-x',
        title: 'child-x',
      },
      {
        children: [
          {
            children: [
              { key: 'childs-y', title: 'childs-y', url: '/admin/childs-y' },
              { key: 'childs-y-r', title: 'childs-y', url: '/admin/childs-y/r' },
            ],
            enabled: true,
            key: 'childs-y',
            title: 'childs-y',
          },
          {
            children: [
              { key: 'child-z-u', title: 'child-z-u', url: '/admin/child-z/u' },
              { key: 'child-z-g', title: 'child-z-g', url: '/admin/child-z/g' },
            ],
            enabled: undefined,
            key: 'child-z',
            title: 'child-z',
          },
          {
            enabled: false,
            key: 'child-i',
            title: 'child-i',
            url: '/admin/child-i',
            children: [
              { key: 'child-i-u', enabled: true, title: 'child-i-u', url: '/admin/child-i/u' },
              { key: 'child-i-g', enabled: true, title: 'child-i-g', url: '/admin/child-i/g' },
            ],
          },
        ],
        enabled: true,
        key: 'admin',
        title: 'Admin',
        url: '/admin',
      },
    ]);

    expect(routes).toMatchObject([
      {
        children: [
          { key: 'child-x-a', title: 'a', url: '/child-x/a' },
          { key: 'child-x-t', title: 't', url: '/child-x/t' },
        ],
        key: 'child-x',
        title: 'child-x',
      },
      {
        children: [
          {
            children: [
              { key: 'childs-y', title: 'childs-y', url: '/admin/childs-y' },
              { key: 'childs-y-r', title: 'childs-y', url: '/admin/childs-y/r' },
            ],
            enabled: true,
            key: 'childs-y',
            title: 'childs-y',
          },
        ],
        enabled: true,
        key: 'admin',
        title: 'Admin',
        url: '/admin',
      },
    ]);
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
    envModule.ENABLE_LOCATIONS = true;
    envModule.ENABLE_TEAMS = true;
    envModule.ENABLE_INVENTORY = true;
    envModule.ENABLE_FORM_CONFIGURATION = true;
    envModule.ENABLE_PRODUCT_CATALOGUE = true;
    envModule.ENABLE_PLANS = true;
    envModule.ENABLE_CARD_SUPPORT = true;
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
