import React from 'react';
import { DashboardOutlined, IdcardOutlined } from '@ant-design/icons';
import { INVENTORY_SERVICE_POINT_LIST_VIEW } from '@opensrp/inventory';
import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  TRASH_PLANS_LIST_VIEW_URL,
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
  ENABLE_FORM_CONFIGURATION,
  ENABLE_CARD_SUPPORT,
  OPENSRP_ROLES,
} from './configs/env';
import {
  ACTIVE,
  DRAFT,
  COMPLETE,
  TRASH,
  SERVICE_POINT_INVENTORY,
  USERS,
  USER_MANAGEMENT,
  LOCATION_UNIT,
  LOCATION_UNIT_GROUP,
  PRODUCT_CATALOGUE,
  TEAMS,
  FORM_CONFIGURATION,
  MANIFEST_RELEASES,
  DRAFT_FILES,
  TEAM_ASSIGNMENT,
  JSON_VALIDATORS,
  MISSIONS,
  ADMIN,
  INVENTORY,
  USER_ROLES,
  USER_GROUPS,
} from './lang';

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

// menu items schema
export const getRoutes = (roles: string[]): Route[] => {
  const activeRoles = OPENSRP_ROLES;

  const routes = [
    {
      otherProps: { icon: <MapMarkerOutline className="sidebar-icons" /> },
      title: `${MISSIONS}`,
      key: 'missions',
      enabled:
        ENABLE_PLANS &&
        roles &&
        activeRoles.PLANS &&
        isAuthorized(roles, activeRoles.PLANS.split(',')),
      children: [
        { title: `${ACTIVE}`, url: `${ACTIVE_PLANS_LIST_VIEW_URL}`, key: 'missions-active' },
        { title: `${DRAFT}`, url: `${DRAFT_PLANS_LIST_VIEW_URL}`, key: 'missions-draft' },
        { title: `${COMPLETE}`, url: `${COMPLETE_PLANS_LIST_VIEW_URL}`, key: 'missions-complete' },
        { title: `${TRASH}`, url: `${TRASH_PLANS_LIST_VIEW_URL}`, key: 'missions-trash' },
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
          url: `${URL_DOWNLOAD_CLIENT_DATA}`,
          key: 'download-client-data',
        },
      ],
    },
    {
      otherProps: { icon: <ArchiveOutline className="sidebar-icons" /> },
      title: `${INVENTORY}`,
      key: 'inventory',
      enabled:
        ENABLE_INVENTORY &&
        roles &&
        activeRoles.INVENTORY &&
        isAuthorized(roles, activeRoles.INVENTORY.split(',')),
      children: [
        {
          title: `${SERVICE_POINT_INVENTORY}`,
          url: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
          key: 'inventory-list',
        },
      ],
    },
    {
      otherProps: { icon: <DashboardOutlined /> },
      title: `${ADMIN}`,
      key: 'admin',
      enabled: true,
      url: '/admin',
      children: [
        {
          title: `${USERS}`,
          key: 'users',
          enabled: roles && activeRoles.USERS && isAuthorized(roles, activeRoles.USERS.split(',')),
          children: [
            { title: `${USER_MANAGEMENT}`, key: 'user', url: `${URL_USER}` },
            { title: `${USER_GROUPS}`, key: 'user-groups', url: `${URL_USER_GROUPS}` },
            { title: `${USER_ROLES}`, key: 'user-roles', url: `${URL_USER_ROLES}` },
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
            { title: `${LOCATION_UNIT}`, url: `${URL_LOCATION_UNIT}`, key: 'location-unit' },
            {
              title: `${LOCATION_UNIT_GROUP}`,
              url: `${URL_LOCATION_UNIT_GROUP}`,
              key: 'location-group',
            },
          ],
        },
        {
          title: `${PRODUCT_CATALOGUE}`,
          key: 'product-catalogue',
          enabled:
            ENABLE_PRODUCT_CATALOGUE &&
            roles &&
            activeRoles.PRODUCT_CATALOGUE &&
            isAuthorized(roles, activeRoles.PRODUCT_CATALOGUE.split(',')),
          url: `${CATALOGUE_LIST_VIEW_URL}`,
        },
        {
          title: `${TEAMS}`,
          key: 'teams',
          enabled:
            ENABLE_TEAMS &&
            roles &&
            activeRoles.TEAMS &&
            isAuthorized(roles, activeRoles.TEAMS.split(',')),
          children: [
            { title: `${TEAMS}`, url: `${URL_TEAMS}`, key: 'teams-list' },
            {
              title: `${TEAM_ASSIGNMENT}`,
              url: `${URL_TEAM_ASSIGNMENT}`,
              key: 'team-assignment',
            },
          ],
        },
        {
          title: `${FORM_CONFIGURATION}`,
          key: 'form-config',
          enabled:
            ENABLE_FORM_CONFIGURATION &&
            roles &&
            activeRoles.FORM_CONFIGURATION &&
            isAuthorized(roles, activeRoles.FORM_CONFIGURATION.split(',')),
          children: [
            {
              title: `${MANIFEST_RELEASES}`,
              key: 'form-config-releases',
              url: `${URL_MANIFEST_RELEASE_LIST}`,
            },
            { title: `${DRAFT_FILES}`, key: 'form-config-draft', url: `${URL_DRAFT_FILE_LIST}` },
            {
              title: `${JSON_VALIDATORS}`,
              key: 'form-config-validators',
              url: `${URL_JSON_VALIDATOR_LIST}`,
            },
          ],
        },
      ],
    },
  ];

  function filterfalsy(route: Route[]): Route[] {
    return route
      .filter(
        (e) => !e.hasOwnProperty('enabled') || (e.hasOwnProperty('enabled') && e.enabled === true)
      )
      .map((e) => {
        if (e.children) return { ...e, children: filterfalsy(e.children) };
        else return e;
      });
  }

  return filterfalsy(routes);
};
