import React from 'react';
import { DashboardOutlined, IdcardOutlined } from '@ant-design/icons';
import { INVENTORY_BULK_UPLOAD_URL, INVENTORY_SERVICE_POINT_LIST_VIEW } from '@opensrp/inventory';
import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  RETIRED_PLANS_LIST_VIEW_URL,
} from '@opensrp/plans';
import { isAuthorized } from '@opensrp/react-utils';
import { CATALOGUE_LIST_VIEW_URL } from '@opensrp/product-catalogue';
import ArchiveOutline from '@opensrp/ant-icons/lib/ArchiveOutline';
import MapMarkerOutline from '@opensrp/ant-icons/lib/MapMarkerOutline';
import {
  ENABLE_PLANS,
  ENABLE_INVENTORY,
  ENABLE_LOCATIONS,
  ENABLE_PRODUCT_CATALOGUE,
  ENABLE_TEAMS,
  ENABLE_TEAMS_ASSIGNMENT_MODULE,
  ENABLE_FORM_CONFIGURATION,
  ENABLE_CARD_SUPPORT,
  OPENSRP_ROLES,
} from './configs/env';

import {
  URL_USER,
  URL_LOCATION_UNIT,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAMS,
  URL_MANIFEST_RELEASE_LIST,
  URL_DRAFT_FILE_LIST,
  URL_TEAM_ASSIGNMENT,
  URL_JSON_VALIDATOR_LIST,
  URL_DOWNLOAD_CLIENT_DATA,
  URL_USER_GROUPS,
  URL_USER_ROLES,
} from './constants';
import lang from './lang';

/** Interface for menu items */
export interface Route {
  key: string;
  enabled?: boolean;
  url?: string;
  title: string;
  otherProps?: {
    icon?: string | JSX.Element;
  };
  children?: Route[];
}

/** Gets Routes For Application
 *
 * @param roles User's roles
 * @returns {Route[]} returns generated routes
 */
export function getRoutes(roles: string[]): Route[] {
  const activeRoles = OPENSRP_ROLES;

  const routes: Route[] = [
    {
      otherProps: { icon: <MapMarkerOutline className="sidebar-icons" /> },
      title: lang.MISSIONS,
      key: 'missions',
      enabled:
        ENABLE_PLANS &&
        roles &&
        activeRoles.PLANS &&
        isAuthorized(roles, activeRoles.PLANS.split(',')),
      children: [
        { title: lang.ACTIVE, url: ACTIVE_PLANS_LIST_VIEW_URL, key: 'missions-active' },
        { title: lang.DRAFT, url: DRAFT_PLANS_LIST_VIEW_URL, key: 'missions-draft' },
        { title: lang.COMPLETE, url: COMPLETE_PLANS_LIST_VIEW_URL, key: 'missions-complete' },
        { title: lang.RETIRED, url: RETIRED_PLANS_LIST_VIEW_URL, key: 'missions-retired' },
      ],
    },
    {
      otherProps: { icon: <IdcardOutlined /> },
      title: 'Card Support',
      key: 'card-support',
      enabled:
        ENABLE_CARD_SUPPORT &&
        roles &&
        activeRoles.CARD_SUPPORT &&
        isAuthorized(roles, activeRoles.CARD_SUPPORT.split(',')),
      children: [
        {
          title: 'Download Client Data',
          url: URL_DOWNLOAD_CLIENT_DATA,
          key: 'download-client-data',
        },
      ],
    },
    {
      otherProps: { icon: <ArchiveOutline className="sidebar-icons" /> },
      title: lang.INVENTORY,
      key: 'inventory',
      enabled:
        ENABLE_INVENTORY &&
        roles &&
        activeRoles.INVENTORY &&
        isAuthorized(roles, activeRoles.INVENTORY.split(',')),
      children: [
        {
          title: lang.SERVICE_POINT_INVENTORY,
          url: INVENTORY_SERVICE_POINT_LIST_VIEW,
          key: 'inventory-list',
        },
        {
          title: lang.ADD_INVENTORY_VIA_CSV,
          url: INVENTORY_BULK_UPLOAD_URL,
          key: 'inventory-upload',
        },
      ],
    },
    {
      otherProps: { icon: <DashboardOutlined /> },
      title: lang.ADMIN,
      key: 'admin',
      enabled: true,
      url: '/admin',
      children: [
        {
          title: lang.USERS,
          key: 'users',
          enabled: roles && activeRoles.USERS && isAuthorized(roles, activeRoles.USERS.split(',')),
          children: [
            { title: lang.USER_MANAGEMENT, key: 'user', url: URL_USER },
            { title: lang.USER_GROUPS, key: 'user-groups', url: URL_USER_GROUPS },
            { title: lang.USER_ROLES, key: 'user-roles', url: URL_USER_ROLES },
          ],
        },
        {
          title: 'Locations',
          key: 'location',
          enabled:
            ENABLE_LOCATIONS &&
            roles &&
            activeRoles.LOCATIONS &&
            isAuthorized(roles, activeRoles.LOCATIONS.split(',')),
          children: [
            { title: lang.LOCATION_UNIT, url: URL_LOCATION_UNIT, key: 'location-unit' },
            {
              title: lang.LOCATION_UNIT_GROUP,
              url: URL_LOCATION_UNIT_GROUP,
              key: 'location-group',
            },
          ],
        },
        {
          title: lang.PRODUCT_CATALOGUE,
          key: 'product-catalogue',
          enabled:
            ENABLE_PRODUCT_CATALOGUE &&
            roles &&
            activeRoles.PRODUCT_CATALOGUE &&
            isAuthorized(roles, activeRoles.PRODUCT_CATALOGUE.split(',')),
          url: CATALOGUE_LIST_VIEW_URL,
        },
        {
          title: lang.TEAMS,
          key: 'teams',
          enabled:
            ENABLE_TEAMS &&
            roles &&
            activeRoles.TEAMS &&
            isAuthorized(roles, activeRoles.TEAMS.split(',')),
          children: [
            { title: lang.TEAMS, url: URL_TEAMS, key: 'teams-list' },
            {
              title: lang.TEAM_ASSIGNMENT,
              url: URL_TEAM_ASSIGNMENT,
              key: 'team-assignment',
              enabled: ENABLE_TEAMS_ASSIGNMENT_MODULE,
            },
          ],
        },
        {
          title: lang.FORM_CONFIGURATION,
          key: 'form-config',
          enabled:
            ENABLE_FORM_CONFIGURATION &&
            roles &&
            activeRoles.FORM_CONFIGURATION &&
            isAuthorized(roles, activeRoles.FORM_CONFIGURATION.split(',')),
          children: [
            {
              title: lang.MANIFEST_RELEASES,
              key: 'form-config-releases',
              url: URL_MANIFEST_RELEASE_LIST,
            },
            { title: lang.DRAFT_FILES, key: 'form-config-draft', url: URL_DRAFT_FILE_LIST },
            {
              title: lang.JSON_VALIDATORS,
              key: 'form-config-validators',
              url: URL_JSON_VALIDATOR_LIST,
            },
          ],
        },
      ],
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
