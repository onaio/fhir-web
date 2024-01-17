import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { filterFalsyRoutes, getRoutes } from '..';
import { DashboardOutlined } from '@ant-design/icons';
import React from 'react';
import { superUserRole } from '@opensrp/react-utils';

jest.mock('../../configs/env');
jest.mock('../../configs/settings');

describe('routes', () => {
  it('Test routes only return enabled values', () => {
    const routes = filterFalsyRoutes(
      [
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
          title: 'Administration',
        },
      ],
      superUserRole
    );

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
        title: 'Administration',
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

    let envModule = require('../../configs/env');
    envModule.ENABLE_FHIR_LOCATIONS = true;
    envModule.ENABLE_FHIR_TEAMS = true;
    envModule.ENABLE_TEAMS_ASSIGNMENT_MODULE = true;
    envModule.ENABLE_FHIR_USER_MANAGEMENT = true;
    envModule.ENABLE_QUEST = true;

    let routes = getRoutes(
      ['ROLE_EDIT_KEYCLOAK_USERS', 'ROLE_VIEW_KEYCLOAK_USERS'],
      (t: string) => t,
      superUserRole
    );
    expect(routes).toMatchObject([
      {
        children: [
          {
            children: [
              {
                key: 'users',
                title: 'Users',
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
            key: 'user-management',
            title: 'User Management',
          },
          {
            children: [
              {
                key: 'location-unit',
                title: 'Location Units',
                url: '/admin/location/unit',
              },
            ],
            enabled: true,
            key: 'location-management',
            title: 'Location Management',
          },
          {
            children: [
              {
                key: 'TEAMS',
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
            key: 'team-management',
            title: 'Team Management',
          },
          { enabled: true, key: 'fhir-quest', title: 'Questionnaire Management', url: '/quest' },
        ],
        enabled: true,
        key: 'admin',
        otherProps: {
          icon: <DashboardOutlined />,
        },
        title: 'Administration',
      },
    ]);
  });

  it('#1135 Enable envs are not coupled', () => {
    store.dispatch(
      authenticateUser(true, {
        email: 'bob@example.com',
        name: 'Bobbie',
        username: 'RobertBaratheon',
      })
    );
    const routes = getRoutes(
      ['ROLE_EDIT_KEYCLOAK_USERS', 'ROLE_VIEW_KEYCLOAK_USERS'],
      (t: string) => t,
      superUserRole
    );
    const parentKeys = routes.flatMap((x) => x.children).map((x) => x.key);
    expect(parentKeys).toContain('team-management');
    expect(parentKeys).toContain('user-management');
    expect(parentKeys).toContain('location-management');
  });
});
