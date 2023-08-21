import { DashboardOutlined, IdcardOutlined } from '@ant-design/icons';
import { isAuthorized } from '@opensrp/react-utils';
import {
  ENABLE_HEALTHCARE_SERVICES,
  ENABLE_FHIR_GROUP,
  OPENSRP_ROLES,
  ENABLE_PATIENTS_MODULE,
  ENABLE_FHIR_CARE_TEAM,
  ENABLE_QUEST,
  ENABLE_TEAMS_ASSIGNMENT_MODULE,
  ENABLE_FHIR_COMMODITY,
  ENABLE_FHIR_LOCATIONS,
} from '../configs/env';
import {
  URL_USER,
  URL_LOCATION_UNIT,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAMS,
  URL_TEAM_ASSIGNMENT,
  URL_USER_GROUPS,
  URL_USER_ROLES,
  URL_FHIR_CARE_TEAM,
} from '../constants';
import { QUEST_VIEW_URL } from '@opensrp/fhir-views';
import type { TFunction } from '@opensrp/i18n';
import { LIST_HEALTHCARE_URL } from '@opensrp/fhir-healthcare-service';
import { LIST_COMMODITY_URL, LIST_GROUP_URL } from '@opensrp/fhir-group-management';
import { LIST_PATIENTS_URL } from '@opensrp/fhir-client';
import {
  COMPOSITE_ENABLE_LOCATIONS_MANAGEMENT,
  COMPOSITE_ENABLE_TEAM_MANAGEMENT,
  COMPOSITE_ENABLE_USER_MANAGEMENT,
} from '../configs/settings';
import React from 'react';

/** Interface for menu items */
export interface Route {
  key: string;
  enabled?: boolean;
  url?: string;
  title: string;
  isHomePageLink?: boolean;
  otherProps?: {
    icon?: string | JSX.Element;
  };
  children?: Route[];
}

export interface GetRoutes {
  (roles: string[], t: TFunction): Route[];
}

/** Gets Routes For Application
 *
 * @param roles User's roles
 * @returns {Route[]} returns generated routes
 */
export function getRoutes(roles: string[], t: TFunction): Route[] {
  const activeRoles = OPENSRP_ROLES;

  const routes: Route[] = [
    {
      otherProps: { icon: <DashboardOutlined /> },
      title: t('Administration'),
      key: 'admin',
      enabled: true,
      children: [
        {
          title: t('User Management'),
          key: 'user-management',
          isHomePageLink: true,
          url: URL_USER,
          enabled:
            COMPOSITE_ENABLE_USER_MANAGEMENT &&
            roles &&
            activeRoles.USERS &&
            isAuthorized(roles, activeRoles.USERS.split(',')),
          children: [
            { title: t('Users'), key: 'users', url: URL_USER },
            { title: t('User Groups'), key: 'user-groups', url: URL_USER_GROUPS },
            { title: t('User Roles'), key: 'user-roles', url: URL_USER_ROLES },
          ],
        },
        {
          title: t('Location Management'),
          key: 'location-management',
          isHomePageLink: true,
          url: URL_LOCATION_UNIT,
          enabled:
            COMPOSITE_ENABLE_LOCATIONS_MANAGEMENT &&
            roles &&
            activeRoles.LOCATIONS &&
            isAuthorized(roles, activeRoles.LOCATIONS.split(',')),
          children: [
            { title: t('Location Units'), url: URL_LOCATION_UNIT, key: 'location-unit' },
            {
              enabled: !ENABLE_FHIR_LOCATIONS,
              title: t('Location Unit Group'),
              url: URL_LOCATION_UNIT_GROUP,
              key: 'location-group',
            },
          ],
        },
        {
          title: t('Care Teams Management'),
          key: 'fhir-care-team',
          isHomePageLink: true,
          enabled:
            ENABLE_FHIR_CARE_TEAM &&
            roles &&
            activeRoles.CARE_TEAM &&
            isAuthorized(roles, activeRoles.CARE_TEAM.split(',')),
          url: URL_FHIR_CARE_TEAM,
        },
        {
          title: t('Team Management'),
          key: 'team-management',
          isHomePageLink: true,
          url: URL_TEAMS,
          enabled:
            COMPOSITE_ENABLE_TEAM_MANAGEMENT &&
            roles &&
            activeRoles.TEAMS &&
            isAuthorized(roles, activeRoles.TEAMS.split(',')),
          children: [
            { title: t('Teams'), url: URL_TEAMS, key: 'TEAMS' },
            {
              title: t('Team Assignment'),
              url: URL_TEAM_ASSIGNMENT,
              key: 'team-assignment',
              enabled: ENABLE_TEAMS_ASSIGNMENT_MODULE,
            },
          ],
        },
        {
          title: t('Group Management'),
          key: 'fhir-group',
          url: LIST_GROUP_URL,
          isHomePageLink: true,
          enabled:
            ENABLE_FHIR_GROUP &&
            roles &&
            activeRoles.GROUP &&
            isAuthorized(roles, activeRoles.GROUP.split(',')),
        },
        {
          title: t('Commodity Management'),
          key: 'fhir-commodity',
          isHomePageLink: true,
          url: LIST_COMMODITY_URL,
          enabled:
            ENABLE_FHIR_COMMODITY &&
            roles &&
            activeRoles.COMMODITY &&
            isAuthorized(roles, activeRoles.COMMODITY.split(',')),
        },
        {
          title: t('Questionnaire Management'),
          key: 'fhir-quest',
          enabled:
            ENABLE_QUEST &&
            roles &&
            activeRoles.QUEST &&
            isAuthorized(roles, activeRoles.QUEST.split(',')),
          url: QUEST_VIEW_URL,
          isHomePageLink: true,
        },
        {
          title: t('Healthcare Services'),
          key: 'healthcare',
          isHomePageLink: true,
          url: LIST_HEALTHCARE_URL,
          enabled:
            ENABLE_HEALTHCARE_SERVICES &&
            roles &&
            activeRoles.HEALTHCARE_SERVICE &&
            isAuthorized(roles, activeRoles.HEALTHCARE_SERVICE.split(',')),
        },
      ],
    },
    {
      otherProps: { icon: <IdcardOutlined /> },
      title: t('Patients'),
      key: 'fhir-patients',
      enabled: ENABLE_PATIENTS_MODULE,
      url: LIST_PATIENTS_URL,
      isHomePageLink: true,
    },
  ];

  return filterFalsyRoutes(routes);
}

/** Removes the disabled Routes from
 *
 * @param routes all routes
 * @returns {Route[]} returns only enabled routes
 */
export function filterFalsyRoutes(routes: Route[]): Route[] {
  return routes
    .filter(
      (e) => !e.hasOwnProperty('enabled') || (e.hasOwnProperty('enabled') && e.enabled === true)
    )
    .map((e) => {
      return e.children ? { ...e, children: filterFalsyRoutes(e.children) } : e;
    });
}

export const getRoutesForHomepage: GetRoutes = (roles, t) => {
  const routes = getRoutes(roles, t);
  const homePageRoutes: Route[] = [];

  function extractHomePAgeLink(routes: Route[]) {
    for (const route of routes) {
      if (route.isHomePageLink) {
        homePageRoutes.push(route);
      }
      if (route.children) {
        extractHomePAgeLink(route.children);
      }
    }
  }

  extractHomePAgeLink(routes);
  return homePageRoutes;
};
