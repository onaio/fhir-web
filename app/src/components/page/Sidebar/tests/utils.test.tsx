import { getActivePath } from '../utils';
import { Route } from '../../../../routes';
import { ENABLE_FHIR_LOCATIONS } from '../../../../configs/env';
import {
  URL_USER,
  URL_LOCATION_UNIT,
  URL_LOCATION_UNIT_GROUP,
  URL_USER_GROUPS,
  URL_USER_ROLES,
} from '../../../../constants';

describe('getActiveKey', () => {
  const routes: Route[] = [
    {
      title: 'Administration',
      key: 'admin',
      enabled: true,
      children: [
        {
          title: 'User Management',
          key: 'user-management',
          isHomePageLink: true,
          url: URL_USER,

          children: [
            { title: 'Users', key: 'users', url: URL_USER },
            { title: 'User Groups', key: 'user-groups', url: URL_USER_GROUPS },
            { title: 'User Roles', key: 'user-roles', url: URL_USER_ROLES },
          ],
        },
        {
          title: 'Location Management',
          key: 'location-management',
          isHomePageLink: true,
          url: URL_LOCATION_UNIT,

          children: [
            { title: 'Location Units', url: URL_LOCATION_UNIT, key: 'location-unit' },
            {
              enabled: !ENABLE_FHIR_LOCATIONS,
              title: 'Location Unit Group',
              url: URL_LOCATION_UNIT_GROUP,
              key: 'location-group',
            },
          ],
        },
      ],
    },
  ];

  it('returns the correct active key when the path matches exactly', () => {
    const path = URL_USER_GROUPS;
    const { activeKey } = getActivePath(path, routes);
    expect(activeKey).toEqual('user-groups');
  });

  it('returns undefined when the path does not match any route', () => {
    const path = '/undefined-path';
    const { activeKey } = getActivePath(path, routes);
    expect(activeKey).toBeUndefined();
  });
});

describe('getPathKey', () => {
  const routes: Route[] = [
    {
      title: 'Administration',
      key: 'admin',
      enabled: true,
      children: [
        {
          title: 'User Management',
          key: 'user-management',
          isHomePageLink: true,
          url: URL_USER,

          children: [
            { title: 'Users', key: 'users', url: URL_USER },
            { title: 'User Groups', key: 'user-groups', url: URL_USER_GROUPS },
            { title: 'User Roles', key: 'user-roles', url: URL_USER_ROLES },
          ],
        },
        {
          title: 'Location Management',
          key: 'location-management',
          isHomePageLink: true,
          url: URL_LOCATION_UNIT,

          children: [
            { title: 'Location Units', url: URL_LOCATION_UNIT, key: 'location-unit' },
            {
              enabled: !ENABLE_FHIR_LOCATIONS,
              title: 'Location Unit Group',
              url: URL_LOCATION_UNIT_GROUP,
              key: 'location-group',
            },
          ],
        },
      ],
    },
  ];

  it('returns the correct open keys', () => {
    const path = URL_USER_ROLES;
    const { activePaths } = getActivePath(path, routes);
    expect(activePaths).toEqual(['admin', 'user-management']);
  });

  it('returns an empty array if no matching path is found', () => {
    const path = '/invalid';
    const { activePaths } = getActivePath(path, routes);
    expect(activePaths).toEqual([]);
  });
});
