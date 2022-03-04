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
  ENABLE_FHIR_CARE_TEAM,
  ENABLE_SERVER_SETTINGS,
  ENABLE_QUEST,
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
  URL_SERVER_SETTINGS,
  URL_FHIR_CARE_TEAM,
  URL_ADMIN,
} from './constants';
import lang, { TFunction } from './lang';
import { QUEST_VIEW_URL } from '@opensrp/fhir-views';

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
export function getRoutes(roles: string[], t: TFunction): Route[] {
  const activeRoles = OPENSRP_ROLES;
  const langObj = lang(t);

  const routes: Route[] = [
    {
      otherProps: { icon: <MapMarkerOutline className="sidebar-icons" /> },
      title: langObj.MISSIONS,
      key: 'missions',
      enabled:
        ENABLE_PLANS &&
        roles &&
        activeRoles.PLANS &&
        isAuthorized(roles, activeRoles.PLANS.split(',')),
      children: [
        { title: langObj.ACTIVE, url: ACTIVE_PLANS_LIST_VIEW_URL, key: 'missions-active' },
        { title: langObj.DRAFT, url: DRAFT_PLANS_LIST_VIEW_URL, key: 'missions-draft' },
        { title: langObj.COMPLETE, url: COMPLETE_PLANS_LIST_VIEW_URL, key: 'missions-complete' },
        { title: langObj.RETIRED, url: RETIRED_PLANS_LIST_VIEW_URL, key: 'missions-retired' },
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
      title: langObj.INVENTORY,
      key: 'inventory',
      enabled:
        ENABLE_INVENTORY &&
        roles &&
        activeRoles.INVENTORY &&
        isAuthorized(roles, activeRoles.INVENTORY.split(',')),
      children: [
        {
          title: langObj.SERVICE_POINT_INVENTORY,
          url: INVENTORY_SERVICE_POINT_LIST_VIEW,
          key: 'inventory-list',
        },
        {
          title: langObj.ADD_INVENTORY_VIA_CSV,
          url: INVENTORY_BULK_UPLOAD_URL,
          key: 'inventory-upload',
        },
      ],
    },
    {
      otherProps: { icon: <DashboardOutlined /> },
      title: langObj.ADMINISTRATION,
      key: 'administration',
      enabled: true,
      url: URL_ADMIN,
      children: [
        {
          title: langObj.USER_MANAGEMENT,
          key: 'user-management',
          enabled: roles && activeRoles.USERS && isAuthorized(roles, activeRoles.USERS.split(',')),
          children: [
            { title: langObj.USERS, key: 'users', url: URL_USER },
            { title: langObj.USER_GROUPS, key: 'user-groups', url: URL_USER_GROUPS },
            { title: langObj.USER_ROLES, key: 'user-roles', url: URL_USER_ROLES },
          ],
        },
        {
          title: langObj.LOCATION_MANAGEMENT,
          key: 'location-management',
          enabled:
            ENABLE_LOCATIONS &&
            roles &&
            activeRoles.LOCATIONS &&
            isAuthorized(roles, activeRoles.LOCATIONS.split(',')),
          children: [
            { title: langObj.LOCATION_UNITS, url: URL_LOCATION_UNIT, key: 'location-unit' },
            {
              title: langObj.LOCATION_UNIT_GROUP,
              url: URL_LOCATION_UNIT_GROUP,
              key: 'location-group',
            },
          ],
        },
        {
          title: langObj.PRODUCT_CATALOGUE,
          key: 'product-catalogue',
          enabled:
            ENABLE_PRODUCT_CATALOGUE &&
            roles &&
            activeRoles.PRODUCT_CATALOGUE &&
            isAuthorized(roles, activeRoles.PRODUCT_CATALOGUE.split(',')),
          url: CATALOGUE_LIST_VIEW_URL,
        },
        {
          title: langObj.CARE_TEAM,
          key: 'fhir-care-team',
          enabled:
            ENABLE_FHIR_CARE_TEAM &&
            roles &&
            activeRoles.CARE_TEAM &&
            isAuthorized(roles, activeRoles.CARE_TEAM.split(',')),
          url: URL_FHIR_CARE_TEAM,
        },
        {
          title: langObj.TEAM_MANAGEMENT,
          key: 'team-management',
          enabled:
            ENABLE_TEAMS &&
            roles &&
            activeRoles.TEAMS &&
            isAuthorized(roles, activeRoles.TEAMS.split(',')),
          children: [
            { title: langObj.TEAMS, url: URL_TEAMS, key: 'TEAMS' },
            {
              title: langObj.TEAM_ASSIGNMENT,
              url: URL_TEAM_ASSIGNMENT,
              key: 'team-assignment',
              enabled: ENABLE_TEAMS_ASSIGNMENT_MODULE,
            },
          ],
        },
        {
          title: langObj.QUESTIONNAIRE,
          key: 'fhir-quest',
          enabled:
            ENABLE_QUEST &&
            roles &&
            activeRoles.QUEST &&
            isAuthorized(roles, activeRoles.QUEST.split(',')),
          url: QUEST_VIEW_URL,
        },
        {
          title: langObj.FORM_CONFIGURATION,
          key: 'form-config',
          enabled:
            ENABLE_FORM_CONFIGURATION &&
            roles &&
            activeRoles.FORM_CONFIGURATION &&
            isAuthorized(roles, activeRoles.FORM_CONFIGURATION.split(',')),
          children: [
            {
              title: langObj.MANIFEST_RELEASES,
              key: 'form-config-releases',
              url: URL_MANIFEST_RELEASE_LIST,
            },
            { title: langObj.DRAFT_FILES, key: 'form-config-draft', url: URL_DRAFT_FILE_LIST },
            {
              title: langObj.JSON_VALIDATORS,
              key: 'form-config-validators',
              url: URL_JSON_VALIDATOR_LIST,
            },
          ],
        },
        {
          title: langObj.SERVER_SETTINGS,
          key: 'server-settings',
          enabled:
            ENABLE_SERVER_SETTINGS &&
            roles &&
            activeRoles.SERVER_SETTINGS &&
            isAuthorized(roles, activeRoles.SERVER_SETTINGS.split(',')),
          url: URL_SERVER_SETTINGS,
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
