import React from 'react';
import { DashboardOutlined, IdcardOutlined } from '@ant-design/icons';
import { Dictionary } from '@onaio/utils';
import { INVENTORY_SERVICE_POINT_LIST_VIEW } from '@opensrp/inventory/dist/types';
import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  TRASH_PLANS_LIST_VIEW_URL,
} from '@opensrp/plans/dist/types';
import { CATALOGUE_LIST_VIEW_URL } from '@opensrp/product-catalogue/dist/types';
import { MenuItems } from '.';
import {
  ENABLE_PLANS,
  ENABLE_INVENTORY,
  ENABLE_LOCATIONS,
  ENABLE_PRODUCT_CATALOGUE,
  ENABLE_TEAMS,
  ENABLE_FORM_CONFIGURATION,
  ENABLE_CARD_SUPPORT,
} from '../../../configs/env';
import {
  ACTIVE,
  DRAFT,
  COMPLETE,
  TRASH,
  SERVICE_POINT_INVENTORY,
  USERS,
  USER_MANAGEMENT,
  URL_USER,
  LOCATIONS_UNIT,
  URL_LOCATION_UNIT,
  LOCATIONS_UNIT_GROUP,
  URL_LOCATION_UNIT_GROUP,
  PRODUCT_CATALOGUE,
  URL_ADMIN,
  TEAMS,
  URL_TEAMS,
  FORM_CONFIGURATION,
  MANIFEST_RELEASES,
  URL_MANIFEST_RELEASE_LIST,
  DRAFT_FILES,
  URL_DRAFT_FILE_LIST,
  JSON_VALIDATORS,
  URL_JSON_VALIDATOR_LIST,
  URL_DOWNLOAD_CLIENT_DATA,
  MISSIONS,
  ADMIN,
  INVENTORY,
} from '../../../constants';

// menu items schema
export const menusSchema = (roles: Dictionary): MenuItems[] => [
  {
    otherProps: { icon: <DashboardOutlined />, title: `${MISSIONS}` },
    key: 'missions',
    enabled: ENABLE_PLANS,
    children: [
      {
        otherProps: { title: `${ACTIVE}` },
        url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
        key: 'missions-active',
        children: [],
      },
      {
        otherProps: { title: `${DRAFT}` },
        url: `${DRAFT_PLANS_LIST_VIEW_URL}`,
        key: 'missions-draft',
        children: [],
      },
      {
        otherProps: { title: `${COMPLETE}` },
        url: `${COMPLETE_PLANS_LIST_VIEW_URL}`,
        key: 'missions-complete',
        children: [],
      },
      {
        otherProps: { title: `${TRASH}` },
        url: `${TRASH_PLANS_LIST_VIEW_URL}`,
        key: 'missions-trash',
        children: [],
      },
    ],
  },
  {
    otherProps: { icon: <DashboardOutlined />, title: `${INVENTORY}` },
    key: 'inventory',
    enabled: ENABLE_INVENTORY,
    children: [
      {
        otherProps: { title: `${SERVICE_POINT_INVENTORY}` },
        url: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
        key: 'inventory-list',
        children: [],
      },
    ],
  },
  {
    otherProps: { icon: <DashboardOutlined />, title: `${ADMIN}` },
    key: 'admin',
    enabled: true,
    url: '/admin',
    children: [
      {
        otherProps: { title: `${USERS}` },
        key: 'users',
        enabled: roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS'),
        children: [
          {
            otherProps: { icon: '', title: `${USER_MANAGEMENT}` },
            key: 'user-management',
            url: `${URL_USER}`,
            children: [],
          },
        ],
      },
      {
        otherProps: { icon: '', title: 'Locations' },
        key: 'location',
        enabled: ENABLE_LOCATIONS,
        children: [
          {
            otherProps: { icon: '', title: `${LOCATIONS_UNIT}` },
            url: `${URL_LOCATION_UNIT}`,
            key: 'location-unit',
            children: [],
          },
          {
            otherProps: { icon: '', title: `${LOCATIONS_UNIT_GROUP}` },
            url: `${URL_LOCATION_UNIT_GROUP}`,
            key: 'location-group',
            children: [],
          },
        ],
      },
      {
        otherProps: { icon: '', title: `${PRODUCT_CATALOGUE}` },
        key: 'product-catalogue',
        enabled: ENABLE_PRODUCT_CATALOGUE,
        url: `${URL_ADMIN}${CATALOGUE_LIST_VIEW_URL}`,
        children: [],
      },
      {
        otherProps: { icon: '', title: `${TEAMS}` },
        key: 'teams',
        enabled: ENABLE_TEAMS,
        url: `${URL_TEAMS}`,
        children: [],
      },
      {
        otherProps: { icon: '', title: `${FORM_CONFIGURATION}` },
        key: 'form-config',
        enabled: ENABLE_FORM_CONFIGURATION,
        children: [
          {
            otherProps: { icon: '', title: `${MANIFEST_RELEASES}` },
            key: 'form-config-releases',
            url: `${URL_MANIFEST_RELEASE_LIST}`,
            children: [],
          },
          {
            otherProps: { icon: '', title: `${DRAFT_FILES}` },
            key: 'form-config-draft',
            url: `${URL_DRAFT_FILE_LIST}`,
            children: [],
          },
          {
            otherProps: { icon: '', title: `${JSON_VALIDATORS}` },
            key: 'form-config-validators',
            url: `${URL_JSON_VALIDATOR_LIST}`,
            children: [],
          },
        ],
      },
    ],
  },
  {
    otherProps: { icon: <IdcardOutlined />, title: 'Card Support' },
    key: 'card-support',
    enabled: ENABLE_CARD_SUPPORT,
    children: [
      {
        otherProps: { title: 'Download Client Data' },
        url: `${URL_DOWNLOAD_CLIENT_DATA}`,
        key: 'download-client-data',
        children: [],
      },
    ],
  },
];

/**
 *
 * @param menus - menu schema
 * @param loc - an array of menu location paths
 */

export const getActiveKey = (menus: MenuItems[], loc: string[]) => {
  let activeKey = '';
  function mapMenus(menu: MenuItems) {
    if (menu.children) {
      if (loc.join('/') !== menu.url) {
        menu.children.forEach(mapMenus);
      } else {
        activeKey = menu.key;
      }
    }
    return true;
  }
  menus.forEach(mapMenus);
  return activeKey;
};
