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
import ArchiveOutline from '@2fd/ant-design-icons/lib/ArchiveOutline';
import MapMarkerOutline from '@2fd/ant-design-icons/lib/MapMarkerOutline';
import {
  ENABLE_PLANS,
  ENABLE_INVENTORY,
  ENABLE_LOCATIONS,
  ENABLE_PRODUCT_CATALOGUE,
  ENABLE_TEAMS,
  ENABLE_HEALTHCARE_SERVICES,
  ENABLE_FORM_CONFIGURATION,
  ENABLE_CARD_SUPPORT,
  ENABLE_FHIR_GROUP,
  OPENSRP_ROLES,
  ENABLE_PATIENTS_MODULE,
  ENABLE_FHIR_CARE_TEAM,
  ENABLE_SERVER_SETTINGS,
  ENABLE_QUEST,
  ENABLE_REPORTS,
  ENABLE_TEAMS_ASSIGNMENT_MODULE,
  ENABLE_USER_MANAGEMENT,
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
  URL_DOWNLOAD_DISTRICT_REPORT,
} from './constants';
import { QUEST_VIEW_URL } from '@opensrp/fhir-views';
import type { TFunction } from '@opensrp/i18n';
import { LIST_HEALTHCARE_URL } from '@opensrp/fhir-healthcare-service';
import { LIST_GROUP_URL } from '@opensrp/fhir-group-management';
import { LIST_PATIENTS_URL } from '@opensrp/fhir-client';

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

  const routes: Route[] = [
    {
      otherProps: { icon: <MapMarkerOutline className="sidebar-icons" /> },
      title: t('Plans'),
      key: 'plans',
      enabled:
        ENABLE_PLANS &&
        roles &&
        activeRoles.PLANS &&
        isAuthorized(roles, activeRoles.PLANS.split(',')),
      children: [
        { title: t('Active'), url: ACTIVE_PLANS_LIST_VIEW_URL, key: 'missions-active' },
        { title: t('Draft'), url: DRAFT_PLANS_LIST_VIEW_URL, key: 'missions-draft' },
        { title: t('Complete'), url: COMPLETE_PLANS_LIST_VIEW_URL, key: 'missions-complete' },
        { title: t('Retired'), url: RETIRED_PLANS_LIST_VIEW_URL, key: 'missions-retired' },
      ],
    },
    {
      otherProps: { icon: <IdcardOutlined /> },
      title: t('Card Support'),
      key: 'card-support',
      enabled:
        ENABLE_CARD_SUPPORT &&
        roles &&
        activeRoles.CARD_SUPPORT &&
        isAuthorized(roles, activeRoles.CARD_SUPPORT.split(',')),
      children: [
        {
          title: t('Download Client Data'),
          url: URL_DOWNLOAD_CLIENT_DATA,
          key: 'download-client-data',
        },
      ],
    },
    {
      otherProps: { icon: <ArchiveOutline className="sidebar-icons" /> },
      title: t('Inventory'),
      key: 'inventory',
      enabled:
        ENABLE_INVENTORY &&
        roles &&
        activeRoles.INVENTORY &&
        isAuthorized(roles, activeRoles.INVENTORY.split(',')),
      children: [
        {
          title: t('Service point inventory'),
          url: INVENTORY_SERVICE_POINT_LIST_VIEW,
          key: 'inventory-list',
        },
        {
          title: t('Add inventory via CSV'),
          url: INVENTORY_BULK_UPLOAD_URL,
          key: 'inventory-upload',
        },
      ],
    },
    {
      otherProps: { icon: <DashboardOutlined /> },
      title: t('Administration'),
      key: 'admin',
      enabled: true,
      url: URL_ADMIN,
      children: [
        {
          title: t('User Management'),
          key: 'user-management',
          enabled:
            ENABLE_USER_MANAGEMENT &&
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
          enabled:
            ENABLE_LOCATIONS &&
            roles &&
            activeRoles.LOCATIONS &&
            isAuthorized(roles, activeRoles.LOCATIONS.split(',')),
          children: [
            { title: t('Location Units'), url: URL_LOCATION_UNIT, key: 'location-unit' },
            {
              title: t('Location Unit Group'),
              url: URL_LOCATION_UNIT_GROUP,
              key: 'location-group',
            },
          ],
        },
        {
          title: t('Product Catalogue'),
          key: 'product-catalogue',
          enabled:
            ENABLE_PRODUCT_CATALOGUE &&
            roles &&
            activeRoles.PRODUCT_CATALOGUE &&
            isAuthorized(roles, activeRoles.PRODUCT_CATALOGUE.split(',')),
          url: CATALOGUE_LIST_VIEW_URL,
        },
        {
          title: t('Care Teams Management'),
          key: 'fhir-care-team',
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
          enabled:
            ENABLE_TEAMS &&
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
          title: t('Group management'),
          key: 'fhir-group',
          url: LIST_GROUP_URL,
          enabled:
            ENABLE_FHIR_GROUP &&
            roles &&
            activeRoles.GROUP &&
            isAuthorized(roles, activeRoles.GROUP.split(',')),
        },
        {
          title: t('Questionnaire'),
          key: 'fhir-quest',
          enabled:
            ENABLE_QUEST &&
            roles &&
            activeRoles.QUEST &&
            isAuthorized(roles, activeRoles.QUEST.split(',')),
          url: QUEST_VIEW_URL,
        },
        {
          title: t('Healthcare Services'),
          key: 'healthcare',
          url: LIST_HEALTHCARE_URL,
          enabled:
            ENABLE_HEALTHCARE_SERVICES &&
            roles &&
            activeRoles.HEALTHCARE_SERVICE &&
            isAuthorized(roles, activeRoles.HEALTHCARE_SERVICE.split(',')),
        },
        {
          title: t('Form Configuration'),
          key: 'form-config',
          enabled:
            ENABLE_FORM_CONFIGURATION &&
            roles &&
            activeRoles.FORM_CONFIGURATION &&
            isAuthorized(roles, activeRoles.FORM_CONFIGURATION.split(',')),
          children: [
            {
              title: t('Manifest Releases'),
              key: 'form-config-releases',
              url: URL_MANIFEST_RELEASE_LIST,
            },
            { title: t('Draft Files'), key: 'form-config-draft', url: URL_DRAFT_FILE_LIST },
            {
              title: t('JSON Validators'),
              key: 'form-config-validators',
              url: URL_JSON_VALIDATOR_LIST,
            },
          ],
        },
        {
          title: t('Server Settings'),
          key: 'server-settings',
          enabled:
            ENABLE_SERVER_SETTINGS &&
            roles &&
            activeRoles.SERVER_SETTINGS &&
            isAuthorized(roles, activeRoles.SERVER_SETTINGS.split(',')),
          url: URL_SERVER_SETTINGS,
        },
        {
          title: t('Reports'),
          key: 'reports',
          enabled:
            ENABLE_REPORTS &&
            roles &&
            activeRoles.MANAGE_REPORTS &&
            isAuthorized(roles, activeRoles.MANAGE_REPORTS.split(',')),
          children: [
            {
              title: t('District report'),
              key: 'district-report',
              enabled:
                roles &&
                activeRoles.DISTRICT_REPORT &&
                isAuthorized(roles, activeRoles.DISTRICT_REPORT.split(',')),
              url: URL_DOWNLOAD_DISTRICT_REPORT,
            },
          ],
        },
      ],
    },
    {
      otherProps: { icon: <IdcardOutlined /> },
      title: t('Patients'),
      key: 'fhir-patients',
      enabled: ENABLE_PATIENTS_MODULE,
      url: LIST_PATIENTS_URL,
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
