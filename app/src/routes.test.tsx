import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { filterFalsyRoutes, getRoutes } from './routes';
import React from 'react';
import MapMarkerOutlineIcon from '@opensrp/ant-icons/lib/MapMarkerOutline';
import { DashboardOutlined, IdcardOutlined } from '@ant-design/icons';
import ArchiveOutlineIcon from '@opensrp/ant-icons/lib/ArchiveOutline';
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
    envModule.ENABLE_TEAMS_ASSIGNMENT_MODULE = true;
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
    expect(routes).toMatchObject([
      {
        children: [
          {
            key: 'missions-active',
            title: 'Active',
            url: '/missions/active',
          },
          {
            key: 'missions-draft',
            title: 'Draft',
            url: '/missions/draft',
          },
          {
            key: 'missions-complete',
            title: 'Complete',
            url: '/missions/complete',
          },
          {
            key: 'missions-retired',
            title: 'Retired',
            url: '/missions/retired',
          },
        ],
        enabled: true,
        key: 'missions',
        otherProps: {
          icon: <MapMarkerOutlineIcon className="sidebar-icons" />,
        },
        title: 'Missions',
      },
      {
        children: [
          {
            key: 'download-client-data',
            title: 'Download Client Data',
            url: '/card-support/download-client-data',
          },
        ],
        enabled: true,
        key: 'card-support',
        otherProps: {
          icon: <IdcardOutlined />,
        },
        title: 'Card Support',
      },
      {
        children: [
          {
            key: 'inventory-list',
            title: 'Service point inventory',
            url: '/inventory',
          },
        ],
        enabled: true,
        key: 'inventory',
        otherProps: {
          icon: <ArchiveOutlineIcon className="sidebar-icons" />,
        },
        title: 'Inventory',
      },
      {
        children: [
          {
            children: [
              {
                key: 'user',
                title: 'User Management',
                url: '/admin/users',
              },
              {
                key: 'user-groups',
                title: 'User Groups',
                url: '/admin/users/groups',
              },
              {
                key: 'user-roles',
                title: 'User Roles',
                url: '/admin/users/roles',
              },
            ],
            enabled: true,
            key: 'users',
            title: 'Users',
          },
          {
            children: [
              {
                key: 'location-unit',
                title: 'Location unit',
                url: '/admin/location/unit',
              },
              {
                key: 'location-group',
                title: 'Location unit group',
                url: '/admin/location/group',
              },
            ],
            enabled: true,
            key: 'location',
            title: 'Locations',
          },
          {
            enabled: true,
            key: 'product-catalogue',
            title: 'Product Catalogue',
            url: '/admin/product-catalogue',
          },
          {
            children: [
              {
                key: 'teams-list',
                title: 'Teams',
                url: '/admin/teams',
              },
              {
                enabled: true,
                key: 'team-assignment',
                title: 'Team Assignment',
                url: '/admin/teams/team-assignment',
              },
            ],
            enabled: true,
            key: 'teams',
            title: 'Teams',
          },
          {
            children: [
              {
                key: 'form-config-releases',
                title: 'Manifest Releases',
                url: '/admin/form-config/releases',
              },
              {
                key: 'form-config-draft',
                title: 'Draft Files',
                url: '/admin/form-config/drafts',
              },
              {
                key: 'form-config-validators',
                title: 'JSON Validators',
                url: '/admin/form-config/json-validators',
              },
            ],
            enabled: true,
            key: 'form-config',
            title: 'Form Configuration',
          },
        ],
        enabled: true,
        key: 'admin',
        otherProps: {
          icon: <DashboardOutlined />,
        },
        title: 'Admin',
        url: '/admin',
      },
    ]);
  });
});
